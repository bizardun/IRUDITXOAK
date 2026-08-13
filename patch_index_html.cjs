const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

if (!content.includes('.font-lora')) {
    content = content.replace(
        /<\/style>/,
        `      .font-lora { font-family: 'Lora', serif; }\n      .font-inter { font-family: 'Inter', sans-serif; }\n      .font-serif { font-family: serif; }\n      .font-sans-clean { font-family: sans-serif; }\n    </style>`
    );
    fs.writeFileSync('index.html', content);
}
