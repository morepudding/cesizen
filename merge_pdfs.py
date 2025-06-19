import os
from PyPDF2 import PdfMerger, PdfReader, PdfWriter
from io import BytesIO

def add_bookmarks(merger, input_files):
    """Ajoute des signets pour chaque fichier PDF dans le document fusionné"""
    bookmarks = {
        'diagrammes_cas_utilisation.pdf': 'Diagrammes de Cas d\'Utilisation',
        'diagrammes_sequence.pdf': 'Diagrammes de Séquence',
        'diagrammes_architecture_mcd.pdf': 'Diagrammes d\'Architecture et MCD',
        'diagrammes_complementaires.pdf': 'Diagrammes Complémentaires'
    }
    
    current_page = 0
    for pdf_file in input_files:
        file_name = os.path.basename(pdf_file)
        reader = PdfReader(pdf_file)
        num_pages = len(reader.pages)
        
        if file_name in bookmarks:
            merger.add_outline_item(bookmarks[file_name], current_page)
        
        current_page += num_pages

def optimize_pdf(input_path, output_path):
    """Optimise la qualité des diagrammes dans le PDF"""
    reader = PdfReader(input_path)
    writer = PdfWriter()
    
    # Copier toutes les pages avec une qualité améliorée
    for i in range(len(reader.pages)):
        page = reader.pages[i]
        # Conserver la page avec ses propriétés originales
        writer.add_page(page)
        
        # Augmenter la qualité des images si possible
        if hasattr(writer, 'set_page_compression'):  # Certaines versions supportent cette option
            writer.set_page_compression(i, 0)  # Désactive la compression pour cette page
    
    # Ajouter des métadonnées
    writer.add_metadata({
        '/Title': 'Documentation CesiZen - Diagrammes UML',
        '/Author': 'CesiZen Team',
        '/Subject': 'Diagrammes UML pour l\'application CesiZen',
        '/Keywords': 'UML, diagrammes, cas d\'utilisation, séquence, classes, architecture, MCD, états, déploiement, activité',
        '/Producer': 'PyPDF2'
    })
    
    # Écrire le PDF optimisé
    with open(output_path, 'wb') as output_file:
        writer.write(output_file)

def main():
    print("Démarrage du processus de fusion des PDFs...")
    # Ordre des fichiers à fusionner
    input_files = [
        'diagrammes_cas_utilisation.pdf',
        'diagrammes_sequence.pdf', 
        'diagrammes_architecture_mcd.pdf',
        'diagrammes_complementaires.pdf'
    ]
    
    # Vérifier que tous les fichiers existent
    for pdf_file in input_files:
        if not os.path.exists(pdf_file):
            print(f"Erreur: Le fichier {pdf_file} n'existe pas!")
            return
        else:
            print(f"Fichier trouvé: {pdf_file}")
    
    merged_pdf = 'CesiZen_Diagrammes_UML_v1.0.pdf'
    temp_merged_pdf = 'temp_merged.pdf'
    
    # Fusionner les PDFs
    merger = PdfMerger()
    
    for pdf_file in input_files:
        merger.append(pdf_file)
    
    # Ajouter des signets
    add_bookmarks(merger, input_files)
    
    # Enregistrer le fichier fusionné temporaire
    merger.write(temp_merged_pdf)
    merger.close()
    
    # Optimiser la qualité et ajouter des métadonnées
    print(f"Optimisation du PDF fusionné...")
    optimize_pdf(temp_merged_pdf, merged_pdf)
    
    # Supprimer le fichier temporaire
    os.remove(temp_merged_pdf)
    
    print(f"Les PDFs ont été fusionnés avec succès dans: {merged_pdf}")

if __name__ == "__main__":
    main()
