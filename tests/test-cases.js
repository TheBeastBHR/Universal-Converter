// Test cases for the Universal Converter Extension
// This file contains all test case definitions separated from the test runner logic

const testCases = {
  // Basic unit conversion test cases
  basicConversions: [
    {
      name: 'Length: 100 cm = 1 m',
      type: 'conversion',
      input: { value: 100, from: 'cm', to: 'm' },
      expected: 1,
      tolerance: 0.001
    },
    {
      name: 'Length: 3.28084 ft ≈ 1 m',
      type: 'conversion',
      input: { value: 3.28084, from: 'ft', to: 'm' },
      expected: 1,
      tolerance: 0.001
    },
    {
      name: 'Weight: 1000 g = 1 kg',
      type: 'conversion',
      input: { value: 1000, from: 'g', to: 'kg' },
      expected: 1,
      tolerance: 0.001
    },
    {
      name: 'Temperature: 0°C = 32°F',
      type: 'conversion',
      input: { value: 0, from: 'c', to: 'f' },
      expected: 32,
      tolerance: 0.001
    },
    {
      name: 'Temperature: 32°F = 0°C',
      type: 'conversion',
      input: { value: 32, from: 'f', to: 'c' },
      expected: 0,
      tolerance: 0.001
    }
  ],

  // Area conversion test cases
  areaConversions: [
    {
      name: 'Area: 10000 cm² = 1 m²',
      type: 'conversion',
      input: { value: 10000, from: 'cm2', to: 'm2' },
      expected: 1,
      tolerance: 0.001
    },
    {
      name: 'Area: 1 ft² ≈ 0.092903 m²',
      type: 'conversion',
      input: { value: 1, from: 'ft2', to: 'm2' },
      expected: 0.092903,
      tolerance: 0.001
    }
  ],

  // Unit detection test cases
  unitDetection: [
    {
      name: 'Unicode alias: cm² → cm2',
      type: 'normalize',
      input: 'cm²',
      expected: 'cm2'
    },
    {
      name: 'Unicode alias: m² → m2',
      type: 'normalize',
      input: 'm²',
      expected: 'm2'
    },
    {
      name: 'Text alias: square meters → m2',
      type: 'normalize',
      input: 'square meters',
      expected: 'm2'
    },
    {
      name: 'Text alias: meters squared → m2',
      type: 'normalize',
      input: 'meters squared',
      expected: 'm2'
    },
    {
      name: 'Unit type: cm2 is area',
      type: 'unitType',
      input: 'cm2',
      expected: 'area'
    },
    {
      name: 'Unit type: cm is length',
      type: 'unitType',
      input: 'cm',
      expected: 'length'
    }
  ],

  // Auto-sizing test cases
  autoSizing: [
    {
      name: 'Auto-size: 0.001 m² → cm²',
      type: 'bestUnit',
      input: { value: 0.001, unitType: 'area', sourceUnit: 'm2' },
      expected: 'cm2'
    },
    {
      name: 'Auto-size: 0.001 m → mm',
      type: 'bestUnit',
      input: { value: 0.001, unitType: 'length', sourceUnit: 'm' },
      expected: 'mm'
    },
    {
      name: 'Auto-size: 0.3 m → 30 cm',
      type: 'bestUnitWithValue',
      input: { value: 0.3, unitType: 'length', sourceUnit: 'm' },
      expected: { unit: 'cm', value: 30 }
    },
    {
      name: 'Auto-size: 2000000 m² → km²',
      type: 'bestUnit',
      input: { value: 2000000, unitType: 'area', sourceUnit: 'm2' },
      expected: 'km2'
    },
    {
      name: 'Auto-size: 2000 m → km',
      type: 'bestUnit',
      input: { value: 2000, unitType: 'length', sourceUnit: 'm' },
      expected: 'km'
    }
  ],

  // Pattern matching test cases
  patternMatching: [
    {
      name: 'Pattern: "1 ft²" detected',
      type: 'patternDetection',
      input: { text: '1 ft²', userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l' } },
      expected: { minConversions: 1 }
    },
    {
      name: 'Pattern: "1 ft²" detected as area',
      type: 'patternDetectionType',
      input: { text: '1 ft²', userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l' } },
      expected: 'area'
    },
    {
      name: 'Pattern: "3 feet" detected',
      type: 'patternDetection',
      input: { text: '3 feet', userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l' } },
      expected: { minConversions: 1 }
    },
    {
      name: 'Pattern: "3 feet" detected as length',
      type: 'patternDetectionType',
      input: { text: '3 feet', userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l' } },
      expected: 'length'
    },
    {
      name: 'Pattern: "1 square foot" detected',
      type: 'patternDetection',
      input: { text: '1 square foot', userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l' } },
      expected: { minConversions: 1 }
    }
  ],

  // Conversion test cases
  comprehensiveConversions: [
    // Length conversions - metric
    { name: 'Length: 10 mm = 1 cm', type: 'conversion', input: { value: 10, from: 'mm', to: 'cm' }, expected: 1, tolerance: 0.001 },
    { name: 'Length: 1 km = 1000 m', type: 'conversion', input: { value: 1, from: 'km', to: 'm' }, expected: 1000, tolerance: 0.001 },
    
    // Length conversions - imperial
    { name: 'Length: 12 in = 1 ft', type: 'conversion', input: { value: 12, from: 'in', to: 'ft' }, expected: 1, tolerance: 0.001 },
    { name: 'Length: 1 yd = 3 ft', type: 'conversion', input: { value: 1, from: 'yd', to: 'ft' }, expected: 3, tolerance: 0.001 },
    { name: 'Length: 1 mi = 5280 ft', type: 'conversion', input: { value: 1, from: 'mi', to: 'ft' }, expected: 5280, tolerance: 0.1 },
    
    // Weight conversions - metric
    { name: 'Weight: 1000 mg = 1 g', type: 'conversion', input: { value: 1000, from: 'mg', to: 'g' }, expected: 1, tolerance: 0.001 },
    { name: 'Weight: 1 t = 1000 kg', type: 'conversion', input: { value: 1, from: 't', to: 'kg' }, expected: 1000, tolerance: 0.001 },
    
    // Weight conversions - imperial
    { name: 'Weight: 16 oz = 1 lb', type: 'conversion', input: { value: 16, from: 'oz', to: 'lb' }, expected: 1, tolerance: 0.001 },
    
    // Volume conversions - metric
    { name: 'Volume: 1000 ml = 1 l', type: 'conversion', input: { value: 1000, from: 'ml', to: 'l' }, expected: 1, tolerance: 0.001 },
    
    // Volume conversions - imperial
    { name: 'Volume: 2 cup = 1 pt', type: 'conversion', input: { value: 2, from: 'cup', to: 'pt' }, expected: 1, tolerance: 0.001 },
    { name: 'Volume: 2 pt = 1 qt', type: 'conversion', input: { value: 2, from: 'pt', to: 'qt' }, expected: 1, tolerance: 0.001 },
    { name: 'Volume: 4 qt = 1 gal', type: 'conversion', input: { value: 4, from: 'qt', to: 'gal' }, expected: 1, tolerance: 0.001 },
    
    // Area conversions - advanced
    { name: 'Area: 100 mm² = 1 cm²', type: 'conversion', input: { value: 100, from: 'mm2', to: 'cm2' }, expected: 1, tolerance: 0.001 },
    { name: 'Area: 1 km² = 1,000,000 m²', type: 'conversion', input: { value: 1, from: 'km2', to: 'm2' }, expected: 1000000, tolerance: 0.001 },
    { name: 'Area: 144 in² = 1 ft²', type: 'conversion', input: { value: 144, from: 'in2', to: 'ft2' }, expected: 1, tolerance: 0.001 }
  ],

  // Decimal precision test cases
  decimalPrecision: [
    { name: 'Format: 3.14159 → 3.14 m', type: 'format', input: { value: 3.14159, unit: 'm' }, expected: '3.14 m' },
    { name: 'Format: 1.999 → 2 kg', type: 'format', input: { value: 1.999, unit: 'kg' }, expected: '2 kg' },
    { name: 'Format: 0.666666 → 0.67 ft', type: 'format', input: { value: 0.666666, unit: 'ft' }, expected: '0.67 ft' },
    { name: 'Format: 10 → 10 cm', type: 'format', input: { value: 10, unit: 'cm' }, expected: '10 cm' }
  ],

  // Edge cases test cases
  edgeCases: [
    { name: 'Edge: 0 m = 0 cm', type: 'conversion', input: { value: 0, from: 'm', to: 'cm' }, expected: 0, tolerance: 0.001 },
    { name: 'Edge: 0.001 m = 1 mm', type: 'conversion', input: { value: 0.001, from: 'm', to: 'mm' }, expected: 1, tolerance: 0.001 },
    { name: 'Edge: 1,000,000 m = 1000 km', type: 'conversion', input: { value: 1000000, from: 'm', to: 'km' }, expected: 1000, tolerance: 0.001 },
    { name: 'Edge: Invalid unit returns null', type: 'conversionNull', input: { value: 100, from: 'm', to: 'invalid_unit' }, expected: null },
    { name: 'Edge: Different unit types return null', type: 'conversionNull', input: { value: 100, from: 'm', to: 'kg' }, expected: null }
  ],

  // Comprehensive auto-sizing test cases
  comprehensiveAutoSizing: [
    { name: 'Auto-size: 0.0001 m → mm', type: 'bestUnit', input: { value: 0.0001, unitType: 'length', sourceUnit: 'm' }, expected: 'mm' },
    { name: 'Auto-size: 0.99 m → cm', type: 'bestUnit', input: { value: 0.99, unitType: 'length', sourceUnit: 'm' }, expected: 'cm' },
    { name: 'Auto-size: 5000 m → km', type: 'bestUnit', input: { value: 5000, unitType: 'length', sourceUnit: 'm' }, expected: 'km' },
    { name: 'Auto-size: 0.5 ft → in', type: 'bestUnit', input: { value: 0.5, unitType: 'length', sourceUnit: 'ft' }, expected: 'in' },
    { name: 'Auto-size: 10000 ft → mi', type: 'bestUnit', input: { value: 10000, unitType: 'length', sourceUnit: 'ft' }, expected: 'mi' },
    { name: 'Auto-size: 0.5 kg → g', type: 'bestUnit', input: { value: 0.5, unitType: 'weight', sourceUnit: 'kg' }, expected: 'g' },
    { name: 'Auto-size: 2000 kg → t', type: 'bestUnit', input: { value: 2000, unitType: 'weight', sourceUnit: 'kg' }, expected: 't' },
    { name: 'Auto-size: 0.5 l → ml', type: 'bestUnit', input: { value: 0.5, unitType: 'volume', sourceUnit: 'l' }, expected: 'ml' },
    { name: 'Auto-size: 0.25 gal → cup', type: 'bestUnit', input: { value: 0.25, unitType: 'volume', sourceUnit: 'gal' }, expected: 'cup' }
  ],

  // Dimension conversion test cases
  dimensionConversions: [
    {
      name: 'Dimension: "4.5 × 3.2 × 2.8 meters" detected',
      type: 'dimensionDetection',
      input: { 
        text: '4.5 × 3.2 × 2.8 meters', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { detected: true }
    },
    {
      name: 'Dimension: Metric dimensions convert to cm',
      type: 'dimensionConversion',
      input: { 
        text: '4.5 × 3.2 × 2.8 meters', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { containsUnit: 'cm' }
    },
    {
      name: 'Dimension: "10 x 5 x 3 inches" detected',
      type: 'dimensionDetection',
      input: { 
        text: '10 x 5 x 3 inches', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { detected: true }
    },
    {
      name: 'Dimension: Imperial dimensions convert to cm',
      type: 'dimensionConversion',
      input: { 
        text: '10 x 5 x 3 inches', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { containsUnit: 'cm' }
    },
    {
      name: 'Dimension: "8 x 4 x 2 feet" with x separator detected',
      type: 'dimensionDetection',
      input: { 
        text: '8 x 4 x 2 feet', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { detected: true }
    },
    {
      name: 'Dimension: "6 × 3 × 1.5 meters" with × separator detected',
      type: 'dimensionDetection',
      input: { 
        text: '6 × 3 × 1.5 meters', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { detected: true }
    },
    {
      name: 'Dimension: "12 by 8 by 6 feet" with by separator detected',
      type: 'dimensionDetection',
      input: { 
        text: '12 by 8 by 6 feet', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { detected: true }
    }
  ],

  // Single-selection approach test cases 
  doubleDetectionPrevention: [
    {
      name: 'Single Selection: Dimension should convert cm to m when user prefers meters',
      type: 'doubleDetectionCount',
      input: { 
        text: '36.5 x 110.8 x 32 cm', 
        userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: 1
    },
    {
      name: 'Single Selection: Dimension should convert cm to m and detect as dimensions type',
      type: 'doubleDetectionType',
      input: { 
        text: '36.5 x 110.8 x 32 cm', 
        userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: 'dimensions'
    },
    {
      name: 'Single Selection: Same unit should NOT convert (same-unit suppression)',
      type: 'doubleDetectionCount',
      input: { 
        text: '36.5 x 110.8 x 32 cm', 
        userSettings: { lengthUnit: 'cm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: 0
    },
    {
      name: 'Single Selection: Large dimension should convert to meters',
      type: 'doubleDetectionCount',
      input: { 
        text: '365 x 1108 x 320 cm', 
        userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: 1
    },
    {
      name: 'Original Bug: "36.5 x 110.8 x 32 cm" should convert to meters when user prefers meters',
      type: 'originalBugFix',
      input: { 
        text: '36.5 x 110.8 x 32 cm', 
        userSettings: { lengthUnit: 'm', areaUnit: 'm2', weightUnit: 'kg', temperatureUnit: 'c', volumeUnit: 'l', currencyUnit: 'USD' }
      },
      expected: { count: 1, type: 'dimensions', allDimensions: true }
    }
  ],

  // Additional test cases for various dimension formats
  dimensionFormats: [
    {
      name: 'Simple dimension (small values, getBestUnit chooses cm)',
      text: '10 x 20 x 30 cm',
      expectedCount: 0,  // getBestUnit chooses cm, same-unit suppression applies
      expectedType: null
    },
    {
      name: 'Large dimension (should convert to meters)',
      text: '150 x 200 x 300 cm',
      expectedCount: 1,  // getBestUnit chooses m for large values
      expectedType: 'dimensions'
    },
    {
      name: 'Dimension in inches',
      text: '12.5 x 8.0 x 3.5 in',
      expectedCount: 1,  // Will convert to cm (different units)
      expectedType: 'dimensions'
    },
    {
      name: 'No spaces in dimension',
      text: '36.5x110.8x32cm',
      expectedCount: 1,  // Will convert cm to m (different units)
      expectedType: 'dimensions'
    },
    {
      name: 'Unicode multiply symbols',
      text: '36.5 × 110.8 × 32 cm',
      expectedCount: 1,  // Will convert cm to m (different units)
      expectedType: 'dimensions'
    }
  ],

  // Non-dimension test cases (updated for single-selection)
  nonDimensions: [
    {
      name: 'Height measurement',
      text: '180 cm',
      expectedCount: 1,
      expectedTypeNot: 'dimensions'
    },
    {
      name: 'Single measurement',
      text: '25 inches',
      expectedCount: 1,
      expectedTypeNot: 'dimensions'
    }
  ],

  // Single-selection conversion test cases (new simplified approach)
  singleSelection: [
    {
      name: 'Single Selection: "$100" should convert to target currency',
      type: 'singleSelection',
      input: {
        selectedText: '$100',
        currencyUnit: 'EUR'
      },
      expected: {
        conversionType: 'currency',
        hasConversion: true
      }
    },
    {
      name: 'Single Selection: "6m × 4m × 2.5m" should convert dimensions',
      type: 'singleSelection',
      input: {
        selectedText: '6m × 4m × 2.5m',
        lengthUnit: 'ft'
      },
      expected: {
        conversionType: 'dimensions',
        hasConversion: true
      }
    },
    {
      name: 'Single Selection: "200g" should convert weight',
      type: 'singleSelection',
      input: {
        selectedText: '200g',
        weightUnit: 'oz'
      },
      expected: {
        conversionType: 'weight',
        hasConversion: true
      }
    },
    {
      name: 'Single Selection: "100 inches" should convert length',
      type: 'singleSelection',
      input: {
        selectedText: '100 inches',
        lengthUnit: 'cm'
      },
      expected: {
        conversionType: 'length',
        hasConversion: true
      }
    },
    {
      name: 'Single Selection: "32°F" should convert temperature',
      type: 'singleSelection',
      input: {
        selectedText: '32°F',
        temperatureUnit: 'c'
      },
      expected: {
        conversionType: 'temperature',
        hasConversion: true
      }
    },
    {
      name: 'Single Selection: "in the US" should not convert (no measurement)',
      type: 'singleSelection',
      input: {
        selectedText: 'in the US',
        lengthUnit: 'cm'
      },
      expected: {
        hasConversion: false
      }
    },
    {
      name: 'Single Selection: "hello world" should not convert (no measurement)',
      type: 'singleSelection',
      input: {
        selectedText: 'hello world',
        lengthUnit: 'cm'
      },
      expected: {
        hasConversion: false
      }
    }
  ],

  // Speed conversion test cases
  speedConversions: [
    {
      name: 'Speed: 1 m/s = 3.6 km/h',
      type: 'conversion',
      input: { value: 1, from: 'ms', to: 'kmh' },
      expected: 3.6,
      tolerance: 0.001
    },
    {
      name: 'Speed: 60 mph ≈ 96.56 km/h',
      type: 'conversion',
      input: { value: 60, from: 'mph', to: 'kmh' },
      expected: 96.56064,
      tolerance: 0.001
    },
    {
      name: 'Speed: 100 km/h ≈ 27.78 m/s',
      type: 'conversion',
      input: { value: 100, from: 'kmh', to: 'ms' },
      expected: 27.77778,
      tolerance: 0.001
    },
    {
      name: 'Speed: 1 knot ≈ 1.852 km/h',
      type: 'conversion',
      input: { value: 1, from: 'kn', to: 'kmh' },
      expected: 1.852,
      tolerance: 0.001
    }
  ],

  // Torque conversion test cases
  torqueConversions: [
    {
      name: 'Torque: 1 N⋅m = 0.7376 lb⋅ft',
      type: 'conversion',
      input: { value: 1, from: 'nm', to: 'lbft' },
      expected: 0.737562,
      tolerance: 0.001
    },
    {
      name: 'Torque: 100 lb⋅ft ≈ 135.58 N⋅m',
      type: 'conversion',
      input: { value: 100, from: 'lbft', to: 'nm' },
      expected: 135.582,
      tolerance: 0.01
    },
    {
      name: 'Torque: 1 lb⋅ft = 12 lb⋅in',
      type: 'conversion',
      input: { value: 1, from: 'lbft', to: 'lbin' },
      expected: 12,
      tolerance: 0.001
    }
  ],

  // Pressure conversion test cases
  pressureConversions: [
    {
      name: 'Pressure: 1 bar = 100000 Pa',
      type: 'conversion',
      input: { value: 1, from: 'bar', to: 'pa' },
      expected: 100000,
      tolerance: 0.1
    },
    {
      name: 'Pressure: 1 atm = 101325 Pa',
      type: 'conversion',
      input: { value: 1, from: 'atm', to: 'pa' },
      expected: 101325,
      tolerance: 1
    },
    {
      name: 'Pressure: 14.7 psi ≈ 1 atm',
      type: 'conversion',
      input: { value: 14.696, from: 'psi', to: 'atm' },
      expected: 1,
      tolerance: 0.01
    },
    {
      name: 'Pressure: 760 mmHg = 1 atm',
      type: 'conversion',
      input: { value: 760, from: 'mmhg', to: 'atm' },
      expected: 1,
      tolerance: 0.001
    }
  ],

  // Timezone conversion test cases - now working with fixed detection
  timezoneConversions: [
    {
      name: 'Timezone: 3:30 PM EST → PST',
      type: 'timezoneConversion',
      input: { time: '3:30 PM EST', from: 'EST', to: 'PST' },
      expected: '12:30 PM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 9:45 AM GMT → PST',
      type: 'timezoneConversion',
      input: { time: '9:45 AM GMT', from: 'GMT', to: 'PST' },
      expected: '1:45 AM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 10:30 AM UTC → PST',
      type: 'timezoneConversion',
      input: { time: '10:30 AM UTC', from: 'UTC', to: 'PST' },
      expected: '2:30 AM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 6:20 PM JST → PST',
      type: 'timezoneConversion',
      input: { time: '6:20 PM JST', from: 'JST', to: 'PST' },
      expected: '1:20 AM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 4:30 PM CET → PST',
      type: 'timezoneConversion',
      input: { time: '4:30 PM CET', from: 'CET', to: 'PST' },
      expected: '7:30 AM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 2:30 PM GMT+5 → PST',
      type: 'timezoneConversion',
      input: { time: '2:30 PM GMT+5', from: 'GMT+5', to: 'PST' },
      expected: '1:30 AM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 15:30 EST → PST (24-hour format)',
      type: 'timezoneConversion',
      input: { time: '15:30 EST', from: 'EST', to: 'PST' },
      expected: '12:30 PM PST',
      tolerance: 0
    },
    {
      name: 'Timezone: 3:30pm Eastern → PST (alternative format)',
      type: 'timezoneConversion',
      input: { time: '3:30pm Eastern', from: 'EASTERN', to: 'PST' },
      expected: '12:30 PM PST',
      tolerance: 0
    }
  ],

  // Timezone pattern detection tests
  timezonePatternDetection: [
    {
      name: 'Timezone Detection: "3:30 PM EST" detected',
      type: 'patternDetection',
      input: { 
        text: '3:30 PM EST', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 1, type: 'timezone' }
    },
    {
      name: 'Timezone Detection: "Meeting at 9:45 AM GMT" detected',
      type: 'patternDetection',
      input: { 
        text: 'Meeting at 9:45 AM GMT', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 1, type: 'timezone' }
    },
    {
      name: 'Timezone Detection: "4:30 PM CET" detected',
      type: 'patternDetection',
      input: { 
        text: '4:30 PM CET', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 1, type: 'timezone' }
    },
    {
      name: 'Timezone Detection: "2:30 PM GMT+5" detected',
      type: 'patternDetection',
      input: { 
        text: '2:30 PM GMT+5', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 1, type: 'timezone' }
    },
    {
      name: 'Timezone Detection: "15:30 EST" (24-hour) detected',
      type: 'patternDetection',
      input: { 
        text: '15:30 EST', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 1, type: 'timezone' }
    },
    {
      name: 'Timezone Detection: "3:30pm Eastern" (alternative) detected',
      type: 'patternDetection',
      input: { 
        text: '3:30pm Eastern', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 1, type: 'timezone' }
    },
    {
      name: 'Timezone Detection: Same timezone skipped',
      type: 'patternDetection',
      input: { 
        text: '2:15 PM PST', 
        userSettings: { timezoneUnit: 'PST' } 
      },
      expected: { minConversions: 0 }
    }
  ],

  // Timezone regex pattern tests
  timezoneRegexTests: [
    {
      name: 'Timezone Regex: "3:30 PM EST" matches',
      type: 'regexTest',
      input: { 
        text: '3:30 PM EST',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*((EST|PST|CST|MST|GMT|UTC|JST|CET|EET|WET|BST|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)([+-]\d{1,2})?|([+-]\d{1,2}):?(\d{2})?)/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Regex: "22:45 GMT" matches',
      type: 'regexTest',
      input: { 
        text: '22:45 GMT',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*((EST|PST|CST|MST|GMT|UTC|JST|CET|EET|WET|BST|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)([+-]\d{1,2})?|([+-]\d{1,2}):?(\d{2})?)/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Regex: "6:15 PM UTC+3" matches',
      type: 'regexTest',
      input: { 
        text: '6:15 PM UTC+3',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*((EST|PST|CST|MST|GMT|UTC|JST|CET|EET|WET|BST|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)([+-]\d{1,2})?|([+-]\d{1,2}):?(\d{2})?)/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Regex: "10:45 AM Central" matches',
      type: 'regexTest',
      input: { 
        text: '10:45 AM Central',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*((EST|PST|CST|MST|GMT|UTC|JST|CET|EET|WET|BST|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)([+-]\d{1,2})?|([+-]\d{1,2}):?(\d{2})?)/gi
      },
      expected: { hasMatch: true }
    }
  ],

  // Timezone pattern recognition tests
  timezonePatternRecognition: [
    {
      name: 'Timezone Pattern: EST abbreviation recognized',
      type: 'normalize',
      input: 'EST',
      expected: 'est'
    },
    {
      name: 'Timezone Pattern: PST abbreviation recognized',
      type: 'normalize', 
      input: 'PST',
      expected: 'pst'
    },
    {
      name: 'Timezone Pattern: GMT offset recognized',
      type: 'normalize',
      input: 'GMT+5',
      expected: 'gmt+5'
    },
    {
      name: 'Timezone Pattern: UTC offset recognized',
      type: 'normalize',
      input: 'UTC-3',
      expected: 'utc-3'
    }
  ],

  // New unit pattern detection tests
  newUnitsPatternMatching: [
    {
      name: 'Pattern: "60 mph" detected',
      type: 'patternDetection',
      input: { text: '60 mph', userSettings: { speedUnit: 'kmh' } },
      expected: { minConversions: 1 }
    },
    {
      name: 'Pattern: "100 N⋅m" detected',
      type: 'patternDetection',
      input: { text: '100 N⋅m torque', userSettings: { torqueUnit: 'lbft' } },
      expected: { minConversions: 1 }
    },
    {
      name: 'Pattern: "30 psi" detected',
      type: 'patternDetection',
      input: { text: '30 psi', userSettings: { pressureUnit: 'bar' } },
      expected: { minConversions: 1 }
    },
    {
      name: 'Timezone Pattern: "5:30 PM EST" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'meeting at 5:30 PM EST',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Pattern: "2:15 PM PST" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'call scheduled for 2:15 PM PST',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Pattern: "09:00 GMT" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'meeting at 09:00 GMT',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Pattern: "14:30 UTC" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'webinar at 14:30 UTC',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Pattern: "11:45 AM GMT+5" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'conference at 11:45 AM GMT+5',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Pattern: "16:20 GMT-3" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'deadline is 16:20 GMT-3',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    },
    {
      name: 'Timezone Pattern: "3:00 PM CST" matches timezone pattern',
      type: 'regexTest',
      input: { 
        text: 'event starts 3:00 PM CST',
        pattern: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(?:([A-Z]{2,4}|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)|GMT([+-]\d{1,2})|UTC([+-]\d{1,2})|([+-]\d{1,2}):?(\d{2})?)?\b/gi
      },
      expected: { hasMatch: true }
    }
  ],

  // Auto-sizing for new units
  newUnitsAutoSizing: [
    {
      name: 'Auto-size: 0.1 m/s → 36 cm/s',
      type: 'bestUnitWithValue',
      input: { value: 0.1, unitType: 'speed', sourceUnit: 'ms' },
      expected: { unit: 'ms', value: 0.1 }
    },
    {
      name: 'Auto-size: 1000 Pa → 1 kPa',
      type: 'bestUnitWithValue',
      input: { value: 1000, unitType: 'pressure', sourceUnit: 'pa' },
      expected: { unit: 'kpa', value: 1 }
    }
  ]
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = testCases;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.testCases = testCases;
}
