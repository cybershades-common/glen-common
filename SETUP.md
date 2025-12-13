# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile LESS to CSS**
   ```bash
   npm run build
   ```

3. **Watch for Changes (Optional)**
   ```bash
   npm run watch
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   This will open your browser at `http://localhost:3000`

## Project Structure

```
glenaeon/
├── assets/
│   ├── fonts/          # Custom fonts (Averta, Born Ready)
│   └── images/         # Images and graphics
├── dist/
│   └── css/
│       └── main.css    # Compiled CSS (generated)
├── src/
│   ├── scripts/
│   │   └── main.js     # JavaScript functionality
│   ├── styles/
│   │   ├── main.less   # Main LESS file
│   │   ├── variables.less   # Design tokens
│   │   ├── components.less  # Reusable components
│   │   └── mega-menu.less   # Mega menu styles
│   └── index.html      # Development HTML
├── index.html          # Main HTML file
├── package.json
└── README.md
```

## Assets

### Fonts
Place custom fonts in `assets/fonts/`:
- Averta (Regular, Bold, ExtraBold)
- Born Ready (Regular)

### Images
Place images in `assets/images/`:
- Logo files
- Hero background
- Pattern textures
- Event images

Currently using Figma API URLs (expire after 7 days). Replace with local files once downloaded.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies

- **HTML5**
- **CSS3** (via LESS preprocessor)
- **JavaScript** (Vanilla ES6+)
- **Bootstrap 5.3.2** (CDN)
- **Font Awesome 6** (CDN)
- **LESS 4.2.0** (for CSS preprocessing)


