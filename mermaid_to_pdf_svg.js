// mermaid_to_pdf_svg.js - Génération de PDF à partir de fichiers markdown contenant des diagrammes mermaid
// Version avec SVG pour une haute qualité sans pixelisation
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

// ES modules don't have __dirname, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Récupérer les arguments de ligne de commande
const inputFiles = process.argv.slice(2).length > 0 ? 
  process.argv.slice(2).filter(arg => !arg.endsWith('.pdf')) : 
  ['diagrammes_complementaires.md', 'diagrammes_cas_utilisation.md', 'diagrammes_sequence.md', 'diagrammes_architecture_mcd.md'];
const outputFile = process.argv.find(arg => arg.endsWith('.pdf')) || 'diagrammes_cesizen_hq.pdf';

console.log(`Fichiers d'entrée: ${inputFiles.join(', ')}`);
console.log(`Fichier de sortie: ${outputFile}`);

// Configuration
const outputDir = path.join(__dirname, 'svg_diagrams');
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
  }
  
  if (!allMarkdownContent) {
    console.error("Aucun contenu markdown valide n'a été trouvé.");
    process.exit(1);
  }
  
  console.log("Recherche des blocs Mermaid...");

  // Extraire les blocs mermaid
  const mermaidRegex = /```mermaid\s*([\s\S]*?)\s*```/g;
  let match;
  const mermaidBlocks = [];
  let index = 0;
  
  // Fonction pour détecter si un diagramme doit être affiché en mode paysage
  function shouldDisplayAsLandscape(content) {
    // Les diagrammes de classe sont généralement mieux en paysage
    if (content.includes('classDiagram')) {
      return true;
    }
    
    // La plupart des flowcharts sont mieux en portrait, sauf s'ils sont très larges
    if ((content.includes('flowchart LR') || content.includes('graph LR')) && 
        content.includes('subgraph')) {
      return true;
    }
    
    // Si le diagramme est explicitement orienté de gauche à droite, il est probablement mieux en paysage
    if (content.includes('flowchart LR') || content.includes('graph LR')) {
      return true;
    }
    
    return false;
  }
  
  // Correction des erreurs connues dans les diagrammes
  allMarkdownContent = allMarkdownContent.replace(/classDef end /g, 'classDef ending ');
  allMarkdownContent = allMarkdownContent.replace(/:::end/g, ':::ending');
  
  // Extraction des diagrammes
  while ((match = mermaidRegex.exec(allMarkdownContent)) !== null) {
    const mermaidContent = match[1].trim();
    const file = path.join(outputDir, `diagram_${index}.mmd`);
    
    // Écrire le contenu Mermaid dans un fichier
    fs.writeFileSync(file, mermaidContent);
    
    // Déterminer l'orientation
    const isLandscape = shouldDisplayAsLandscape(mermaidContent);
    
    mermaidBlocks.push({
      content: mermaidContent,
      file,
      index,
      isLandscape
    });
    
    index++;
    console.log(`Diagramme ${index} extrait.`);
  }

  console.log(`Extraction de ${mermaidBlocks.length} diagrammes terminée.`);

  // Convertir les diagrammes en SVG avec Puppeteer
  console.log('Conversion des diagrammes en SVG...');
  
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Créer une page pour le rendu des diagrammes Mermaid
    const page = await browser.newPage();
    
    // Pour chaque bloc mermaid, générer un SVG
    for (let i = 0; i < mermaidBlocks.length; i++) {
      const block = mermaidBlocks[i];
      console.log(`Conversion du diagramme ${i+1}/${mermaidBlocks.length} en SVG...`);
      
      const svgPath = path.join(outputDir, `diagram_${block.index}.svg`);
      
      // Préparer le HTML pour le rendu du SVG
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
          <script>
            mermaid.initialize({ 
              startOnLoad: true,
              theme: 'default',
              securityLevel: 'loose',
              fontFamily: 'Arial',
              fontSize: 16
            });
          </script>
          <style>
            body { margin: 0; padding: 0; }
            #container { width: ${block.isLandscape ? '1200px' : '900px'}; overflow: visible; }
          </style>
        </head>
        <body>
          <div id="container">
            <pre class="mermaid">
              ${block.content}
            </pre>
          </div>
        </body>
        </html>
      `;
      
      await page.setContent(html);
      await page.waitForFunction('document.querySelector(".mermaid svg") !== null');
      
      // Récupérer le SVG généré
      const svgElement = await page.$('.mermaid svg');
      const svgContent = await page.evaluate(svg => svg.outerHTML, svgElement);
      
      // Sauvegarder le SVG dans un fichier
      fs.writeFileSync(svgPath, svgContent);
      
      // Mettre à jour le chemin SVG dans le bloc
      block.svgPath = svgPath;
    }
    
    // Créer le HTML pour le PDF final
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Diagrammes CesiZen</title>
        <style>
          @page { 
            size: A4; 
            margin: 1cm;
          }
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            line-height: 1.5;
          }
          h1 { 
            color: #333; 
            font-size: 24pt;
            margin-bottom: 30px;
          }
          h2 { 
            color: #444;
            font-size: 18pt;
            margin-top: 30px;
          }
          p {
            font-size: 12pt;
          }
          .page-break { 
            page-break-before: always; 
          }
          .diagram-container { 
            text-align: center; 
            margin: 20px auto;
            max-width: 100%;
          }
          .diagram-container img, .diagram-container svg { 
            max-width: 100%; 
            height: auto; 
          }
          .diagram-container.landscape { 
            page-break-before: always;
            page-break-after: always;
            height: 100%;
            transform: rotate(90deg);
            transform-origin: center;
          }
          hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 40px 0;
          }
        </style>
      </head>
      <body>
        <h1>Diagrammes CesiZen</h1>
    `;
    
    // Diviser le contenu markdown par les blocs mermaid
    const sections = allMarkdownContent.split('```mermaid');
    
    // Ajouter le texte du début (jusqu'au premier diagramme)
    htmlContent += sections[0]
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\n?(.+)$(?!\n)/gm, '<p>$1</p>');
    
    // Ajouter chaque section avec son image SVG
    for (let i = 1; i < sections.length; i++) {
      // Diviser la section pour enlever le bloc mermaid fermé
      const sectionParts = sections[i].split('```');
      const afterDiagram = sectionParts[1] || '';
      
      // Ajouter une page break avant chaque nouvelle section principale
      if (i > 1 && afterDiagram.includes('##')) {
        htmlContent += '<div class="page-break"></div>';
      }
      
      // Récupérer le bloc mermaid correspondant
      const block = mermaidBlocks[i-1];
      
      // Ajouter le SVG en intégrant directement le contenu
      const svgContent = fs.readFileSync(block.svgPath, 'utf8');
      
      // Ajouter le SVG avec l'orientation appropriée
      if (block.isLandscape) {
        htmlContent += `<div class="page-break"></div>`;
        htmlContent += `<div class="diagram-container landscape">`;
        htmlContent += svgContent;
        htmlContent += `</div>`;
        htmlContent += `<div class="page-break"></div>`;
      } else {
        htmlContent += `<div class="diagram-container">`;
        htmlContent += svgContent;
        htmlContent += `</div>`;
      }
      
      // Ajouter le texte qui suit
      if (afterDiagram) {
        htmlContent += afterDiagram
          .replace(/^## (.*)$/gm, '<h2>$1</h2>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/^\n?(.+)$(?!\n)/gm, '<p>$1</p>');
      }
      
      // Ajouter un séparateur entre les sections
      if (i < sections.length - 1) {
        htmlContent += '<hr>';
      }
    }
    
    htmlContent += '</body></html>';
    
    // Écrire le HTML dans un fichier temporaire
    const htmlFile = path.join(outputDir, 'output.html');
    fs.writeFileSync(htmlFile, htmlContent);
    
    // Générer le PDF
    console.log('Conversion du HTML en PDF...');
    
    const pdfPage = await browser.newPage();
    await pdfPage.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });
    
    await pdfPage.pdf({
      path: outputPdf,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: '<div style="width: 100%; text-align: center; font-size: 10px; color: #777;">CesiZen - Page <span class="pageNumber"></span> sur <span class="totalPages"></span></div>',
      margin: {
        top: '1cm',
        bottom: '1cm',
        left: '1cm',
        right: '1cm'
      }
    });
    
    await browser.close();
    console.log(`PDF généré avec succès : ${outputPdf}`);
  })();

} catch (error) {
  console.error("Erreur lors du traitement:", error);
}
