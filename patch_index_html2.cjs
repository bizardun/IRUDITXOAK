const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
    /\.font-sans-clean \{ font-family: sans-serif; \}/,
    ".font-sans { font-family: 'Inter', sans-serif !important; }"
);

fs.writeFileSync('index.html', content);
