export function randomInteger(minimum, maximum) {
  const range = maximum - minimum + 1;

  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return minimum + (values[0] % range);
  }

  return Math.floor(Math.random() * range) + minimum;
}

export function createId(prefix = "item") {
  const identifier = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `${Date.now().toString(36)}-${randomInteger(100000, 999999).toString(36)}`;

  return `${prefix}-${identifier}`;
}

export function sample(items) {
  return items[randomInteger(0, items.length - 1)];
}

export function shuffle(items) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = randomInteger(0, index);
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}

export function unique(items) {
  return [...new Set(items)];
}

export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export function interpolate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function sentenceCase(value) {
  const cleanValue = value.trim();
  return cleanValue ? cleanValue[0].toUpperCase() + cleanValue.slice(1) : "";
}

export function truncateWords(value, maximumWords) {
  const words = value.trim().split(/\s+/);

  if (words.length <= maximumWords) return words.join(" ");

  const trailingConnectors = new Set([
    "a",
    "como",
    "cómo",
    "con",
    "cuando",
    "de",
    "del",
    "el",
    "en",
    "la",
    "o",
    "pero",
    "que",
    "si",
    "sin",
    "y"
  ]);
  const truncatedWords = words.slice(0, maximumWords);

  while (trailingConnectors.has(truncatedWords.at(-1).toLocaleLowerCase("es"))) {
    truncatedWords.pop();
  }

  return `${truncatedWords.join(" ")}…`;
}

export async function copyToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise((_, reject) => {
          window.setTimeout(() => reject(new Error("Clipboard timeout")), 800);
        })
      ]);
      return;
    } catch {
      // Continue with the compatibility fallback below.
    }
  }

  const activeElement = document.activeElement;
  const temporaryField = document.createElement("textarea");
  temporaryField.value = value;
  temporaryField.setAttribute("readonly", "");
  temporaryField.className = "clipboard-helper";
  document.body.append(temporaryField);
  temporaryField.select();
  const copied = document.execCommand("copy");
  temporaryField.remove();

  if (activeElement instanceof HTMLElement) {
    activeElement.focus({ preventScroll: true });
  }

  if (!copied) throw new Error("Clipboard copy failed");
}

export function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
