import os
import subprocess
import re
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Dossier de sortie pour les images haute qualité
OUTPUT_DIR = "high_res_diagrams"

def extract_mermaid_diagrams(markdown_file):
    """Extrait les diagrammes Mermaid d'un fichier markdown"""
    logger.info(f"Extraction des diagrammes depuis {markdown_file}")
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraction des blocs Mermaid
    mermaid_pattern = r"```mermaid\s*([\s\S]*?)\s*```"
    diagrams = re.findall(mermaid_pattern, content)
    
    logger.info(f"Extraction terminée, {len(diagrams)} diagrammes trouvés")
    return diagrams

def generate_high_res_image(diagram_content, output_path, width=1600, height=1200, background_color="#ffffff"):
    """Génère une image haute résolution d'un diagramme Mermaid"""
    # Créer le dossier de sortie s'il n'existe pas
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Écrire le contenu du diagramme dans un fichier temporaire
    temp_file = f"{output_path}.mmd"
    with open(temp_file, 'w', encoding='utf-8') as f:
        f.write(diagram_content)
    
    # Générer l'image avec mmdc (mermaid-cli)
    logger.info(f"Génération de l'image haute résolution pour {output_path}")
    cmd = [
        "npx", "mmdc",
        "-i", temp_file,
        "-o", output_path,
        "-b", background_color,
        "-w", str(width),
        "-H", str(height),
        "--scale", "2"  # Facteur d'échelle pour augmenter la qualité
    ]
    
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        logger.info(f"Image générée avec succès: {output_path}")
        # Supprimer le fichier temporaire
        os.remove(temp_file)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Erreur lors de la génération de l'image: {e}")
        logger.error(f"Stderr: {e.stderr.decode('utf-8') if e.stderr else 'N/A'}")
        return False

def generate_html_with_high_res_images(markdown_file):
    """Génère un fichier HTML contenant le contenu markdown avec des images haute résolution"""
    logger.info(f"Génération du HTML pour {markdown_file}")
    
    # Nom du fichier sans extension
    base_name = os.path.basename(markdown_file).replace('.md', '')
    
    # Extraire les diagrammes
    diagrams = extract_mermaid_diagrams(markdown_file)
    
    # Générer des images haute résolution
    image_paths = []
    for i, diagram in enumerate(diagrams):
        output_path = os.path.join(OUTPUT_DIR, f"{base_name}_diagram_{i}.png")
        if generate_high_res_image(diagram, output_path):
            image_paths.append(output_path)
    
    # Extraire le contenu texte du fichier markdown
    with open(markdown_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remplacer les blocs Mermaid par des images dans le HTML
    html_content = content
    for i, img_path in enumerate(image_paths):
        # On peut utiliser une expression régulière pour remplacer le i-ème bloc Mermaid par l'image
        pattern = r"```mermaid\s*[\s\S]*?```"
        replacement = f'<img src="{img_path}" alt="Diagramme {i+1}" style="width: 100%; max-width: 1600px;">'
        # On ne remplace que la première occurrence (le i-ème bloc)
        html_content = re.sub(pattern, replacement, html_content, count=1)
    
    # Conversion basique du markdown restant en HTML
    html_content = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', html_content, flags=re.MULTILINE)
    html_content = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html_content, flags=re.MULTILINE)
    html_content = re.sub(r'\n\n(.*?)\n\n', r'<p>\1</p>\n\n', html_content)
    
    # Ajout des styles et des balises HTML
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{base_name}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 30px;
            line-height: 1.6;
        }}
        h1, h2 {{
            color: #2c3e50;
        }}
        h1 {{
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }}
        h2 {{
            margin-top: 30px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }}
        img {{
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            margin: 20px 0;
            border-radius: 8px;
        }}
        .page-break {{
            page-break-before: always;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>
"""
    
    # Écrire le HTML dans un fichier
    html_file = f"{base_name}_high_res.html"
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    logger.info(f"HTML généré avec succès: {html_file}")
    return html_file

def html_to_pdf(html_file, output_pdf):
    """Convertit un fichier HTML en PDF à l'aide de Puppeteer"""
    logger.info(f"Conversion du HTML en PDF: {html_file} -> {output_pdf}")
    
    try:
        import puppeteer
        from pyppeteer import launch
        import asyncio
        
        async def convert():
            browser = await launch()
            page = await browser.newPage()
            await page.goto(f'file://{os.path.abspath(html_file)}')
            await page.pdf({
                'path': output_pdf,
                'format': 'A4',
                'printBackground': True,
                'margin': {'top': '1cm', 'right': '1cm', 'bottom': '1cm', 'left': '1cm'}
            })
            await browser.close()
        
        asyncio.get_event_loop().run_until_complete(convert())
        logger.info(f"PDF généré avec succès: {output_pdf}")
        return True
    except ImportError:
        # Si pyppeteer n'est pas disponible, utiliser puppeteer via Node.js
        logger.info("Pyppeteer non disponible, utilisation de puppeteer via Node.js")
        
        # Créer un script JS temporaire
        js_script = f"""
        const puppeteer = require('puppeteer');

        (async () => {{
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('file://{os.path.abspath(html_file)}', {{
                waitUntil: 'networkidle0'
            }});
            await page.pdf({{
                path: '{output_pdf}',
                format: 'A4',
                printBackground: true,
                margin: {{ top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }}
            }});
            await browser.close();
            console.log('PDF généré avec succès!');
        }})();
        """
        
        script_file = "temp_convert_script.js"
        with open(script_file, 'w', encoding='utf-8') as f:
            f.write(js_script)
        
        try:
            subprocess.run(["node", script_file], check=True)
            os.remove(script_file)
            logger.info(f"PDF généré avec succès: {output_pdf}")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Erreur lors de la conversion en PDF: {e}")
            return False

def merge_pdfs(pdf_files, output_pdf):
    """Fusionne plusieurs fichiers PDF en un seul"""
    logger.info(f"Fusion de {len(pdf_files)} fichiers PDF")
    
    merger = PdfMerger()
    
    # Ajouter chaque PDF au document fusionné
    for pdf_file in pdf_files:
        merger.append(pdf_file)
    
    # Enregistrer le PDF fusionné
    merger.write(output_pdf)
    merger.close()
    
    logger.info(f"Fusion terminée: {output_pdf}")

def add_metadata_and_bookmarks(input_pdf, output_pdf, bookmarks=None):
    """Ajoute des métadonnées et des signets à un PDF"""
    logger.info(f"Ajout de métadonnées et signets au PDF")
    
    reader = PdfReader(input_pdf)
    writer = PdfWriter()
    
    # Copier toutes les pages
    for page in reader.pages:
        writer.add_page(page)
    
    # Ajouter des métadonnées
    writer.add_metadata({
        '/Title': 'CesiZen - Documentation UML',
        '/Author': 'CesiZen Team',
        '/Subject': 'Diagrammes UML pour l\'application CesiZen',
        '/Keywords': 'UML, diagrammes, cas d\'utilisation, séquence, architecture',
        '/Producer': 'High Quality PDF Generator'
    })
    
    # Ajouter des signets si fournis
    if bookmarks:
        for title, page_num in bookmarks:
            writer.add_outline_item(title, page_num)
    
    # Écrire le PDF final
    with open(output_pdf, 'wb') as f:
        writer.write(f)
    
    logger.info(f"PDF finalisé: {output_pdf}")

def process_markdown_files():
    """Traite tous les fichiers markdown avec des diagrammes Mermaid"""
    # Créer le dossier de sortie s'il n'existe pas
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    # Liste des fichiers markdown à traiter
    markdown_files = [
        "diagrammes_cas_utilisation.md",
        "diagrammes_sequence.md",
        "diagrammes_architecture_mcd.md",
        "diagrammes_complementaires.md"
    ]
    
    pdf_files = []
    bookmarks = []
    current_page = 0
    
    # Traiter chaque fichier
    for md_file in markdown_files:
        if not os.path.exists(md_file):
            logger.warning(f"Le fichier {md_file} n'existe pas, ignoré")
            continue
        
        logger.info(f"Traitement du fichier {md_file}")
        
        # Générer HTML avec images haute résolution
        html_file = generate_html_with_high_res_images(md_file)
        
        # Convertir HTML en PDF
        base_name = os.path.basename(md_file).replace('.md', '')
        pdf_file = f"{base_name}_high_res.pdf"
        
        if html_to_pdf(html_file, pdf_file):
            pdf_files.append(pdf_file)
            
            # Ajouter un signet
            title = base_name.replace('_', ' ').title()
            bookmarks.append((title, current_page))
            
            # Mettre à jour le numéro de page pour le prochain signet
            with open(pdf_file, 'rb') as f:
                pdf = PdfReader(f)
                current_page += len(pdf.pages)
    
    # Fusionner les PDFs individuels
    if pdf_files:
        temp_merged = "temp_merged.pdf"
        merge_pdfs(pdf_files, temp_merged)
        
        # Ajouter métadonnées et signets
        final_pdf = "CesiZen_Diagrammes_UML_HQ.pdf"
        add_metadata_and_bookmarks(temp_merged, final_pdf, bookmarks)
        
        # Nettoyer les fichiers temporaires
        for pdf_file in pdf_files:
            os.remove(pdf_file)
        os.remove(temp_merged)
        
        logger.info(f"Processus terminé! PDF final: {final_pdf}")
        return final_pdf
    else:
        logger.error("Aucun PDF généré!")
        return None

if __name__ == "__main__":
    process_markdown_files()
