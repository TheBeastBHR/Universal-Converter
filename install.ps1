# Unit Converter Chrome Extension Installation Script
# This script helps you create a distributable package

Write-Host "🔄 Unit Converter Extension Builder" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "manifest.json")) {
    Write-Host "❌ Error: manifest.json not found. Please run this script from the extension directory." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found manifest.json" -ForegroundColor Green

# Create icons directory if it doesn't exist
if (-not (Test-Path "icons")) {
    New-Item -ItemType Directory -Path "icons" -Force
    Write-Host "✅ Created icons directory" -ForegroundColor Green
}

# Check for required files
$requiredFiles = @("manifest.json", "content.js", "content.css", "popup.html", "popup.js", "background.js")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Missing required files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "✅ All required files found" -ForegroundColor Green

# Create a zip package for distribution
$zipName = "unit-converter-extension-v1.0.0.zip"
if (Test-Path $zipName) {
    Remove-Item $zipName -Force
}

$filesToZip = @(
    "manifest.json",
    "content.js", 
    "content.css",
    "popup.html",
    "popup.js",
    "background.js",
    "README.md",
    "icons"
)

Write-Host "📦 Creating distribution package..." -ForegroundColor Yellow

try {
    Compress-Archive -Path $filesToZip -DestinationPath $zipName -Force
    Write-Host "✅ Created $zipName" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creating zip: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Extension is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Installation Instructions:" -ForegroundColor Cyan
Write-Host "1. Open Chrome and go to chrome://extensions/" -ForegroundColor White
Write-Host "2. Enable 'Developer mode' in the top right" -ForegroundColor White
Write-Host "3. Click 'Load unpacked' and select this folder" -ForegroundColor White
Write-Host "4. The extension will be installed and ready to use" -ForegroundColor White
Write-Host ""
Write-Host "Testing:" -ForegroundColor Cyan
Write-Host "- Open test.html in your browser to test the extension" -ForegroundColor White
Write-Host "- Select any text with measurements to see conversions" -ForegroundColor White
Write-Host "- Click the extension icon to configure settings" -ForegroundColor White
Write-Host ""
Write-Host "Distribution:" -ForegroundColor Cyan
Write-Host "- Use $zipName for sharing or publishing" -ForegroundColor White
Write-Host ""

# Open the extensions page in Chrome if requested
$openChrome = Read-Host "Open Chrome extensions page? (y/n)"
if ($openChrome -eq "y" -or $openChrome -eq "Y") {
    Start-Process "chrome://extensions/"
}
