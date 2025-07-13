# Testing Guide for Universal Converter Extension

## How to Run Tests

### 1. **Node.js Tests** (Recommended - No Browser Required)

```bash
# Run all automated tests
npm test

# Run comprehensive test suite
npm run test:all

# Run tests with verbose output
npm run test:verbose

# Stop on first test failure
npm run test:stop-on-failure
```

**What it tests:**
- Detection Tests: Pattern matching, unit detection, timezone recognition, and measurement identification
- Autosizing Tests: Automatic unit sizing functionality (small values to smaller units, large values to larger units)
- Conversion Tests: All unit conversions including length, weight, temperature, volume, area, speed, torque, pressure, dimensions, and timezones
- Other Tests: Edge cases, decimal precision, formatting, and error handling
- Single-selection dimension conversions ("10 x 5 x 3 inches", "4.5 × 3.2 × 2.8 meters", "6m × 4m × 2.5m")
- Currency pattern detection with real-time conversion support
- Unicode symbol detection (cm², m², ft², د.ب, ر.س, د.إ)
- Unit aliases and normalization
- Arabic currency symbols (BHD, KWD, SAR, AED, QAR)
- European number formats (1.234,56)
- False-positive prevention (only converts explicitly selected measurements)

### 2. **Browser Tests** (Manual)

```bash
# Open test files in browser after installing extension
npm run test:browser

# Or open directly:
# - test.html (comprehensive test page)
# - area-test.html (area-specific tests)
```

**What to test:**
- Install extension in Chrome/Edge
- Select individual highlighted measurements in test files
- Verify conversion popups appear with correct values
- Test currency conversions with live exchange rates
- Check dimension parsing for various formats
- Verify auto-sizing works correctly
- Confirm false-positive prevention (non-measurements are ignored)

### 3. **Extension Validation**

```bash
npm run validate
```

**What it checks:**
- Manifest.json structure and Manifest v3 compliance
- Required files exist (background.js, content.js, icons, etc.)
- JavaScript syntax validation
- Content script loading order
- Icon files (16px, 32px, 48px, 128px)
- Permissions and security settings
- File structure integrity

## GitHub Actions (Automated CI/CD)

This project uses GitHub Actions for continuous integration and automated testing.

### **Triggers:**
- Push to `main` or `develop` branch
- Pull requests to `main`
- Manual workflow dispatch

### **Test Matrix:**
- Node.js 24.x
- Ubuntu latest, Windows latest, macOS latest

### **What Runs Automatically:**
1. **Detection Tests** - Pattern matching, unit detection, timezone patterns, and measurement identification
2. **Autosizing Tests** - Automatic unit sizing logic validation
3. **Conversion Tests** - All core conversion logic including dimensions and timezones
4. **Other Tests** - Edge cases, precision, and error handling
5. **Extension Validation** - Structure, syntax, and Manifest v3 compliance
6. **Cross-Platform Compatibility** - Windows, macOS, Linux
7. **Build Verification** - Ensures extension can be packaged

### **Viewing Results:**
1. Go to your GitHub repository
2. Click "Actions" tab
3. View test results and download build artifacts

## Test Coverage

The test suite provides comprehensive coverage across all functionality areas.

### Core Functionality
- Length conversions (mm, cm, m, km, in, ft, yd, mi)
- Weight conversions (mg, g, kg, t, oz, lb)
- Temperature conversions (°C, °F, K)
- Volume conversions (ml, L, fl oz, cup, pt, qt, gal)
- Area conversions (mm², cm², m², km², in², ft², acre)


### Extension Integration
- Manifest v3 compliance
- Content script injection and isolation
- Chrome storage API integration
- Popup positioning and display
- Service worker background processing
- Permission validation (activeTab, storage)

### Error Handling & Edge Cases
- Invalid unit combinations
- Zero and negative values
- Very large/small numbers
- Malformed text patterns
- Missing currency data fallbacks
- Network timeout handling
- Non-measurement text rejection (false-positive prevention)

##  Troubleshooting Tests

### **"Module not found" errors:**
```bash
# Ensure you're in the project directory
cd "Universal Converter"
npm test
```

### **"window is not defined" errors:**
- This is normal for Node.js tests
- The test runner mocks the window object automatically
- Tests run in a simulated browser environment

### **Browser tests not working:**
1. Ensure extension is installed in Chrome/Edge
2. Enable "Developer mode" in chrome://extensions/
3. Reload extension after code changes
4. Check browser console (F12) for errors
5. Verify the extension has permissions for the test page

### **Currency conversion tests failing:**
- Check internet connection (requires API access)
- Verify currency API is accessible
- Some tests may skip if API is unavailable (expected behavior)

### **GitHub Actions failing:**
1. Check the "Actions" tab in your repository
2. Review error logs in failed workflow runs
3. Ensure all files are committed and pushed
4. Verify package.json scripts are correct

### **Extension not detecting text:**
1. Check that only the measurement itself is highlighted/selected (not surrounding context)
2. Ensure content script is loaded (check Extensions page)
3. Verify the page allows content scripts
4. Check for JavaScript errors in browser console
5. Try selecting just the number and unit (e.g., "5.5 kg" not "The package weighs 5.5 kg")

## Continuous Integration

The CI/CD pipeline runs comprehensive tests automatically where **on every push:**
   - Runs all automated tests
   - Validates extension structure and Manifest v3 compliance
   - Checks code quality and syntax
   - Tests currency pattern detection
   - Verifies dimension parsing functionality
   - Tests single-selection approach and false-positive prevention

## Adding Tests

The test suite uses a JSON-based structure with organized test categories for better maintainability.

### Test Structure
- **tests/test-cases.json** - Contains all test case definitions organized by logical categories
- **tests/test-runner.js** - test runner that loads and executes grouped test cases


### Test Categories

The tests are organized into four main categories:

1. **Detection Tests**
   - Unit detection and normalization
   - Pattern matching and recognition
   - Timezone pattern detection and regex validation
   - Dimension format recognition
   - Single selection approach validation
   - False-positive prevention

2. **Autosizing Tests**
   - Automatic unit sizing based on value magnitude
   - Best unit selection logic
   - Value and unit combination optimization

3. **Conversion Tests**
   - Basic unit conversions (length, weight, temperature, volume, area)
   - Speed, torque, and pressure conversions
   - Dimension conversions with various separators
   - Timezone conversions between different time zones

4. **Other Tests**
   - Decimal precision and formatting
   - Edge cases and error handling
   - Invalid unit combinations
   - Boundary value testing

### Adding Test Cases

To add test cases, edit `tests/test-cases.json` and add to the appropriate category:

```json
{
  "Detection": [
    {
      "name": "Pattern: \"new format\" detected",
      "type": "patternDetection",
      "input": {
        "text": "test text",
        "userSettings": { "lengthUnit": "m", "areaUnit": "m2" }
      },
      "expected": { "minConversions": 1 }
    }
  ],
  "Conversions": [
    {
      "name": "Length: 100 cm = 1 m",
      "type": "conversion",
      "input": { "value": 100, "from": "cm", "to": "m" },
      "expected": 1,
      "tolerance": 0.001
    }
  ]
}
```

### Test Types Available
- `conversion` - Standard unit conversions
- `timezoneConversion` - Timezone conversion tests
- `normalize` - Unit normalization tests  
- `unitType` - Unit type detection tests
- `bestUnit` - Auto-sizing tests
- `format` - Number formatting tests
- `patternDetection` - Individual measurement pattern recognition
- `patternFromDataTest` - Pattern testing using actual conversion data
- `dimensionDetection` - Dimension detection tests
- `singleSelection` - Single-selection approach tests
- `doubleDetectionCount` - Multiple detection prevention tests
- `originalBugFix` - Regression testing for specific bug fixes

## Test Commands Summary

```bash
# Core testing commands
npm test                    # Run all automated tests
npm run test:all           # Run comprehensive test suite  
npm run test:verbose       # Detailed test output
npm run test:stop-on-failure  # Stop on first failure

# Validation and building
npm run validate           # Validate extension structure
npm run build             # Build extension for distribution
npm run test:browser      # Instructions for manual browser testing

```

## Success Criteria

All tests should pass before merging to main branch:
- All automated tests passing (Detection, Autosizing, Conversions, Other Tests)
- Extension validation passing
- Manual browser tests working (individual measurement selections)
- No console errors during testing
- Build process completing successfully
- Single-selection approach working correctly
- False-positive prevention verified