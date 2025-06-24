// Main content script - orchestrates unit conversion functionality

// Global instances
let unitConverter;
let conversionDetector;
let popupManager;
let settingsManager;
let userSettings = {};

/**
 * Initialize the extension components
 */
async function init() {
  try {
    // Wait for all scripts to load
    if (!window.UnitConverter || !window.UnitConverterData) {
      setTimeout(init, 100);
      return;
    }

    unitConverter = new window.UnitConverter.UnitConverter();
    conversionDetector = new window.UnitConverter.ConversionDetector(unitConverter);
    popupManager = new window.UnitConverter.PopupManager();
    settingsManager = new window.UnitConverter.SettingsManager();
    
    await loadUserSettings();
    setupEventListeners();
    
    console.log('Unit Converter extension initialized successfully');
  } catch (error) {
    console.error('Error initializing Unit Converter extension:', error);
  }
}

/**
 * Load user settings from storage
 */
async function loadUserSettings() {
  userSettings = await settingsManager.loadSettings();
}

/**
 * Setup event listeners for text selection and popup management
 */
function setupEventListeners() {
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('click', hidePopup);
  document.addEventListener('scroll', hidePopup);
  window.addEventListener('resize', hidePopup);
}

/**
 * Handle text selection events
 * @param {Event} event - Mouse up event
 */
function handleTextSelection(event) {
  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      const conversions = conversionDetector.findConversions(selectedText, userSettings);
      if (conversions.length > 0) {
        popupManager.showConversionPopup(conversions, selection);
      } else {
        hidePopup();
      }
    } else {
      hidePopup();
    }
  }, 10);
}

/**
 * Hide the conversion popup
 */
function hidePopup() {
  popupManager.hidePopup();
}

/**
 * Listen for messages from background script or popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'settingsUpdated') {
    loadUserSettings();
    sendResponse({ status: 'Settings updated' });
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
