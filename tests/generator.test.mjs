import test from "node:test";
import assert from "node:assert/strict";

import { AUDIENCE_PROFILES, PLATFORM_PROFILES, STYLE_PROFILES } from "../js/data.js";
import { findTopicProfile, MockClipGenerator } from "../js/generator.js";

const baseConfiguration = {
  description:
    "En este stream cuento cómo lancé una tienda, el error con mis primeros clientes y la decisión que cambió el resultado.",
  platform: "tiktok",
  duration: "30-60",
  style: "dynamic",
  audience: "general"
};

function assertValidIdea(idea) {
  assert.equal(typeof idea.hook, "string");
  assert.ok(idea.hook.length > 0);
  assert.equal(typeof idea.title, "string");
  assert.ok(idea.title.length > 0);
  assert.equal(typeof idea.description, "string");
  assert.ok(idea.description.length > 0);
  assert.equal(idea.description.includes("undefined"), false);
  assert.equal(typeof idea.editingTip, "string");
  assert.equal(idea.editingTip.includes("undefined"), false);
  assert.equal(idea.hashtags.length, 6);
  assert.ok(idea.hashtags.every((hashtag) => hashtag.startsWith("#")));
  assert.ok(idea.viralScore >= 72 && idea.viralScore <= 98);
  assert.ok(["Prometedor", "Alto", "Muy alto"].includes(idea.viralLabel));
}

test("genera tres ideas completas y diferenciadas", async () => {
  const generator = new MockClipGenerator();
  const ideas = await generator.generate(baseConfiguration);

  assert.equal(ideas.length, 3);
  ideas.forEach(assertValidIdea);
  assert.equal(new Set(ideas.map((idea) => idea.hook)).size, 3);
  assert.equal(new Set(ideas.map((idea) => idea.title)).size, 3);
});

test("normaliza límites inválidos de cantidad y duración", async () => {
  const generator = new MockClipGenerator();
  const ideas = await generator.generate(
    { ...baseConfiguration, duration: "desconocida" },
    0
  );

  assert.equal(ideas.length, 1);
  assertValidIdea(ideas[0]);
});

test("detecta IA como palabra completa sin confundirla con historia", () => {
  assert.equal(findTopicProfile("Una historia personal sobre mi familia").key, "general");
  assert.equal(findTopicProfile("Cómo utilizo IA para desarrollar software").key, "technology");
});

test("soporta todas las combinaciones disponibles", () => {
  const generator = new MockClipGenerator();

  for (const platform of Object.keys(PLATFORM_PROFILES)) {
    for (const style of Object.keys(STYLE_PROFILES)) {
      for (const audience of Object.keys(AUDIENCE_PROFILES)) {
        const idea = generator.generateOne({
          ...baseConfiguration,
          platform,
          style,
          audience
        });
        assertValidIdea(idea);
      }
    }
  }
});
