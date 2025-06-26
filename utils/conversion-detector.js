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
    
    // Check for currency conversions using Currency-Converter-master logic
    const currencyConversions = this.findCurrencyConversions(text, userSettings);
    conversions.push(...currencyConversions);
    
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
   * Find currency conversions using Currency-Converter-master logic
   * @param {string} text - Text to analyze
   * @param {Object} userSettings - User settings
   * @returns {Array} - Array of currency conversions
   */
  /**
   * Find currency conversions using Currency-Converter-master logic and regex patterns
   * @param {string} text - Text to analyze
   * @param {Object} userSettings - User settings
   * @returns {Array} - Array of currency conversions
   */
  findCurrencyConversions(text, userSettings) {
    const conversions = [];
    
    if (!window.UnitConverter.currencyConverter) {
      return conversions;
    }
    
    try {
      const targetCurrency = userSettings.currencyUnit || 'USD';
      const currencyConverter = window.UnitConverter.currencyConverter;
      
      // Use regex pattern to find currency matches
      const currencyPattern = this.patterns.currency;
      const matches = [...text.matchAll(currencyPattern)];
      
      for (const match of matches) {
        const fullMatch = match[0];
        let amount, symbol;
        
        // Handle both symbol-first and symbol-last patterns
        if (match[1] && match[2]) {
          // Symbol first: $100
          symbol = match[1];
          amount = match[2];
        } else if (match[3] && match[4]) {
          // Symbol last: 100$
          amount = match[3];
          symbol = match[4];
        } else {
          continue;
        }
        
        // Use Currency-Converter-master logic for detection
        const detectedCurrency = currencyConverter.detectCurrency(symbol);
        
        if (detectedCurrency !== 'Unknown currency') {
          // Extract the numeric value using Currency-Converter-master logic
          const numericAmount = currencyConverter.extractNumber(fullMatch);
          
          if (numericAmount && detectedCurrency.toUpperCase() !== targetCurrency.toUpperCase()) {
            conversions.push({
              match: fullMatch,
              originalValue: numericAmount,
              originalUnit: detectedCurrency,
              targetUnit: targetCurrency.toUpperCase(),
              type: 'currency',
              needsAsyncProcessing: true,
              fromCurrency: detectedCurrency,
              toCurrency: targetCurrency.toUpperCase(),
              convertedValue: '...', // Will be updated with actual conversion
              // Add properties expected by popup
              original: `${numericAmount} ${detectedCurrency}`,
              converted: '...' // Will be updated after API call
            });
          }
        }
      }
    } catch (error) {
      console.error('Currency detection error:', error);
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
            
            // Skip if the best unit is the same as the original unit AND the values are essentially the same
            if (bestResult.unit === normalizedUnit && Math.abs(bestResult.value - parseFloat(value)) < 0.01) {
              continue;
            }
            
            let convertedText = this.unitConverter.formatResult(bestResult.value, bestResult.unit);
            
            // For area units, also show the linear equivalent
            // Commented out as requested - linear equivalent feature disabled
            /*
            if (unitType === 'area') {
              const linearEquivalent = this.unitConverter.getLinearEquivalent(
                bestResult.value, bestResult.unit
              );
              if (linearEquivalent) {
                convertedText = `${convertedText}, ${linearEquivalent} linear`;
              }
            }
            */
            
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
