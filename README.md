# Glenaeon Concordia Kit

Professional website implementation with mega menu navigation.

## Tech Stack
- HTML5
- CSS3 (LESS preprocessor)
- JavaScript (Vanilla)
- Bootstrap 5.3.2

## Setup

1. Install dependencies:
```bash
npm install
```

2. Compile LESS:
```bash
npm run build
```

3. Watch LESS files:
```bash
npm run watch
```

4. Run dev server:
```bash
npm run dev
```

## Deployment

### GitHub Pages Deployment

1. Build the project:
```bash
npm run build
```

2. The project is ready for GitHub Pages deployment. The build process compiles LESS to CSS.

3. GitHub Actions workflow is set up to automatically build on push to main/master branch.

### Manual Deployment

1. Build CSS:
```bash
npm run build
```

2. Commit and push to your repository:
```bash
git add .
git commit -m "Build for deployment"
git push
```

3. Enable GitHub Pages in repository settings and select the main branch.

## Project Structure

```
├── src/
│   ├── styles/
│   │   ├── style.less
│   │   ├── _variables.less
│   │   ├── _megamenu.less
│   │   └── _*.less
│   ├── scripts/
│   │   ├── main.js
│   │   └── megamenu-animations.js
│   └── index.html
├── assets/
│   ├── images/
│   └── fonts/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── package.json
```


