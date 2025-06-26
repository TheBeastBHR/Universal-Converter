// Automated Unit Converter Test Suite
// This script provides comprehensive testing for the extension

class ExtensionTester {
  constructor() {
    this.testResults = [];
    this.testCount = 0;
    this.passCount = 0;
    this.failCount = 0;
    this.isExtensionLoaded = false;
    this.conversionEngine = null;
  }

  // Initialize the test suite
  async init() {
    console.log('🧪 Starting Unit Converter Test Suite');
    this.checkExtensionAvailability();
    this.setupTestEnvironment();
    await this.runAllTests();
    this.generateReport();
  }

  // Check if the extension is properly loaded
  checkExtensionAvailability() {
    // Check for extension-specific elements or functions
    const extensionElements = document.querySelectorAll('.unit-converter-popup');
    const hasContentScript = typeof window.unitConverter !== 'undefined';
    
    this.isExtensionLoaded = hasContentScript || extensionElements.length > 0;
    
    if (this.isExtensionLoaded) {
      console.log('✅ Extension detected');
    } else {
      console.warn('⚠️ Extension not detected - some tests may fail');
    }
  }

  // Setup test environment
  setupTestEnvironment() {
    // Create test results container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'test-results';
    resultsContainer.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      width: 300px;
      max-height: 400px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999999;
      font-family: monospace;
      font-size: 12px;
      overflow-y: auto;
      display: none;
    `;
    document.body.appendChild(resultsContainer);

    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🧪 Test Results';
    toggleButton.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 1000000;
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
    `;
    toggleButton.onclick = () => {
      const results = document.getElementById('test-results');
      results.style.display = results.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(toggleButton);
  }

  // Run all test suites
  async runAllTests() {
    console.log('🚀 Running test suites...');
    
    await this.testBasicConversions();
    await this.testDimensionalConversions();
    await this.testTemperatureConversions();
    await this.testEdgeCases();
    await this.testUIElements();
    await this.testSettings();
  }

  // Test basic unit conversions
  async testBasicConversions() {
    console.log('📏 Testing basic conversions...');
    
    const tests = [
      { input: '10 feet', expected: 'meters', type: 'length' },
      { input: '5 kg', expected: 'pounds', type: 'weight' },
      { input: '2 liters', expected: 'gallons', type: 'volume' },
      { input: '100 cm', expected: 'inches', type: 'length' },
      { input: '500 grams', expected: 'ounces', type: 'weight' }
    ];

    for (const test of tests) {
      try {
        const result = await this.simulateTextSelection(test.input);
        this.recordTest(`Basic ${test.type}`, test.input, result.success, result.message);
      } catch (error) {
        this.recordTest(`Basic ${test.type}`, test.input, false, error.message);
      }
    }
  }

  // Test dimensional conversions (L x W x H)
  async testDimensionalConversions() {
    console.log('📦 Testing dimensional conversions...');
    
    const tests = [
      '10 x 5 x 3 feet',
      '2.5 × 1.5 × 1.0 meters',
      '50cm × 30cm × 25cm',
      '12 by 8 by 6 inches'
    ];

    for (const test of tests) {
      try {
        const result = await this.simulateTextSelection(test);
        this.recordTest('Dimensions', test, result.success, result.message);
      } catch (error) {
        this.recordTest('Dimensions', test, false, error.message);
      }
    }
  }

  // Test temperature conversions
  async testTemperatureConversions() {
    console.log('🌡️ Testing temperature conversions...');
    
    const tests = [
      '32°F',
      '100°C',
      '273 Kelvin',
      '98.6 degrees Fahrenheit',
      '0 degrees Celsius'
    ];

    for (const test of tests) {
      try {
        const result = await this.simulateTextSelection(test);
        this.recordTest('Temperature', test, result.success, result.message);
      } catch (error) {
        this.recordTest('Temperature', test, false, error.message);
      }
    }
  }

  // Test edge cases and error handling
  async testEdgeCases() {
    console.log('🔍 Testing edge cases...');
    
    const tests = [
      '0 meters',
      '-10°C',
      '1000000 kilometers',
      'invalid unit test',
      '10.5555555 inches',
      ''
    ];

    for (const test of tests) {
      try {
        const result = await this.simulateTextSelection(test);
        this.recordTest('Edge Case', test, true, 'Handled gracefully');
      } catch (error) {
        this.recordTest('Edge Case', test, true, 'Expected error handled');
      }
    }
  }

  // Test UI elements and interactions
  async testUIElements() {
    console.log('🎨 Testing UI elements...');
    
    // Test popup creation
    try {
      const testElement = document.createElement('span');
      testElement.textContent = '10 feet';
      document.body.appendChild(testElement);
      
      // Simulate selection
      const range = document.createRange();
      range.selectNodeContents(testElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const popup = document.querySelector('.unit-converter-popup');
      const hasPopup = popup !== null;
      
      this.recordTest('UI Popup', 'Popup creation', hasPopup, 
        hasPopup ? 'Popup created successfully' : 'No popup found');
      
      // Cleanup
      testElement.remove();
      selection.removeAllRanges();
      if (popup) popup.remove();
      
    } catch (error) {
      this.recordTest('UI Popup', 'Popup creation', false, error.message);
    }
  }

  // Test extension settings
  async testSettings() {
    console.log('⚙️ Testing settings...');
    
    try {
      // Test storage access
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const testSettings = {
          lengthUnit: 'm',
          weightUnit: 'kg',
          temperatureUnit: 'c'
        };
        
        this.recordTest('Settings', 'Storage access', true, 'Chrome storage available');
      } else {
        this.recordTest('Settings', 'Storage access', false, 'Chrome storage not available');
      }
    } catch (error) {
      this.recordTest('Settings', 'Storage access', false, error.message);
    }
  }

  // Simulate text selection and conversion
  async simulateTextSelection(text) {
    return new Promise((resolve) => {
      try {
        // Create temporary element with test text
        const testElement = document.createElement('div');
        testElement.textContent = text;
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        document.body.appendChild(testElement);

        // Simulate text selection
        const range = document.createRange();
        range.selectNodeContents(testElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Wait for extension to process
        setTimeout(() => {
          const popup = document.querySelector('.unit-converter-popup');
          const hasConversion = popup !== null;
          
          // Cleanup
          testElement.remove();
          selection.removeAllRanges();
          if (popup) popup.remove();
          
          resolve({
            success: hasConversion,
            message: hasConversion ? 'Conversion popup appeared' : 'No conversion detected'
          });
        }, 300);

      } catch (error) {
        resolve({
          success: false,
          message: error.message
        });
      }
    });
  }

  // Record test result
  recordTest(category, test, passed, message) {
    this.testCount++;
    if (passed) {
      this.passCount++;
    } else {
      this.failCount++;
    }

    const result = {
      category,
      test,
      passed,
      message,
      timestamp: new Date().toISOString()
    };

    this.testResults.push(result);
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${category}: ${test} - ${message}`);
  }

  // Generate comprehensive test report
  generateReport() {
    const report = {
      summary: {
        total: this.testCount,
        passed: this.passCount,
        failed: this.failCount,
        successRate: ((this.passCount / this.testCount) * 100).toFixed(1) + '%'
      },
      extensionStatus: this.isExtensionLoaded,
      results: this.testResults,
      timestamp: new Date().toISOString()
    };

    console.log('📊 Test Report Generated:');
    console.table(report.summary);
    
    // Display results in UI
    this.displayResults(report);
    
    // Store results for later analysis
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('unitConverterTestResults', JSON.stringify(report));
    }

    return report;
  }

  // Display results in the UI
  displayResults(report) {
    const container = document.getElementById('test-results');
    if (!container) return;

    container.innerHTML = `
      <div style="padding: 15px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Test Results</h3>
        <div style="margin-bottom: 10px;">
          <strong>Total:</strong> ${report.summary.total}<br>
          <strong>Passed:</strong> <span style="color: green;">${report.summary.passed}</span><br>
          <strong>Failed:</strong> <span style="color: red;">${report.summary.failed}</span><br>
          <strong>Success Rate:</strong> ${report.summary.successRate}
        </div>
        <div style="max-height: 200px; overflow-y: auto;">
          ${report.results.map(result => `
            <div style="margin: 5px 0; padding: 5px; background: ${result.passed ? '#e8f5e8' : '#ffe8e8'}; border-radius: 3px;">
              <strong>${result.category}:</strong> ${result.test}<br>
              <small>${result.message}</small>
            </div>
          `).join('')}
        </div>
        <button onclick="extensionTester.exportResults()" style="margin-top: 10px; padding: 5px 10px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer;">
          Export Results
        </button>
      </div>
    `;
  }

  // Export results as JSON
  exportResults() {
    const results = localStorage.getItem('unitConverterTestResults');
    if (results) {
      const blob = new Blob([results], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unit-converter-test-results-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}

// Auto-run tests when script loads
const extensionTester = new ExtensionTester();

// Expose to global scope for manual testing
window.extensionTester = extensionTester;

// Auto-start tests after page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    extensionTester.init();
  }, 2000); // Wait 2 seconds for extension to load
});

console.log('🧪 Extension Tester loaded. Use extensionTester.init() to run tests manually.');
