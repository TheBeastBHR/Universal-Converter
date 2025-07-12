// Background service worker for Chrome Extension v3

// Handle extension icon click to open settings page
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('settings-page/settings.html')
  });
});

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Unit Converter extension installed');
  
  // Open settings page on first install
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('settings-page/settings.html')
    });
  }
  
  // Set default settings if none exist
  try {
    const result = await chrome.storage.sync.get(['unitSettings']);
    if (!result.unitSettings) {
      const defaultSettings = {
        preset: 'metric',
        lengthUnit: 'm',
        weightUnit: 'kg',
        temperatureUnit: 'c',
        volumeUnit: 'l',
        areaUnit: 'm2'
      };
      await chrome.storage.sync.set({ unitSettings: defaultSettings });
      console.log('Default settings initialized');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(['unitSettings'])
      .then(result => {
        sendResponse({ settings: result.unitSettings });
      })
      .catch(error => {
        console.error('Error getting settings:', error);
        sendResponse({ error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// Listen for storage changes and notify content scripts
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.unitSettings) {
    // Notify all tabs about settings change
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { 
          action: 'settingsUpdated',
          newSettings: changes.unitSettings.newValue
        }).catch(() => {
          // Ignore errors for tabs without content script
        });
      });
    });
  }
});

// Handle context menu (optional future feature)
chrome.runtime.onStartup.addListener(() => {
  console.log('Unit Converter extension started');
});
