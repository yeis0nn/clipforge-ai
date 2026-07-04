import {
  AUDIENCE_PROFILES,
  DEFAULT_TOPIC_PROFILE,
  DESCRIPTION_TEMPLATES,
  PLATFORM_PROFILES,
  STYLE_PROFILES,
  TOPIC_PROFILES,
  UNIVERSAL_EDITING_TIPS
} from "./data.js";
import {
  clamp,
  interpolate,
  randomInteger,
  sample,
  sentenceCase,
  shuffle,
  truncateWords,
  unique
} from "./utils.js";

function normalizeForSearch(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesKeyword(description, keyword) {
  const normalizedKeyword = normalizeForSearch(keyword);

  if (normalizedKeyword.length > 3) {
    return description.includes(normalizedKeyword);
  }

  const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`).test(description);
}

export function findTopicProfile(description) {
  const normalizedDescription = normalizeForSearch(description);

  const matches = TOPIC_PROFILES.map((profile) => ({
    profile,
    score: profile.keywords.reduce(
      (total, keyword) => total + (matchesKeyword(normalizedDescription, keyword) ? 1 : 0),
      0
    )
  })).sort((first, second) => second.score - first.score);

  return matches[0]?.score > 0 ? matches[0].profile : DEFAULT_TOPIC_PROFILE;
}

function createSummary(description) {
  const cleanDescription = description
    .replace(/\s+/g, " ")
    .replace(/^(en (este|el) (video|stream|podcast)\s*)/i, "")
    .replace(/^(hablo|cuento|explico|muestro)\s+(sobre|cómo|como|que)?\s*/i, "")
    .trim()
    .replace(/[.!?]+$/, "");

  return truncateWords(cleanDescription, 19).toLocaleLowerCase("es");
}

function calculateViralScore(configuration, description, variation) {
  const wordCount = description.trim().split(/\s+/).length;
  const hasSpecificDetail = /\d|porque|pero|hasta que|error|resultado|decid/i.test(description);
  const baseScore = 67;
  const contextScore = clamp(Math.round(wordCount / 4), 4, 14);
  const detailScore = hasSpecificDetail ? 5 : 1;
  const formatScore = configuration.duration === "15-30" ? 4 : 2;

  return clamp(baseScore + contextScore + detailScore + formatScore + variation, 72, 98);
}

function getViralLabel(score) {
  if (score >= 92) return "Muy alto";
  if (score >= 84) return "Alto";
  return "Prometedor";
}

function createHashtags(platform, style, audience, topic) {
  const hashtagPool = unique([
    ...platform.hashtags,
    ...style.hashtags,
    ...audience.hashtags,
    ...topic.hashtags
  ]);

  return shuffle(hashtagPool).slice(0, 6);
}

function createEditingTip(platform, duration) {
  const durationDirections = {
    "15-30": "Busca una sola revelación y llega al remate antes del segundo veinte.",
    "30-60": "Divide la narrativa en hook, tensión y resolución, sin superar tres bloques visuales.",
    "60-90": "Introduce un cambio de ritmo cerca de la mitad para recuperar la atención."
  };
  const durationDirection = durationDirections[duration] ?? durationDirections["30-60"];

  return `${sample(platform.editingTips)} ${sample([durationDirection, ...UNIVERSAL_EDITING_TIPS])}`;
}

export class MockClipGenerator {
  async generate(configuration, count = 3) {
    const targetCount = clamp(Number.isFinite(count) ? Math.trunc(count) : 3, 1, 10);
    const ideas = [];
    let attempts = 0;

    while (ideas.length < targetCount && attempts < targetCount * 20) {
      const idea = this.generateOne(configuration);
      const isRepeated = ideas.some(
        (existingIdea) =>
          existingIdea.hook === idea.hook ||
          existingIdea.title === idea.title ||
          existingIdea.description.slice(0, 48) === idea.description.slice(0, 48)
      );

      if (!isRepeated) ideas.push(idea);
      attempts += 1;
    }

    while (ideas.length < targetCount) {
      ideas.push(this.generateOne(configuration));
    }

    return ideas;
  }

  generateOne(configuration, previousIdea = null) {
    const platform = PLATFORM_PROFILES[configuration.platform] ?? PLATFORM_PROFILES.tiktok;
    const style = STYLE_PROFILES[configuration.style] ?? STYLE_PROFILES.dynamic;
    const audience = AUDIENCE_PROFILES[configuration.audience] ?? AUDIENCE_PROFILES.general;
    const topic = findTopicProfile(configuration.description);
    const rawSummary = createSummary(configuration.description);
    const summary = rawSummary.endsWith("…") ? rawSummary : `${rawSummary}.`;
    const insight = sample(topic.insights);
    const values = {
      audience: audience.label,
      callToAction: sample(audience.callToActions),
      insight,
      platform: platform.label,
      style: style.label,
      summary,
      topic: topic.topic
    };

    let hook = interpolate(sample(style.hookTemplates), values);
    let title = interpolate(sample(style.titleTemplates), values);

    for (let attempt = 0; attempt < 4 && previousIdea; attempt += 1) {
      if (hook !== previousIdea.hook && title !== previousIdea.title) break;
      hook = interpolate(sample(style.hookTemplates), values);
      title = interpolate(sample(style.titleTemplates), values);
    }

    const viralScore = calculateViralScore(
      configuration,
      configuration.description,
      randomInteger(-3, 7)
    );

    return {
      hook: sentenceCase(hook),
      title: sentenceCase(title),
      description: sentenceCase(interpolate(sample(DESCRIPTION_TEMPLATES), values)),
      hashtags: createHashtags(platform, style, audience, topic),
      editingTip: createEditingTip(platform, configuration.duration),
      viralScore,
      viralLabel: getViralLabel(viralScore)
    };
  }
}
