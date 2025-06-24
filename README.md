# Universal Unit Converter - Chrome Extension v3

A Chrome extension that provides **instant unit conversions** using text selection popups and comprehensive unit support. Features advanced area conversions, auto-sizing, and supports detection of Unicode symbols and text based units (meters, feet squared etc..).

## ✨ Key Features

### 🔄 **Instant Text Selection Conversion**
- Select any text containing units (measurements, dimensions, temperatures, etc.)
- Get instant conversion popup below the selected text
- Supports complex dimensions in **"L x W x H"** format with mixed units
- **Non-intrusive popup** doesn't modify the original text

### 📏 **Comprehensive Unit Support**
- **Length**: meters, centimeters, millimeters, kilometers, inches, feet, yards, miles
- **Weight**: kilograms, grams, pounds, ounces, tonnes
- **Temperature**: Celsius, Fahrenheit, Kelvin (with proper conversion formulas)
- **Volume**: liters, milliliters, gallons, quarts, pints, cups, fluid ounces
- **Area**: square meters, square centimeters, square kilometers, square feet, square inches, acres

### 🎯 **Advanced Area Conversions**
- **Linear Equivalents**: Shows both area and linear measurements (e.g., "100 m², 10 m linear")
- **Unicode Symbol Detection**: Properly handles `cm²`, `m²`, `mm²`, `km²`, `ft²`, `in²`
- **Text Format Recognition**: "square meters", "meters squared", "square feet"
- **Fixed Conversion Bug**: Correctly calculates linear equivalents from converted area values

### 🧠 **Auto unit Sizing** 
- **Automatic Unit Selection**: Chooses the most appropriate unit for display
- **Small Values**: `0.001 m²` → `10 cm²` or `1000 mm²`
- **Large Values**: `2000000 m²` → `2 km²`
- **Prevents Awkward Numbers**: Instead of `0.0003 m` - shows `3 mm` instead
- **Works Across All Unit Types**: Length, weight, volume, and area

### ⚙️ **Settings Management** *(Auto-Save)*
- **Preset Systems**: Choose between Metric, Imperial, or Custom unit preferences
- **Auto-Save**: Settings save automatically when changed - no save button needed
- **Individual Unit Control**: Override defaults for specific unit types
- **Intelligent Detection**: Recognizes various unit formats and aliases
- **Cross-Device Sync**: Your preferences sync across Chrome instances

### 🎨 **Modern UI Design**
- **Beautiful Gradient Design**: Sleek purple gradient interface
- **Smooth Animations**: Elegant transitions and hover effects
- **Responsive Layout**: Works on all screen sizes
- **Dark Mode Compatible**: Adapts to system preferences

## 🚀 Installation

1. **Download**: Clone or download this repository
2. **Open Chrome Extensions**: Navigate to `chrome://extensions/`
3. **Enable Developer Mode**: Toggle "Developer mode" in the top right
4. **Load Extension**: Click "Load unpacked" and select the `unitConverter` folder
5. **Ready**: The extension icon will appear in your Chrome toolbar

## 💡 Usage Examples

### **Text Selection Conversion**
- **Simple**: Select `"10 inches"` → Shows `"25.4 cm"`
- **Temperature**: Select `"20°C"` → Shows `"68°F"`
- **Dimensions**: Select `"10 x 5 x 3 feet"` → Shows `"3.05 × 1.52 × 0.91 m"`
- **Area**: Select `"30 cm²"` → Shows `"0.003 m², 5.48 cm linear"`
- **Mixed Units**: Select `"5m x 3ft x 20in"` → Converts all to your preferred unit

### **Settings Configuration**
1. **Click** the extension icon in your toolbar
2. **Choose** preset (Metric/Imperial) or customize individual units
3. **Settings** save automatically when you make changes
4. **Changes** apply immediately to all future conversions

### **Supported Text Formats**
- **Simple**: `10 meters`, `5.5 kg`, `20°C`, `30 cm²`
- **Dimensions**: `10 x 5 x 3 feet`, `2m × 1.5m × 0.8m`
- **Unicode**: `25 cm²`, `100 m²`, `32°F`
- **Aliases**: `5 inches`, `10 lbs`, `20 degrees celsius`
- **Mixed**: Works with or without spaces, different separators

### **File Structure**

```
unitConverter/
├── manifest.json              # Extension configuration
├── content.js                 # Main orchestrator (modular architecture)
├── background.js              # Service worker
├── content.css                # Popup styling
├── package.json               # NPM configuration and build scripts
├── package-lock.json          # NPM dependency lock file
├── LICENSE                    # MIT license file
├── popup/                     # Extension popup UI
│   ├── popup.html             # Settings UI (auto-save enabled)
│   └── popup.js               # Auto-save settings management
├── data/
│   └── conversion-data.js      # All conversion data & patterns
├── utils/
│   ├── unit-converter.js       # Core conversion logic + auto-sizing
│   ├── conversion-detector.js  # Enhanced text pattern matching
│   ├── popup-manager.js        # DOM manipulation & positioning
│   └── settings-manager.js     # Chrome storage wrapper
├── icons/                     # Extension icons (16px, 32px, 48px, 128px)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── tests/                     # Comprehensive test suite
│   ├── area-test.html         # Area conversion edge cases & Unicode tests
│   ├── test.html              # General conversion testing
│   ├── conversion-test.js     # Programmatic testing script
│   ├── test-suite.js          # Automated test runner
│   ├── test-runner.js         # Node.js test automation
│   ├── validate-extension.js  # Extension structure validation
│   ├── TESTING.md             # Testing documentation
│   └── TESTING_SUMMARY.md     # Testing infrastructure overview
├── debug/                     # Debug utilities
│   └── debug-area.js          # Debug utilities for area conversions
├── .github/workflows/         # CI/CD automation
│   └── ci.yml                 # GitHub Actions workflow (uses Node.js 24.x, path filtering)
├── node_modules/              # NPM dependencies (auto-generated)
├── .git/                      # Git repository
└── README.md                  # This documentation file
```



## 🧪 Testing

### **Test Files Included**
- `tests/area-test.html` - Test area conversion edge cases and Unicode symbols
- `tests/test.html` - General conversion testing for all unit types
- `tests/conversion-test.js` - Programmatic testing script
- `tests/test-suite.js` - Automated test runner
- `tests/test-runner.js` - Node.js automated testing
- `tests/validate-extension.js` - Extension structure validation
- `debug/debug-area.js` - Debug utilities for troubleshooting area conversions

### **Automated Testing**
```bash
# Run all automated tests (24 comprehensive tests)
npm test

# Validate extension structure and syntax
npm run validate

# Run browser tests manually
npm run test:browser

# Build extension for distribution
npm run build

# Create extension ZIP package
npm run zip
```

### **Dependencies**
- **js-yaml**: YAML parsing for CI workflow validation
- **Node.js 24.x**: Required for development and testing

### **CI/CD Pipeline**
- **Automated testing** on push to main/develop branches
- **Path-based triggers** - only runs when relevant files change
- **5 comprehensive jobs**: testing, browser compatibility, security, build, code quality
- **Node.js 24.x** for optimal performance and latest features

### **Manual Testing Steps**
1. **Install** the extension following installation steps
2. **Visit** any test file in the `tests/` folder or create text with units
3. **Select** text containing measurements
4. **Verify** popup appears with correct conversions
5. **Test** settings auto-save by changing preferences

## 🔒 Privacy & Security

- **Minimal Permissions**: Only `activeTab` and `storage`
- **No External Servers**: All processing happens locally
- **No Data Collection**: Zero tracking or analytics
- **Offline Functionality**: Works without internet connection

## 🌐 Browser Compatibility

- **Chrome 88+** ✅
- **Edge 88+** ✅  
- **Brave Browser** ✅
- **Any Chromium-based browser** supporting Manifest v3 ✅

## 👨‍💻 Development

### **Local Development Setup**
```bash
# Clone the repository
git clone <repository-url>
cd unitConverter


# Manual installation:
# Load in Chrome for testing
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the unitConverter folder
```

### **Build and Package**
```bash
# Test the extension
npm test

# Package for distribution (creates zip file)
npm run zip
```

### **Key Files to Modify**
- **Add New Units**: Edit `data/conversion-data.js`
- **Modify Conversion Logic**: Edit `utils/unit-converter.js`
- **Change UI**: Edit `popup.html` and `content.css`
- **Add Features**: Create new modules in `utils/`

### **Testing Changes**
```bash
# After making changes:
# 1. Click "Reload" on extension in chrome://extensions/
# 2. Test on included test files
# 3. Verify settings save properly
# 4. Check console for errors
```

## 📋 TODO:

1. **Publish to Chrome Webstore**
2. **FIX**: some bugs related to conversions.

## 🤝 Contributing

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes following the coding conventions
4. **Test** thoroughly using included test files
5. **Commit** changes (`git commit -m 'Add amazing feature'`)
6. **Push** to branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

## 📄 License

**MIT License** - Feel free to use, modify, and distribute for any purpose.

---