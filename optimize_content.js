const fs = require('fs');
const path = require('path');

function formatWord(text) {
    if (!text) return text;
    const t = text.trim();
    if (t.includes(' ')) {
        return t.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
    return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

function formatSentence(text) {
    if (!text) return text;
    let t = text.trim();
    t = t.charAt(0).toUpperCase() + t.slice(1);
    t = t.replace(/\bi'm\b/gi, "I'm");
    t = t.replace(/\bi\b/g, "I");
    return t;
}

const vocabPath = path.join(process.cwd(), 'src', 'data', 'vocabulary.json');
const sentencesPath = path.join(process.cwd(), 'src', 'data', 'sentences.json');

const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
const optimizedVocab = vocab.map(item => ({
    ...item,
    word: formatWord(item.word),
    examples: item.examples?.map(ex => ({
        ...ex,
        text: formatSentence(ex.text)
    }))
}));

// Remove duplicates based on 'word'
const uniqueVocab = [];
const seenWords = new Set();
for (const item of optimizedVocab) {
    if (!seenWords.has(item.word)) {
        uniqueVocab.push(item.word);
        seenWords.add(item.word);
    }
}
// Wait, that's not right. uniqueVocab should be the array of objects.
const finalVocab = [];
const seen = new Set();
for (const item of optimizedVocab) {
    const key = item.word.toLowerCase();
    if (!seen.has(key)) {
        finalVocab.push(item);
        seen.add(key);
    }
}

fs.writeFileSync(vocabPath, JSON.stringify(finalVocab, null, 2));

const sentences = JSON.parse(fs.readFileSync(sentencesPath, 'utf8'));
const optimizedSentences = sentences.map(item => ({
    ...item,
    text: formatSentence(item.text)
}));

fs.writeFileSync(sentencesPath, JSON.stringify(optimizedSentences, null, 2));

console.log('Optimization complete!');
