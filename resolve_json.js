const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'vocabulary.json');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find conflict blocks
// <<<<<<< HEAD
// ... (theirs/remote)
// =======
// ... (mine/local)
// >>>>>>> commit_id
const conflictRegex = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>>.*?\r?\n/g;

content = content.replace(conflictRegex, (match, theirs, mine) => {
    // In this specific project, we want to keep both if they are different items,
    // or keep the formatted version (mine) if they are the same item.
    // However, simplest is to just concatenate them and let the user/optimizer handle duplicates.
    // But usually these blocks contain partial JSON objects.
    
    // Let's try to just clean up the markers and see if it produces valid-ish JSON
    // Actually, looking at the pattern:
    // {
    // <<<<<<< HEAD
    //     "word": "item1",
    // =======
    //     "word": "item2",
    //     ...
    //   },
    //   {
    //     "word": "item1_formatted",
    // >>>>>>> commit
    //     "meaning": "..."
    
    // This is messy. Let's just pick 'mine' (the formatted version) and if there were NEW items in 'theirs', we might lose them or keep them.
    // If 'theirs' has more content than 'mine', we should probably try to merge.
    
    // Given the pattern I saw:
    // remote added "I'm starving"
    // local has "Hang Out" and "I'm Starving"
    
    return theirs + '\n' + mine;
});

// Clean up any double commas or syntax errors introduced by concatenation
// (Very basic cleanup)
// content = content.replace(/},\s*{/g, '},\n  {');

fs.writeFileSync(filePath, content);
console.log('Conflict markers removed from vocabulary.json. Please check for syntax errors.');
