// Text pattern matching and conversion detection

// Global namespace for conversion detector
window.UnitConverter = window.UnitConverter || {};

window.UnitConverter.ConversionDetector = class {
  constructor(unitConverter) {
    this.unitConverter = unitConverter;
    this.patterns = window.UnitConverterData.UNIT_PATTERNS;
  }
  
  /**
   * Find all conversions in the given text
   * @param {string} text - The text to analyze
   * @param {Object} userSettings - User preference settings
   * @returns {Array} - Array of conversion objects
   */
  findConversions(text, userSettings) {
    const conversions = [];
    
    // Check for dimensions (L x W x H format) - supports mixed units
    const dimensionConversions = this.findDimensionalConversions(text, userSettings);
    conversions.push(...dimensionConversions);
    
    // Check for regular units
    const regularConversions = this.findRegularConversions(text, userSettings);
    conversions.push(...regularConversions);
    
    return conversions;
  }
  
  /**
   * Find dimensional conversions (L x W x H format)
   * @param {string} text - Text to analyze
   * @param {Object} userSettings - User settings
   * @returns {Array} - Array of dimensional conversions
   */
  findDimensionalConversions(text, userSettings) {
    const conversions = [];
    const dimensionMatches = text.matchAll(this.patterns.dimensions);
    
    for (const match of dimensionMatches) {
      const [fullMatch, length, lengthUnit, width, widthUnit, height, heightUnit] = match;
      
      // Normalize all units
      const normalizedLengthUnit = this.unitConverter.normalizeUnit(lengthUnit);
      const normalizedWidthUnit = this.unitConverter.normalizeUnit(widthUnit);
      const normalizedHeightUnit = this.unitConverter.normalizeUnit(heightUnit);
      
      // Get target unit (use the first unit's target or default)
      const targetUnit = this.unitConverter.getDefaultTargetUnit(normalizedLengthUnit, userSettings);
      
      if (targetUnit) {
        // Convert all dimensions to the target unit
        const convertedLength = this.unitConverter.convert(parseFloat(length), normalizedLengthUnit, targetUnit);
        const convertedWidth = this.unitConverter.convert(parseFloat(width), normalizedWidthUnit, targetUnit);
        const convertedHeight = this.unitConverter.convert(parseFloat(height), normalizedHeightUnit, targetUnit);
        
        if (convertedLength !== null && convertedWidth !== null && convertedHeight !== null) {
          conversions.push({
            original: fullMatch,
            converted: `${Math.round(convertedLength * 100) / 100} × ${Math.round(convertedWidth * 100) / 100} × ${Math.round(convertedHeight * 100) / 100} ${targetUnit}`,
            type: 'dimensions'
          });
        }
      }
    }
    
    return conversions;
  }
  
  /**
   * Find regular unit conversions
   * @param {string} text - Text to analyze
   * @param {Object} userSettings - User settings
   * @returns {Array} - Array of regular conversions
   */  findRegularConversions(text, userSettings) {
    const conversions = [];
    const processedRanges = []; // Track which parts of text we've already processed
    
    // Process area units FIRST to avoid conflicts with length units
    const priorityOrder = ['area', 'temperature', 'volume', 'weight', 'length'];
    
    for (const unitType of priorityOrder) {
      if (unitType === 'dimensions') continue;
      
      const pattern = this.patterns[unitType];
      if (!pattern) continue;
      
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const [fullMatch, value, unit] = match;
        const matchStart = match.index;
        const matchEnd = match.index + fullMatch.length;
        
        // Check if this range overlaps with already processed ranges
        const isOverlapping = processedRanges.some(range => 
          (matchStart < range.end && matchEnd > range.start)
        );
        
        if (isOverlapping) continue; // Skip if already processed by higher priority pattern
        
        const normalizedUnit = this.unitConverter.normalizeUnit(unit);
        const targetUnit = this.unitConverter.getDefaultTargetUnit(normalizedUnit, userSettings);
        
        if (targetUnit && normalizedUnit !== targetUnit) {
          const convertedValue = this.unitConverter.convert(parseFloat(value), normalizedUnit, targetUnit);
          if (convertedValue !== null) {
            // Auto-detect best unit size
            const bestResult = this.unitConverter.getBestUnit(convertedValue, unitType, targetUnit);
            let convertedText = this.unitConverter.formatResult(bestResult.value, bestResult.unit);
            
            // For area units, also show the linear equivalent
            if (unitType === 'area') {
              const linearEquivalent = this.unitConverter.getLinearEquivalent(
                bestResult.value, bestResult.unit
              );
              if (linearEquivalent) {
                convertedText = `${convertedText}, ${linearEquivalent} linear`;
              }
            }
            
            conversions.push({
              original: fullMatch,
              converted: convertedText,
              type: unitType
            });
            
            // Mark this range as processed
            processedRanges.push({ start: matchStart, end: matchEnd });
          }
        }
      }
    }
    
    return conversions;
  }
};
