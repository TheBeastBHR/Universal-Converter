<h1 style="text-align: center;">Universal Converter - Chrome Extension</h1>

<div align="center">
    
[![Tests](../../actions/workflows/ci.yml/badge.svg)](../../actions)

</div>

<div align="center">
<img src="img/popup.png" alt="Extension Usage Demo" />
</div>

<div align="center">
<strong>Instantly convert any unit or currency by simply selecting text on any webpage!</strong>
</div>

A powerful Chrome Extension that automatically detects and converts units in selected text, supporting length, weight, temperature, volume, area measurements, and **real-time currency conversions** with smart auto-sizing and dimension support.

## ✨ Key Features

- **Single-Selection Conversion** - Select individual measurements for precise, instant conversions
- **Real-Time Currency Conversion** - Live exchange rates for 150+ currencies with Arabic/Unicode symbol support
- **Smart Auto-Sizing** - Automatically chooses appropriate units (0.001m → 1mm)  
- **Dimension Support** - Handles formats like "8ft × 4ft × 30in", "6m × 4m × 2.5m"
- **Auto-Save Settings** - Metric/Imperial presets with manual overrides

## 🚀 Installation
**One Click Installation**
- [Chrome Webstore](https://chromewebstore.google.com/detail/ediegfdjholeejhjdenagnjjjlhafgbl)

**Manual Installation**
1. Click on Code, Download ZIP, Extract files. (or get it from releases for more stable-er build)
2. **Open** `chrome://extensions/` in Chrome
3. **Enable** "Developer mode" (top right toggle)
4. **Click** "Load unpacked" and select the project folder
5. **Test** by selecting "30 cm" on any webpage → See "11.81 inches" popup

## 🧪 Testing & Development

For  testing documentation, build instructions, and development setup:

**→ [See TESTING.md](tests/TESTING.md)**

**Quick Commands:**
```bash
npm test          # Run all automated tests
npm run validate  # Validate extension structure  
npm run build     # Build for distribution
```

## 📁 Project Structure

```
Universal Converter/
├── manifest.json              # Extension configuration
├── background.js              # Service worker
├── content.js                 # Main content script
├── content.css                # Content script styles
├── package.json               # Node.js dependencies
│
├── data/                       # Conversion data
│   ├── conversion-data.js     # Unit definitions & patterns
│   └── currency-mappings.js   # Currency symbols & codes
│
├── utils/                      # Core functionality
│   ├── unit-converter.js      # Unit conversion logic
│   ├── currency-converter.js  # Currency detection & conversion
│   ├── conversion-detector.js # Pattern matching & detection
│   ├── popup-manager.js       # Popup positioning & display
│   ├── settings-manager.js    # User preferences storage
│   └── build.js               # Build script for distribution
│
├── settings-page/             # Extension settings UI
│   ├── settings.html         # Settings interface
│   └── settings.js           # Settings functionality
│
├── icons/                     # Extension icons
│
├── tests/                     # Test suite
│   ├── test-runner.js        # Core unit tests
│   ├── test-suite.js         # Additional tests
│   ├── validate-extension.js # Extension structure validation
│   ├── run-all-tests.js      # Cross-platform test runner
│   ├── test.html             # Browser test page
│   ├── area-test.html        # Area conversion test page
│   └── TESTING.md            # Testing documentation
│
└── .github/                    # GitHub configuration
    └── workflows/             # CI/CD automation
```

## 🔒 Privacy & Security

- **Minimal Permissions**: Only `activeTab` and `storage`
- **Uses Currency Data from an API**: this extension uses [Fawaz Exchange API](https://github.com/fawazahmed0/exchange-api).
- **No Data Collection**: Zero tracking or analytics

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes and test thoroughly
4. Submit a pull request

See [TESTING.md](tests/TESTING.md) for development guidelines and testing procedures.

## 🙏 Credits & Acknowledgments

This project integrates currency conversion functionality from [Currency-Converter](https://github.com/adampawelczyk/Currency-Converter) by Adam Pawełczyk. The currency detection, symbol mapping, API's used and real-time exchange rate features are based on this open-source project.

## 📄 License

MIT License - Feel free to use, modify, and distribute.
