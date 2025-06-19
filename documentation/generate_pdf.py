import re
from pathlib import Path
import markdown2
from playwright.sync_api import sync_playwright

# Get the directory of the current script
SCRIPT_DIR = Path(__file__).resolve().parent

# 1) Configuration des chemins
MD_FILE = SCRIPT_DIR / "../diagramme/diagramme.md"   # ton Markdown
PDF_FILE = SCRIPT_DIR / "../diagramme/diagramme.pdf"

# 2) Lecture et pré‑traitement du Markdown
md = MD_FILE.read_text(encoding="utf-8")
# Remplace chaque bloc ```mermaid``` par <div class="mermaid">…</div>
md = re.sub(
    r'```mermaid\s+([\s\S]+?)```',
    r'<div class="mermaid">\1</div>',
    md,
    flags=re.MULTILINE
)

# 3) Conversion Markdown → HTML
body = markdown2.markdown(md, extras=["fenced-code-blocks"])
html = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", () => {{
      mermaid.initialize({{ startOnLoad: true }});
    }});
  </script>
  <style>
    body {{ font-family: sans-serif; margin: 1rem; }}
    .mermaid {{ text-align: center; margin: 1em 0; }}
  </style>
</head>
<body>
{body}
</body>
</html>"""

# 4) Lancement de Chromium headless et génération du PDF
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.set_content(html, wait_until="networkidle")
    # On attend que Mermaid ait généré les SVG dans les div.mermaid
    page.wait_for_selector("div.mermaid svg", timeout=60000) # Increased timeout for potentially complex diagrams
    page.pdf(path=str(PDF_FILE), format="A4", print_background=True)
    browser.close()

print(f"✅ PDF généré : {PDF_FILE.resolve()}")
