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

### GitHub Pages Deployment (Automatic)

The project is set up for automatic deployment via GitHub Actions:

1. **Enable GitHub Pages in Repository Settings:**
   - Go to your repository → Settings → Pages
   - Under "Source", select **"GitHub Actions"** (not "Deploy from a branch")
   - Save the settings

2. **Push to main/master branch:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **The workflow will automatically:**
   - Build the CSS from LESS files
   - Deploy to GitHub Pages
   - Your site will be available at `https://[username].github.io/[repository-name]`

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

3. If using branch-based deployment, enable GitHub Pages in repository settings and select the main branch.

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


