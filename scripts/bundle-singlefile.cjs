const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Read CSS
const assetsDir = path.join(distDir, 'assets');
const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
let cssContent = '';
for (const f of cssFiles) {
  cssContent += fs.readFileSync(path.join(assetsDir, f), 'utf-8') + '\n';
}

// Read JS
const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
let jsContent = '';
for (const f of jsFiles) {
  jsContent += fs.readFileSync(path.join(assetsDir, f), 'utf-8') + '\n';
}

// Clean out existing external stylesheet and module tags
html = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi, '');
html = html.replace(/<script[^>]+src=["'][^"']+["'][^>]*><\/script>/gi, '');

// Embed CSS directly
html = html.replace('</head>', '<style>\n' + cssContent + '\n</style>\n</head>');

// Embed JS directly
html = html.replace('</body>', '<script type="module">\n' + jsContent + '\n</script>\n</body>');

const outputPath = path.resolve(__dirname, '..', 'vitality-os-standalone.html');
fs.writeFileSync(outputPath, html, 'utf-8');

console.log('SUCCESS: Generated standalone HTML at:', outputPath);
console.log('File size:', (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2), 'MB');
