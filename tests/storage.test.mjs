import test from "node:test";
import assert from "node:assert/strict";

import { ClipForgeStorage } from "../js/storage.js";

class MemoryStorage {
  constructor() {
    this.values = new Map();
    this.shouldFail = false;
  }

  getItem(key) {
    if (this.shouldFail) throw new Error("Storage unavailable");
    return this.values.get(key) ?? null;
  }

  setItem(key, value) {
    if (this.shouldFail) throw new Error("Storage unavailable");
    this.values.set(key, String(value));
  }
}

const configuration = {
  description: "Una descripción suficientemente detallada para la prueba.",
  platform: "tiktok",
  duration: "30-60",
  style: "dynamic",
  audience: "general"
};

const idea = {
  id: "idea-1",
  hook: "Un hook válido",
  title: "Un título válido",
  description: "Una descripción válida",
  hashtags: ["#ClipForge"],
  editingTip: "Un consejo válido",
  viralScore: 88,
  viralLabel: "Alto"
};

function createHistoryEntry(id = "generation-1") {
  return {
    id,
    createdAt: new Date().toISOString(),
    configuration,
    ideas: [idea]
  };
}

test.beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
});

test("guarda, recupera y elimina historial", () => {
  const storage = new ClipForgeStorage();
  const added = storage.addHistory(createHistoryEntry());

  assert.equal(added.persisted, true);
  assert.equal(added.history.length, 1);
  assert.equal(storage.getHistory().length, 1);

  const removed = storage.removeHistory("generation-1");
  assert.equal(removed.persisted, true);
  assert.equal(removed.history.length, 0);
});

test("descarta estructuras corruptas", () => {
  localStorage.setItem(
    "clipforge.history.v1",
    JSON.stringify([{ unexpected: true }, createHistoryEntry()])
  );
  localStorage.setItem("clipforge.favorites.v1", JSON.stringify([null, { idea: {} }]));

  const storage = new ClipForgeStorage();
  assert.equal(storage.getHistory().length, 1);
  assert.equal(storage.getFavorites().length, 0);
});

test("descarta datos manipulados aunque tengan la forma esperada", () => {
  const invalidPlatform = createHistoryEntry("invalid-platform");
  invalidPlatform.configuration = { ...configuration, platform: "unknown" };
  const invalidDate = createHistoryEntry("invalid-date");
  invalidDate.createdAt = "ayer";
  const invalidScore = createHistoryEntry("invalid-score");
  invalidScore.ideas = [{ ...idea, viralScore: 180 }];

  localStorage.setItem(
    "clipforge.history.v1",
    JSON.stringify([invalidPlatform, invalidDate, invalidScore, createHistoryEntry()])
  );

  const storage = new ClipForgeStorage();
  assert.deepEqual(storage.getHistory().map((entry) => entry.id), ["generation-1"]);
});

test("informa fallos de persistencia sin falsear el estado", () => {
  const storage = new ClipForgeStorage();
  localStorage.shouldFail = true;

  const result = storage.addHistory(createHistoryEntry());
  assert.equal(result.persisted, false);
  assert.deepEqual(result.history, []);
});

test("activa y desactiva favoritos", () => {
  const storage = new ClipForgeStorage();
  const favorite = {
    id: "favorite-1",
    savedAt: new Date().toISOString(),
    configuration,
    idea
  };

  const added = storage.toggleFavorite(favorite);
  assert.equal(added.persisted, true);
  assert.equal(added.isFavorite, true);
  assert.equal(added.favorites.length, 1);

  const removed = storage.toggleFavorite(favorite);
  assert.equal(removed.persisted, true);
  assert.equal(removed.isFavorite, false);
  assert.equal(removed.favorites.length, 0);
});
