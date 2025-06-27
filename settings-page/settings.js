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
      currencyUnit: 'EUR'
    },
    imperial: {
      lengthUnit: 'ft',
      weightUnit: 'lb',
      temperatureUnit: 'f',
      volumeUnit: 'gal',
      areaUnit: 'ft2',
      currencyUnit: 'USD'
    }
  };
  
  // Dynamic currency list initialization
  async function initializeCurrencyList() {
    const currencySelect = document.getElementById('currencyUnit');
    
    // Clear existing options
    currencySelect.innerHTML = '';
    
    // Add detect currency option
    const detectOption = document.createElement('option');
    detectOption.value = 'detect-currency';
    detectOption.textContent = 'Detect your currency';
    currencySelect.appendChild(detectOption);
    
    // Add all currencies from the mapping
    if (typeof countryNameToCurrencyCode !== 'undefined') {
      populateSelectList(currencySelect, countryNameToCurrencyCode, 'detect-currency');
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
      populateSelectList(currencySelect, basicCurrencies, 'detect-currency');
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
  // Event listeners for unit selectors with auto-save (excluding currency)
  [elements.lengthUnit, elements.weightUnit, elements.temperatureUnit, 
   elements.volumeUnit, elements.areaUnit].forEach(select => {
    select.addEventListener('change', () => {
      updateActivePreset();
      saveSettings(); // Auto-save when any setting changes
    });
  });
  
  // Currency unit changes don't affect preset status
  elements.currencyUnit.addEventListener('change', () => {
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
      // Store current currency selection before applying preset
      const currentCurrency = elements.currencyUnit.value;
      
      elements.lengthUnit.value = preset.lengthUnit;
      elements.weightUnit.value = preset.weightUnit;
      elements.temperatureUnit.value = preset.temperatureUnit;
      elements.volumeUnit.value = preset.volumeUnit;
      elements.areaUnit.value = preset.areaUnit;
      
      // Restore currency selection - don't change it with presets
      elements.currencyUnit.value = currentCurrency;
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
      // Auto-detect based on current settings (excluding currency)
      const currentSettings = {
        lengthUnit: elements.lengthUnit.value,
        weightUnit: elements.weightUnit.value,
        temperatureUnit: elements.temperatureUnit.value,
        volumeUnit: elements.volumeUnit.value,
        areaUnit: elements.areaUnit.value
      };
      
      // Compare against preset configurations (excluding currency)
      const metricSettings = {
        lengthUnit: presets.metric.lengthUnit,
        weightUnit: presets.metric.weightUnit,
        temperatureUnit: presets.metric.temperatureUnit,
        volumeUnit: presets.metric.volumeUnit,
        areaUnit: presets.metric.areaUnit
      };
      
      const imperialSettings = {
        lengthUnit: presets.imperial.lengthUnit,
        weightUnit: presets.imperial.weightUnit,
        temperatureUnit: presets.imperial.temperatureUnit,
        volumeUnit: presets.imperial.volumeUnit,
        areaUnit: presets.imperial.areaUnit
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
