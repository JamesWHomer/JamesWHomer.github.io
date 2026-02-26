# James Watson Homer - Personal Portfolio

My fairly modern and clean portfolio website. Hope you enjoy :)

## External dependency policy

To keep third-party risk low and make builds deterministic, this project uses the following rules:

- **Pinned + SRI-protected CDN assets**
  - Font Awesome is loaded from a pinned versioned URL on cdnjs and includes `integrity` + `crossorigin` attributes in `index.html`.
- **Self-hosted / local-first typography**
  - Google Fonts CSS is not loaded directly because that endpoint does not provide a stable SRI workflow.
  - Typography is defined through `assets/css/fonts.css` with local-first font stacks so the site does not depend on non-pinnable third-party CSS.
  - If branded webfonts are required in future, add font binaries under `assets/fonts/` and reference them via local `@font-face` rules.
- **First-party assets preferred**
  - Site styles and scripts should remain in-repo (`assets/`) wherever practical.
