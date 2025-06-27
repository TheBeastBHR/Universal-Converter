// DOM manipulation and popup management

// Global namespace for popup manager
window.UnitConverter = window.UnitConverter || {};

window.UnitConverter.PopupManager = class {
  constructor() {
    this.conversionPopup = null;
  }
  
  /**
   * Show conversion popup with results
   * @param {Array} conversions - Array of conversion objects
   * @param {Selection} selection - Text selection object
   */
  showConversionPopup(conversions, selection) {
    this.hidePopup();
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    this.conversionPopup = this.createPopupElement(conversions);
    document.body.appendChild(this.conversionPopup);
    
    this.positionPopup(rect);
    this.attachEventListeners();
  }
  
  /**
   * Create the popup DOM element
   * @param {Array} conversions - Array of conversion objects
   * @returns {HTMLElement} - The popup element
   */
  createPopupElement(conversions) {
    const popup = document.createElement('div');
    popup.className = 'unit-converter-popup';
    popup.innerHTML = `
      <div class="unit-converter-content">
        <div class="unit-converter-results">
          ${conversions.map(conv => `
            <div class="unit-converter-item">
              <div class="original">${conv.original}</div>
              <div class="arrow">➜</div>
              <div class="converted">${conv.converted}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    return popup;
  }
  
  /**
   * Position the popup relative to the selected text
   * @param {DOMRect} selectionRect - Bounding rectangle of the selection
   */
  positionPopup(selectionRect) {
    if (!this.conversionPopup) return;
    
    const popupRect = this.conversionPopup.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    let top = selectionRect.bottom + window.scrollY + 10;
    let left = selectionRect.left + window.scrollX;
    
    // Adjust if popup would go below viewport
    if (selectionRect.bottom + popupRect.height + 10 > viewportHeight) {
      top = selectionRect.top + window.scrollY - popupRect.height - 10;
    }
    
    
    if (left + popupRect.width > viewportWidth) {
      left = viewportWidth - popupRect.width - 10;
    }
    
    
    if (left < 10) {
      left = 10;
    }
    
    this.conversionPopup.style.top = `${top}px`;
    this.conversionPopup.style.left = `${left}px`;
  }
  
  /**
   * Attach event listeners to the popup
   */
  attachEventListeners() {
    if (!this.conversionPopup) return;
    
    this.conversionPopup.addEventListener('click', (e) => e.stopPropagation());
  }
    /**
   * Hide and remove the popup
   */
  hidePopup() {
    if (this.conversionPopup) {
      this.conversionPopup.remove();
      this.conversionPopup = null;
    }
  }
};
