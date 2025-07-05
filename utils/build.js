#!/usr/bin/env node
// Chrome Extension Build Script
// This script packages the extension for distribution

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

class ExtensionBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.buildDir = path.join(this.rootDir, 'build');
    this.version = this.getVersion();
    
    // Files and directories to include in the build
    this.includeFiles = [
      'manifest.json',
      'background.js',
      'content.js',
      'content.css'
    ];
    
    this.includeDirs = [
      'data',
      'utils',
      'settings-page',
      'icons'
    ];
    
    // Files and directories to exclude
    this.excludePatterns = [
      'tests',
      'node_modules',
      '.git',
      '.github',
      'build',
      'run-tests.ps1',
      'package.json',
      'package-lock.json',
      '.gitignore',
      'img' // Usually development assets
    ];
    
    // Files to exclude from specific directories
    this.excludeFromDirs = {
      'utils': ['build.js'], // Don't include the build script itself
      'tests': ['*'] // Exclude all test files
    };
  }
  
  getVersion() {
    try {
      const manifestPath = path.join(this.rootDir, 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      return manifest.version || '1.0.0';
    } catch (error) {
      console.warn(`${colors.yellow}⚠️  Could not read version from manifest.json, using 1.0.0${colors.reset}`);
      return '1.0.0';
    }
  }
  
  cleanBuildDir() {
    console.log(`${colors.blue}🧹 Cleaning build directory...${colors.reset}`);
    
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(this.buildDir, { recursive: true });
    console.log(`${colors.green}✅ Build directory cleaned${colors.reset}`);
  }
  
  copyFile(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
  
  copyDirectory(src, dest, excludeFiles = []) {
    if (!fs.existsSync(src)) {
      console.warn(`${colors.yellow}⚠️  Source directory does not exist: ${src}${colors.reset}`);
      return;
    }
    
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
      // Skip excluded files
      if (excludeFiles.includes(item) || excludeFiles.includes('*')) {
        continue;
      }
      
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);
      
      if (stat.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        this.copyFile(srcPath, destPath);
      }
    }
  }
  
  copyExtensionFiles() {
    console.log(`${colors.blue}📁 Copying extension files...${colors.reset}`);
    
    // Copy individual files
    for (const file of this.includeFiles) {
      const srcPath = path.join(this.rootDir, file);
      const destPath = path.join(this.buildDir, file);
      
      if (fs.existsSync(srcPath)) {
        this.copyFile(srcPath, destPath);
        console.log(`${colors.green}  ✅ ${file}${colors.reset}`);
      } else {
        console.warn(`${colors.yellow}  ⚠️  File not found: ${file}${colors.reset}`);
      }
    }
    
    // Copy directories
    for (const dir of this.includeDirs) {
      const srcPath = path.join(this.rootDir, dir);
      const destPath = path.join(this.buildDir, dir);
      const excludeFiles = this.excludeFromDirs[dir] || [];
      
      if (fs.existsSync(srcPath)) {
        this.copyDirectory(srcPath, destPath, excludeFiles);
        console.log(`${colors.green}  ✅ ${dir}/${colors.reset}`);
      } else {
        console.warn(`${colors.yellow}  ⚠️  Directory not found: ${dir}${colors.reset}`);
      }
    }
  }
  
  validateBuild() {
    console.log(`${colors.blue}🔍 Validating build...${colors.reset}`);
    
    const requiredFiles = [
      'manifest.json',
      'background.js',
      'content.js',
      'content.css',
      'data/conversion-data.js',
      'data/currency-data.js',
      'utils/conversion-detector.js',
      'utils/currency-converter.js',
      'utils/popup-manager.js',
      'utils/settings-manager.js',
      'utils/unit-converter.js',
      'settings-page/settings.html',
      'settings-page/settings.js',
      'settings-page/settings.css'
    ];
    
    let isValid = true;
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.buildDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`${colors.green}  ✅ ${file}${colors.reset}`);
      } else {
        console.log(`${colors.red}  ❌ Missing: ${file}${colors.reset}`);
        isValid = false;
      }
    }
    
    // Validate manifest.json
    try {
      const manifestPath = path.join(this.buildDir, 'manifest.json');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      if (manifest.manifest_version === 3) {
        console.log(`${colors.green}  ✅ Manifest v3 format${colors.reset}`);
      } else {
        console.log(`${colors.red}  ❌ Invalid manifest version${colors.reset}`);
        isValid = false;
      }
      
    } catch (error) {
      console.log(`${colors.red}  ❌ Invalid manifest.json${colors.reset}`);
      isValid = false;
    }
    
    return isValid;
  }
  
  getBuildStats() {
    const stats = {
      files: 0,
      directories: 0,
      totalSize: 0
    };
    
    const calculateStats = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          stats.directories++;
          calculateStats(itemPath);
        } else {
          stats.files++;
          stats.totalSize += stat.size;
        }
      }
    };
    
    calculateStats(this.buildDir);
    return stats;
  }
  
  createZipArchive() {
    console.log(`${colors.blue}📦 Creating ZIP archive...${colors.reset}`);
    
    const zipName = `universal-converter-v${this.version}.zip`;
    const zipPath = path.join(this.rootDir, zipName);
    
    return new Promise((resolve, reject) => {
      try {
        // Remove existing zip if it exists
        if (fs.existsSync(zipPath)) {
          fs.unlinkSync(zipPath);
        }
        
        // Create ZIP using archiver
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
          zlib: { level: 9 } // Maximum compression
        });
        
        output.on('close', () => {
          const zipStats = fs.statSync(zipPath);
          const zipSizeMB = (zipStats.size / (1024 * 1024)).toFixed(2);
          console.log(`${colors.green}  ✅ Created: ${zipName} (${zipSizeMB} MB)${colors.reset}`);
          resolve(zipPath);
        });
        
        archive.on('error', (err) => {
          console.log(`${colors.red}  ❌ Failed to create ZIP: ${err.message}${colors.reset}`);
          reject(err);
        });
        
        archive.pipe(output);
        
        // Add the entire build directory to the ZIP
        archive.directory(this.buildDir, false);
        
        archive.finalize();
        
      } catch (error) {
        console.log(`${colors.red}  ❌ Failed to create ZIP: ${error.message}${colors.reset}`);
        reject(error);
      }
    });
  }
  
  async build() {
    console.log(`${colors.bright}${colors.cyan}🚀 Building Universal Converter Extension v${this.version}${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    
    try {
      // Step 1: Clean build directory
      this.cleanBuildDir();
      
      // Step 2: Copy extension files
      this.copyExtensionFiles();
      
      // Step 3: Validate build
      const isValid = this.validateBuild();
      
      if (!isValid) {
        throw new Error('Build validation failed');
      }
      
      // Step 4: Get build statistics
      const stats = this.getBuildStats();
      const sizeMB = (stats.totalSize / (1024 * 1024)).toFixed(2);
      
      console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(`${colors.bright}${colors.green}✅ Build completed successfully!${colors.reset}`);
      console.log(`${colors.green}   📊 Files: ${stats.files}, Directories: ${stats.directories}${colors.reset}`);
      console.log(`${colors.green}   💾 Total size: ${sizeMB} MB${colors.reset}`);
      console.log(`${colors.green}   📁 Build location: ${this.buildDir}${colors.reset}`);
      
      // Step 5: Create ZIP archive
      const zipPath = await this.createZipArchive();
      
      if (zipPath) {
        console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.bright}${colors.green}🎉 Extension ready for distribution!${colors.reset}`);
        console.log(`${colors.green}   📦 ZIP archive: ${path.basename(zipPath)}${colors.reset}`);
        console.log(`${colors.green}   📁 Build folder: build/${colors.reset}`);
        console.log(`${colors.cyan}   💡 Load the 'build' folder as an unpacked extension in Chrome${colors.reset}`);
      }
      
    } catch (error) {
      console.log(`${colors.red}❌ Build failed: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  }
}

// Run the build when script is executed directly
if (require.main === module) {
  const builder = new ExtensionBuilder();
  builder.build().catch(error => {
    console.log(`${colors.red}❌ Build failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = ExtensionBuilder;