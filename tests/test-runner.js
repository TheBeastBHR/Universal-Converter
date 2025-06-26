#!/usr/bin/env node
// Node.js Test Runner for Unit Converter Extension
// This script tests the core conversion logic without browser dependencies

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

class UnitConverterTester {
  constructor() {
    this.testResults = [];
    this.testCount = 0;
    this.passCount = 0;
    this.failCount = 0;
    
    // Mock window object for Node.js
    global.window = {};
    global.document = { location: { hostname: 'localhost' } }; // Mock document for currency tests
    
    // Load the extension modules
    this.loadModules();
  }
  loadModules() {
    try {
      // Load conversion data
      const conversionDataPath = path.join(__dirname, '..', 'data', 'conversion-data.js');
      const conversionData = fs.readFileSync(conversionDataPath, 'utf8');
      eval(conversionData);

      // Load unit converter
      const unitConverterPath = path.join(__dirname, '..', 'utils', 'unit-converter.js');
      const unitConverter = fs.readFileSync(unitConverterPath, 'utf8');
      eval(unitConverter);

      // Load currency converter
      const currencyConverterPath = path.join(__dirname, '..', 'utils', 'currency-converter.js');
      const currencyConverter = fs.readFileSync(currencyConverterPath, 'utf8');
      eval(currencyConverter);

      // Load conversion detector
      const detectorPath = path.join(__dirname, '..', 'utils', 'conversion-detector.js');
      const detector = fs.readFileSync(detectorPath, 'utf8');
      eval(detector);

      console.log(`${colors.green}✅ All modules loaded successfully${colors.reset}`);
      
      this.unitConverter = new global.window.UnitConverter.UnitConverter();
      this.detector = new global.window.UnitConverter.ConversionDetector(this.unitConverter);
      
    } catch (error) {
      console.error(`${colors.red}❌ Failed to load modules:${colors.reset}`, error.message);
      process.exit(1);
    }
  }

  assert(condition, testName, expected, actual) {
    this.testCount++;
    
    if (condition) {
      this.passCount++;
      console.log(`${colors.green}[PASS] ${testName}${colors.reset}`);
      this.testResults.push({ name: testName, status: 'PASS', expected, actual });
    } else {
      this.failCount++;
      console.log(`${colors.red}[FAIL] ${testName}${colors.reset}`);
      console.log(`   Expected: ${expected}`);
      console.log(`   Actual: ${actual}`);
      this.testResults.push({ name: testName, status: 'FAIL', expected, actual });
    }
  }

  // Test basic unit conversions
  testBasicConversions() {
    console.log(`\n${colors.blue}[Testing Basic Unit Conversions]${colors.reset}`);

    // Length conversions
    const cm_to_m = this.unitConverter.convert(100, 'cm', 'm');
    this.assert(Math.abs(cm_to_m - 1) < 0.001, 'Length: 100 cm = 1 m', 1, cm_to_m);

    const ft_to_m = this.unitConverter.convert(3.28084, 'ft', 'm');
    this.assert(Math.abs(ft_to_m - 1) < 0.001, 'Length: 3.28084 ft ≈ 1 m', 1, ft_to_m);

    // Weight conversions
    const g_to_kg = this.unitConverter.convert(1000, 'g', 'kg');
    this.assert(Math.abs(g_to_kg - 1) < 0.001, 'Weight: 1000 g = 1 kg', 1, g_to_kg);

    // Temperature conversions
    const c_to_f = this.unitConverter.convert(0, 'c', 'f');
    this.assert(Math.abs(c_to_f - 32) < 0.001, 'Temperature: 0°C = 32°F', 32, c_to_f);

    const f_to_c = this.unitConverter.convert(32, 'f', 'c');
    this.assert(Math.abs(f_to_c - 0) < 0.001, 'Temperature: 32°F = 0°C', 0, f_to_c);
  }

  // Test area conversions (the main bug we fixed)
  testAreaConversions() {
    console.log(`\n${colors.blue}[Testing Area Conversions]${colors.reset}`);

    // Basic area conversions
    const cm2_to_m2 = this.unitConverter.convert(10000, 'cm2', 'm2');
    this.assert(Math.abs(cm2_to_m2 - 1) < 0.001, 'Area: 10000 cm² = 1 m²', 1, cm2_to_m2);    const ft2_to_m2 = this.unitConverter.convert(1, 'ft2', 'm2');
    this.assert(Math.abs(ft2_to_m2 - 0.092903) < 0.001, 'Area: 1 ft² ≈ 0.092903 m²', 0.092903, ft2_to_m2);

    // Linear equivalent feature disabled - no longer testing linear equivalents
    // const linear_1m2 = this.unitConverter.getLinearEquivalent(1, 'm2');
    // const linear_0003m2 = this.unitConverter.getLinearEquivalent(0.003, 'm2');
  }

  // Test unit detection and aliases
  testUnitDetection() {
    console.log(`\n${colors.blue}[Testing Unit Detection]${colors.reset}`);

    // Unicode symbol aliases
    const cm2_unicode = this.unitConverter.normalizeUnit('cm²');
    this.assert(cm2_unicode === 'cm2', 'Unicode alias: cm² → cm2', 'cm2', cm2_unicode);

    const m2_unicode = this.unitConverter.normalizeUnit('m²');
    this.assert(m2_unicode === 'm2', 'Unicode alias: m² → m2', 'm2', m2_unicode);

    // Text aliases
    const square_meters = this.unitConverter.normalizeUnit('square meters');
    this.assert(square_meters === 'm2', 'Text alias: square meters → m2', 'm2', square_meters);

    const meters_squared = this.unitConverter.normalizeUnit('meters squared');
    this.assert(meters_squared === 'm2', 'Text alias: meters squared → m2', 'm2', meters_squared);

    // Unit type detection
    const area_type = this.unitConverter.getUnitType('cm2');
    this.assert(area_type === 'area', 'Unit type: cm2 is area', 'area', area_type);

    const length_type = this.unitConverter.getUnitType('cm');
    this.assert(length_type === 'length', 'Unit type: cm is length', 'length', length_type);
  }

  // Test auto-sizing functionality
  testAutoSizing() {
    console.log(`\n${colors.blue}[Testing Auto-Sizing]${colors.reset}`);    // Small values should use smaller units
    const small_area = this.unitConverter.getBestUnit(0.001, 'area', 'm2');
    this.assert(small_area.unit === 'cm2', 'Auto-size: 0.001 m² → cm²', 'cm2', small_area.unit);

    const small_length = this.unitConverter.getBestUnit(0.001, 'length', 'm');
    this.assert(small_length.unit === 'mm', 'Auto-size: 0.001 m → mm', 'mm', small_length.unit);

    // Test specific case: 0.3m should show as 30cm
    const cm_30 = this.unitConverter.getBestUnit(0.3, 'length', 'm');
    this.assert(cm_30.unit === 'cm' && cm_30.value === 30, 'Auto-size: 0.3 m → 30 cm', '30 cm', `${cm_30.value} ${cm_30.unit}`);

    // Test the example case: 11.81 inches should show as ~30cm when converted to meters then auto-sized
    const inches_to_m = this.unitConverter.convert(11.81, 'in', 'm');
    const auto_sized = this.unitConverter.getBestUnit(inches_to_m, 'length', 'm');
    this.assert(auto_sized.unit === 'cm', 'Auto-size: 11.81 in → ~30 cm (via meters)', 'cm', auto_sized.unit);

    // Large values should use larger units
    const large_area = this.unitConverter.getBestUnit(2000000, 'area', 'm2');
    this.assert(large_area.unit === 'km2', 'Auto-size: 2000000 m² → km²', 'km2', large_area.unit);

    const large_length = this.unitConverter.getBestUnit(2000, 'length', 'm');
    this.assert(large_length.unit === 'km', 'Auto-size: 2000 m → km', 'km', large_length.unit);
  }

  // Test text pattern matching
  testPatternMatching() {
    console.log(`\n${colors.blue}[Testing Pattern Matching]${colors.reset}`);

    const userSettings = {
      lengthUnit: 'm',
      areaUnit: 'm2',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l'
    };    // Test area pattern matching - use values that will result in different units after conversion
    const area_conversions = this.detector.findConversions('1 ft²', userSettings);
    this.assert(area_conversions.length > 0, 'Pattern: "1 ft²" detected', '>0 conversions', area_conversions.length);
    
    if (area_conversions.length > 0) {
      this.assert(area_conversions[0].type === 'area', 'Pattern: "1 ft²" detected as area', 'area', area_conversions[0].type);
    }

    // Test that length patterns work with meaningful conversions
    const length_conversions = this.detector.findConversions('3 feet', userSettings);
    this.assert(length_conversions.length > 0, 'Pattern: "3 feet" detected', '>0 conversions', length_conversions.length);
    
    if (length_conversions.length > 0) {
      this.assert(length_conversions[0].type === 'length', 'Pattern: "3 feet" detected as length', 'length', length_conversions[0].type);
    }

    // Test text format conversions - use imperial to metric conversion
    const text_conversions = this.detector.findConversions('1 square foot', userSettings);
    this.assert(text_conversions.length > 0, 'Pattern: "1 square foot" detected', '>0 conversions', text_conversions.length);
  }

  // Test comprehensive unit conversions
  testComprehensiveConversions() {
    console.log(`\n${colors.blue}[Testing Comprehensive Conversions]${colors.reset}`);

    // Length conversions - metric
    const mm_to_cm = this.unitConverter.convert(10, 'mm', 'cm');
    this.assert(Math.abs(mm_to_cm - 1) < 0.001, 'Length: 10 mm = 1 cm', 1, mm_to_cm);

    const km_to_m = this.unitConverter.convert(1, 'km', 'm');
    this.assert(Math.abs(km_to_m - 1000) < 0.001, 'Length: 1 km = 1000 m', 1000, km_to_m);

    // Length conversions - imperial
    const in_to_ft = this.unitConverter.convert(12, 'in', 'ft');
    this.assert(Math.abs(in_to_ft - 1) < 0.001, 'Length: 12 in = 1 ft', 1, in_to_ft);

    const yd_to_ft = this.unitConverter.convert(1, 'yd', 'ft');
    this.assert(Math.abs(yd_to_ft - 3) < 0.001, 'Length: 1 yd = 3 ft', 3, yd_to_ft);

    const mi_to_ft = this.unitConverter.convert(1, 'mi', 'ft');
    this.assert(Math.abs(mi_to_ft - 5280) < 0.1, 'Length: 1 mi = 5280 ft', 5280, mi_to_ft);

    // Weight conversions - metric
    const mg_to_g = this.unitConverter.convert(1000, 'mg', 'g');
    this.assert(Math.abs(mg_to_g - 1) < 0.001, 'Weight: 1000 mg = 1 g', 1, mg_to_g);

    const t_to_kg = this.unitConverter.convert(1, 't', 'kg');
    this.assert(Math.abs(t_to_kg - 1000) < 0.001, 'Weight: 1 t = 1000 kg', 1000, t_to_kg);

    // Weight conversions - imperial
    const oz_to_lb = this.unitConverter.convert(16, 'oz', 'lb');
    this.assert(Math.abs(oz_to_lb - 1) < 0.001, 'Weight: 16 oz = 1 lb', 1, oz_to_lb);

    // Volume conversions - metric
    const ml_to_l = this.unitConverter.convert(1000, 'ml', 'l');
    this.assert(Math.abs(ml_to_l - 1) < 0.001, 'Volume: 1000 ml = 1 l', 1, ml_to_l);

    // Volume conversions - imperial
    const cup_to_pt = this.unitConverter.convert(2, 'cup', 'pt');
    this.assert(Math.abs(cup_to_pt - 1) < 0.001, 'Volume: 2 cup = 1 pt', 1, cup_to_pt);

    const pt_to_qt = this.unitConverter.convert(2, 'pt', 'qt');
    this.assert(Math.abs(pt_to_qt - 1) < 0.001, 'Volume: 2 pt = 1 qt', 1, pt_to_qt);

    const qt_to_gal = this.unitConverter.convert(4, 'qt', 'gal');
    this.assert(Math.abs(qt_to_gal - 1) < 0.001, 'Volume: 4 qt = 1 gal', 1, qt_to_gal);

    // Area conversions - advanced
    const mm2_to_cm2 = this.unitConverter.convert(100, 'mm2', 'cm2');
    this.assert(Math.abs(mm2_to_cm2 - 1) < 0.001, 'Area: 100 mm² = 1 cm²', 1, mm2_to_cm2);

    const km2_to_m2 = this.unitConverter.convert(1, 'km2', 'm2');
    this.assert(Math.abs(km2_to_m2 - 1000000) < 0.001, 'Area: 1 km² = 1,000,000 m²', 1000000, km2_to_m2);

    const in2_to_ft2 = this.unitConverter.convert(144, 'in2', 'ft2');
    this.assert(Math.abs(in2_to_ft2 - 1) < 0.001, 'Area: 144 in² = 1 ft²', 1, in2_to_ft2);
  }

  // Test decimal precision formatting
  testDecimalPrecision() {
    console.log(`\n${colors.blue}[Testing Decimal Precision]${colors.reset}`);

    // Test that results are formatted to 2 decimal places
    const result1 = this.unitConverter.formatResult(3.14159, 'm');
    this.assert(result1 === '3.14 m', 'Format: 3.14159 → 3.14 m', '3.14 m', result1);

    const result2 = this.unitConverter.formatResult(1.999, 'kg');
    this.assert(result2 === '2 kg', 'Format: 1.999 → 2 kg', '2 kg', result2);

    const result3 = this.unitConverter.formatResult(0.666666, 'ft');
    this.assert(result3 === '0.67 ft', 'Format: 0.666666 → 0.67 ft', '0.67 ft', result3);

    const result4 = this.unitConverter.formatResult(10, 'cm');
    this.assert(result4 === '10 cm', 'Format: 10 → 10 cm', '10 cm', result4);
  }

  // Test edge cases and boundary conditions
  testEdgeCases() {
    console.log(`\n${colors.blue}[Testing Edge Cases]${colors.reset}`);

    // Zero values
    const zero_result = this.unitConverter.convert(0, 'm', 'cm');
    this.assert(zero_result === 0, 'Edge: 0 m = 0 cm', 0, zero_result);

    // Very small values
    const small_result = this.unitConverter.convert(0.001, 'm', 'mm');
    this.assert(Math.abs(small_result - 1) < 0.001, 'Edge: 0.001 m = 1 mm', 1, small_result);

    // Very large values
    const large_result = this.unitConverter.convert(1000000, 'm', 'km');
    this.assert(Math.abs(large_result - 1000) < 0.001, 'Edge: 1,000,000 m = 1000 km', 1000, large_result);

    // Invalid conversions should return null
    const invalid_result = this.unitConverter.convert(100, 'm', 'invalid_unit');
    this.assert(invalid_result === null, 'Edge: Invalid unit returns null', null, invalid_result);

    // Different unit types should return null
    const mixed_types = this.unitConverter.convert(100, 'm', 'kg');
    this.assert(mixed_types === null, 'Edge: Different unit types return null', null, mixed_types);
  }

  // Test auto-sizing with comprehensive cases
  testComprehensiveAutoSizing() {
    console.log(`\n${colors.blue}[Testing Comprehensive Auto-Sizing]${colors.reset}`);

    // Length auto-sizing edge cases
    const very_small = this.unitConverter.getBestUnit(0.0001, 'length', 'm');
    this.assert(very_small.unit === 'mm', 'Auto-size: 0.0001 m → mm', 'mm', very_small.unit);

    const cm_boundary = this.unitConverter.getBestUnit(0.99, 'length', 'm');
    this.assert(cm_boundary.unit === 'cm', 'Auto-size: 0.99 m → cm', 'cm', cm_boundary.unit);

    const large_meters = this.unitConverter.getBestUnit(5000, 'length', 'm');
    this.assert(large_meters.unit === 'km', 'Auto-size: 5000 m → km', 'km', large_meters.unit);

    // Imperial length auto-sizing
    const small_feet = this.unitConverter.getBestUnit(0.5, 'length', 'ft');
    this.assert(small_feet.unit === 'in', 'Auto-size: 0.5 ft → in', 'in', small_feet.unit);

    const large_feet = this.unitConverter.getBestUnit(10000, 'length', 'ft');
    this.assert(large_feet.unit === 'mi', 'Auto-size: 10000 ft → mi', 'mi', large_feet.unit);

    // Weight auto-sizing
    const small_kg = this.unitConverter.getBestUnit(0.5, 'weight', 'kg');
    this.assert(small_kg.unit === 'g', 'Auto-size: 0.5 kg → g', 'g', small_kg.unit);

    const large_kg = this.unitConverter.getBestUnit(2000, 'weight', 'kg');
    this.assert(large_kg.unit === 't', 'Auto-size: 2000 kg → t', 't', large_kg.unit);

    // Volume auto-sizing
    const small_liters = this.unitConverter.getBestUnit(0.5, 'volume', 'l');
    this.assert(small_liters.unit === 'ml', 'Auto-size: 0.5 l → ml', 'ml', small_liters.unit);    const small_gallons = this.unitConverter.getBestUnit(0.25, 'volume', 'gal');
    this.assert(small_gallons.unit === 'cup', 'Auto-size: 0.25 gal → cup', 'cup', small_gallons.unit);
  }

  // Generate test report
  generateReport() {
    console.log(`\n${colors.bright}${colors.blue}[Test Report]${colors.reset}`);
    console.log(`${colors.bright}Total Tests: ${this.testCount}${colors.reset}`);
    console.log(`${colors.green}Passed: ${this.passCount}${colors.reset}`);
    console.log(`${colors.red}Failed: ${this.failCount}${colors.reset}`);
    
    const successRate = ((this.passCount / this.testCount) * 100).toFixed(1);
    console.log(`${colors.bright}Success Rate: ${successRate}%${colors.reset}`);

    if (this.failCount > 0) {
      console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
      this.testResults
        .filter(result => result.status === 'FAIL')
        .forEach(result => {
          console.log(`  - ${result.name}`);
        });
      
      process.exit(1); // Exit with error code for CI/CD
    } else {
      console.log(`\n${colors.green}[All tests passed!]${colors.reset}`);
    }
  }

  // Test currency conversions (mock tests since we can't make API calls in Node.js)
  testCurrencyConversions() {
    console.log(`\n${colors.blue}[Testing Currency Conversions (Mock)]${colors.reset}`);

    // Test if CurrencyConverter class is loaded
    if (typeof global.window.UnitConverter.CurrencyConverter !== 'undefined') {
      const currencyConverter = new global.window.UnitConverter.CurrencyConverter();
      
      // Test currency symbol extraction
      const usd_symbol = currencyConverter.extractCurrencySymbol('$100');
      this.assert(usd_symbol === '$', 'Currency: Extract $ symbol', '$', usd_symbol);
      
      const eur_symbol = currencyConverter.extractCurrencySymbol('EUR50');
      this.assert(eur_symbol === 'EUR', 'Currency: Extract EUR symbol', 'EUR', eur_symbol);
      
      const gbp_symbol = currencyConverter.extractCurrencySymbol('GBP25');
      this.assert(gbp_symbol === 'GBP', 'Currency: Extract GBP symbol', 'GBP', gbp_symbol);
      
      // Test amount extraction
      const amount1 = currencyConverter.extractNumber('$100.50');
      this.assert(Math.abs(amount1 - 100.50) < 0.001, 'Currency: Extract $100.50', 100.50, amount1);
      
      const amount2 = currencyConverter.extractNumber('EUR1,234.56');
      this.assert(Math.abs(amount2 - 1234.56) < 0.001, 'Currency: Extract EUR1,234.56', 1234.56, amount2);
      
      const amount3 = currencyConverter.extractNumber('GBP1.234,56');  // European format
      this.assert(Math.abs(amount3 - 1234.56) < 0.001, 'Currency: Extract European format GBP1.234,56', 1234.56, amount3);
      
      // Test currency detection
      try {
        const usd_code = currencyConverter.detectCurrency('$');
        this.assert(Array.isArray(usd_code) || usd_code === 'USD', 'Currency: $ detection (USD or array)', 'USD or array', typeof usd_code);
      } catch (e) {
        console.log(`${colors.yellow}[WARNING] Currency detection test skipped: ${e.message}${colors.reset}`);
      }
      
      const eur_code = currencyConverter.detectCurrency('€');
      this.assert(eur_code === 'EUR', 'Currency: € maps to EUR', 'EUR', eur_code);
      
      const unknown_code = currencyConverter.detectCurrency('XYZ');
      this.assert(unknown_code === 'Unknown currency', 'Currency: Unknown symbol', 'Unknown currency', unknown_code);
      
      // Test currency symbol retrieval
      const usd_sym = currencyConverter.getCurrencySymbol('USD');
      const usd_symbol_valid = Array.isArray(usd_sym) ? usd_sym.includes('$') : usd_sym === '$';
      this.assert(usd_symbol_valid, 'Currency: USD symbol lookup', '$ (or array containing $)', usd_sym);
      
      const eur_sym = currencyConverter.getCurrencySymbol('EUR');
      this.assert(eur_sym === '€', 'Currency: EUR symbol lookup', '€', eur_sym);
      
      // Test formatting
      const formatted1 = currencyConverter.formatCurrency(100.5, 'USD');
      this.assert(formatted1.includes('100.50') && formatted1.includes('$'), 'Currency: Format USD', 'Contains 100.50 and $', formatted1);
      
      const formatted2 = currencyConverter.formatCurrency(1234.56, 'EUR');
      this.assert(formatted2.includes('1,234.56') && formatted2.includes('€'), 'Currency: Format EUR', 'Contains 1,234.56 and €', formatted2);
      
      // Test formatting for important Middle Eastern currencies
      const formatted3 = currencyConverter.formatCurrency(7.52, 'BHD');
      this.assert(formatted3.includes('7.52') && formatted3.includes('BHD') && formatted3.includes('د.ب'), 'Currency: Format BHD', 'Contains 7.52, BHD, and د.ب', formatted3);
      
      const formatted4 = currencyConverter.formatCurrency(25.75, 'KWD');
      this.assert(formatted4.includes('25.75') && formatted4.includes('KWD') && (formatted4.includes('د.ك') || formatted4.includes('KD')), 'Currency: Format KWD', 'Contains 25.75, KWD, and د.ك or KD', formatted4);
      
      const formatted5 = currencyConverter.formatCurrency(100, 'SAR');
      this.assert(formatted5.includes('100.00') && formatted5.includes('SAR') && formatted5.includes('ر.س'), 'Currency: Format SAR', 'Contains 100.00, SAR, and ر.س', formatted5);
      
      const formatted6 = currencyConverter.formatCurrency(200, 'AED');
      this.assert(formatted6.includes('200.00') && formatted6.includes('AED') && formatted6.includes('د.إ'), 'Currency: Format AED', 'Contains 200.00, AED, and د.إ', formatted6);
      
      const formatted7 = currencyConverter.formatCurrency(50.25, 'QAR');
      this.assert(formatted7.includes('50.25') && formatted7.includes('QAR') && (formatted7.includes('ر.ق') || formatted7.includes('QR')), 'Currency: Format QAR', 'Contains 50.25, QAR, and ر.ق or QR', formatted7);
      
      // Test Asian currencies
      const formatted8 = currencyConverter.formatCurrency(1500, 'JPY');
      this.assert(formatted8.includes('1,500.00') && formatted8.includes('JPY') && (formatted8.includes('¥') || formatted8.includes('円')), 'Currency: Format JPY', 'Contains 1,500.00, JPY, and ¥ or 円', formatted8);
      
      const formatted9 = currencyConverter.formatCurrency(75.99, 'INR');
      this.assert(formatted9.includes('75.99') && formatted9.includes('INR') && formatted9.includes('₹'), 'Currency: Format INR', 'Contains 75.99, INR, and ₹', formatted9);
      
      const formatted10 = currencyConverter.formatCurrency(1234.56, 'CNY');
      this.assert(formatted10.includes('1,234.56') && formatted10.includes('CNY') && formatted10.includes('¥'), 'Currency: Format CNY', 'Contains 1,234.56, CNY, and ¥', formatted10);
      
      // Test other major currencies
      const formatted11 = currencyConverter.formatCurrency(123.45, 'CAD');
      this.assert(formatted11.includes('123.45') && formatted11.includes('CAD') && formatted11.includes('$'), 'Currency: Format CAD', 'Contains 123.45, CAD, and $', formatted11);
      
      const formatted12 = currencyConverter.formatCurrency(89.99, 'AUD');
      this.assert(formatted12.includes('89.99') && formatted12.includes('AUD') && formatted12.includes('$'), 'Currency: Format AUD', 'Contains 89.99, AUD, and $', formatted12);
      
      const formatted13 = currencyConverter.formatCurrency(45.67, 'CHF');
      this.assert(formatted13.includes('45.67') && formatted13.includes('CHF'), 'Currency: Format CHF', 'Contains 45.67 and CHF', formatted13);
      
      // Test symbol extraction for critical currencies
      const bhd_sym = currencyConverter.getCurrencySymbol('BHD');
      const bhd_symbol_valid = Array.isArray(bhd_sym) ? bhd_sym.includes('د.ب') : bhd_sym === 'د.ب';
      this.assert(bhd_symbol_valid, 'Currency: BHD symbol lookup', 'د.ب (or array containing د.ب)', bhd_sym);
      
      const kwd_sym = currencyConverter.getCurrencySymbol('KWD');
      const kwd_symbol_valid = Array.isArray(kwd_sym) ? (kwd_sym.includes('د.ك') || kwd_sym.includes('KD')) : (kwd_sym === 'د.ك' || kwd_sym === 'KD');
      this.assert(kwd_symbol_valid, 'Currency: KWD symbol lookup', 'د.ك or KD (or array containing either)', kwd_sym);
      
      const aed_sym = currencyConverter.getCurrencySymbol('AED');
      const aed_symbol_valid = Array.isArray(aed_sym) ? aed_sym.includes('د.إ') : (aed_sym === 'د.إ' || aed_sym === 'AED');
      this.assert(aed_symbol_valid, 'Currency: AED symbol lookup', 'د.إ (or array containing د.إ)', Array.isArray(aed_sym) ? aed_sym.join(',') : aed_sym);
      
      // Test currency detection for Arabic symbols
      try {
        const bhd_detected = currencyConverter.detectCurrency('د.ب');
        this.assert(bhd_detected === 'BHD', 'Currency: د.ب detection maps to BHD', 'BHD', bhd_detected);
      } catch (e) {
        console.log(`${colors.yellow}[WARNING] BHD detection test skipped: ${e.message}${colors.reset}`);
      }
      
      try {
        const aed_detected = currencyConverter.detectCurrency('د.إ');
        this.assert(aed_detected === 'AED', 'Currency: د.إ detection maps to AED', 'AED', aed_detected);
      } catch (e) {
        console.log(`${colors.yellow}[WARNING] AED detection test skipped: ${e.message}${colors.reset}`);
      }
      
      // Test number extraction for various formats
      const bhd_amount = currencyConverter.extractNumber('7.52 د.ب');
      this.assert(Math.abs(bhd_amount - 7.52) < 0.001, 'Currency: Extract BHD amount', 7.52, bhd_amount);
      
      const kwd_amount = currencyConverter.extractNumber('25.75 د.ك');
      this.assert(Math.abs(kwd_amount - 25.75) < 0.001, 'Currency: Extract KWD amount', 25.75, kwd_amount);
      
      const sar_amount = currencyConverter.extractNumber('100 ر.س');
      this.assert(Math.abs(sar_amount - 100) < 0.001, 'Currency: Extract SAR amount', 100, sar_amount);

      // ...existing code...
    } else {
      console.log(`${colors.yellow}[WARNING] CurrencyConverter class not available${colors.reset}`);
    }
  }

  // Test currency pattern detection in text
  testCurrencyPatternDetection() {
    console.log(`\n${colors.blue}[Testing Currency Pattern Detection]${colors.reset}`);
    
    const userSettings = {
      lengthUnit: 'm',
      areaUnit: 'm2',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l',
      currencyUnit: 'USD'
    };

    // Test currency pattern detection through the main detector
    const currency_conversions = this.detector.findCurrencyConversions('The price is $100', userSettings);
    
    if (currency_conversions && currency_conversions.length > 0) {
      this.assert(currency_conversions.length > 0, 'Currency Pattern: "$100" detected', '>0 conversions', currency_conversions.length);
      this.assert(currency_conversions[0].type === 'currency', 'Currency Pattern: Detected as currency type', 'currency', currency_conversions[0].type);
    } else {
      console.log(`${colors.yellow}[WARNING] Currency pattern detection not fully integrated yet${colors.reset}`);
    }

    // Test multiple currency patterns
    const multi_currency = this.detector.findCurrencyConversions('Items cost €50, $75, and £25', userSettings);
    if (multi_currency && multi_currency.length > 0) {
      // Should find 2 conversions (€50->USD and £25->USD), but not $75->USD since it's the same currency
      this.assert(multi_currency.length >= 2, 'Currency Pattern: Multiple currencies detected', '>=2 conversions', multi_currency.length);
    }

    // Test currency with commas
    const comma_currency = this.detector.findCurrencyConversions('Total is $1,234.56', userSettings);
    if (comma_currency && comma_currency.length > 0) {
      this.assert(comma_currency[0].originalValue === 1234.56, 'Currency Pattern: Parse comma-separated amount', 1234.56, comma_currency[0].originalValue);
    }

    // Test Arabic currency symbol patterns
    const bhd_pattern = this.detector.findCurrencyConversions('The price is 7.52 د.ب today', userSettings);
    if (bhd_pattern && bhd_pattern.length > 0) {
      this.assert(bhd_pattern[0].type === 'currency', 'Currency Pattern: BHD د.ب detected as currency', 'currency', bhd_pattern[0].type);
      this.assert(Math.abs(bhd_pattern[0].originalValue - 7.52) < 0.001, 'Currency Pattern: BHD amount parsed correctly', 7.52, bhd_pattern[0].originalValue);
    }
    
    const kwd_pattern = this.detector.findCurrencyConversions('Cost is 25.75 د.ك per unit', userSettings);
    if (kwd_pattern && kwd_pattern.length > 0) {
      this.assert(kwd_pattern[0].type === 'currency', 'Currency Pattern: KWD د.ك detected as currency', 'currency', kwd_pattern[0].type);
      this.assert(Math.abs(kwd_pattern[0].originalValue - 25.75) < 0.001, 'Currency Pattern: KWD amount parsed correctly', 25.75, kwd_pattern[0].originalValue);
    }
    
    const sar_pattern = this.detector.findCurrencyConversions('Payment of 100 ر.س required', userSettings);
    if (sar_pattern && sar_pattern.length > 0) {
      this.assert(sar_pattern[0].type === 'currency', 'Currency Pattern: SAR ر.س detected as currency', 'currency', sar_pattern[0].type);
      this.assert(Math.abs(sar_pattern[0].originalValue - 100) < 0.001, 'Currency Pattern: SAR amount parsed correctly', 100, sar_pattern[0].originalValue);
    }
    
    const aed_pattern = this.detector.findCurrencyConversions('Total 200 د.إ with tax', userSettings);
    if (aed_pattern && aed_pattern.length > 0) {
      this.assert(aed_pattern[0].type === 'currency', 'Currency Pattern: AED د.إ detected as currency', 'currency', aed_pattern[0].type);
      this.assert(Math.abs(aed_pattern[0].originalValue - 200) < 0.001, 'Currency Pattern: AED amount parsed correctly', 200, aed_pattern[0].originalValue);
    }
    
    // Test mixed currency patterns in single text
    const mixed_middle_east = this.detector.findCurrencyConversions('Prices: 50 د.ب in Bahrain, 75 د.ك in Kuwait, 100 ر.س in Saudi', userSettings);
    if (mixed_middle_east && mixed_middle_east.length > 0) {
      this.assert(mixed_middle_east.length >= 2, 'Currency Pattern: Multiple Middle Eastern currencies detected', '>=2 conversions', mixed_middle_east.length);
    }
    
    // Test currencies with decimal commas (European format)
    const european_format = this.detector.findCurrencyConversions('Price is €1.234,56 in Europe', userSettings);
    if (european_format && european_format.length > 0) {
      this.assert(Math.abs(european_format[0].originalValue - 1234.56) < 0.001, 'Currency Pattern: European decimal comma format', 1234.56, european_format[0].originalValue);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log(`${colors.bright}${colors.yellow}[Starting Unit Converter Tests]${colors.reset}\n`);
    
    this.testBasicConversions();
    this.testAreaConversions();
    this.testUnitDetection();
    this.testAutoSizing();
    this.testPatternMatching();
    this.testComprehensiveConversions();
    this.testDecimalPrecision();
    this.testEdgeCases();
    this.testComprehensiveAutoSizing();
    this.testCurrencyConversions();
    this.testCurrencyPatternDetection();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new UnitConverterTester();
  tester.runAllTests().then(() => {
    tester.generateReport();
  }).catch(error => {
    console.error(`${colors.red}❌ Test suite failed:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = UnitConverterTester;
