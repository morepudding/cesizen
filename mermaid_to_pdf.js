// mermaid_to_pdf.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Récupérer les arguments de ligne de commande
const inputFiles = process.argv.slice(2).length > 0 ? 
  process.argv.slice(2).filter(arg => !arg.endsWith('.pdf')) : 
  ['diagrammes_complementaires.md', 'diagrammes_cas_utilisation.md', 'diagrammes_sequence.md', 'diagrammes_architecture_mcd.md'];
const outputFile = process.argv.find(arg => arg.endsWith('.pdf')) || 'diagrammes_cesizen.pdf';

console.log(`Fichiers d'entrée: ${inputFiles.join(', ')}`);
console.log(`Fichier de sortie: ${outputFile}`);

// Configuration
const outputDir = path.join(__dirname, 'temp_diagrams');
const outputPdf = path.join(__dirname, outputFile);

// Créer le dossier temporaire s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Lire le contenu des fichiers markdown
let allMarkdownContent = '';
let fileIndex = 0;

try {
  for (const inputFile of inputFiles) {
    const inputMarkdown = path.join(__dirname, inputFile);
    console.log(`Lecture du fichier markdown: ${inputMarkdown}`);
    
    // Vérifie d'abord si le fichier existe
    if (!fs.existsSync(inputMarkdown)) {
      console.error(`Le fichier ${inputMarkdown} n'existe pas.`);
      continue;
    }
    
    // Lit le contenu avec un encodage explicite
    const markdownContent = fs.readFileSync(inputMarkdown, {encoding: 'utf-8'});
    
    if (markdownContent.length === 0) {
      console.error(`Le fichier ${inputMarkdown} est vide.`);
      continue;
    }
    
    // Ajouter une séparation entre les fichiers
    if (fileIndex > 0) {
      allMarkdownContent += '\n\n---\n\n';
    }
    
    allMarkdownContent += markdownContent;
    fileIndex++;
    
    console.log(`Taille du fichier: ${markdownContent.length} caractères`);
    console.log(`Les 100 premiers caractères: ${markdownContent.substring(0, 100)}`);
  }
  
  if (!allMarkdownContent) {
    console.error("Aucun contenu markdown valide n'a été trouvé.");
    process.exit(1);
  }
  
  console.log("Recherche des blocs Mermaid...");
  
  // Extraire les blocs mermaid - utiliser une expression régulière plus fiable pour les blocs Mermaid
  const mermaidRegex = /```mermaid\s*([\s\S]*?)\s*```/g;
  let match;
  const mermaidBlocks = [];
  let index = 0;

  // Fonction pour détecter si un diagramme doit être affiché en mode paysage
  function shouldDisplayAsLandscape(content) {
    // Les diagrammes de classe sont généralement mieux en paysage
    if (content.includes('classDiagram')) {
      return false; // On les affiche en portrait finalement
    }
    
    // Les diagrammes flowchart explicitement orientés LR (gauche à droite) sont mieux en paysage
    if (content.includes('flowchart LR') || content.includes('graph LR')) {
      return false;
    }
    
    // Par défaut tous les diagrammes en portrait
    return false;
  }

  // Correction des erreurs connues dans les diagrammes
  allMarkdownContent = allMarkdownContent.replace(/classDef end/g, 'classDef ending');
  allMarkdownContent = allMarkdownContent.replace(/:::end/g, ':::ending');

  // Extraction des diagrammes
  while ((match = mermaidRegex.exec(allMarkdownContent)) !== null) {
    const mermaidContent = match[1].trim();
    const tempFile = path.join(outputDir, `diagram_${index}.mmd`);
    fs.writeFileSync(tempFile, mermaidContent);
    
    // Déterminer si le diagramme doit être en mode paysage
    const isLandscape = shouldDisplayAsLandscape(mermaidContent);
    
    mermaidBlocks.push({
      content: mermaidContent,
      file: tempFile,
      outputImage: path.join(outputDir, `diagram_${index}.png`),
      isLandscape
    });
    index++;
    console.log(`Diagramme ${index} extrait.`);
  }

  console.log(`Extraction de ${mermaidBlocks.length} diagrammes terminée.`);

  // Convertir les diagrammes en images PNG
  console.log('Conversion des diagrammes en images...');
  for (let idx = 0; idx < mermaidBlocks.length; idx++) {
    try {
      console.log(`Conversion du diagramme ${idx+1}/${mermaidBlocks.length}...`);
      execSync(`npx mmdc -i "${mermaidBlocks[idx].file}" -o "${mermaidBlocks[idx].outputImage}" -b white`, { stdio: 'inherit' });
      console.log(`Diagramme ${idx+1}/${mermaidBlocks.length} converti.`);
    } catch (error) {
      console.error(`Erreur lors de la conversion du diagramme ${idx}:`, error);
    }
  }

  // Créer le HTML avec les images
  const sections = allMarkdownContent.split('```mermaid');
  let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Diagrammes CesiZen</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    h1, h2 { color: #444; margin-top: 1.5em; }
    h1 { font-size: 26px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
    h2 { font-size: 22px; margin-top: 30px; }
    p { margin-bottom: 1em; }
    img { max-width: 100%; max-height: 700px; margin: 20px auto; display: block; }
    .page-break { page-break-before: always; }
    .diagram-container { text-align: center; margin: 30px 0; }
    .diagram-title { font-weight: bold; margin-bottom: 10px; color: #555; }
  </style>
</head>
<body>
  <h1>Diagrammes CesiZen</h1>
`;

  // Ajouter le texte du début (jusqu'au premier diagramme)
  htmlContent += sections[0].replace(/^# (.*)$/m, '').replace(/\n## /g, '\n<h2>').replace(/\n(?=\w)/g, '\n<p>').replace(/\n$/g, '</p>\n');

  // Ajouter chaque section avec son image
  for (let i = 1; i < sections.length; i++) {
    const sectionParts = sections[i].split('```');
    const afterDiagram = sectionParts[1];
    
    // Ajouter une page break avant chaque nouvelle section sauf la première
    if (i > 1) {
      htmlContent += '<div class="page-break"></div>\n';
    }
    
    // Ajouter l'image du diagramme
    htmlContent += '<div class="diagram-container">\n';
    htmlContent += `  <img src="file:///${mermaidBlocks[i-1].outputImage.replace(/\\/g, '/')}" alt="Diagramme ${i}" />\n`;
    htmlContent += '</div>\n';
    
    // Ajouter le texte qui suit jusqu'au prochain diagramme
    if (afterDiagram) {
      htmlContent += afterDiagram.replace(/\n## /g, '\n<h2>').replace(/\n(?=\w)/g, '\n<p>').replace(/\n$/g, '</p>\n');
    }
  }

  htmlContent += '</body></html>';

  // Écrire le fichier HTML temporaire
  const htmlFile = path.join(outputDir, 'output.html');
  fs.writeFileSync(htmlFile, htmlContent);

  // Convertir le HTML en PDF avec Puppeteer
  console.log('Conversion du HTML en PDF...');
  (async () => {
    try {
      const browser = await puppeteer.launch({
        headless: 'new', // Use the new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });
      await page.pdf({ 
        path: outputPdf, 
        format: 'A4',
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
        printBackground: true,
        displayHeaderFooter: false
      });
      await browser.close();
      console.log(`PDF généré avec succès : ${outputPdf}`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
    }
  })();
} catch (error) {
  console.error("Erreur lors du traitement des fichiers markdown:", error);
}