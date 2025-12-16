const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images');
const outputDir = path.join(__dirname, '../public/images/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach((file) => {
  const inputFile = path.join(inputDir, file);
  const outputFileWebP = path.join(outputDir, `${path.parse(file).name}.webp`);
  const outputFileAvif = path.join(outputDir, `${path.parse(file).name}.avif`);

  sharp(inputFile)
    .webp({ quality: 80 })
    .toFile(outputFileWebP)
    .then(() => console.log(`Converted ${file} to WebP`))
    .catch((err) => console.error(`Error converting ${file} to WebP:`, err));

  sharp(inputFile)
    .avif({ quality: 50 })
    .toFile(outputFileAvif)
    .then(() => console.log(`Converted ${file} to AVIF`))
    .catch((err) => console.error(`Error converting ${file} to AVIF:`, err));
});