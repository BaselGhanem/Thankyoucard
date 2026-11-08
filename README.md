# محمد الشريدة — مساحة التقدير

Static HTML/CSS/JavaScript card generator for GitHub Pages. Open index.html through a static web server. No build, API, external CDN, or account required.

- Paste Excel rows or cells, edit names, remove duplicates, and retain the list in browser localStorage.
- Export one selected card, a multi-page PDF, or a ZIP of individual PDFs.
- Original artwork, logos, slide proportions, text content, and text box coordinates from the supplied PPTX are retained. Long names shrink to fit.
- Open Sans ExtraBold matches the supplied name/title font. The supplied PPTX references Aptos without embedding it; Liberation Sans is bundled for the remaining text. This is a font substitution, so typography is not pixel-identical to PowerPoint with Aptos installed.
- PDFs contain 2400 × 1350 rendered card images at the original 1058.25 × 595.25 pt page size. Export is local to the browser; names are not uploaded. Large batches require additional memory.

Verified: combined PDF page count/dimensions, selected Arabic card, ZIP integrity and individual PDFs, duplicate removal, list restoration.
