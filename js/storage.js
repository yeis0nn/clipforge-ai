const STORAGE_KEYS = {
  history: "clipforge.history.v1",
  favorites: "clipforge.favorites.v1"
};

const HISTORY_LIMIT = 8;
const FAVORITES_LIMIT = 30;
const CONFIGURATION_OPTIONS = {
  platform: new Set(["tiktok", "instagram", "youtube", "kick", "twitch"]),
  duration: new Set(["15-30", "30-60", "60-90"]),
  style: new Set([
    "dynamic",
    "educational",
    "storytelling",
    "controversial",
    "inspirational",
    "humorous"
  ]),
  audience: new Set([
    "general",
    "creators",
    "gamers",
    "entrepreneurs",
    "professionals",
    "students"
  ])
};

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value) {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isConfiguration(value) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.description) &&
    value.description.length <= 600 &&
    CONFIGURATION_OPTIONS.platform.has(value.platform) &&
    CONFIGURATION_OPTIONS.duration.has(value.duration) &&
    CONFIGURATION_OPTIONS.style.has(value.style) &&
    CONFIGURATION_OPTIONS.audience.has(value.audience)
  );
}

function isIdea(value) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.hook) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.description) &&
    Array.isArray(value.hashtags) &&
    value.hashtags.every(isNonEmptyString) &&
    isNonEmptyString(value.editingTip) &&
    Number.isFinite(value.viralScore) &&
    value.viralScore >= 0 &&
    value.viralScore <= 100 &&
    isNonEmptyString(value.viralLabel)
  );
}

function isHistoryEntry(value) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isValidDate(value.createdAt) &&
    isConfiguration(value.configuration) &&
    Array.isArray(value.ideas) &&
    value.ideas.length > 0 &&
    value.ideas.every(isIdea)
  );
}

function isFavoriteEntry(value) {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isValidDate(value.savedAt) &&
    isIdea(value.idea)
  );
}

function readCollection(key, validator) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter(validator) : [];
  } catch {
    return [];
  }
}

function writeCollection(key, collection) {
  try {
    localStorage.setItem(key, JSON.stringify(collection));
    return true;
  } catch {
    return false;
  }
}

export class ClipForgeStorage {
  getHistory() {
    return readCollection(STORAGE_KEYS.history, isHistoryEntry);
  }

  addHistory(entry) {
    const currentHistory = this.getHistory();
    const nextHistory = [
      entry,
      ...currentHistory.filter((item) => item.id !== entry.id)
    ].slice(0, HISTORY_LIMIT);
    const persisted = writeCollection(STORAGE_KEYS.history, nextHistory);

    return { history: persisted ? nextHistory : currentHistory, persisted };
  }

  clearHistory() {
    const currentHistory = this.getHistory();
    const persisted = writeCollection(STORAGE_KEYS.history, []);
    return { history: persisted ? [] : currentHistory, persisted };
  }

  removeHistory(historyId) {
    const currentHistory = this.getHistory();
    const nextHistory = currentHistory.filter((item) => item.id !== historyId);
    const persisted = writeCollection(STORAGE_KEYS.history, nextHistory);

    return { history: persisted ? nextHistory : currentHistory, persisted };
  }

  getFavorites() {
    return readCollection(STORAGE_KEYS.favorites, isFavoriteEntry);
  }

  toggleFavorite(entry) {
    const currentFavorites = this.getFavorites();
    const existingIndex = currentFavorites.findIndex((item) => item.idea.id === entry.idea.id);
    const wasFavorite = existingIndex >= 0;
    const nextFavorites = wasFavorite
      ? currentFavorites.filter((_, index) => index !== existingIndex)
      : [entry, ...currentFavorites].slice(0, FAVORITES_LIMIT);
    const persisted = writeCollection(STORAGE_KEYS.favorites, nextFavorites);

    return {
      favorites: persisted ? nextFavorites : currentFavorites,
      isFavorite: persisted ? !wasFavorite : wasFavorite,
      persisted
    };
  }

  removeFavorite(favoriteId) {
    const currentFavorites = this.getFavorites();
    const nextFavorites = currentFavorites.filter((item) => item.id !== favoriteId);
    const persisted = writeCollection(STORAGE_KEYS.favorites, nextFavorites);

    return { favorites: persisted ? nextFavorites : currentFavorites, persisted };
  }
}
