# Testing Guide for Unit Converter Extension

## 🧪 How to Run Tests

### 1. **Node.js Tests** (Recommended - No Browser Required)

```bash
# Run all automated tests
npm test

# Run extension validation
npm run validate

# Run specific test categories
node test-runner.js
```

**What it tests:**
- ✅ Basic unit conversions (length, weight, temperature, volume, area)
- ✅ Area conversion linear equivalents
- ✅ Unicode symbol detection (cm², m², ft²)
- ✅ Auto-sizing functionality
- ✅ Pattern matching and text detection
- ✅ Unit aliases and normalization

### 2. **Browser Tests** (Manual)

```bash
# Open test files in browser after installing extension
npm run test:browser

# Or open directly:
# - area-test.html
# - test.html
# - debug-test.html
```

**What to test:**
- Install extension in Chrome
- Select highlighted text in test files
- Verify conversion popups appear
- Check area units show linear equivalents

### 3. **Extension Validation**

```bash
npm run validate
```

**What it checks:**
- ✅ Manifest.json structure
- ✅ Required files exist
- ✅ JavaScript syntax
- ✅ Content script loading order
- ✅ Icon files
- ✅ Permissions

## 🤖 GitHub Actions (Automated CI/CD)

When you push to GitHub, automated tests run:

### **Triggers:**
- Push to `main` or `develop` branch
- Pull requests to `main`

### **Test Matrix:**
- Node.js 18.x and 20.x
- Ubuntu latest

### **What Runs Automatically:**
1. **Unit Tests** - Core conversion logic
2. **Extension Validation** - Structure and syntax
3. **Browser Compatibility** - Headless Chrome tests
4. **Security Checks** - Permission auditing
5. **Code Quality** - Linting and analysis
6. **Build & Package** - Creates distributable ZIP

### **Viewing Results:**
1. Go to your GitHub repository
2. Click "Actions" tab
3. View test results and artifacts

## 📊 Test Coverage

Current test coverage includes:

### **Core Functionality** ✅
- [x] Length conversions (cm, m, ft, in, etc.)
- [x] Weight conversions (g, kg, lb, oz, etc.)
- [x] Temperature conversions (°C, °F, K)
- [x] Volume conversions (L, mL, gal, etc.)
- [x] Area conversions (cm², m², ft², etc.)

### **Advanced Features** ✅
- [x] Unicode symbol detection
- [x] Text format aliases ("square meters")
- [x] Auto-sizing (0.001 m → 1 mm)
- [x] Linear equivalents for area
- [x] Pattern matching priority
- [x] Settings auto-save

### **Extension Integration** ✅
- [x] Manifest v3 compliance
- [x] Content script loading
- [x] Chrome storage API
- [x] Popup functionality
- [x] Service worker

## 🚨 Troubleshooting Tests

### **"Module not found" errors:**
```bash
# Ensure you're in the project directory
cd unitConverter
npm test
```

### **"window is not defined" errors:**
- This is normal for Node.js tests
- The test runner mocks the window object

### **Browser tests not working:**
1. Ensure extension is installed in Chrome
2. Reload extension after code changes
3. Check browser console for errors

### **GitHub Actions failing:**
1. Check the "Actions" tab in your repository
2. Review error logs
3. Ensure all files are committed

## 🔄 Continuous Integration

The CI/CD pipeline automatically:

1. **On every push:**
   - Runs all tests
   - Validates extension structure
   - Checks code quality

2. **On main branch:**
   - Creates distributable package
   - Uploads build artifacts

3. **On tags (releases):**
   - Creates GitHub release
   - Attaches extension ZIP file

## 📈 Adding New Tests

To add new test cases, edit `test-runner.js`:

```javascript
// Add to existing test methods or create new ones
testNewFeature() {
  console.log('🧪 Testing New Feature');
  
  const result = this.unitConverter.newMethod();
  this.assert(result === expected, 'New feature works', expected, result);
}
```

## 🎯 Test Commands Summary

```bash
npm test           # Run all automated tests
npm run validate   # Validate extension structure  
npm run build      # Build extension
npm run zip        # Create distribution package
```

All tests should pass before merging to main branch! 🚀
