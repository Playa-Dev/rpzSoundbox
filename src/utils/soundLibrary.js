/***************************************************************************
 *                  Usage: node src/utils/soundLibrary.js                  *
 *           à exécuter à chaque modification de assets/category/          *
 * Génère un fichier config.ts contenant le tableau de données images/sons *
 ***************************************************************************/

const fs = require('fs');
const path = "./assets/category/";

let resArray = `[`;

// Parcours des dossiers catégories dans assets/category
fs.readdirSync(path).forEach((val) => {
    if (val === "config.ts") return;

    const subDir = fs.readdirSync(path + val);

    // Liste des sons mp3
    const sounds = subDir.filter((x) => x.endsWith(".mp3"));

    // Liste des images thumb_ (indexées par numéro)
    const images = [];
    subDir.filter(x => x.includes("thumb_")).forEach(i => {
        const idx = parseInt(i.split('.')[0].split('_')[1]);
        images[idx] = i;
    });

    resArray += `
    {
        name: "${(val.charAt(0).toUpperCase() + val.slice(1)).split("_").join(" ").replace(/&#33;/g, "!")}",
        image: require("${images[0] ? ("./" + val + "/" + images[0]) : "../img/logorpz.png"}"),
        sounds: [${sounds.map((file, i) => `
            {
                name: "${(file.split('.')[0].charAt(0).toUpperCase() + file.split('.')[0].slice(1)).split("_").join(" ").replace(/X/g, "*").replace(/&#33;/g, "!")}",
                audio: require("${"./" + val + "/" + file}"),
                image: require("${images[i+1] ? ("./" + val + "/" + images[i+1]) : (images[0] ? ("./" + val + "/" + images[0]) : "../img/logorpz.png")}")
            }`).join(",")}
        ],
    },`;
});

resArray += "\n]";

const res = `/*** AUTO-GENERATED FILE - DO NOT EDIT ***/

import { Sound } from "../../src/components/Sound";

const soundLibrary: Sound[] = ${resArray};

export default soundLibrary;
`;

fs.writeFileSync(path + "config.ts", res);
