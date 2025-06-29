#!/usr/bin/env node
// Debug script to investigate the failing test case

const fs = require('fs');
const path = require('path');

// Mock window object for Node.js
global.window = {};
global.document = { location: { hostname: 'localhost' } };

// Load modules
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

  console.log('✅ All modules loaded successfully');
  
  const unitConverterInstance = new global.window.UnitConverter.UnitConverter();
  const detectorInstance = new global.window.UnitConverter.ConversionDetector(unitConverterInstance);
  
  // Initialize the global currency converter instance
  if (typeof global.window.UnitConverter.CurrencyConverter !== 'undefined') {
    global.window.UnitConverter.currencyConverter = new global.window.UnitConverter.CurrencyConverter();
  }

  // Test the failing case
  const userSettings = {
    lengthUnit: 'cm',
    areaUnit: 'm2',
    weightUnit: 'kg',
    temperatureUnit: 'c',
    volumeUnit: 'l',
    currencyUnit: 'USD'
  };

  console.log('\n=== Testing Failing Case ===');
  const failingText = 'Height: 180 cm';
  console.log(`Testing text: "${failingText}"`);
  
  const conversions = detectorInstance.findConversions(failingText, userSettings);
  console.log(`Found ${conversions.length} conversion(s)`);
  
  if (conversions.length > 0) {
    conversions.forEach((conv, index) => {
      console.log(`Conversion ${index + 1}:`);
      console.log(`  Type: ${conv.type}`);
      console.log(`  Original: ${conv.original}`);
      console.log(`  Converted: ${conv.converted}`);
    });
  } else {
    console.log('No conversions detected');
  }

  // Test the working case for comparison
  console.log('\n=== Testing Working Case for Comparison ===');
  const workingText = 'Single measurement: 25 inches';
  console.log(`Testing text: "${workingText}"`);
  
  const workingConversions = detectorInstance.findConversions(workingText, userSettings);
  console.log(`Found ${workingConversions.length} conversion(s)`);
  
  if (workingConversions.length > 0) {
    workingConversions.forEach((conv, index) => {
      console.log(`Conversion ${index + 1}:`);
      console.log(`  Type: ${conv.type}`);
      console.log(`  Original: ${conv.original}`);
      console.log(`  Converted: ${conv.converted}`);
    });
  }

  // Test a simple case
  console.log('\n=== Testing Simple Case ===');
  const simpleText = '180 cm';
  console.log(`Testing text: "${simpleText}"`);
  
  const simpleConversions = detectorInstance.findConversions(simpleText, userSettings);
  console.log(`Found ${simpleConversions.length} conversion(s)`);
  
  if (simpleConversions.length > 0) {
    simpleConversions.forEach((conv, index) => {
      console.log(`Conversion ${index + 1}:`);
      console.log(`  Type: ${conv.type}`);
      console.log(`  Original: ${conv.original}`);
      console.log(`  Converted: ${conv.converted}`);
    });
  }

} catch (error) {
  console.error('❌ Failed to load modules:', error.message);
}
