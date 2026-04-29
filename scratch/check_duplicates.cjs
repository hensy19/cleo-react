const fs = require('fs');

const content = fs.readFileSync('c:/React/cleo/src/context/LanguageContext.jsx', 'utf8');

// Use a simple regex to find the translations object
const translationsMatch = content.match(/const translations = ({[\s\S]*?});\n\nconst LanguageProvider/);
if (!translationsMatch) {
    console.log('Could not find translations object');
    process.exit(1);
}

// Wrap in async function or just evaluate it if it's safe
// But it's easier to just parse the file structure if we can.
// Since it's a huge nested object, we can try to evaluate it as JS.

let translations;
try {
    // We need to clean up imports or just evaluate the object part
    translations = eval('(' + translationsMatch[1] + ')');
} catch (e) {
    console.log('Error evaluating translations object:', e);
    process.exit(1);
}

for (const lang in translations) {
    console.log(`Checking language: ${lang}`);
    const keys = Object.keys(translations[lang]);
    const counts = {};
    keys.forEach(k => {
        counts[k] = (counts[k] || 0) + 1;
    });

    const duplicates = Object.keys(counts).filter(k => counts[k] > 1);
    if (duplicates.length > 0) {
        console.log(`  DUPLICATES FOUND in ${lang}:`, duplicates);
    } else {
        console.log(`  No duplicates in ${lang}`);
    }
}
