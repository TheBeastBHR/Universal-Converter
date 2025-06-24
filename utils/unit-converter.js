// Unit conversion utilities and helper functions

// Global namespace for unit converter
window.UnitConverter = window.UnitConverter || {};

window.UnitConverter.UnitConverter = class {
  constructor() {
    this.conversions = window.UnitConverterData.CONVERSION_RATIOS;
    this.unitAliases = window.UnitConverterData.UNIT_ALIASES;
    this.defaultUnits = window.UnitConverterData.DEFAULT_UNITS;
    this.areaToLinearMap = window.UnitConverterData.AREA_TO_LINEAR_MAP;
  }
  
  /**
   * Normalize unit string to standard format
   * @param {string} unit - The unit string to normalize
   * @returns {string} - Normalized unit string
   */
  normalizeUnit(unit) {
    const normalized = unit.toLowerCase().replace(/\s+/g, ' ').trim();
    return this.unitAliases[normalized] || normalized;
  }
  
  /**
   * Get the type of unit (length, weight, temperature, etc.)
   * @param {string} unit - The unit to check
   * @returns {string|null} - The unit type or null if not found
   */
  getUnitType(unit) {
    const normalizedUnit = this.normalizeUnit(unit);
    for (const [type, units] of Object.entries(this.conversions)) {
      if (type === 'temperature') continue;      if (units.hasOwnProperty(normalizedUnit)) {
        return type;
      }
    }
    if (['c', 'f', 'k'].includes(normalizedUnit)) {
      return 'temperature';
    }
    return null;
  }
  
  /**
   * Convert a value from one unit to another
   * @param {number} value - The value to convert
   * @param {string} fromUnit - Source unit
   * @param {string} toUnit - Target unit
   * @returns {number|null} - Converted value or null if conversion not possible
   */
  convert(value, fromUnit, toUnit) {
    const normalizedFrom = this.normalizeUnit(fromUnit);
    const normalizedTo = this.normalizeUnit(toUnit);
    const unitType = this.getUnitType(normalizedFrom);
    
    if (!unitType || this.getUnitType(normalizedTo) !== unitType) {
      return null;
    }
    
    if (unitType === 'temperature') {
      return this.convertTemperature(value, normalizedFrom, normalizedTo);
    }
    
    const conversions = this.conversions[unitType];
    const valueInBase = value / conversions[normalizedFrom];
    return valueInBase * conversions[normalizedTo];
  }
  
  /**
   * Convert temperature between different scales
   * @param {number} value - Temperature value
   * @param {string} from - Source temperature scale
   * @param {string} to - Target temperature scale
   * @returns {number} - Converted temperature
   */
  convertTemperature(value, from, to) {
    let celsius = value;
    
    // Convert to Celsius first
    if (from === 'f') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'k') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'f') {
      return (celsius * 9/5) + 32;
    } else if (to === 'k') {
      return celsius + 273.15;
    }
    
    return celsius;
  }
  
  /**
   * Get the default target unit for a given source unit based on user settings
   * @param {string} sourceUnit - The source unit
   * @param {Object} userSettings - User preference settings
   * @returns {string|null} - Target unit or null
   */
  getDefaultTargetUnit(sourceUnit, userSettings) {
    const unitType = this.getUnitType(sourceUnit);
    if (!unitType) return null;
    
    const settingKey = unitType === 'weight' ? 'weightUnit' : 
                      unitType === 'temperature' ? 'temperatureUnit' :
                      unitType === 'volume' ? 'volumeUnit' :
                      unitType === 'area' ? 'areaUnit' : 'lengthUnit';
    
    return userSettings[settingKey] || this.defaultUnits[unitType];
  }
  
  /**
   * Format the conversion result for display
   * @param {number} value - The numeric value
   * @param {string} unit - The unit string
   * @returns {string} - Formatted result string
   */
  formatResult(value, unit) {
    const formatted = Math.round(value * 10000) / 10000;
    return `${formatted} ${unit}`;
  }
    /**
   * Calculate area equivalent for linear measurements
   * @param {number} areaValue - The area value (in target units)
   * @param {string} targetUnit - Target area unit
   * @returns {string|null} - Linear equivalent or null
   */
  getLinearEquivalent(areaValue, targetUnit) {
    const targetLinearUnit = this.areaToLinearMap[targetUnit];
    
    if (targetLinearUnit) {
      const linearSideLength = Math.sqrt(areaValue);
      return this.formatResult(linearSideLength, targetLinearUnit);
    }
    return null;
  }
    /**
   * Get the best unit for displaying a value (auto-size detection)
   * @param {number} value - The converted value
   * @param {string} unitType - The unit type (length, weight, etc.)
   * @param {string} defaultUnit - The default target unit
   * @returns {Object} - {value, unit} with the best unit choice
   */
  getBestUnit(value, unitType, defaultUnit) {
    if (unitType === 'length') {
      const units = this.conversions.length;
      
      // If less than 1 and default is meters, use smaller units
      if (value < 1 && defaultUnit === 'm') {
        const cmValue = value * units.cm;
        if (cmValue >= 1) return { value: cmValue, unit: 'cm' };
        const mmValue = value * units.mm;
        return { value: mmValue, unit: 'mm' };
      }
      
      // If less than 1 and default is feet, use inches
      if (value < 1 && defaultUnit === 'ft') {
        const inValue = value * units.in;
        return { value: inValue, unit: 'in' };
      }
      
      // If less than 1 and default is yards, use feet or inches
      if (value < 1 && defaultUnit === 'yd') {
        const ftValue = value * units.ft;
        if (ftValue >= 1) return { value: ftValue, unit: 'ft' };
        const inValue = value * units.in;
        return { value: inValue, unit: 'in' };
      }
      
      // If too large, use larger unit
      if (value > 1000 && defaultUnit === 'm') {
        return { value: value * units.km, unit: 'km' };
      }
      if (value > 5280 && defaultUnit === 'ft') {
        return { value: value * units.mi, unit: 'mi' };
      }
      
    } else if (unitType === 'weight') {
      const units = this.conversions.weight;
      
      // If less than 1 and default is kg, use grams
      if (value < 1 && defaultUnit === 'kg') {
        return { value: value * units.g, unit: 'g' };
      }
      
      // If less than 1 and default is pounds, use ounces
      if (value < 1 && defaultUnit === 'lb') {
        return { value: value * units.oz, unit: 'oz' };
      }
      
      // If too large, use larger unit
      if (value > 1000 && defaultUnit === 'kg') {
        return { value: value * units.t, unit: 't' };
      }
      
    } else if (unitType === 'volume') {
      const units = this.conversions.volume;
      
      // If less than 1 and default is liters, use ml
      if (value < 1 && defaultUnit === 'l') {
        return { value: value * units.ml, unit: 'ml' };
      }
      
      // If less than 1 and default is gallons, use smaller units
      if (value < 1 && defaultUnit === 'gal') {
        const qtValue = value * units.qt;
        if (qtValue >= 1) return { value: qtValue, unit: 'qt' };
        const ptValue = value * units.pt;
        if (ptValue >= 1) return { value: ptValue, unit: 'pt' };
        const cupValue = value * units.cup;
        if (cupValue >= 1) return { value: cupValue, unit: 'cup' };
        const flozValue = value * units.floz;
        return { value: flozValue, unit: 'floz' };
      }
      
    } else if (unitType === 'area') {
      const units = this.conversions.area;
      
      // If less than 1 and default is m², use smaller units
      if (value < 1 && defaultUnit === 'm2') {
        const cm2Value = value * units.cm2;
        if (cm2Value >= 1) return { value: cm2Value, unit: 'cm2' };
        const mm2Value = value * units.mm2;
        return { value: mm2Value, unit: 'mm2' };
      }
      
      // If less than 1 and default is ft², use in²
      if (value < 1 && defaultUnit === 'ft2') {
        const in2Value = value * units.in2;
        return { value: in2Value, unit: 'in2' };
      }
      
      // If too large, use larger unit
      if (value > 1000000 && defaultUnit === 'm2') {
        return { value: value * units.km2, unit: 'km2' };
      }
      if (value > 43560 && defaultUnit === 'ft2') {
        return { value: value * units.acre, unit: 'acre' };
      }
    }
    
    return { value, unit: defaultUnit };
  }
};
