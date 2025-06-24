// Popup script for settings management
document.addEventListener('DOMContentLoaded', async function() {  const elements = {
    metricBtn: document.getElementById('metricBtn'),
    imperialBtn: document.getElementById('imperialBtn'),
    customBtn: document.getElementById('customBtn'),
    lengthUnit: document.getElementById('lengthUnit'),
    weightUnit: document.getElementById('weightUnit'),
    temperatureUnit: document.getElementById('temperatureUnit'),
    volumeUnit: document.getElementById('volumeUnit'),
    areaUnit: document.getElementById('areaUnit'),
    status: document.getElementById('status')
  };
  
  // Preset configurations
  const presets = {
    metric: {
      lengthUnit: 'm',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l',
      areaUnit: 'm2'
    },
    imperial: {
      lengthUnit: 'ft',
      weightUnit: 'lb',
      temperatureUnit: 'f',
      volumeUnit: 'gal',
      areaUnit: 'ft2'
    }
  };
  
  // Load saved settings
  await loadSettings();
    // Event listeners for preset buttons with auto-save
  elements.metricBtn.addEventListener('click', () => {
    applyPreset('metric');
    saveSettings(); // Auto-save when preset is applied
  });
  elements.imperialBtn.addEventListener('click', () => {
    applyPreset('imperial');
    saveSettings(); // Auto-save when preset is applied
  });
  elements.customBtn.addEventListener('click', () => {
    applyPreset('custom');
    saveSettings(); // Auto-save when preset is applied
  });
  // Event listeners for unit selectors with auto-save
  [elements.lengthUnit, elements.weightUnit, elements.temperatureUnit, 
   elements.volumeUnit, elements.areaUnit].forEach(select => {
    select.addEventListener('change', () => {
      updateActivePreset();
      saveSettings(); // Auto-save when any setting changes
    });
  });
  
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['unitSettings']);
      const settings = result.unitSettings || presets.metric;
      
      elements.lengthUnit.value = settings.lengthUnit || 'm';
      elements.weightUnit.value = settings.weightUnit || 'kg';
      elements.temperatureUnit.value = settings.temperatureUnit || 'c';
      elements.volumeUnit.value = settings.volumeUnit || 'l';
      elements.areaUnit.value = settings.areaUnit || 'm2';
      
      updateActivePreset(settings.preset || 'metric');
    } catch (error) {
      console.error('Error loading settings:', error);
      applyPreset('metric');
    }
  }
  
  function applyPreset(presetName) {
    if (presetName !== 'custom' && presets[presetName]) {
      const preset = presets[presetName];
      elements.lengthUnit.value = preset.lengthUnit;
      elements.weightUnit.value = preset.weightUnit;
      elements.temperatureUnit.value = preset.temperatureUnit;
      elements.volumeUnit.value = preset.volumeUnit;
      elements.areaUnit.value = preset.areaUnit;
    }
    updateActivePreset(presetName);
  }
  
  function updateActivePreset(activePreset = null) {
    // Remove active class from all buttons
    [elements.metricBtn, elements.imperialBtn, elements.customBtn].forEach(btn => {
      btn.classList.remove('active');
    });
    
    if (activePreset) {
      // Set the specified preset as active
      if (activePreset === 'metric') elements.metricBtn.classList.add('active');
      else if (activePreset === 'imperial') elements.imperialBtn.classList.add('active');
      else if (activePreset === 'custom') elements.customBtn.classList.add('active');
    } else {
      // Auto-detect based on current settings
      const currentSettings = {
        lengthUnit: elements.lengthUnit.value,
        weightUnit: elements.weightUnit.value,
        temperatureUnit: elements.temperatureUnit.value,
        volumeUnit: elements.volumeUnit.value,
        areaUnit: elements.areaUnit.value
      };
      
      const isMetric = JSON.stringify(currentSettings) === JSON.stringify(presets.metric);
      const isImperial = JSON.stringify(currentSettings) === JSON.stringify(presets.imperial);
      
      if (isMetric) {
        elements.metricBtn.classList.add('active');
      } else if (isImperial) {
        elements.imperialBtn.classList.add('active');
      } else {
        elements.customBtn.classList.add('active');
      }
    }
  }
  
  async function saveSettings() {
    const settings = {
      preset: getActivePreset(),
      lengthUnit: elements.lengthUnit.value,
      weightUnit: elements.weightUnit.value,
      temperatureUnit: elements.temperatureUnit.value,
      volumeUnit: elements.volumeUnit.value,
      areaUnit: elements.areaUnit.value
    };
    
    try {
      await chrome.storage.sync.set({ unitSettings: settings });
      
      // Notify content scripts about settings update
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' });
        } catch (error) {
          // Ignore errors for tabs that don't have our content script
        }
      }
      
      showStatus('Settings saved automatically!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showStatus('Error saving settings!', 'error');
    }
  }
  
  function getActivePreset() {
    if (elements.metricBtn.classList.contains('active')) return 'metric';
    if (elements.imperialBtn.classList.contains('active')) return 'imperial';
    return 'custom';
  }
  
  function showStatus(message, type) {
    elements.status.textContent = message;
    elements.status.className = `status show ${type}`;
    
    setTimeout(() => {
      elements.status.classList.remove('show');
    }, 2000);
  }
});
