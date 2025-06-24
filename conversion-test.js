// Quick test script for unit conversions
// Run this in browser console to test the conversion logic

function testConversions() {
    // Test area conversions
    console.log('Testing Area Conversions:');
    
    const converter = new window.UnitConverter.UnitConverter();
    
    // Test 1: 30 cm² to m²
    const result1 = converter.convert(30, 'cm2', 'm2');
    console.log('30 cm² =', result1, 'm²'); // Should be 0.003
    
    // Test linear equivalent
    const linear1 = converter.getLinearEquivalent(result1, 'm2');
    console.log('Linear equivalent:', linear1); // Should be ~0.0548 m
    
    // Test 2: 1000 m² 
    const result2 = converter.convert(1000, 'm2', 'm2');
    console.log('1000 m² =', result2, 'm²'); // Should be 1000
    
    const linear2 = converter.getLinearEquivalent(result2, 'm2');
    console.log('Linear equivalent:', linear2); // Should be ~31.62 m
    
    // Test 3: Auto-sizing
    const autoResult1 = converter.getBestUnit(0.001, 'area', 'm2');
    console.log('Auto-size 0.001 m²:', autoResult1); // Should suggest cm2
    
    const autoResult2 = converter.getBestUnit(2000000, 'area', 'm2');
    console.log('Auto-size 2000000 m²:', autoResult2); // Should suggest km2
    
    // Test Unicode symbols
    const normalized = converter.normalizeUnit('cm²');
    console.log('cm² normalized to:', normalized); // Should be 'cm2'
    
    console.log('All tests completed. Check values against expected results.');
}

// Call the test function
testConversions();
