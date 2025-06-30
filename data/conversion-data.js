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
  }
};

window.UnitConverterData.UNIT_PATTERNS = {
  length: /\b(\d+(?:\.\d+)?)\s*-?\s*(m|cm|mm|km|in|inch|inches|ft|foot|feet|yd|yard|yards|mi|mile|miles|meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers)\b/gi,
  weight: /\b(\d+(?:\.\d+)?)\s*(kg|g|mg|lb|lbs|oz|ounce|ounces|pound|pounds|kilogram|kilograms|gram|grams|milligram|milligrams|tonne|tonnes|t)\b/gi,
  temperature: /\b(\d+(?:\.\d+)?)\s*°?\s*(c|f|k|celsius|fahrenheit|kelvin|degrees?\s*celsius|degrees?\s*fahrenheit)\b/gi,
  volume: /\b(\d+(?:\.\d+)?)\s*(l|ml|gal|gallon|gallons|qt|quart|quarts|pt|pint|pints|cup|cups|fl\s*oz|fluid\s*ounce|fluid\s*ounces|liter|liters|milliliter|milliliters)\b/gi,
  area: /(\d+(?:\.\d+)?)\s*-?\s*(m²|cm²|mm²|km²|ft²|in²|m2|cm2|mm2|km2|ft2|in2|acre|acres|square\s*meter|square\s*meters|square\s*centimeter|square\s*centimeters|square\s*millimeter|square\s*millimeters|square\s*kilometer|square\s*kilometers|square\s*foot|square\s*feet|square\s*inch|square\s*inches|meters?\s*squared|meter\s*squared|feet\s*squared|foot\s*squared|inches?\s*squared|inch\s*squared|centimeters?\s*squared|centimeter\s*squared|millimeters?\s*squared|millimeter\s*squared|kilometers?\s*squared|kilometer\s*squared)(?!\w)/gi,
  // Two dimension patterns: with units on each number, and with unit at the end
  dimensionsWithUnits: /(\d+(?:\.\d+)?)\s*(m|cm|mm|km|in|inch|inches|ft|foot|feet|yd|yard|yards|mi|mile|miles|meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers)\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*\2\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*\2/gi,
  dimensions: /(\d+(?:\.\d+)?)\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*(?:x|×|by|\*)\s*(\d+(?:\.\d+)?)\s*-?\s*(m|cm|mm|km|in|inch|inches|ft|foot|feet|yd|yard|yards|mi|mile|miles|meter|meters|centimeter|centimeters|millimeter|millimeters|kilometer|kilometers)\b/gi,
  // Currency patterns based on Currency-Converter-master: major symbols + amounts
  // This pattern matches currency symbols followed by numbers or numbers followed by currency symbols
  // Supports various number formats including commas, dots, apostrophes, and spaces as separators
  // Added word boundaries to prevent false matches in identifiers
  currency: /(?:(?:^|\s)(\$|€|£|¥|₹|₽|¢|₩|₦|₡|₪|₱|₫|₴|₵|₨|₭|₲|₸|₼|₺|₾|₿|¤|﷼|؋|֏|ƒ|Kz|Dhs?|Af|Lek|ден|som|៛|₮|UM|Rf|MVR|ރ|K|RM|MT|MTn|N\$|B\/\.|S\/|Q|G|L|Ft|Rp|RI|J\$|KD|CI\$|LD\$|M|DH|Ar|den|Ks|UM|Rf|zł|Lei|Leu|QR|R\.O|₦|₾|₼|₺|₸|₲|₭|₨|₵|₴|₫|₱|₪|₡|CAD|AUD|USD|EUR|GBP|JPY|CHF|SEK|NOK|DKK|PLN|CZK|HUF|RON|BGN|HRK|RSD|BAM|MKD|ALL|ISK|د\.ب|د\.ك|ر\.س|د\.إ|ر\.ق)(?=\s*\d)\s*(\d+(?:[.,\d' \s]*\d)?)|(\d+(?:[.,\d' \s]*\d)?)\s*(\$|€|£|¥|₹|₽|¢|₩|₦|₡|₪|₱|₫|₴|₵|₨|₭|₲|₸|₼|₺|₾|₿|¤|﷼|؋|֏|ƒ|Kz|Dhs?|Af|Lek|ден|som|៛|₮|UM|Rf|MVR|ރ|K|RM|MT|MTn|N\$|B\/\.|S\/|Q|G|L|Ft|Rp|RI|J\$|KD|CI\$|LD\$|M|DH|Ar|den|Ks|UM|Rf|zł|Lei|Leu|QR|R\.O|₦|₾|₼|₺|₸|₲|₭|₨|₵|₴|₫|₱|₪|₡|CAD|AUD|USD|EUR|GBP|JPY|CHF|SEK|NOK|DKK|PLN|CZK|HUF|RON|BGN|HRK|RSD|BAM|MKD|ALL|ISK|د\.ب|د\.ك|ر\.س|د\.إ|ر\.ق)(?=\s|$))/gi
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
  'ft²': 'ft2', 'in²': 'in2'
};

window.UnitConverterData.DEFAULT_UNITS = {
  length: 'm',
  weight: 'kg',
  temperature: 'c',
  volume: 'l',
  area: 'm2',
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