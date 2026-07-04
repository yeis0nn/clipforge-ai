import { MockClipGenerator } from "./generator.js";
import { ClipForgeStorage } from "./storage.js";
import { ClipForgeUI } from "./ui.js";
import { copyToClipboard, createId, downloadFile, wait } from "./utils.js";

const LOADING_STAGES = [
  { message: "Analizando el contexto de tu contenido…", duration: 520 },
  { message: "Detectando momentos con potencial…", duration: 640 },
  { message: "Construyendo hooks y dirección creativa…", duration: 680 }
];

const DEMO_CONFIGURATION = {
  description:
    "En este stream cuento cómo lancé mi primera tienda online, los errores con mis primeros clientes y la decisión que duplicó las ventas cuando estaba a punto de abandonar.",
  platform: "instagram",
  duration: "30-60",
  style: "storytelling",
  audience: "entrepreneurs"
};

const ui = new ClipForgeUI();
const generator = new MockClipGenerator();
const storage = new ClipForgeStorage();

const state = {
  configuration: null,
  ideas: [],
  history: storage.getHistory(),
  favorites: storage.getFavorites(),
  generationId: 0
};

function readConfiguration() {
  return {
    description: ui.descriptionField.value.trim(),
    platform: ui.form.elements.platform.value,
    duration: ui.form.elements.duration.value,
    style: ui.form.elements.style.value,
    audience: ui.form.elements.audience.value
  };
}

function addIdsToIdeas(ideas) {
  return ideas.map((idea) => ({
    ...idea,
    id: idea.id ?? createId("idea")
  }));
}

function getFavoriteIdeaIds() {
  return new Set(state.favorites.map((favorite) => favorite.idea.id));
}

function renderCurrentResults() {
  ui.renderResults(state.ideas, getFavoriteIdeaIds());
}

function saveGenerationToHistory() {
  const entry = {
    id: createId("generation"),
    createdAt: new Date().toISOString(),
    configuration: { ...state.configuration },
    ideas: state.ideas.map((idea) => ({ ...idea, hashtags: [...idea.hashtags] }))
  };

  const result = storage.addHistory(entry);
  state.history = result.history;
  ui.renderLibrary(state.history, state.favorites);

  if (!result.persisted) {
    ui.showToast("Los resultados se generaron, pero el historial no pudo guardarse.");
  }
}

async function runLoadingSequence(generationId) {
  for (const stage of LOADING_STAGES) {
    if (generationId !== state.generationId) return false;
    ui.updateLoadingMessage(stage.message);
    await wait(stage.duration);
  }

  return generationId === state.generationId;
}

async function generateAllIdeas({ shouldScroll = true } = {}) {
  if (!ui.validateDescription()) return;

  const generationId = state.generationId + 1;
  const previousConfiguration = state.configuration;
  const previousIdeas = state.ideas;
  state.generationId = generationId;
  state.configuration = readConfiguration();

  ui.setGenerating(true);
  ui.showLoading(LOADING_STAGES[0].message);

  try {
    const [ideas, sequenceCompleted] = await Promise.all([
      generator.generate(state.configuration),
      runLoadingSequence(generationId)
    ]);

    if (!sequenceCompleted || generationId !== state.generationId) return;

    state.ideas = addIdsToIdeas(ideas);
    ui.hideLoading();
    renderCurrentResults();
    saveGenerationToHistory();

    if (shouldScroll) ui.scrollToResults();
  } catch {
    if (generationId !== state.generationId) return;

    state.configuration = previousConfiguration;
    state.ideas = previousIdeas;
    ui.hideLoading();

    if (state.ideas.length > 0) renderCurrentResults();

    ui.showToast("No pudimos generar las ideas. Inténtalo nuevamente.");
  } finally {
    if (generationId === state.generationId) ui.setGenerating(false);
  }
}

function regenerateIdea(index) {
  if (!state.configuration || !state.ideas[index]) return;

  const previousIdea = state.ideas[index];
  state.ideas[index] = {
    ...generator.generateOne(state.configuration, previousIdea),
    id: createId("idea")
  };
  renderCurrentResults();
  ui.showToast(`Oportunidad ${index + 1} regenerada`);
}

function formatIdeaForClipboard(idea, index) {
  return [
    `CLIP ${String(index + 1).padStart(2, "0")} · ${idea.viralScore}/100 ${idea.viralLabel}`,
    `Hook: ${idea.hook}`,
    `Título: ${idea.title}`,
    `Descripción: ${idea.description}`,
    `Hashtags: ${idea.hashtags.join(" ")}`,
    `Edición: ${idea.editingTip}`
  ].join("\n");
}

async function copyText(value, successMessage) {
  try {
    await copyToClipboard(value);
    ui.showToast(successMessage);
  } catch {
    ui.showToast("No se pudo copiar el contenido");
  }
}

function copyIdeaField(button) {
  const card = button.closest("[data-idea-index]");
  const index = Number(card?.dataset.ideaIndex);
  const field = button.dataset.copy;
  const value = state.ideas[index]?.[field];

  if (value) copyText(value, "Copiado al portapapeles");
}

function formatAllIdeas() {
  const heading = [
    "CLIPFORGE AI · RESULTADOS",
    state.configuration?.description ?? "",
    ""
  ].join("\n");
  const content = state.ideas
    .map(formatIdeaForClipboard)
    .join("\n\n────────────────────\n\n");

  return `${heading}${content}`;
}

function copyAllIdeas() {
  if (state.ideas.length === 0) return;
  copyText(formatAllIdeas(), "Todas las oportunidades fueron copiadas");
}

function exportIdeas(format) {
  if (state.ideas.length === 0) return;

  const date = new Date().toISOString().slice(0, 10);
  const exportMenu = document.querySelector("[data-export-menu]");

  if (format === "json") {
    const content = JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        configuration: state.configuration,
        ideas: state.ideas
      },
      null,
      2
    );
    downloadFile(content, `clipforge-${date}.json`, "application/json;charset=utf-8");
  } else {
    downloadFile(formatAllIdeas(), `clipforge-${date}.txt`, "text/plain;charset=utf-8");
  }

  exportMenu.open = false;
  ui.showToast(`Resultados exportados como ${format.toUpperCase()}`);
}

function toggleFavorite(button) {
  const card = button.closest("[data-idea-id]");
  const idea = state.ideas.find((candidate) => candidate.id === card?.dataset.ideaId);

  if (!idea) return;

  const result = storage.toggleFavorite({
    id: createId("favorite"),
    savedAt: new Date().toISOString(),
    configuration: { ...state.configuration },
    idea: { ...idea, hashtags: [...idea.hashtags] }
  });

  state.favorites = result.favorites;

  if (!result.persisted) {
    ui.showToast("No se pudo actualizar favoritos en este navegador.");
    return;
  }

  ui.updateFavoriteButton(idea.id, result.isFavorite);
  ui.renderLibrary(state.history, state.favorites);
  ui.showToast(result.isFavorite ? "Idea guardada en favoritos" : "Idea eliminada de favoritos");
}

function restoreHistory(historyId) {
  const entry = state.history.find((item) => item.id === historyId);

  if (!entry) return;

  state.generationId += 1;
  ui.hideLoading();
  ui.setGenerating(false);
  state.configuration = { ...entry.configuration };
  state.ideas = addIdsToIdeas(
    entry.ideas.map((idea) => ({ ...idea, hashtags: [...idea.hashtags] }))
  );
  ui.populateForm(state.configuration);
  renderCurrentResults();
  ui.scrollToResults();
  ui.showToast("Generación restaurada desde el historial");
}

function removeFavorite(favoriteId) {
  const favorite = state.favorites.find((item) => item.id === favoriteId);
  const result = storage.removeFavorite(favoriteId);
  state.favorites = result.favorites;

  if (!result.persisted) {
    ui.showToast("No se pudo eliminar el favorito.");
    return;
  }

  if (favorite) ui.updateFavoriteButton(favorite.idea.id, false);

  ui.renderLibrary(state.history, state.favorites);
  ui.showToast("Favorito eliminado");
}

function copyFavorite(favoriteId) {
  const favorite = state.favorites.find((item) => item.id === favoriteId);
  if (favorite) copyText(formatIdeaForClipboard(favorite.idea, 0), "Favorito copiado");
}

function deleteHistory(historyId) {
  const result = storage.removeHistory(historyId);
  state.history = result.history;
  ui.renderLibrary(state.history, state.favorites);
  ui.showToast(
    result.persisted
      ? "Generación eliminada del historial"
      : "No se pudo eliminar la generación"
  );
}

function resetStudio() {
  state.generationId += 1;
  state.configuration = null;
  state.ideas = [];
  ui.resetStudio();
  ui.showToast("Estudio restablecido");
}

function loadDemoConfiguration() {
  ui.populateForm(DEMO_CONFIGURATION);
  ui.descriptionField.focus();
  ui.showToast("Ejemplo cargado. Puedes editarlo antes de generar.");
}

function initializeNavigation() {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNavigation = document.querySelector("[data-mobile-nav]");
  const mobileLinks = [...mobileNavigation.querySelectorAll("a")];
  const desktopMediaQuery = window.matchMedia("(min-width: 801px)");

  const closeMenu = ({ returnFocus = false } = {}) => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    mobileNavigation.hidden = true;

    if (returnFocus) menuButton.focus();
  };

  const openMenu = () => {
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Cerrar menú");
    mobileNavigation.hidden = false;
    mobileLinks[0]?.focus();
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu({ returnFocus: true });
    else openMenu();
  });

  mobileNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) closeMenu();
  });

  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  desktopMediaQuery.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

function initializeExportMenu() {
  const exportMenu = document.querySelector("[data-export-menu]");
  const summary = exportMenu.querySelector("summary");

  document.addEventListener("click", (event) => {
    if (!exportMenu.contains(event.target)) exportMenu.open = false;
  });

  exportMenu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    exportMenu.open = false;
    summary.focus();
  });
}

ui.form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateAllIdeas();
});

ui.descriptionField.addEventListener("input", () => ui.updateDescriptionFeedback());

document.querySelector("[data-use-example]").addEventListener("click", loadDemoConfiguration);
document.querySelector("[data-reset-form]").addEventListener("click", resetStudio);

document.querySelector("[data-regenerate-all]").addEventListener("click", () => {
  generateAllIdeas({ shouldScroll: false });
});

document.querySelector("[data-copy-all]").addEventListener("click", copyAllIdeas);

document.querySelector("[data-export-menu]").addEventListener("click", (event) => {
  const exportButton = event.target.closest("[data-export-format]");
  if (exportButton) exportIdeas(exportButton.dataset.exportFormat);
});

ui.resultsGrid.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy]");
  const regenerateButton = event.target.closest("[data-regenerate-card]");
  const favoriteButton = event.target.closest("[data-favorite-card]");

  if (copyButton) copyIdeaField(copyButton);
  if (favoriteButton) toggleFavorite(favoriteButton);

  if (regenerateButton) {
    const card = regenerateButton.closest("[data-idea-index]");
    regenerateIdea(Number(card.dataset.ideaIndex));
  }
});

ui.librarySection.addEventListener("click", (event) => {
  const restoreButton = event.target.closest("[data-restore-history]");
  const deleteButton = event.target.closest("[data-delete-history]");
  const copyButton = event.target.closest("[data-copy-favorite]");
  const removeButton = event.target.closest("[data-remove-favorite]");

  if (restoreButton) restoreHistory(restoreButton.dataset.restoreHistory);
  if (deleteButton) deleteHistory(deleteButton.dataset.deleteHistory);
  if (copyButton) copyFavorite(copyButton.dataset.copyFavorite);
  if (removeButton) removeFavorite(removeButton.dataset.removeFavorite);
});

ui.clearHistoryButton.addEventListener("click", () => {
  const result = storage.clearHistory();
  state.history = result.history;
  ui.renderLibrary(state.history, state.favorites);
  ui.showToast(result.persisted ? "Historial eliminado" : "No se pudo limpiar el historial");
});

document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear());

initializeNavigation();
initializeExportMenu();
ui.updateDescriptionFeedback();
ui.renderLibrary(state.history, state.favorites);
