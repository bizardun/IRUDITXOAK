const fs = require('fs');
let code = fs.readFileSync('components/gestion/GestionCategoria.tsx', 'utf8');
code = code.replace(
    /useEffect\(\(\) => \{\s*if \(\!showAllergens\) setSelectedAllergens\(\[\]\);\s*\}, \[showAllergens\]\);/,
    `useEffect(() => { 
        if (!showAllergens) setSelectedAllergens([]); 
    }, [showAllergens]);

    useEffect(() => {
        setExpandedCats({});
    }, [mode]);`
);
fs.writeFileSync('components/gestion/GestionCategoria.tsx', code);
