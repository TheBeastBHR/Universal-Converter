# Testing Guide for Universal Converter Extension

## 🧪 How to Run Tests

### 1. **Node.js Tests** (Recommended - No Browser Required)

```bash
# Run all automated tests
npm test

# Run extension validation
npm run validate

# Run comprehensive test suite
npm run test:all

# Run tests with verbose output
npm run test:verbose

# Stop on first test failure
npm run test:stop-on-failure
```

**What it tests:**
- ✅ **103 automated test cases** covering all functionality
- ✅ Basic unit conversions (length, weight, temperature, volume, area)
- ✅ **Dimension conversions** ("10 x 5 x 3 inches", "4.5 × 3.2 × 2.8 meters", "12 by 8 by 6 feet")
- ✅ **Currency pattern detection** with real-time conversion support
- ✅ Unicode symbol detection (cm², m², ft², د.ب, ر.س, د.إ)
- ✅ Auto-sizing functionality (0.001m → 1mm)
- ✅ Pattern matching and text detection
- ✅ Unit aliases and normalization
- ✅ **Arabic currency symbols** (BHD, KWD, SAR, AED, QAR)
- ✅ **European number formats** (1.234,56)
- ✅ Edge cases and error handling

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
- Select highlighted text in test files
- Verify conversion popups appear with correct values
- Test currency conversions with live exchange rates
- Check dimension parsing for various formats
- Verify auto-sizing works correctly

### 3. **Extension Validation**

```bash
npm run validate
```

**What it checks:**
- ✅ Manifest.json structure and Manifest v3 compliance
- ✅ Required files exist (background.js, content.js, icons, etc.)
- ✅ JavaScript syntax validation
- ✅ Content script loading order
- ✅ Icon files (16px, 32px, 48px, 128px)
- ✅ Permissions and security settings
- ✅ File structure integrity

## 🤖 GitHub Actions (Automated CI/CD)

This project uses GitHub Actions for continuous integration and automated testing.

### **Triggers:**
- Push to `main` or `develop` branch
- Pull requests to `main`
- Manual workflow dispatch

### **Test Matrix:**
- Node.js 18.x, 20.x, and 22.x
- Ubuntu latest, Windows latest, macOS latest

### **What Runs Automatically:**
1. **Unit Tests** - All 103 core conversion logic tests
2. **Extension Validation** - Structure, syntax, and Manifest v3 compliance
3. **Currency Integration Tests** - Pattern detection and conversion logic
4. **Dimension Parsing Tests** - Complex format support ("by", "×", "x")
5. **Cross-Platform Compatibility** - Windows, macOS, Linux
6. **Build Verification** - Ensures extension can be packaged

### **Viewing Results:**
1. Go to your GitHub repository
2. Click "Actions" tab
3. View test results and download build artifacts

## 📊 Test Coverage

Current test coverage: **103/103 tests passing (100% success rate)**

### **Core Functionality** ✅
- [x] Length conversions (mm, cm, m, km, in, ft, yd, mi)
- [x] Weight conversions (mg, g, kg, t, oz, lb)
- [x] Temperature conversions (°C, °F, K)
- [x] Volume conversions (ml, L, fl oz, cup, pt, qt, gal)
- [x] Area conversions (mm², cm², m², km², in², ft², acre)

### **Advanced Features** ✅
- [x] **Dimension Support** - "10 x 5 x 3 inches", "4.5 × 3.2 × 2.8 meters", "12 by 8 by 6 feet"
- [x] **Currency Conversions** - Real-time exchange rates with 150+ currencies
- [x] **Arabic Currency Support** - د.ب (BHD), د.ك (KWD), ر.س (SAR), د.إ (AED)
- [x] **European Number Formats** - 1.234,56 decimal comma support
- [x] Unicode symbol detection (cm², m², °C, etc.)
- [x] Text format aliases ("square meters", "degrees Celsius")
- [x] Auto-sizing (0.001 m → 1 mm, 2000 m → 2 km)
- [x] Pattern matching with priority handling
- [x] Settings persistence and auto-save

### **Extension Integration** ✅
- [x] Manifest v3 compliance
- [x] Content script injection and isolation
- [x] Chrome storage API integration
- [x] Popup positioning and display
- [x] Service worker background processing
- [x] Permission validation (activeTab, storage)

### **Error Handling & Edge Cases** ✅
- [x] Invalid unit combinations
- [x] Zero and negative values
- [x] Very large/small numbers
- [x] Malformed text patterns
- [x] Missing currency data fallbacks
- [x] Network timeout handling

## 🚨 Troubleshooting Tests

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
1. Check that text is properly highlighted/selected
2. Ensure content script is loaded (check Extensions page)
3. Verify the page allows content scripts
4. Check for JavaScript errors in browser console

## 🔄 Continuous Integration

The CI/CD pipeline runs comprehensive tests automatically:

1. **On every push:**
   - Runs all 103 automated tests
   - Validates extension structure and Manifest v3 compliance
   - Checks code quality and syntax
   - Tests currency pattern detection
   - Verifies dimension parsing functionality

2. **On main branch:**
   - Creates distributable package in build/ folder
   - Uploads build artifacts for download
   - Validates cross-platform compatibility

3. **On tags (releases):**
   - Creates GitHub release automatically
   - Attaches extension ZIP file
   - Generates release notes from commits

## 📈 Adding New Tests

To add new test cases, edit `tests/test-runner.js`:

```javascript
// Add to existing test methods or create new ones
testNewFeature() {
  console.log(`\n${colors.blue}[Testing New Feature]${colors.reset}`);
  
  const result = this.unitConverter.newMethod();
  this.assert(result === expected, 'New feature works', expected, result);
}

// For currency tests, add to testCurrencyPatternDetection()
const newCurrencyTest = this.detector.findCurrencyConversions('¥1000', userSettings);
this.assert(newCurrencyTest.length > 0, 'Currency Pattern: JPY detected', '>0', newCurrencyTest.length);
```

## 🎯 Test Commands Summary

```bash
# Core testing commands
npm test                    # Run all 103 automated tests
npm run test:all           # Run comprehensive test suite  
npm run test:verbose       # Detailed test output
npm run test:stop-on-failure  # Stop on first failure

# Validation and building
npm run validate           # Validate extension structure
npm run build             # Build extension for distribution
npm run test:browser      # Instructions for manual browser testing

# Development helpers
node tests/test-runner.js  # Run core tests directly
node tests/validate-extension.js  # Validate structure only
```

## 🏆 Success Criteria

All tests should pass before merging to main branch:
- ✅ **103/103 automated tests passing**
- ✅ **Extension validation passing**
- ✅ **Manual browser tests working**
- ✅ **No console errors during testing**
- ✅ **Build process completing successfully**

🚀 **Ready for production when all criteria are met!**
