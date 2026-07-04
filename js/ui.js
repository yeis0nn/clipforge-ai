const QUALITY_LEVELS = [
  { minimum: 0, label: "Esperando", width: 0 },
  { minimum: 1, label: "Muy breve", width: 18 },
  { minimum: 30, label: "Básico", width: 42 },
  { minimum: 90, label: "Buen contexto", width: 70 },
  { minimum: 180, label: "Excelente", width: 100 }
];

const DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  dateStyle: "short",
  timeStyle: "short"
});

export class ClipForgeUI {
  constructor() {
    this.form = document.querySelector("#generator-form");
    this.descriptionField = document.querySelector("#video-description");
    this.characterCount = document.querySelector("#character-count");
    this.descriptionError = document.querySelector("#description-error");
    this.loadingState = document.querySelector("[data-loading-state]");
    this.loadingMessage = document.querySelector("[data-loading-message]");
    this.resultsSection = document.querySelector("[data-results-section]");
    this.resultsGrid = document.querySelector("[data-results-grid]");
    this.resultsAnnouncement = document.querySelector("[data-results-announcement]");
    this.cardTemplate = document.querySelector("#clip-card-template");
    this.qualityLabel = document.querySelector("[data-quality-label]");
    this.qualityMeter = document.querySelector("[data-quality-meter]");
    this.qualityProgress = this.qualityMeter.closest("[role='progressbar']");
    this.librarySection = document.querySelector("[data-library-section]");
    this.historyList = document.querySelector("[data-history-list]");
    this.favoritesList = document.querySelector("[data-favorites-list]");
    this.historyCount = document.querySelector("[data-history-count]");
    this.favoritesCount = document.querySelector("[data-favorites-count]");
    this.clearHistoryButton = document.querySelector("[data-clear-history]");
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.toast = document.querySelector("[data-toast]");
    this.submitButton = this.form.querySelector("button[type='submit']");
    this.submitButtonLabel = this.submitButton.querySelector("span");
    this.engineStatus = this.form.querySelector("[data-engine-status]");
    this.defaultSubmitLabel = this.submitButtonLabel.textContent;
    this.toastTimer = null;
  }

  updateDescriptionFeedback() {
    const length = this.descriptionField.value.length;
    const quality = [...QUALITY_LEVELS].reverse().find((level) => length >= level.minimum);

    this.characterCount.textContent = `${length} / 600`;
    this.qualityLabel.textContent = quality.label;
    this.qualityMeter.style.width = `${quality.width}%`;
    this.qualityProgress.setAttribute("aria-valuenow", String(quality.width));
    this.qualityProgress.setAttribute("aria-valuetext", quality.label);

    if (this.descriptionField.getAttribute("aria-invalid") === "true") {
      this.clearValidationError();
    }
  }

  validateDescription() {
    const description = this.descriptionField.value.trim();

    if (!description) {
      this.showValidationError("Describe el contenido antes de generar ideas.");
      return false;
    }

    if (description.length < 30) {
      this.showValidationError("Añade un poco más de contexto: utiliza al menos 30 caracteres.");
      return false;
    }

    this.clearValidationError();
    return true;
  }

  showValidationError(message) {
    this.descriptionField.setAttribute("aria-invalid", "true");
    this.descriptionError.textContent = message;
    this.descriptionError.hidden = false;
    this.descriptionField.focus();
  }

  clearValidationError() {
    this.descriptionField.removeAttribute("aria-invalid");
    this.descriptionError.textContent = "";
    this.descriptionError.hidden = true;
  }

  setGenerating(isGenerating) {
    [...this.form.elements].forEach((control) => {
      if (!control.matches("[data-reset-form]")) control.disabled = isGenerating;
    });
    this.submitButtonLabel.textContent = isGenerating
      ? "Creando oportunidades…"
      : this.defaultSubmitLabel;
    this.engineStatus.textContent = isGenerating ? "Procesando" : "Motor listo";
    this.form.setAttribute("aria-busy", String(isGenerating));
  }

  showLoading(message) {
    this.resultsSection.hidden = true;
    this.resultsAnnouncement.textContent = "";
    this.loadingState.hidden = false;
    this.loadingMessage.textContent = message;
  }

  updateLoadingMessage(message) {
    this.loadingMessage.textContent = message;
  }

  hideLoading() {
    this.loadingState.hidden = true;
  }

  renderResults(ideas, favoriteIdeaIds = new Set()) {
    const fragment = document.createDocumentFragment();

    ideas.forEach((idea, index) => {
      fragment.append(this.createResultCard(idea, index, favoriteIdeaIds.has(idea.id)));
    });

    this.resultsGrid.replaceChildren(fragment);
    this.resultsSection.hidden = false;
    this.resultsAnnouncement.textContent = `${ideas.length} oportunidades de contenido generadas.`;
  }

  createResultCard(idea, index, isFavorite) {
    const card = this.cardTemplate.content.firstElementChild.cloneNode(true);
    const resultNumber = String(index + 1).padStart(2, "0");
    const favoriteButton = card.querySelector("[data-favorite-card]");

    card.dataset.ideaIndex = String(index);
    card.dataset.ideaId = idea.id;
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.setAttribute(
      "aria-label",
      isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"
    );
    card.querySelector("[data-result-index]").textContent = `Oportunidad ${resultNumber}`;
    card.querySelector("[data-viral-score]").textContent = `${idea.viralScore}/100`;
    card.querySelector("[data-viral-label]").textContent = idea.viralLabel;
    card.querySelector("[data-hook]").textContent = idea.hook;
    card.querySelector("[data-title]").textContent = idea.title;
    card.querySelector("[data-description]").textContent = idea.description;
    card.querySelector("[data-editing-tip]").textContent = idea.editingTip;

    const hashtagContainer = card.querySelector("[data-hashtags]");
    idea.hashtags.forEach((hashtag) => {
      const element = document.createElement("span");
      element.textContent = hashtag;
      hashtagContainer.append(element);
    });

    return card;
  }

  updateFavoriteButton(ideaId, isFavorite) {
    const card = [...this.resultsGrid.querySelectorAll("[data-idea-id]")].find(
      (element) => element.dataset.ideaId === ideaId
    );
    const button = card?.querySelector("[data-favorite-card]");

    if (!button) return;

    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute(
      "aria-label",
      isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"
    );
  }

  renderLibrary(history, favorites) {
    this.historyCount.textContent = String(history.length);
    this.favoritesCount.textContent = String(favorites.length);
    this.clearHistoryButton.disabled = history.length === 0;
    this.librarySection.hidden = history.length === 0 && favorites.length === 0;

    this.renderHistory(history);
    this.renderFavorites(favorites);
  }

  renderHistory(history) {
    if (history.length === 0) {
      this.historyList.replaceChildren(
        this.createEmptyState("Tus generaciones recientes aparecerán aquí.")
      );
      return;
    }

    const items = history.map((entry) => {
      const item = this.createLibraryItem();
      const platform = this.getSelectLabel("platform", entry.configuration.platform);
      const style = this.getSelectLabel("style", entry.configuration.style);

      item.querySelector("[data-library-kind]").textContent = platform;
      item.querySelector("[data-library-date]").textContent = this.formatDate(entry.createdAt);
      item.querySelector("h4").textContent = entry.configuration.description;
      item.querySelector("p").textContent = `${entry.ideas.length} oportunidades · ${style}`;
      item.querySelector("[data-library-actions]").append(
        this.createLibraryButton("Ver resultados", "data-restore-history", entry.id),
        this.createLibraryButton("Eliminar", "data-delete-history", entry.id)
      );

      return item;
    });

    this.historyList.replaceChildren(...items);
  }

  renderFavorites(favorites) {
    if (favorites.length === 0) {
      this.favoritesList.replaceChildren(
        this.createEmptyState("Guarda una oportunidad para encontrarla rápidamente.")
      );
      return;
    }

    const items = favorites.map((favorite) => {
      const item = this.createLibraryItem();

      item.querySelector("[data-library-kind]").textContent = "Idea guardada";
      item.querySelector("[data-library-date]").textContent = this.formatDate(favorite.savedAt);
      item.querySelector("h4").textContent = favorite.idea.title;
      item.querySelector("p").textContent = favorite.idea.hook;
      item.querySelector("[data-library-actions]").append(
        this.createLibraryButton("Copiar", "data-copy-favorite", favorite.id),
        this.createLibraryButton("Eliminar", "data-remove-favorite", favorite.id)
      );

      return item;
    });

    this.favoritesList.replaceChildren(...items);
  }

  createLibraryItem() {
    const item = document.createElement("article");
    const meta = document.createElement("div");
    const kind = document.createElement("span");
    const date = document.createElement("span");
    const title = document.createElement("h4");
    const description = document.createElement("p");
    const actions = document.createElement("div");

    item.className = "library-item";
    meta.className = "library-item__meta";
    actions.className = "library-item__actions";
    kind.dataset.libraryKind = "";
    date.dataset.libraryDate = "";
    actions.dataset.libraryActions = "";
    meta.append(kind, date);
    item.append(meta, title, description, actions);

    return item;
  }

  createLibraryButton(label, attribute, value) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute(attribute, value);
    return button;
  }

  createEmptyState(message) {
    const element = document.createElement("p");
    element.className = "library-empty";
    element.textContent = message;
    return element;
  }

  getSelectLabel(fieldName, value) {
    const option = [...this.form.elements[fieldName].options].find(
      (candidate) => candidate.value === value
    );
    return option?.textContent ?? value;
  }

  formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Reciente" : DATE_FORMATTER.format(date);
  }

  populateForm(configuration) {
    this.descriptionField.value = configuration.description;
    this.form.elements.platform.value = configuration.platform;
    this.form.elements.duration.value = configuration.duration;
    this.form.elements.style.value = configuration.style;
    this.form.elements.audience.value = configuration.audience;
    this.updateDescriptionFeedback();
  }

  resetStudio() {
    this.form.reset();
    this.clearValidationError();
    this.hideLoading();
    this.resultsSection.hidden = true;
    this.resultsGrid.replaceChildren();
    this.resultsAnnouncement.textContent = "";
    this.setGenerating(false);
    this.updateDescriptionFeedback();
    this.descriptionField.focus();
  }

  scrollToResults() {
    this.resultsSection.scrollIntoView({
      behavior: this.reducedMotionQuery.matches ? "auto" : "smooth",
      block: "start"
    });
  }

  showToast(message) {
    window.clearTimeout(this.toastTimer);
    this.toast.textContent = message;
    this.toast.hidden = false;

    this.toastTimer = window.setTimeout(() => {
      this.toast.hidden = true;
    }, 2400);
  }
}
