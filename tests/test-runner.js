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
      console.log(`${colors.green}✅ ${testName}${colors.reset}`);
      this.testResults.push({ name: testName, status: 'PASS', expected, actual });
    } else {
      this.failCount++;
      console.log(`${colors.red}❌ ${testName}${colors.reset}`);
      console.log(`   Expected: ${expected}`);
      console.log(`   Actual: ${actual}`);
      this.testResults.push({ name: testName, status: 'FAIL', expected, actual });
    }
  }

  // Test basic unit conversions
  testBasicConversions() {
    console.log(`\n${colors.blue}🧪 Testing Basic Unit Conversions${colors.reset}`);

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
    console.log(`\n${colors.blue}🧪 Testing Area Conversions${colors.reset}`);

    // Basic area conversions
    const cm2_to_m2 = this.unitConverter.convert(10000, 'cm2', 'm2');
    this.assert(Math.abs(cm2_to_m2 - 1) < 0.001, 'Area: 10000 cm² = 1 m²', 1, cm2_to_m2);

    const ft2_to_m2 = this.unitConverter.convert(1, 'ft2', 'm2');
    this.assert(Math.abs(ft2_to_m2 - 0.092903) < 0.001, 'Area: 1 ft² ≈ 0.092903 m²', 0.092903, ft2_to_m2);

    // Linear equivalents
    const linear_1m2 = this.unitConverter.getLinearEquivalent(1, 'm2');
    this.assert(linear_1m2 === '1 m', 'Linear equivalent: 1 m² = 1 m linear', '1 m', linear_1m2);

    const linear_0003m2 = this.unitConverter.getLinearEquivalent(0.003, 'm2');
    this.assert(linear_0003m2 === '0.0548 m', 'Linear equivalent: 0.003 m² ≈ 0.0548 m linear', '0.0548 m', linear_0003m2);
  }

  // Test unit detection and aliases
  testUnitDetection() {
    console.log(`\n${colors.blue}🧪 Testing Unit Detection${colors.reset}`);

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
    console.log(`\n${colors.blue}🧪 Testing Auto-Sizing${colors.reset}`);

    // Small values should use smaller units
    const small_area = this.unitConverter.getBestUnit(0.001, 'area', 'm2');
    this.assert(small_area.unit === 'cm2', 'Auto-size: 0.001 m² → cm²', 'cm2', small_area.unit);

    const small_length = this.unitConverter.getBestUnit(0.001, 'length', 'm');
    this.assert(small_length.unit === 'mm', 'Auto-size: 0.001 m → mm', 'mm', small_length.unit);

    // Large values should use larger units
    const large_area = this.unitConverter.getBestUnit(2000000, 'area', 'm2');
    this.assert(large_area.unit === 'km2', 'Auto-size: 2000000 m² → km²', 'km2', large_area.unit);

    const large_length = this.unitConverter.getBestUnit(2000, 'length', 'm');
    this.assert(large_length.unit === 'km', 'Auto-size: 2000 m → km', 'km', large_length.unit);
  }

  // Test text pattern matching
  testPatternMatching() {
    console.log(`\n${colors.blue}🧪 Testing Pattern Matching${colors.reset}`);

    const userSettings = {
      lengthUnit: 'm',
      areaUnit: 'm2',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l'
    };

    // Test area pattern matching
    const area_conversions = this.detector.findConversions('30 cm²', userSettings);
    this.assert(area_conversions.length > 0, 'Pattern: "30 cm²" detected', '>0 conversions', area_conversions.length);
    
    if (area_conversions.length > 0) {
      this.assert(area_conversions[0].type === 'area', 'Pattern: "30 cm²" detected as area', 'area', area_conversions[0].type);
    }

    // Test that length patterns don't interfere
    const length_conversions = this.detector.findConversions('30 cm', userSettings);
    this.assert(length_conversions.length > 0, 'Pattern: "30 cm" detected', '>0 conversions', length_conversions.length);
    
    if (length_conversions.length > 0) {
      this.assert(length_conversions[0].type === 'length', 'Pattern: "30 cm" detected as length', 'length', length_conversions[0].type);
    }

    // Test square meters text format
    const square_meters_conversions = this.detector.findConversions('150 square centimeters', userSettings);
    this.assert(square_meters_conversions.length > 0, 'Pattern: "150 square centimeters" detected', '>0 conversions', square_meters_conversions.length);
  }

  // Generate test report
  generateReport() {
    console.log(`\n${colors.bright}${colors.blue}📊 Test Report${colors.reset}`);
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
      console.log(`\n${colors.green}🎉 All tests passed!${colors.reset}`);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log(`${colors.bright}${colors.yellow}🚀 Starting Unit Converter Tests${colors.reset}\n`);
    
    this.testBasicConversions();
    this.testAreaConversions();
    this.testUnitDetection();
    this.testAutoSizing();
    this.testPatternMatching();
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
