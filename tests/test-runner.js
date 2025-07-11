#!/usr/bin/env node
// Streamlined Test Runner for Unit Converter Extension
// This script loads test cases from external files and runs them efficiently

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

class StreamlinedUnitConverterTester {
  constructor() {
    this.testResults = [];
    this.testCount = 0;
    this.passCount = 0;
    this.failCount = 0;
    
    // Mock window object for Node.js
    global.window = {};
    global.document = { location: { hostname: 'localhost' } };
    
    // Load modules and test cases
    this.loadModules();
    this.loadTestCases();
  }

  loadModules() {
    try {
      // Load conversion data
      const conversionDataPath = path.join(__dirname, '..', 'data', 'conversion-data.js');
      const conversionData = fs.readFileSync(conversionDataPath, 'utf8');
      eval(conversionData);

      // Load currency mappings
      const currencyMappingsPath = path.join(__dirname, '..', 'data', 'currency-mappings.js');
      const currencyMappings = fs.readFileSync(currencyMappingsPath, 'utf8');
      eval(currencyMappings);

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
      
      // Initialize the global currency converter instance
      if (typeof global.window.UnitConverter.CurrencyConverter !== 'undefined') {
        global.window.UnitConverter.currencyConverter = new global.window.UnitConverter.CurrencyConverter();
      }
      
      // Initialize currency pattern after mappings are loaded
      if (global.window.UnitConverterData && global.window.UnitConverterData.initializeCurrencyPattern) {
        global.window.UnitConverterData.initializeCurrencyPattern();
      }
      
    } catch (error) {
      console.error(`${colors.red}❌ Failed to load modules:${colors.reset}`, error.message);
      process.exit(1);
    }
  }

  loadTestCases() {
    try {
      const testCasesPath = path.join(__dirname, 'test-cases.js');
      delete require.cache[require.resolve(testCasesPath)]; // Clear cache
      this.testCases = require(testCasesPath);
      console.log(`${colors.green}✅ Test cases loaded successfully${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Failed to load test cases:${colors.reset}`, error.message);
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

  // Generic test runner for different test types
  runTestCase(testCase) {
    const { name, type, input, expected, tolerance = 0 } = testCase;

    switch (type) {
      case 'conversion':
        const result = this.unitConverter.convert(input.value, input.from, input.to);
        this.assert(Math.abs(result - expected) < tolerance, name, expected, result);
        break;

      case 'conversionNull':
        const nullResult = this.unitConverter.convert(input.value, input.from, input.to);
        this.assert(nullResult === expected, name, expected, nullResult);
        break;

      case 'normalize':
        const normalized = this.unitConverter.normalizeUnit(input);
        this.assert(normalized === expected, name, expected, normalized);
        break;

      case 'unitType':
        const unitType = this.unitConverter.getUnitType(input);
        this.assert(unitType === expected, name, expected, unitType);
        break;

      case 'bestUnit':
        const bestUnit = this.unitConverter.getBestUnit(input.value, input.unitType, input.sourceUnit);
        this.assert(bestUnit.unit === expected, name, expected, bestUnit.unit);
        break;

      case 'bestUnitWithValue':
        const bestUnitWithValue = this.unitConverter.getBestUnit(input.value, input.unitType, input.sourceUnit);
        const condition = bestUnitWithValue.unit === expected.unit && bestUnitWithValue.value === expected.value;
        this.assert(condition, name, `${expected.value} ${expected.unit}`, `${bestUnitWithValue.value} ${bestUnitWithValue.unit}`);
        break;

      case 'format':
        const formatted = this.unitConverter.formatResult(input.value, input.unit);
        this.assert(formatted === expected, name, expected, formatted);
        break;

      case 'patternDetection':
        const conversions = this.detector.findConversions(input.text, input.userSettings);
        this.assert(conversions.length >= expected.minConversions, name, `>=${expected.minConversions} conversions`, conversions.length);
        break;

      case 'patternDetectionType':
        const typeConversions = this.detector.findConversions(input.text, input.userSettings);
        if (typeConversions.length > 0) {
          this.assert(typeConversions[0].type === expected, name, expected, typeConversions[0].type);
        } else {
          this.assert(false, name, expected, 'no conversions found');
        }
        break;

      case 'dimensionDetection':
        const dimConversions = this.detector.findConversions(input.text, input.userSettings);
        const dimensionFound = dimConversions.find(conv => conv.type === 'dimensions');
        this.assert(dimensionFound !== undefined, name, 'detected', dimensionFound ? 'detected' : 'not detected');
        break;

      case 'dimensionConversion':
        const dimConvResult = this.detector.findConversions(input.text, input.userSettings);
        const dimensionConv = dimConvResult.find(conv => conv.type === 'dimensions');
        if (dimensionConv) {
          const containsUnit = dimensionConv.converted.includes(expected.containsUnit);
          this.assert(containsUnit, name, `contains ${expected.containsUnit}`, dimensionConv.converted);
        } else {
          this.assert(false, name, 'dimension conversion', 'not found');
        }
        break;

      case 'doubleDetectionCount':
        const doubleDetectConversions = this.detector.findConversions(input.text, input.userSettings);
        this.assert(doubleDetectConversions.length === expected, name, expected, doubleDetectConversions.length);
        break;

      case 'doubleDetectionType':
        const doubleDetectTypeConversions = this.detector.findConversions(input.text, input.userSettings);
        if (doubleDetectTypeConversions.length > 0) {
          this.assert(doubleDetectTypeConversions[0].type === expected, name, expected, doubleDetectTypeConversions[0].type);
        } else {
          this.assert(false, name, expected, 'no conversions found');
        }
        break;

      case 'originalBugFix':
        const bugFixConversions = this.detector.findConversions(input.text, input.userSettings);
        
        // Test count
        this.assert(bugFixConversions.length === expected.count, 
          `${name} (count)`, expected.count, bugFixConversions.length);
        
        // Test type
        if (bugFixConversions.length > 0) {
          this.assert(bugFixConversions[0].type === expected.type, 
            `${name} (type)`, expected.type, bugFixConversions[0].type);
          
          // Test all dimensions included
          if (expected.allDimensions && bugFixConversions[0].converted) {
            const converted = bugFixConversions[0].converted;
            // Check for converted values (0.37 × 1.11 × 0.32 m) instead of original cm values
            const hasAllDimensions = converted.includes('0.37') && converted.includes('1.11') && converted.includes('0.32');
            this.assert(hasAllDimensions, 
              `${name} (all dimensions)`, 'all dimensions included', hasAllDimensions ? 'all included' : 'some missing');
          }
        }
        break;

      case 'timezonePatternTest':
        // Test if timezone patterns are recognized in text
        const { conversionData } = require('../data/conversion-data');
        const timezonePattern = conversionData.timezone?.patterns?.[0];
        if (timezonePattern) {
          const hasMatch = timezonePattern.test(input.text);
          this.assert(hasMatch === expected.hasTimePattern, name, expected.hasTimePattern ? 'pattern matched' : 'pattern not matched', hasMatch ? 'pattern matched' : 'pattern not matched');
        } else {
          this.assert(false, name, 'timezone pattern available', 'timezone pattern not found');
        }
        break;

      default:
        console.log(`${colors.yellow}[WARNING] Unknown test type: ${type}${colors.reset}`);
    }
  }

  // Run test suites by category
  runTestSuite(suiteName, testCases) {
    console.log(`\n${colors.blue}[Testing ${suiteName}]${colors.reset}`);
    
    testCases.forEach(testCase => {
      this.runTestCase(testCase);
    });
  }

  // Run dimension format tests
  runDimensionFormatTests() {
    console.log(`\n${colors.blue}[Testing Dimension Formats]${colors.reset}`);
    
    const userSettings = {
      lengthUnit: 'm',  // Changed from 'cm' to 'm' to ensure cm dimensions get converted
      areaUnit: 'm2',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l',
      currencyUnit: 'USD'
    };

    this.testCases.dimensionFormats.forEach((testCase, index) => {
      console.log(`Testing case ${index + 1}: ${testCase.name}`);
      const conversions = this.detector.findConversions(testCase.text, userSettings);
      
      this.assert(conversions.length === testCase.expectedCount, 
        `Dimension Format Case ${index + 1}: "${testCase.name}" should yield ${testCase.expectedCount} conversion(s)`, 
        testCase.expectedCount, conversions.length);
      
      if (conversions.length > 0 && testCase.expectedType) {
        this.assert(conversions[0].type === testCase.expectedType, 
          `Dimension Format Case ${index + 1}: Should detect as ${testCase.expectedType} type`, 
          testCase.expectedType, conversions[0].type);
      }
    });
  }

  // Run non-dimension tests
  runNonDimensionTests() {
    console.log(`\n${colors.blue}[Testing Non-Dimension Cases]${colors.reset}`);
    
    // Use different target units to ensure conversions are triggered
    const userSettings = {
      lengthUnit: 'm',  // Changed from 'cm' to 'm' to trigger cm->m conversion
      areaUnit: 'm2',
      weightUnit: 'kg',
      temperatureUnit: 'c',
      volumeUnit: 'l',
      currencyUnit: 'USD'
    };

    this.testCases.nonDimensions.forEach((testCase, index) => {
      console.log(`Testing non-dimension case ${index + 1}: ${testCase.name}`);
      const conversions = this.detector.findConversions(testCase.text, userSettings);
      
      this.assert(conversions.length === testCase.expectedCount, 
        `Non-Dimension Case ${index + 1}: Should detect ${testCase.expectedCount} measurement(s)`, 
        testCase.expectedCount, conversions.length);
      
      if (conversions.length > 0 && testCase.expectedTypeNot) {
        this.assert(conversions[0].type !== testCase.expectedTypeNot, 
          `Non-Dimension Case ${index + 1}: Should NOT detect as ${testCase.expectedTypeNot}`, 
          `not ${testCase.expectedTypeNot}`, conversions[0].type);
      }
    });
  }

  // Run false positive prevention tests
  runSingleSelectionTests() {
    console.log(`\n${colors.blue}[Testing Single Selection Approach]${colors.reset}`);
    
    this.testCases.singleSelection.forEach((testCase, index) => {
      console.log(`Testing single selection case ${index + 1}: ${testCase.name}`);
      
      const userSettings = testCase.input;
      const conversions = this.detector.findConversions(testCase.input.selectedText, userSettings);
      
      if (testCase.expected.hasConversion) {
        // Should have exactly one conversion
        this.assert(conversions.length === 1, 
          `Single Selection Case ${index + 1}: Should detect 1 conversion`, 
          1, conversions.length);
        
        if (conversions.length > 0 && testCase.expected.conversionType) {
          this.assert(conversions[0].type === testCase.expected.conversionType, 
            `Single Selection Case ${index + 1}: Should detect ${testCase.expected.conversionType} type`, 
            testCase.expected.conversionType, conversions[0].type);
        }
      } else {
        // Should have no conversions
        this.assert(conversions.length === 0, 
          `Single Selection Case ${index + 1}: Should detect 0 conversions`, 
          0, conversions.length);
      }
    });
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

  // Run all tests
  async runAllTests() {
    console.log(`${colors.bright}${colors.yellow}[Starting Streamlined Unit Converter Tests]${colors.reset}\n`);
    
    // Run test suites from test cases file
    this.runTestSuite('Basic Unit Conversions', this.testCases.basicConversions);
    this.runTestSuite('Area Conversions', this.testCases.areaConversions);
    this.runTestSuite('Unit Detection', this.testCases.unitDetection);
    this.runTestSuite('Auto-Sizing', this.testCases.autoSizing);
    this.runTestSuite('Pattern Matching', this.testCases.patternMatching);
    this.runTestSuite('Comprehensive Conversions', this.testCases.comprehensiveConversions);
    this.runTestSuite('Decimal Precision', this.testCases.decimalPrecision);
    this.runTestSuite('Edge Cases', this.testCases.edgeCases);
    this.runTestSuite('Comprehensive Auto-Sizing', this.testCases.comprehensiveAutoSizing);
    this.runTestSuite('Dimension Conversions', this.testCases.dimensionConversions);
    this.runTestSuite('Double Detection Prevention', this.testCases.doubleDetectionPrevention);
    this.runTestSuite('Single Selection Tests', this.testCases.singleSelection);
    this.runTestSuite('Speed Conversions', this.testCases.speedConversions);
    this.runTestSuite('Torque Conversions', this.testCases.torqueConversions);
    this.runTestSuite('Pressure Conversions', this.testCases.pressureConversions);
    this.runTestSuite('Timezone Conversions', this.testCases.timezoneConversions);
    this.runTestSuite('Timezone Pattern Detection', this.testCases.timezonePatternDetection);
    this.runTestSuite('Timezone Regex Tests', this.testCases.timezoneRegexTests);
    this.runTestSuite('Timezone Pattern Recognition', this.testCases.timezonePatternRecognition);
    this.runTestSuite('New Units Pattern Matching', this.testCases.newUnitsPatternMatching);
    this.runTestSuite('New Units Auto-Sizing', this.testCases.newUnitsAutoSizing);
    
    // Run additional specialized tests
    this.runDimensionFormatTests();
    this.runNonDimensionTests();
    this.runSingleSelectionTests();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new StreamlinedUnitConverterTester();
  tester.runAllTests().then(() => {
    tester.generateReport();
  }).catch(error => {
    console.error(`${colors.red}❌ Test suite failed:${colors.reset}`, error);
    process.exit(1);
  });
}

module.exports = StreamlinedUnitConverterTester;
