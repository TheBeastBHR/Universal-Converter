// Debug test for area conversions
// This file helps debug the area conversion issues

// Test the conversion logic directly
console.log('=== Area Conversion Debug Test ===');

// Load the modules
if (typeof window === 'undefined') {
    global.window = {};
}

// Simulate loading the data
eval(require('fs').readFileSync('../data/conversion-data.js', 'utf8'));
eval(require('fs').readFileSync('../utils/unit-converter.js', 'utf8'));
eval(require('fs').readFileSync('../utils/conversion-detector.js', 'utf8'));

// Test cases from the screenshot
const testCases = [
    "30 cm²",
    "5.4772 cm",
    "500 mm²", 
    "100 ft²",
    "150 square centimeters"
];

// Initialize the components
const unitConverter = new window.UnitConverter.UnitConverter();
const detector = new window.UnitConverter.ConversionDetector(unitConverter);

// Default user settings
const userSettings = {
    lengthUnit: 'm',
    weightUnit: 'kg',
    temperatureUnit: 'c',
    volumeUnit: 'l',
    areaUnit: 'm2'
};

console.log('Testing area conversions:');
testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. Testing: "${testCase}"`);
    
    // Test the pattern matching
    const areaPattern = window.UnitConverterData.UNIT_PATTERNS.area;
    const lengthPattern = window.UnitConverterData.UNIT_PATTERNS.length;
    
    const areaMatches = testCase.match(areaPattern);
    const lengthMatches = testCase.match(lengthPattern);
    
    console.log('   Area pattern matches:', areaMatches);
    console.log('   Length pattern matches:', lengthMatches);
    
    // Test the full conversion detection
    const conversions = detector.findConversions(testCase, userSettings);
    console.log('   Detected conversions:', conversions);
    
    // Manual unit normalization test
    if (areaMatches) {
        const [, value, unit] = areaMatches[0];
        const normalizedUnit = unitConverter.normalizeUnit(unit);
        const unitType = unitConverter.getUnitType(normalizedUnit);
        console.log(`   Manual test: ${value} ${unit} -> normalized: ${normalizedUnit}, type: ${unitType}`);
        
        if (unitType === 'area') {
            const converted = unitConverter.convert(parseFloat(value), normalizedUnit, 'm2');
            console.log(`   Converted to m2: ${converted}`);
            
            const linear = unitConverter.getLinearEquivalent(converted, 'm2');
            console.log(`   Linear equivalent: ${linear}`);
        }
    }
});
