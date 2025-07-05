# Contributing to Universal Converter

Thank you for your interest in contributing to Universal Converter! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style and Standards](#code-style-and-standards)
- [Testing Requirements](#testing-requirements)
- [Submitting Changes](#submitting-changes)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Architecture Overview](#architecture-overview)
- [Adding New Units or Currencies](#adding-new-units-or-currencies)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Chrome browser for testing
- Basic knowledge of JavaScript, Chrome Extensions API
- Git for version control

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/Universal-Converter.git
   cd Universal-Converter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Load Extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project folder

4. **Run Tests**
   ```bash
   npm test
   ```

## Code Style and Standards

### JavaScript Style Guidelines

- Use ES6+ features where appropriate
- Prefer `const` and `let` over `var`
- Use meaningful variable and function names
- Add JSDoc comments for all public functions 
- Keep functions small and focused (single responsibility)

### Example Function Documentation

```javascript
/**
 * Convert a value from one unit to another
 * @param {number} value - The numeric value to convert
 * @param {string} fromUnit - Source unit abbreviation
 * @param {string} toUnit - Target unit abbreviation
 * @returns {number|null} - Converted value or null if conversion fails
 */
function convertUnit(value, fromUnit, toUnit) {
  // Implementation
}
```

### File Organization

- **Core Logic**: Place in `utils/` directory
- **Data Files**: Place in `data/` directory
- **Tests**: Place in `tests/` directory
- **Settings UI Components**: Place in `settings-page/` directory

## Testing Requirements

All contributions must include appropriate tests and pass existing test suites.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test categories
node tests/test-runner.js

# Validate extension structure
npm run validate

# Test in browser environment
# Open tests/test.html in Chrome
```

### Test Categories

1. **Unit Tests**: Core conversion logic
2. **Integration Tests**: Component interaction
3. **Pattern Tests**: Regex pattern matching
4. **Currency Tests**: Currency detection and conversion
5. **Edge Case Tests**: Boundary conditions and error handling

### Writing Tests

When adding new functionality, include tests that cover:

- Normal operation cases
- Edge cases and boundary conditions
- Error conditions
- Regression prevention

Example test structure:
```javascript
// Test case example
{
  input: "100 cm",
  expectedUnit: "cm",
  expectedValue: 100,
  expectedTargetUnit: "m",
  description: "Basic centimeter to meter conversion"
}
```

## Submitting Changes

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code style guidelines
   - Add/update tests as needed
   - Update documentation if applicable

3. **Test Thoroughly**
   ```bash
   npm test
   npm run validate
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add description of your feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commit format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test additions or modifications
- `refactor:` Code refactoring
- `style:` Code style changes
- `chore:` Maintenance tasks

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Commit messages are clear and conventional
- [ ] PR description explains changes clearly
- [ ] No breaking changes (or clearly documented)

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Chrome version
   - Operating system
   - Extension version

2. **Steps to Reproduce**
   - Clear steps
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Test Cases**
   - Specific text that fails to convert
   - User settings at time of issue

## Feature Requests

### Before Submitting

- Check existing issues for similar requests
- Consider if the feature fits the extension's scope
- Think about implementation complexity and maintenance

## Architecture Overview

### Core Components

1. **Content Script** (`content.js`)
   - Main orchestrator
   - Handles text selection events
   - Manages popup display

2. **Conversion Detector** (`utils/conversion-detector.js`)
   - Pattern matching and detection
   - Determines conversion type (unit, currency, dimension)

3. **Unit Converter** (`utils/unit-converter.js`)
   - Core conversion logic
   - Unit normalization and calculation

4. **Currency Converter** (`utils/currency-converter.js`)
   - Currency detection and conversion
   - Exchange rate integration

5. **Data Files** (`data/`)
   - Conversion ratios and patterns
   - Currency mappings and symbols

### Data Flow

1. User selects text
2. ConversionDetector analyzes text
3. Appropriate converter processes the conversion
4. PopupManager displays result
5. SettingsManager applies user preferences

## Adding New Units or Currencies

### Adding New Units

1. **Update Conversion Data** (`data/conversion-data.js`)
   ```javascript
   // Add to appropriate category
   window.UnitConverterData.CONVERSION_RATIOS = {
     length: {
       // existing units...
       newunit: ratioToBaseUnit
     }
   };
   
   // Add to pattern regex
   // Add to aliases if needed
   ```

2. **Add Tests**
   ```javascript
   // Add test cases to tests/test-cases.js
   {
     input: "10 newunit",
     expectedConversion: true,
     expectedType: "length"
   }
   ```

### Adding New Currencies

1. **Update Currency Mappings** (`data/currency-mappings.js`)
   ```javascript
   // Add to symbol mapping
   const currencySymbolToCurrencyCode = {
     // existing mappings...
     'NEWSYMBOL': 'NEWCODE'
   };
   ```

2. **Currency Pattern Auto-Updates**
   - The regex pattern is dynamically generated
   - No manual pattern updates needed

3. **Test the Currency**
   ```javascript
   // Add to currency test cases
   {
     text: "100 NEWSYMBOL",
     expectedCurrency: "NEWCODE",
     expectedAmount: 100
   }
   ```

## Questions and Support

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion
- **Documentation**: Check existing documentation in `/tests/TESTING.md`

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment for all contributors
- Follow GitHub's Community Guidelines

## License

By contributing to Universal Converter, you agree that your contributions will be licensed under the same MIT License that covers the project.