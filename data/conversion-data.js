// Unit conversion data and constants
// This file contains all the conversion ratios, patterns, and aliases

// Global namespace for unit converter data
window.UnitConverterData = window.UnitConverterData || {};

window.UnitConverterData.CONVERSION_RATIOS = {
  length: {
    m: 1,
    cm: 100,
    mm: 1000,
    km: 0.001,
    in: 39.3701,
    ft: 3.28084,
    yd: 1.09361,
    mi: 0.000621371
  },  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274,
    t: 0.001
  },
  temperature: {
    c: (val) => val,
    f: (val) => (val * 9/5) + 32,
    k: (val) => val + 273.15
  },
  volume: {
    l: 1,
    ml: 1000,
    gal: 0.264172,
    qt: 1.05669,
    pt: 2.11338,
    cup: 4.22675,
    fl_oz: 33.814
  },
  area: {
    m2: 1,
    cm2: 10000,
    mm2: 1000000,
    km2: 0.000001,
    ft2: 10.7639,
    in2: 1550,
    acre: 0.000247105
  },
  speed: {
    'ms': 1,
    'kmh': 0.277778,
    'mph': 0.44704,
    'fps': 0.3048,
    'kn': 0.514444,
    'mach': 343
  },
  torque: {
    'nm': 1,
    'lbft': 1.35582,
    'lbin': 0.112985,
    'kgm': 9.80665,
    'kgfm': 9.80665, // kilogram-force meter
    'ozin': 0.00706155
  },
  pressure: {
    'pa': 1,
    'bar': 100000,
    'psi': 6894.76,
    'atm': 101325,
    'mmhg': 133.322,
    'inhg': 3386.39, // inches of mercury
    'torr': 133.322,
    'kpa': 1000,
    'mpa': 1000000,
    'psf': 47.8803 // pounds per square foot
  },
  timezone: {
    // Timezone handling is special - uses offset calculation
    'utc': (date, offset) => new Date(date.getTime() + (offset * 60000)),
    'gmt': (date, offset) => new Date(date.getTime() + (offset * 60000))
  }
};

window.UnitConverterData.UNIT_PATTERNS = {
  length: /\b(\d+(?:\.\d+)?)\s*-?\s*(m|cm|mm|km|in|inch|inches|ft|foot|feet|yd|yard|yards|mi|mile|miles|meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers)\b/gi,
  weight: /\b(\d+(?:\.\d+)?)\s*(kg|g|mg|lb(?![\s\.\-⋅\/]*(?:ft|foot|feet|in|inch|inches))|lbs|oz(?![\s\.\-⋅\/]*(?:in|inch|inches))|ounce|ounces|pound(?![\s\-]*(?:foot|feet|inch|inches))|pounds(?![\s\-]*(?:foot|feet|inch|inches))|kilogram|kilograms|gram|grams|milligram|milligrams|tonne|tonnes|t)\b/gi,
  temperature: /\b(\d+(?:\.\d+)?)\s*°?\s*(c|f|k|celsius|fahrenheit|kelvin|degrees?\s*celsius|degrees?\s*fahrenheit)\b/gi,
  volume: /\b(\d+(?:\.\d+)?)\s*(l|ml|gal|gallon|gallons|qt|quart|quarts|pt|pint|pints|cup|cups|fl\s*oz|fluid\s*ounce|fluid\s*ounces|liter|liters|milliliter|milliliters)\b/gi,
  area: /(\d+(?:\.\d+)?)\s*-?\s*(m²|cm²|mm²|km²|ft²|in²|m2|cm2|mm2|km2|ft2|in2|acre|acres|square\s*meter|square\s*meters|square\s*centimeter|square\s*centimeters|square\s*millimeter|square\s*millimeters|square\s*kilometer|square\s*kilometers|square\s*foot|square\s*feet|square\s*inch|square\s*inches|meters?\s*squared|meter\s*squared|feet\s*squared|foot\s*squared|inches?\s*squared|inch\s*squared|centimeters?\s*squared|centimeter\s*squared|millimeters?\s*squared|millimeter\s*squared|kilometers?\s*squared|kilometer\s*squared)(?!\w)/gi,
  // Two dimension patterns: with units on each number, and with unit at the end
  dimensionsWithUnits: /(\d+(?:\.\d+)?)\s*(m|cm|mm|km|in|inch|inches|ft|foot|feet|yd|yard|yards|mi|mile|miles|meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers)\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*\2\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*\2/gi,
  dimensions: /(\d+(?:\.\d+)?)\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*-?\s*(m|cm|mm|km|in|inch|inches|ft|foot|feet|yd|yard|yards|mi|mile|miles|meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers)\b/gi,
  speed: /\b(\d+(?:\.\d+)?)\s*-?\s*(m\/s|ms|km\/h|kmh|km\/hr|mph|mi\/h|ft\/s|fps|knots?|kn|nautical\s*miles?\s*per\s*hour|mach|meters?\s*per\s*second|kilometers?\s*per\s*hour|miles?\s*per\s*hour|feet\s*per\s*second)\b/gi,
  torque: /\b(\d+(?:\.\d+)?)\s*-?\s*(N[\s\.\-⋅]?m|Nm|lb[\s\.\-⋅]?ft|lbft|ft[\s\.\-⋅]?lbs?|lb[\s\.\-⋅]?in|lbin|in[\s\.\-⋅]?lbs?|kg[\s\.\-⋅]?m|kgm|kgf[\s\.\-⋅]?m|oz[\s\.\-⋅]?in|ozin|newton[\s\-]?meters?|pound[\s\-]?feet|foot[\s\-]?pounds?|pound[\s\-]?inches?|inch[\s\-]?pounds?|kilogram[\s\-]?force[\s\-]?meters?)\b/gi,
  pressure: /\b(\d+(?:\.\d+)?)\s*-?\s*(Pa|bar|psi|atm|mmHg|inHg|torr|kPa|MPa|psf|pascal|atmosphere|atmospheres|pounds?\s*per\s*square\s*inch|pounds?\s*per\s*square\s*foot|millimeters?\s*of\s*mercury|inches?\s*of\s*mercury)\b/gi,
  timezone: /\b(\d{1,2}):(\d{2})\s*(AM|PM)?\s*((EST|PST|CST|MST|GMT|UTC|JST|CET|EET|WET|BST|EASTERN|PACIFIC|CENTRAL|MOUNTAIN)([+-]\d{1,2})?|([+-]\d{1,2}):?(\d{2})?)/gi,
  // Currency pattern will be generated dynamically from currency mappings
  currency: null  // Will be set after currency mappings are loaded
};

window.UnitConverterData.UNIT_ALIASES = {
  // Length aliases
  'inch': 'in', 'inches': 'in',
  'foot': 'ft', 'feet': 'ft',
  'yard': 'yd', 'yards': 'yd',
  'mile': 'mi', 'miles': 'mi',
  'meter': 'm', 'meters': 'm',
  'centimeter': 'cm', 'centimeters': 'cm',
  'millimeter': 'mm', 'millimeters': 'mm',
  'kilometer': 'km', 'kilometers': 'km',
    // Weight aliases
  'kilogram': 'kg', 'kilograms': 'kg',
  'gram': 'g', 'grams': 'g',
  'milligram': 'mg', 'milligrams': 'mg',
  'pound': 'lb', 'pounds': 'lb', 'lbs': 'lb',
  'ounce': 'oz', 'ounces': 'oz',
  'tonne': 't', 'tonnes': 't',
  
  // Temperature aliases
  'celsius': 'c', 'fahrenheit': 'f', 'kelvin': 'k',
  'degrees celsius': 'c', 'degrees fahrenheit': 'f', 
  'degree celsius': 'c', 'degree fahrenheit': 'f',
  
  // Volume aliases
  'liter': 'l', 'liters': 'l',
  'milliliter': 'ml', 'milliliters': 'ml',
  'gallon': 'gal', 'gallons': 'gal',
  'quart': 'qt', 'quarts': 'qt',
  'pint': 'pt', 'pints': 'pt',
  'cup': 'cup', 'cups': 'cup',
  'fl oz': 'fl_oz', 'fluid ounce': 'fl_oz', 'fluid ounces': 'fl_oz',  
  // Area aliases
  'square meter': 'm2', 'square meters': 'm2',
  'square centimeter': 'cm2', 'square centimeters': 'cm2',
  'square millimeter': 'mm2', 'square millimeters': 'mm2',
  'square kilometer': 'km2', 'square kilometers': 'km2',
  'square foot': 'ft2', 'square feet': 'ft2',
  'square inch': 'in2', 'square inches': 'in2',
  'meters squared': 'm2', 'meter squared': 'm2',
  'feet squared': 'ft2', 'foot squared': 'ft2',
  'inches squared': 'in2', 'inch squared': 'in2',
  'centimeters squared': 'cm2', 'centimeter squared': 'cm2',
  'millimeters squared': 'mm2', 'millimeter squared': 'mm2',
  'kilometers squared': 'km2', 'kilometer squared': 'km2',
  'acre': 'acre', 'acres': 'acre',
  // Unicode area symbols
  'm²': 'm2', 'cm²': 'cm2', 'mm²': 'mm2', 'km²': 'km2',
  'ft²': 'ft2', 'in²': 'in2',
  
  // Speed aliases
  'm/s': 'ms', 'meters per second': 'ms', 'meter per second': 'ms',
  'km/h': 'kmh', 'km/hr': 'kmh', 'kilometers per hour': 'kmh', 'kilometer per hour': 'kmh',
  'miles per hour': 'mph', 'mile per hour': 'mph', 'mi/h': 'mph',
  'ft/s': 'fps', 'feet per second': 'fps', 'foot per second': 'fps',
  'knot': 'kn', 'knots': 'kn', 'nautical miles per hour': 'kn', 'nautical mile per hour': 'kn',
  
  // Torque aliases
  'n.m': 'nm', 'n·m': 'nm', 'n⋅m': 'nm', 'n-m': 'nm', 'newton meter': 'nm', 'newton meters': 'nm', 'newton-meters': 'nm', 'newton-meter': 'nm',
  'lb.ft': 'lbft', 'lb·ft': 'lbft', 'lb⋅ft': 'lbft', 'lb-ft': 'lbft', 'pound foot': 'lbft', 'pound feet': 'lbft', 'pound-feet': 'lbft', 'pound-foot': 'lbft',
  'foot pound': 'lbft', 'foot pounds': 'lbft', 'foot-pounds': 'lbft', 'foot-pound': 'lbft', 'ft-lbs': 'lbft', 'ft⋅lbs': 'lbft',
  'lb.in': 'lbin', 'lb·in': 'lbin', 'lb⋅in': 'lbin', 'lb-in': 'lbin', 'pound inch': 'lbin', 'pound inches': 'lbin', 'pound-inches': 'lbin', 'pound-inch': 'lbin',
  'in-lbs': 'lbin', 'inch-pounds': 'lbin', 'inch-pound': 'lbin', 'inch pounds': 'lbin', 'inch pound': 'lbin',
  'kg.m': 'kgm', 'kg·m': 'kgm', 'kg⋅m': 'kgm', 'kg-m': 'kgm', 'kilogram meter': 'kgm', 'kilogram meters': 'kgm',
  'kgf.m': 'kgfm', 'kgf·m': 'kgfm', 'kgf⋅m': 'kgfm', 'kgf-m': 'kgfm', 'kilogram force meter': 'kgfm', 'kilogram force meters': 'kgfm', 'kilogram-force meters': 'kgfm', 'kilogram-force meter': 'kgfm',
  'oz.in': 'ozin', 'oz·in': 'ozin', 'oz⋅in': 'ozin', 'oz-in': 'ozin', 'ounce inch': 'ozin', 'ounce inches': 'ozin',
  
  // Pressure aliases
  'pascal': 'pa', 'pascals': 'pa',
  'atmosphere': 'atm', 'atmospheres': 'atm',
  'pounds per square inch': 'psi', 'pound per square inch': 'psi',
  'pounds per square foot': 'psf', 'pound per square foot': 'psf',
  'millimeters of mercury': 'mmhg', 'millimeter of mercury': 'mmhg',
  'inches of mercury': 'inhg', 'inch of mercury': 'inhg', 'inhg': 'inhg',
  'mm Hg': 'mmhg', 'mmhg': 'mmhg',
  'in Hg': 'inhg', 'inHg': 'inhg',
  'kilopascal': 'kpa', 'kilopascals': 'kpa', 'kPa': 'kpa',
  'megapascal': 'mpa', 'megapascals': 'mpa', 'MPa': 'mpa'
};

window.UnitConverterData.DEFAULT_UNITS = {
  length: 'm',
  weight: 'kg',
  temperature: 'c',
  volume: 'l',
  area: 'm2',
  speed: 'ms',
  torque: 'nm',
  pressure: 'pa',
  timezone: 'auto', // Will be auto-detected
  currency: 'usd'
};

window.UnitConverterData.AREA_TO_LINEAR_MAP = {
  'm2': 'm', 
  'cm2': 'cm', 
  'mm2': 'mm', 
  'km2': 'km',
  'ft2': 'ft', 
  'in2': 'in'
};

// Timezone mappings for common timezone abbreviations
window.UnitConverterData.TIMEZONE_MAPPINGS = {
  // US Timezones
  'PST': -8, 'PDT': -7, 'PT': -8, 'PACIFIC': -8,
  'MST': -7, 'MDT': -6, 'MT': -7, 'MOUNTAIN': -7,
  'CST': -6, 'CDT': -5, 'CT': -6, 'CENTRAL': -6,
  'EST': -5, 'EDT': -4, 'ET': -5, 'EASTERN': -5,
  
  // International
  'UTC': 0, 'GMT': 0,
  'CET': 1, 'CEST': 2,
  'EET': 2, 'EEST': 3,
  'WET': 0, 'WEST': 1,
  'JST': 9, 'KST': 9,
  'IST': 5.5, 'BST': 1,
  'AEST': 10, 'AEDT': 11,
  'NZST': 12, 'NZDT': 13,
  
  // Additional common zones
  'AST': -4, 'ADT': -3,
  'NST': -3.5, 'NDT': -2.5,
  'HST': -10, 'AKST': -9, 'AKDT': -8
};

/**
 * Get user's current timezone offset
 */
window.UnitConverterData.getUserTimezone = function() {
  const offset = -(new Date().getTimezoneOffset() / 60);
  return offset;
};

/**
 * Get timezone name from offset
 */
window.UnitConverterData.getTimezoneFromOffset = function(offset) {
  for (const [tz, tz_offset] of Object.entries(window.UnitConverterData.TIMEZONE_MAPPINGS)) {
    if (tz_offset === offset) {
      return tz;
    }
  }
  return `UTC${offset >= 0 ? '+' : ''}${offset}`;
};

/**
 * Generate currency regex pattern from currency mappings
 * This ensures all currencies and symbols are covered automatically
 */
window.UnitConverterData.generateCurrencyPattern = function() {
  // Wait for currency mappings to be loaded
  if (!window.currencySymbolToCurrencyCode) {
    return null;
  }
  
  // Extract all currency symbols and codes
  const symbols = Object.keys(window.currencySymbolToCurrencyCode);
  
  // Escape special regex characters
  const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  // Sort by length (longest first) to prevent shorter patterns from matching first
  const sortedSymbols = symbols.sort((a, b) => b.length - a.length);
  
  // Escape and join all symbols
  const escapedSymbols = sortedSymbols.map(escapeRegex).join('|');
  
  // Create the complete pattern
  // Matches: symbol + number OR number + symbol
  const pattern = new RegExp(
    `(?:(?:^|\\s)(${escapedSymbols})(?=\\s*\\d)\\s*(\\d+(?:[.,\\d' \\s]*\\d)?)|` +
    `(\\d+(?:[.,\\d' \\s]*\\d)?)\\s*(${escapedSymbols})(?=\\s|$))`,
    'gi'
  );
  
  return pattern;
};

/**
 * Initialize currency pattern after mappings are loaded
 */
window.UnitConverterData.initializeCurrencyPattern = function() {
  const pattern = window.UnitConverterData.generateCurrencyPattern();
  if (pattern) {
    window.UnitConverterData.UNIT_PATTERNS.currency = pattern;
    console.log('Currency pattern initialized with', Object.keys(window.currencySymbolToCurrencyCode || {}).length, 'symbols');
  }
};