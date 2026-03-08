# 3D Printing Material Recommender - Project Summary

**Created:** March 8, 2026  
**Framework:** React + Vite  
**Theme:** Light mode with clean, professional design

---

## 📋 Project Overview

An interactive web app to help clients choose the best 3D printing material (PLA, PETG, ABS, ASA, TPU) for their specific application, with a focus on video game cartridge housing recommendations.

### Key Features
- **Application-based recommendations** - Select from preset applications or create custom requirements
- **Material comparison cards** - Visual property bars, specs, pros/cons
- **Side-by-side comparison builder** - Compare 3 materials in a detailed table
- **Price adjuster** - Scale prices based on actual vendor pricing
- **Print time estimator** - Estimated print times based on material properties

---

## 🗂️ File Structure

```
visualwebapp/
├── src/
│   ├── App.jsx          # Main application logic & components
│   ├── App.css          # All styling
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── package.json
└── dist/                # Production build
```

---

## 🧵 Materials Database

All materials include properties (1-10 scale), specifications, pricing, pros/cons, and best-use cases.

| Material | Full Name | Price (₱/kg) | Print Temp | Bed Temp | Key Strength |
|----------|-----------|--------------|------------|----------|--------------|
| **PLA** | Polylactic Acid | ₱1,299 | 190-220°C | 20-60°C | Easy to print |
| **PETG** | Polyethylene Terephthalate Glycol | ₱1,499 | 220-260°C | 70-80°C | Strong & durable |
| **ABS** | Acrylonitrile Butadiene Styrene | ₱1,399 | 220-250°C | 80-110°C | Impact resistance |
| **ASA** | Acrylonitrile Styrene Acrylate | ₱1,699 | 240-260°C | 90-110°C | UV resistance |
| **TPU** | Thermoplastic Polyurethane | ₱1,899 | 220-250°C | 20-60°C | Flexibility |

### Property Ratings (1-10)

| Material | Strength | Flexibility | Durability | Heat Res. | UV Res. | Ease | Surface | Cost |
|----------|----------|-------------|------------|-----------|---------|------|---------|------|
| PLA | 6 | 4 | 5 | 4 | 3 | 9 | 8 | 9 |
| PETG | 8 | 7 | 8 | 6 | 6 | 7 | 7 | 7 |
| ABS | 8 | 7 | 8 | 8 | 5 | 5 | 7 | 8 |
| ASA | 8 | 7 | 9 | 8 | 9 | 5 | 7 | 6 |
| TPU | 7 | 10 | 9 | 5 | 6 | 5 | 6 | 5 |

---

## 🎯 Application Profiles

Pre-configured applications with weighted property importance:

### Video Game Cartridge (Default)
- **High priority:** Durability (0.9), Surface Finish (0.8), Strength (0.7)
- **Requirements:** Min strength 6, min durability 7, min surface finish 6

### Other Applications
- **Outdoor Signage** - UV resistance focused
- **Mechanical Part** - Strength & durability focused
- **Prototype/Model** - Ease of printing & cost focused
- **Automotive Interior** - Heat resistance & durability focused
- **Custom** - User-adjustable weights

---

## 🔧 Components

### 1. ApplicationSelector
- Grid of clickable application buttons
- Custom mode with adjustable property weight sliders

### 2. RecommendationResult
- Ranked list with match percentages
- Shows why each material ranks where it does

### 3. MaterialCard
- Property bars (8 properties)
- Print specifications (temp, density, tensile)
- Pricing card with price level indicators
- Pros/cons lists

### 4. CostComparisonTable
- Visual bar chart comparing all material prices
- Sorted from cheapest to most expensive

### 5. ComparisonBuilder ⭐
- **3 material selectors** - Choose which materials to compare
- **Price Adjuster** - Enter actual price to scale all prices proportionally
- **Comparison Table** with rows for:
  - Full Name, Price (1kg), Est. Print Time
  - Print/Bed Temp, Density, Tensile Strength
  - All 8 properties with mini visual bars
- **Pros/Cons/Best For** columns below table

---

## 💡 Key Algorithms

### Recommendation Scoring
```javascript
score = Σ(property_value × weight) - penalties
```
Penalties applied if material doesn't meet minimum requirements.

### Scaled Price Calculation
```javascript
ratio = material_base_price / base_material_base_price
scaled_price = user_entered_price × ratio
```

### Print Time Estimation
```javascript
base_time = 60 minutes
ease_factor = 10 / ease_of_printing
temp_factor = 1.0 to 1.1 (based on print temperature)
estimated_time = base_time × ease_factor × temp_factor
```

---

## 🎨 Design System

### Colors
```css
--bg-primary: #ffffff
--bg-secondary: #f5f7fa
--bg-card: #ffffff
--text-primary: #2d3748
--text-secondary: #718096
--accent: #4f46e5
--success: #10b981
--danger: #ef4444
--border: #e2e8f0
```

### Material Colors
- PLA: `#4CAF50` (Green)
- PETG: `#2196F3` (Blue)
- ABS: `#FF9800` (Orange)
- ASA: `#9C27B0` (Purple)
- TPU: `#E91E63` (Pink)

---

## 🚀 Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production (local, uses base path '/')
npm run preview # Preview production build
npm run build:gh # Build for GitHub Pages (uses base path '/material-reco/')
```

---

## 🌐 Deployment

### GitHub Pages Setup

The project is configured for deployment to GitHub Pages at `https://niccoreyes.github.io/material-reco/`.

**Configuration:**
- `vite.config.js` uses conditional base path:
  - Local: `/` (default)
  - GitHub Pages: `/material-reco/` (when `GITHUB_PAGES=true`)
- GitHub Actions workflow (`.github/workflows/static.yml`) runs `npm run build:gh`

**Deploy Steps:**
1. Push to `main` branch (triggers auto-deploy via GitHub Actions)
2. Or manually run: `npm run build:gh` and push the `dist/` folder

**Important:** Always use `npm run build:gh` before pushing for deployment to ensure correct asset paths.

---

## 📝 Customization Guide

### Adding a New Material
1. Add entry to `MATERIALS_DB` in `App.jsx`:
```javascript
NEW: {
  name: 'NEW',
  fullName: 'New Material Name',
  color: '#HEXCOLOR',
  properties: { /* 8 properties 1-10 */ },
  specs: { /* print temps, density, tensile */ },
  pricing: { pricePerKg: '₱X,XXX', priceLevel: 1-3, description: '' },
  pros: [],
  cons: [],
  bestFor: [],
}
```

### Adding a New Application
1. Add entry to `APPLICATIONS_DB`:
```javascript
'application-key': {
  name: 'Application Name',
  icon: '🎯',
  description: 'Description text',
  weights: { /* 8 properties with 0.0-1.0 weights */ },
  requirements: { minProperty: value },
}
```

### Updating Prices
Edit `pricing.pricePerKg` in each material's `MATERIALS_DB` entry.

---

## 🎮 Video Game Cartridge Recommendation

For the original use case (video game cartridge housing), the app recommends:

1. **PETG** - Best overall (durable, good surface finish, moderate cost)
2. **PLA** - Budget option (easy to print, good finish, but less durable)
3. **ABS** - Durability option (impact resistant, but harder to print)

---

## 📸 For Client Screenshots

The app is designed for easy screenshot sharing:
- Clean, professional light theme
- All information visible in organized sections
- Comparison builder shows clear side-by-side data
- Price adjuster lets you show client-specific pricing

**Best sections for screenshots:**
1. Top Recommendations section
2. Full comparison table with adjusted prices
3. Individual material cards with property bars

---

## 🔮 Future Enhancements

Potential additions for future versions:
- Export comparison as PDF/image
- Save custom application profiles
- Multi-language support
- More materials (PC, Nylon, PVA, etc.)
- Printer-specific recommendations
- Filament brand database

---

## 📞 Usage Tips

1. **For quick recommendations:** Use the application selector and show top 3 recommendations
2. **For detailed comparison:** Use the Comparison Builder at the bottom
3. **For custom pricing:** Enter your actual vendor price in the Price Adjuster
4. **For client meetings:** Open on tablet/laptop and let clients interact with selectors

---

*Built with React, Vite, and CSS. No external UI libraries.*
