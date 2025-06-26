// Currency conversion utilities using Currency-Converter-master logic
// This file integrates the currency detection and conversion logic from Currency-Converter-master

// Global namespace for currency converter
window.UnitConverter = window.UnitConverter || {};

// Import currency mappings from Currency-Converter-master
const currencySymbolToCurrencyCode = {
    'Dhs': 'AED',
    'Dh': 'AED',
    'د.إ': 'AED',
    'Af': 'AFN',
    'Afs': 'AFN',
    '؋': 'AFN',
    'Lek': 'ALL',
    '֏': 'AMD',
    'ƒ': 'ANG',
    'NAƒ': 'ANG',
    'NAf': 'ANG',
    'f': 'ANG',
    'Kz': 'AOA',
    '$': ['USD', 'ARS', 'AUD', 'BBD', 'BMD', 'BND', 'BZD', 'CAD', 'CLP', 'COP', 'CUP', 'DOP', 'FJD', 'GYD', 'HKD', 'JMD', 'KYD', 'LRD', 'MOP', 'MXN', 'NAD', 'NIO', 'NZD', 'SBD', 'SGD', 'SRD', 'TTD', 'TWD', 'XCD'],
    'Arg$': 'ARS',
    'Au$': 'AUD',
    'A$': 'AUD',
    'Afl': 'AWG',
    '₼': 'AZN',
    'KM': 'BAM',
    'BB$': 'BBD',
    'BBD$': 'BBD',
    'BDS$': 'BBD',
    '৳': 'BDT',
    'лв': 'BGN',
    'lv': 'BGN',
    'د.ب': 'BHD',
    'BD': 'BHD',
    'B.D.': 'BHD',
    'BHD': 'BHD',
    'bd': 'BHD',
    'FBu': 'BIF',
    'BD$': 'BMD',
    'B$': 'BND',
    'Bs': 'BOB',
    'R$': 'BRL',
    'Nu': 'BTN',
    'P': 'BWP',
    'Br': [ 'BYN', 'ETB' ],
    'BZ$': 'BZD',
    'CA$': 'CAD',
    'Can$': 'CAD',
    'C$': [ 'CAD', 'NIO' ],
    'FC': [ 'CDF', 'KMF' ],
    '₣': 'CHF',
    'CHF': 'CHF',
    'CLP$': 'CLP',
    '¥': [ 'JPY', 'CNY' ],
    '円': 'JPY',
    'CN¥': 'CNY',
    'Col$': 'COP',
    '₡': 'CRC',
    '$MN': 'CUP',
    'Esc': 'CVE',
    'Kč': 'CZK',
    'Fdj': 'DJF',
    'kr': [ 'DKK', 'ISK', 'NOK', 'SEK' ],
    'RD$': 'DOP',
    'دج': 'DZD',
    'DA': 'DZD',
    '.ج.م': 'EGP',
    'E£': 'EGP',
    '£E': 'EGP',
    'LE': 'EGP',
    'EGP': 'EGP',
    'ናቕፋ': 'ERN',
    'ناكفا': 'ERN',
    'Nkf': 'ERN',
    'ብር': 'ETB',
    '€': 'EUR',
    'FJ$': 'FJD',
    '£': 'GBP',
    '₾': 'GEL',
    'ლ': 'GEL',
    'GH₵': 'GHS',
    'GH¢': 'GHS',
    'D': 'GMD',
    'FG': 'GNF',
    'Fr': 'GNF',
    'GFr': 'GNF',
    'Q': 'GTQ',
    'G$': 'GYD',
    'GY$': 'GYD',
    'HK$': 'HKD',
    '元': 'HKD',
    'L': [ 'HNL', 'MDL' ],
    'G': 'HTG',
    'Ft': 'HUF',
    'Rp': 'IDR',
    '₪': 'ILS',
    '₹': 'INR',
    'د.ع': 'IQD',
    'ID': 'IQD',
    '﷼': [ 'IRR', 'OMR', 'YER' ],
    'RI': 'IRR',
    'J$': 'JMD',
    'د.أ': 'JOD',
    'KSh': 'KES',
    '⃀': 'KGS',
    'сом': 'KGS',
    'som': 'KGS',
    '៛': 'KHR',
    '₩': 'KRW',
    'د.ك': 'KWD',
    'KD': 'KWD',
    'CI$': 'KYD',
    '₸': 'KZT',
    '₭': 'LAK',
    '₭N': 'LAK',
    'ل.ل': 'LBP',
    'LL': 'LBP',
    'රු': 'LKR',
    '௹': 'LKR',
    'Rs': [ 'LKR', 'MUR', 'PKR' ],
    'Re': 'LKR',
    'L$': 'LRD',
    'LD$': 'LRD',
    'M': 'LSL',
    'ل.د': 'LYD',
    'LD': 'LYD',
    'DH': 'MAD',
    'Ar': 'MGA',
    'ден': 'MKD',
    'den': 'MKD',
    'Ks': 'MMK',
    '₮': 'MNT',
    'MOP$': 'MOP',
    'UM': 'MRU',
    'Rf': 'MVR',
    'MVR': 'MVR',
    'ރ': 'MVR',
    'K': [ 'MWK', 'PGK', 'ZMW' ],
    'Mex$': 'MXN',
    'RM': 'MYR',
    'MT': 'MZN',
    'MTn': 'MZN',
    'N$': 'NAD',
    '₦': 'NGN',
    'रू': 'NPR',
    'NZ$': 'NZD',
    '$NZ': 'NZD',
    'ر.ع.': 'OMR',
    ' R.O': 'OMR',
    'B/.': 'PAB',
    'S/': 'PEN',
    '₱': 'PHP',
    'zł': 'PLN',
    '₲': 'PYG',
    'ر.ق': 'QAR',
    'QR': 'QAR',
    'Leu': 'RON',
    'Lei': 'RON',
    'РСД': 'RSD',
    'DIN': 'RSD',
    '₽': 'RUB',
    'FRw': 'RWF',
    'RF': 'RWF',
    'R₣': 'RWF',
    'ر.س': 'SAR',
    'SAR': 'SAR',
    'SR': [ 'SAR', 'SCR' ],
    'SI$': 'SBD',
    'ج.س': 'SDG',
    'LS': [ 'SDG', 'SYP' ],
    'S$': 'SGD',
    'Le': 'SLE',
    'Sh.So': 'SOS',
    'Sur$': 'SRD',
    'SSP': 'SSP',
    'Db': 'STN',
    'ل.س': 'SYP',
    'SP': 'SYP',
    'E': 'SZL',
    '฿': 'THB',
    'SM': 'TJS',
    'm': 'TMT',
    'د.ت': 'TND',
    'DT': 'TND',
    'T$': 'TOP',
    'PT': 'TOP',
    '₺': 'TRY',
    'TT$': 'TTD',
    'NT$': 'TWD',
    'NT': 'TWD',
    'TSh': 'TZS',
    '₴': 'UAH',
    'USh': 'UGX',
    'US$': 'USD',
    'U$': 'USD',
    '$U': 'UYU',
    'soʻm': 'UZS',
    'Bs.S': 'VES',
    '₫': 'VND',
    'VT': 'VUV',
    'WS$': 'WST',
    'SAT': 'WST',
    'ST': 'WST',
    'T': 'WST',
    'F.CFA': [ 'XAF', 'XOF' ],
    'EC$': 'XCD',
    'F': 'XPF',
    'R': 'ZAR',
    'ZK': 'ZMW'
};

const currencyCodeToSymbol = {
    'AED': [ 'د.إ', 'Dhs', 'Dh' ],
    'AFN': [ 'Af', 'Afs', '؋' ],
    'ALL': 'Lek',
    'AMD': '֏',
    'ANG': [ 'ƒ', 'NAƒ', 'NAf', 'f' ],
    'AOA': 'Kz',
    'ARS': [ '$', 'Arg$' ],
    'AUD': [ '$', 'Au$', 'A$' ],
    'AWG': 'Afl',
    'AZN': '₼',
    'BAM': 'KM',
    'BBD': [ '$', 'BB$', 'BBD$', 'BDS$' ],
    'BDT': '৳',
    'BGN': [ 'лв', 'lv' ],
    'BHD': [ 'د.ب', 'BD' , 'BHD' , 'B.D.', 'B.D', 'bd', 'دينار'],
    'BIF': 'FBu',
    'BMD': [ '$', 'BD$' ],
    'BND': [ '$', 'B$' ],
    'BOB': 'Bs',
    'BRL': 'R$',
    'BTN': 'Nu',
    'BWP': 'P',
    'BYN': 'Br',
    'BZD': [ '$', 'BZ$' ],
    'CAD': [ '$', 'CA$', 'Can$', 'C$' ],
    'CDF': 'FC',
    'CHF': 'CHF',
    'CLP': [ '$', 'CLP$' ],
    'CNY': '¥',
    'COP': [ '$', 'Col$' ],
    'CRC': '₡',
    'CUP': [ '$', '$MN' ],
    'CVE': 'Esc',
    'CZK': 'Kč',
    'DJF': 'Fdj',
    'DKK': 'kr',
    'DOP': [ '$', 'RD$' ],
    'DZD': [ 'دج', 'DA' ],
    'EGP': [ '.ج.م', 'E£', '£E', 'LE', 'EGP' ],
    'ERN': [ 'ناكفا', 'ናቕፋ', 'Nkf' ],
    'ETB': [ 'ብር', 'Br' ],
    'EUR': '€',
    'FJD': [ '$', 'FJ$' ],
    'GBP': '£',
    'GEL': [ '₾', 'ლ' ],
    'GHS': [ 'GH₵', 'GH¢' ],
    'GMD': 'D',
    'GNF': [ 'FG', 'Fr', 'GFr' ],
    'GTQ': 'Q',
    'GYD': [ '$', 'G$', 'GY$' ],
    'HKD': [ '$', 'HK$', '元' ],
    'HNL': 'L',
    'HTG': 'G',
    'HUF': 'Ft',
    'IDR': 'Rp',
    'ILS': '₪',
    'INR': '₹',
    'IQD': [ 'د.ع', 'ID' ],
    'IRR': [ '﷼', 'RI' ],
    'ISK': 'kr',
    'JMD': [ '$', 'J$' ],
    'JOD': 'د.أ',
    'JPY': [ '¥', '円' ],
    'KES': 'KSh',
    'KGS': [ '⃀', 'сом', 'som' ],
    'KHR': '៛',
    'KMF': 'FC',
    'KRW': '₩',
    'KWD': [ 'د.ك', 'KD' ],
    'KYD': [ '$', 'CI$' ],
    'KZT': '₸',
    'LAK': [ '₭', '₭N' ],
    'LBP': [ 'ل.ل', 'LL' ],
    'LKR': [ 'රු', '௹', 'Rs', 'Re' ],
    'LRD': [ '$', 'L$', 'LD$' ],
    'LSL': 'M',
    'LYD': [ 'ل.د', 'LD' ],
    'MAD': 'DH',
    'MDL': 'L',
    'MGA': 'Ar',
    'MKD': [ 'ден', 'den' ],
    'MMK': 'Ks',
    'MNT': '₮',
    'MOP': [ '$', 'MOP$' ],
    'MRU': 'UM',
    'MUR': 'Rs',
    'MVR': [ 'Rf', 'MVR', 'ރ' ],
    'MWK': 'K',
    'MXN': [ '$', 'Mex$' ],
    'MYR': 'RM',
    'MZN': [ 'MT', 'MTn' ],
    'NAD': [ '$', 'N$' ],
    'NGN': '₦',
    'NIO': [ '$', 'C$' ],
    'NOK': 'kr',
    'NPR': 'रू',
    'NZD': [ '$', 'NZ$', '$NZ' ],
    'OMR': [ '﷼', 'ر.ع.', ' R.O' ],
    'PAB': 'B/.',
    'PEN': 'S/',
    'PGK': 'K',
    'PHP': '₱',
    'PKR': 'Rs',
    'PLN': 'zł',
    'PYG': '₲',
    'QAR': [ 'ر.ق', 'QR' ],
    'RON': [ 'Leu', 'Lei' ],
    'RSD': [ 'РСД', 'DIN' ],
    'RUB': '₽',
    'RWF': [ 'FRw', 'RF', 'R₣' ],
    'SAR': [ 'ر.س', 'SAR', 'SR' ],
    'SBD': [ '$', 'SI$' ],
    'SCR': 'SR',
    'SDG': [ 'ج.س', 'LS' ],
    'SEK': 'kr',
    'SGD': [ '$', 'S$' ],
    'SLE': 'Le',
    'SOS': 'Sh.So',
    'SRD': [ '$', 'Sur$' ],
    'SSP': 'SSP',
    'STN': 'Db',
    'SYP': [ 'ل.س', 'SP', 'LS' ],
    'SZL': 'E',
    'THB': '฿',
    'TJS': 'SM',
    'TMT': 'm',
    'TND': [ 'د.ت', 'DT' ],
    'TOP': [ 'T$', 'PT' ],
    'TRY': '₺',
    'TTD': [ '$', 'TT$' ],
    'TWD': [ '$', 'NT$', 'NT' ],
    'TZS': 'TSh',
    'UAH': '₴',
    'UGX': 'USh',
    'USD': [ '$', 'US$', 'U$' ],
    'UYU': [ '$', '$U' ],
    'UZS': 'soʻm',
    'VES': 'Bs.S',
    'VND': '₫',
    'VUV': 'VT',
    'WST': [ 'WS$', 'SAT', 'ST', 'T' ],
    'XAF': 'F.CFA',
    'XCD': [ '$', 'EC$' ],
    'XOF': 'F.CFA',
    'XPF': 'F',
    'YER': '﷼',
    'ZAR': 'R',
    'ZMW': [ 'K', 'ZK' ]
};

// Country code mappings (simplified version)
const countryCodeToCurrencyCode = {
    'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'JP': 'JPY', 'CA': 'CAD', 'AU': 'AUD',
    'CH': 'CHF', 'CN': 'CNY', 'IN': 'INR', 'KR': 'KRW', 'MX': 'MXN', 'BR': 'BRL'
};

window.UnitConverter.CurrencyConverter = class {
    constructor() {
        this.baseURL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/';
        this.fallbackURL = 'https://currency-api.pages.dev/v1/currencies/';
        this.rateCache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    }

    /**
     * Extract currency symbol from text (from Currency-Converter-master)
     */
    extractCurrencySymbol(str) {
        // Check if str is valid
        if (!str || typeof str !== 'string') {
            return '';
        }
        
        // Remove numbers, whitespace, commas, periods
        const cleanedStr = str.replace(/[0-9\s,.']+/g, '');

        // Match everything up to the first parenthesis (if present)
        const result = cleanedStr.match(/^[^\(\)]+/);

        return result ? result[0] : '';
    }

    /**
     * Extract number from text (from Currency-Converter-master)
     */
    extractNumber(str) {
        // Check if str is valid
        if (!str || typeof str !== 'string') {
            return null;
        }
        
        // Extract the part of the string with digits, commas, dots, apostrophes, and spaces
        let cleanedString = str.match(/(\d+[.,\d' \s]*)(?=\D|$)/);

        if (!cleanedString) return null;

        cleanedString = cleanedString[0];

        // Remove spaces and apostrophes (they're thousands separators)
        cleanedString = cleanedString.replace(/[ \']/g, '');

        // Determine format based on the presence of both ',' and '.'
        if (cleanedString.includes('.') && cleanedString.includes(',')) {
            if (cleanedString.indexOf('.') < cleanedString.indexOf(',')) {
                // European-style format: dot as thousands, comma as decimal
                cleanedString = cleanedString.replace(/\./g, '').replace(',', '.');
            } else {
                // US-style format: comma as thousands, dot as decimal
                cleanedString = cleanedString.replace(/,/g, '');
            }
        } else if (cleanedString.includes(',')) {
            // If only a comma is present, determine if it's decimal or thousands separator
            if (cleanedString.match(/,\d{2}$/)) {
                cleanedString = cleanedString.replace(',', '.');
            } else {
                cleanedString = cleanedString.replace(/,/g, '');
            }
        } else if (cleanedString.includes('.')) {
            // If only a dot is present, determine if it's decimal or thousands separator
            if (cleanedString.match(/\.\d{3}$/)) {
                // Dot as thousands separator
                cleanedString = cleanedString.replace(/\./g, '');
            }
        }

        let result = parseFloat(cleanedString);

        return isNaN(result) ? null : result;
    }

    /**
     * Detect currency from symbol (from Currency-Converter-master)
     */
    detectCurrency(currencySymbol) {
        const currencyCode = currencySymbolToCurrencyCode[currencySymbol];

        if (currencyCode === undefined) return 'Unknown currency';

        if (Array.isArray(currencyCode)) return this.guessCountryByCurrencyCode(currencyCode);

        return currencyCode;
    }

    /**
     * Guess currency code when multiple options available (from Currency-Converter-master)
     */
    guessCountryByCurrencyCode(currencyCodes) {
        const pageCountryCode = this.getPageCountryCode();
        let currencyCode = countryCodeToCurrencyCode[pageCountryCode];

        if (pageCountryCode !== 'No country code' && currencyCodes.includes(currencyCode)) {
            return currencyCode;
        }

        if (currencyCodes.includes('USD') && this.getPageLanguageCode() === 'EN') {
            return 'USD';
        }

        const pageTopLayerDomain = this.getPageTopLayerDomain();
        currencyCode = countryCodeToCurrencyCode[pageTopLayerDomain];

        if (currencyCodes.includes(currencyCode)) return currencyCode;

        return currencyCodes[0];
    }

    /**
     * Get page country code from language tag
     */
    getPageCountryCode() {
        // Check if we're in a browser environment
        if (typeof document === 'undefined' || !document.documentElement) {
            return 'No country code';
        }
        
        const lang = document.documentElement.lang;

        if (lang && lang.includes('-')) {
            const countryCode = lang.split('-')[1].toUpperCase();
            return countryCode;
        } else {
            return 'No country code';
        }
    }

    /**
     * Get page language code
     */
    getPageLanguageCode() {
        // Check if we're in a browser environment
        if (typeof document === 'undefined' || !document.documentElement) {
            return 'EN'; // Default to English
        }
        
        const lang = document.documentElement.lang;

        if (lang && lang.includes('-')) {
            const languageCode = lang.split('-')[0].toUpperCase();
            return languageCode;
        } else {
            return lang ? lang.toUpperCase() : 'EN';
        }
    }

    /**
     * Get top-level domain
     */
    getPageTopLayerDomain() {
        // Check if we're in a browser environment
        if (typeof window === 'undefined' || !window.location) {
            return 'com'; // Default
        }
        
        return window.location.origin.split('.').pop().toUpperCase();
    }

    /**
     * Get currency rate from API (from Currency-Converter-master)
     */
    async getCurrencyRate(from, to) {
        const cacheKey = `${from}-${to}`;
        const cached = this.rateCache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.rate;
        }

        // Using data from the Currency API by Fawaz Ahmed (https://github.com/fawazahmed0/exchange-api)
        const url = this.baseURL + from + '.json';
        const fallbackUrl = this.fallbackURL + from + '.json';

        try {
            let response = await fetch(url);

            if (!response.ok) {
                response = await fetch(fallbackUrl);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            }

            const data = await response.json();
            const rate = data[from][to];
            
            // Cache the result
            this.rateCache.set(cacheKey, {
                rate: rate,
                timestamp: Date.now()
            });
            
            return rate;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Format currency display (from Currency-Converter-master)
     * Shows both currency code and symbol, e.g., "7.52 BHD د.ب"
     */
    formatCurrency(amount, currencyCode, userLocale = navigator.language) {
        const formattedAmount = new Intl.NumberFormat(userLocale, {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);

        let currencySymbol = this.getCurrencySymbol(currencyCode);

        if (Array.isArray(currencySymbol)) currencySymbol = currencySymbol[0];

        // Return format: "amount CURRENCY_CODE symbol"
        if (currencySymbol && currencySymbol !== currencyCode) {
            return `${formattedAmount} ${currencyCode.toUpperCase()} ${currencySymbol}`;
        } else {
            // Fallback if no symbol found, just show currency code
            return `${formattedAmount} ${currencyCode.toUpperCase()}`;
        }
    }

    /**
     * Get currency symbol from code
     */
    getCurrencySymbol(countryCode) {
        return currencyCodeToSymbol[countryCode];
    }

};

// Auto-initialize when the script loads
if (typeof window !== 'undefined') {
    window.UnitConverter.currencyConverter = new window.UnitConverter.CurrencyConverter();
}
