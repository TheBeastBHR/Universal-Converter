// Popup script for settings management
document.addEventListener('DOMContentLoaded', async function() {
  // Initialize currency list dynamically
  await initializeCurrencyList();
  
  const elements = {
    metricBtn: document.getElementById('metricBtn'),
    imperialBtn: document.getElementById('imperialBtn'),
    customBtn: document.getElementById('customBtn'),
    lengthUnit: document.getElementById('lengthUnit'),
    weightUnit: document.getElementById('weightUnit'),
    temperatureUnit: document.getElementById('temperatureUnit'),
    volumeUnit: document.getElementById('volumeUnit'),
    areaUnit: document.getElementById('areaUnit'),
    speedUnit: document.getElementById('speedUnit'),
    torqueUnit: document.getElementById('torqueUnit'),
    pressureUnit: document.getElementById('pressureUnit'),
    timezoneUnit: document.getElementById('timezoneUnit'),
    timeFormatBtn: document.getElementById('timeFormatBtn'),
    currencyUnit: document.getElementById('currencyUnit')
  };
  
  // Preset configurations
  const presets = {
    metric: {
      lengthUnit: 'm',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l',
      areaUnit: 'm2',
      speedUnit: 'kmh',
      torqueUnit: 'nm',
      pressureUnit: 'kpa',
      timezoneUnit: 'auto',
      is12hr: true, // true = 12hr, false = 24hr
      currencyUnit: 'EUR'
    },
    imperial: {
      lengthUnit: 'ft',
      weightUnit: 'lb',
      temperatureUnit: 'f',
      volumeUnit: 'gal',
      areaUnit: 'ft2',
      speedUnit: 'mph',
      torqueUnit: 'lbft',
      pressureUnit: 'psi',
      timezoneUnit: 'auto',
      is12hr: true, // true = 12hr, false = 24hr
      currencyUnit: 'USD'
    }
  };
  
  // Dynamic currency list initialization
  async function initializeCurrencyList() {
    const currencySelect = document.getElementById('currencyUnit');
    
    // Clear existing options
    currencySelect.innerHTML = '';
    
    // Add all currencies from the mapping
    if (typeof countryNameToCurrencyCode !== 'undefined') {
      populateSelectList(currencySelect, countryNameToCurrencyCode, 'USD');
    } else {
      // Fallback to basic currency list if mapping not loaded
      const basicCurrencies = {
        'United States Dollar': 'USD',
        'Euro': 'EUR', 
        'British Pound Sterling': 'GBP',
        'Japanese Yen': 'JPY',
        'Canadian Dollar': 'CAD',
        'Australian Dollar': 'AUD',
        'Swiss Franc': 'CHF',
        'Chinese Yuan': 'CNY',
        'Indian Rupee': 'INR',
        'South Korean Won': 'KRW'
      };
      populateSelectList(currencySelect, basicCurrencies, 'USD');
    }
  }
  
  // Populate select list function (from Currency-Converter-master)
  function populateSelectList(selectElement, dataList, defaultOption) {
    for (const key in dataList) {
      const option = document.createElement('option');
      option.value = dataList[key];
      option.text = key;
      selectElement.appendChild(option);
    }

    if (defaultOption && !checkValueExists(selectElement, defaultOption)) {
      removeOptionByValue(selectElement, defaultOption);
    }
  }
  
  // Check if value exists in select list
  function checkValueExists(list, value) {
    const options = list.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        return true;
      }
    }
    return false;
  }
  
  // Remove option by value
  function removeOptionByValue(list, value) {
    const options = list.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        list.remove(i);
        break;
      }
    }
  }
  
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
  // Event listeners for unit selectors with auto-save (excluding currency and timezone)
  [elements.lengthUnit, elements.weightUnit, elements.temperatureUnit, 
   elements.volumeUnit, elements.areaUnit, elements.speedUnit, elements.torqueUnit, elements.pressureUnit].forEach(select => {
    select.addEventListener('change', () => {
      updateActivePreset();
      saveSettings(); // Auto-save when any setting changes
    });
  });
  
  // Currency, timezone and time format changes don't affect preset status
  elements.currencyUnit.addEventListener('change', () => {
    saveSettings();
  });
  
  elements.timezoneUnit.addEventListener('change', () => {
    saveSettings();
  });
  
  elements.timeFormatBtn.addEventListener('click', () => {
    const currentFormat = elements.timeFormatBtn.dataset.format;
    const newFormat = currentFormat === '12' ? '24' : '12';
    
    elements.timeFormatBtn.dataset.format = newFormat;
    elements.timeFormatBtn.textContent = newFormat === '12' ? '12 Hours' : '24 Hours';
    
    saveSettings();
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
      elements.speedUnit.value = settings.speedUnit || 'ms';
      elements.torqueUnit.value = settings.torqueUnit || 'nm';
      elements.pressureUnit.value = settings.pressureUnit || 'pa';
      elements.timezoneUnit.value = settings.timezoneUnit || 'auto';
      
      // Set button based on settings
      const is12hr = settings.is12hr !== false; // Default to 12hr (true)
      elements.timeFormatBtn.dataset.format = is12hr ? '12' : '24';
      elements.timeFormatBtn.textContent = is12hr ? '12 Hours' : '24 Hours';
      
      elements.currencyUnit.value = settings.currencyUnit || 'USD';
      
      updateActivePreset(settings.preset || 'metric');
    } catch (error) {
      console.error('Error loading settings:', error);
      applyPreset('metric');
    }
  }
  
  function applyPreset(presetName) {
    if (presetName !== 'custom' && presets[presetName]) {
      const preset = presets[presetName];
      // Store current currency and timezone selection before applying preset
      const currentCurrency = elements.currencyUnit.value;
      const currentTimezone = elements.timezoneUnit.value;
      
      elements.lengthUnit.value = preset.lengthUnit;
      elements.weightUnit.value = preset.weightUnit;
      elements.temperatureUnit.value = preset.temperatureUnit;
      elements.volumeUnit.value = preset.volumeUnit;
      elements.areaUnit.value = preset.areaUnit;
      elements.speedUnit.value = preset.speedUnit;
      elements.torqueUnit.value = preset.torqueUnit;
      elements.pressureUnit.value = preset.pressureUnit;
      
      // Restore currency and timezone selection - don't change them with presets
      elements.currencyUnit.value = currentCurrency;
      elements.timezoneUnit.value = currentTimezone;
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
      // Auto-detect based on current settings (excluding currency and timezone)
      const currentSettings = {
        lengthUnit: elements.lengthUnit.value,
        weightUnit: elements.weightUnit.value,
        temperatureUnit: elements.temperatureUnit.value,
        volumeUnit: elements.volumeUnit.value,
        areaUnit: elements.areaUnit.value,
        speedUnit: elements.speedUnit.value,
        torqueUnit: elements.torqueUnit.value,
        pressureUnit: elements.pressureUnit.value
      };
      
      // Compare against preset configurations (excluding currency and timezone)
      const metricSettings = {
        lengthUnit: presets.metric.lengthUnit,
        weightUnit: presets.metric.weightUnit,
        temperatureUnit: presets.metric.temperatureUnit,
        volumeUnit: presets.metric.volumeUnit,
        areaUnit: presets.metric.areaUnit,
        speedUnit: presets.metric.speedUnit,
        torqueUnit: presets.metric.torqueUnit,
        pressureUnit: presets.metric.pressureUnit
      };
      
      const imperialSettings = {
        lengthUnit: presets.imperial.lengthUnit,
        weightUnit: presets.imperial.weightUnit,
        temperatureUnit: presets.imperial.temperatureUnit,
        volumeUnit: presets.imperial.volumeUnit,
        areaUnit: presets.imperial.areaUnit,
        speedUnit: presets.imperial.speedUnit,
        torqueUnit: presets.imperial.torqueUnit,
        pressureUnit: presets.imperial.pressureUnit
      };
      
      const isMetric = JSON.stringify(currentSettings) === JSON.stringify(metricSettings);
      const isImperial = JSON.stringify(currentSettings) === JSON.stringify(imperialSettings);
      
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
      areaUnit: elements.areaUnit.value,
      speedUnit: elements.speedUnit.value,
      torqueUnit: elements.torqueUnit.value,
      pressureUnit: elements.pressureUnit.value,
      timezoneUnit: elements.timezoneUnit.value,
      is12hr: elements.timeFormatBtn.dataset.format === '12',
      currencyUnit: elements.currencyUnit.value
    };
    
    try {
      await chrome.storage.sync.set({ unitSettings: settings });
      
      // Notify content scripts about settings update
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'settingsUpdated' });
        } catch (error) {
          // Ignore errors for tabs that don't have the content script
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
  
  function getActivePreset() {
    if (elements.metricBtn.classList.contains('active')) return 'metric';
    if (elements.imperialBtn.classList.contains('active')) return 'imperial';
    return 'custom';
  }
});
