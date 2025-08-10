// build.js - Run this to generate hashed versions of your files
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');

async function generateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = createHash('sha3-384');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function buildSecurityFiles() {
  try {
    // Generate hashes for main files
    const cssHash = await generateFileHash(path.join(__dirname, 'css', 'main.css'));
    const jsHash = await generateFileHash(path.join(__dirname, 'functions', 'main.js'));
    const securityHash = await generateFileHash(path.join(__dirname, 'security.js'));

    // Create security.js with actual hashes
    const securityTemplate = fs.readFileSync(path.join(__dirname, 'security.template.js'), 'utf8');
    const securityContent = securityTemplate
      .replace('{{CSS_HASH}}', cssHash)
      .replace('{{JS_HASH}}', jsHash)
      .replace('{{SECURITY_HASH}}', securityHash);

    fs.writeFileSync(path.join(__dirname, 'security.js'), securityContent);
    
    console.log('Security files built successfully!');
    console.log('CSS Hash:', cssHash);
    console.log('JS Hash:', jsHash);
    console.log('Security Hash:', securityHash);
  } catch (err) {
    console.error('Build failed:', err);
  }
}

buildSecurityFiles();