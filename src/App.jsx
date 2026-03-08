import { useState, useMemo } from 'react'
import './App.css'

// Material database - easily extensible for future use
// Pricing based on Bambu Lab filament spools (1kg)
const MATERIALS_DB = {
  PLA: {
    name: 'PLA',
    fullName: 'Polylactic Acid',
    color: '#4CAF50',
    properties: {
      strength: 6,
      flexibility: 4,
      durability: 5,
      heatResistance: 4,
      uvResistance: 3,
      easeOfPrinting: 9,
      surfaceFinish: 8,
      cost: 9,
    },
    specs: {
      printTemp: '190-220°C',
      bedTemp: '20-60°C',
      density: '1.24 g/cm³',
      tensileStrength: '50 MPa',
    },
    pricing: {
      pricePerKg: '₱1,299',
      priceLevel: 1,
      description: 'Most affordable option',
    },
    pros: ['Easy to print', 'Biodegradable', 'Low warping', 'Great surface finish', 'Affordable'],
    cons: ['Low heat resistance', 'Brittle', 'Poor UV resistance', 'Not suitable for outdoor use'],
    bestFor: ['Prototypes', 'Decorative items', 'Indoor models', 'Low-stress parts'],
  },
  PETG: {
    name: 'PETG',
    fullName: 'Polyethylene Terephthalate Glycol',
    color: '#2196F3',
    properties: {
      strength: 8,
      flexibility: 7,
      durability: 8,
      heatResistance: 6,
      uvResistance: 6,
      easeOfPrinting: 7,
      surfaceFinish: 7,
      cost: 7,
    },
    specs: {
      printTemp: '220-260°C',
      bedTemp: '70-80°C',
      density: '1.27 g/cm³',
      tensileStrength: '53 MPa',
    },
    pricing: {
      pricePerKg: '₱1,499',
      priceLevel: 2,
      description: 'Great value for functional parts',
    },
    pros: ['Strong and durable', 'Good chemical resistance', 'Food safe', 'Low warping', 'Good UV resistance'],
    cons: ['Stringing issues', 'Harder to post-process', 'Can absorb moisture'],
    bestFor: ['Functional parts', 'Outdoor applications', 'Mechanical parts', 'Containers'],
  },
  ABS: {
    name: 'ABS',
    fullName: 'Acrylonitrile Butadiene Styrene',
    color: '#FF9800',
    properties: {
      strength: 8,
      flexibility: 7,
      durability: 8,
      heatResistance: 8,
      uvResistance: 5,
      easeOfPrinting: 5,
      surfaceFinish: 7,
      cost: 8,
    },
    specs: {
      printTemp: '220-250°C',
      bedTemp: '80-110°C',
      density: '1.04 g/cm³',
      tensileStrength: '40 MPa',
    },
    pricing: {
      pricePerKg: '₱1,399',
      priceLevel: 2,
      description: 'Mid-range pricing',
    },
    pros: ['High impact resistance', 'Good heat resistance', 'Lightweight', 'Can be acetone smoothed'],
    cons: ['Warps easily', 'Requires enclosed printer', 'Fumes during printing', 'Poor UV resistance'],
    bestFor: ['Automotive parts', 'Enclosures', 'High-impact applications', 'LEGO-style parts'],
  },
  ASA: {
    name: 'ASA',
    fullName: 'Acrylonitrile Styrene Acrylate',
    color: '#9C27B0',
    properties: {
      strength: 8,
      flexibility: 7,
      durability: 9,
      heatResistance: 8,
      uvResistance: 9,
      easeOfPrinting: 5,
      surfaceFinish: 7,
      cost: 6,
    },
    specs: {
      printTemp: '240-260°C',
      bedTemp: '90-110°C',
      density: '1.07 g/cm³',
      tensileStrength: '45 MPa',
    },
    pricing: {
      pricePerKg: '₱1,699',
      priceLevel: 3,
      description: 'Premium outdoor material',
    },
    pros: ['Excellent UV resistance', 'Weather resistant', 'High heat resistance', 'Good mechanical properties'],
    cons: ['Warps easily', 'Requires enclosed printer', 'More expensive', 'Fumes during printing'],
    bestFor: ['Outdoor applications', 'Automotive exteriors', 'Signage', 'Weather-exposed parts'],
  },
  TPU: {
    name: 'TPU',
    fullName: 'Thermoplastic Polyurethane',
    color: '#E91E63',
    properties: {
      strength: 7,
      flexibility: 10,
      durability: 9,
      heatResistance: 5,
      uvResistance: 6,
      easeOfPrinting: 5,
      surfaceFinish: 6,
      cost: 5,
    },
    specs: {
      printTemp: '220-250°C',
      bedTemp: '20-60°C',
      density: '1.21 g/cm³',
      tensileStrength: '26 MPa',
    },
    pricing: {
      pricePerKg: '₱1,899',
      priceLevel: 3,
      description: 'Premium flexible material',
    },
    pros: ['Extremely flexible', 'Excellent impact resistance', 'Abrasion resistant', 'Vibration dampening', 'Elastic'],
    cons: ['Difficult to print', 'Stringing issues', 'Not rigid', 'Slower print speeds required'],
    bestFor: ['Flexible parts', 'Gaskets', 'Phone cases', 'Wearables', 'Vibration mounts'],
  },
}

// Application profiles with weighted importance for each property
const APPLICATIONS_DB = {
  'video-game-cartridge': {
    name: 'Video Game Cartridge',
    icon: '🎮',
    description: 'Housing for video game cartridges with internal electronics',
    weights: {
      strength: 0.7,
      flexibility: 0.5,
      durability: 0.9,
      heatResistance: 0.6,
      uvResistance: 0.5,
      easeOfPrinting: 0.6,
      surfaceFinish: 0.8,
      cost: 0.4,
    },
    requirements: {
      minStrength: 6,
      minDurability: 7,
      minSurfaceFinish: 6,
    },
  },
  'outdoor-signage': {
    name: 'Outdoor Signage',
    icon: '🪧',
    description: 'Signs and displays for outdoor use',
    weights: {
      strength: 0.5,
      flexibility: 0.3,
      durability: 0.8,
      heatResistance: 0.7,
      uvResistance: 1.0,
      easeOfPrinting: 0.4,
      surfaceFinish: 0.7,
      cost: 0.5,
    },
    requirements: {
      minUVResistance: 7,
      minDurability: 7,
    },
  },
  'mechanical-part': {
    name: 'Mechanical Part',
    icon: '⚙️',
    description: 'Functional mechanical components under stress',
    weights: {
      strength: 0.9,
      flexibility: 0.6,
      durability: 0.9,
      heatResistance: 0.7,
      uvResistance: 0.3,
      easeOfPrinting: 0.5,
      surfaceFinish: 0.4,
      cost: 0.5,
    },
    requirements: {
      minStrength: 7,
      minDurability: 7,
    },
  },
  'prototype': {
    name: 'Prototype / Model',
    icon: '📐',
    description: 'Quick prototypes and visual models',
    weights: {
      strength: 0.4,
      flexibility: 0.3,
      durability: 0.4,
      heatResistance: 0.3,
      uvResistance: 0.2,
      easeOfPrinting: 0.9,
      surfaceFinish: 0.7,
      cost: 0.8,
    },
    requirements: {
      minEaseOfPrinting: 6,
    },
  },
  'automotive-interior': {
    name: 'Automotive Interior',
    icon: '🚗',
    description: 'Interior car parts and accessories',
    weights: {
      strength: 0.7,
      flexibility: 0.5,
      durability: 0.8,
      heatResistance: 0.8,
      uvResistance: 0.4,
      easeOfPrinting: 0.5,
      surfaceFinish: 0.7,
      cost: 0.5,
    },
    requirements: {
      minHeatResistance: 6,
      minDurability: 7,
    },
  },
  'custom': {
    name: 'Custom Application',
    icon: '⚡',
    description: 'Define your own requirements',
    weights: null,
    requirements: {},
  },
}

function PropertyBar({ label, value, color }) {
  return (
    <div className="property-row">
      <span className="property-label">{label}</span>
      <div className="property-bar-bg">
        <div 
          className="property-bar-fill" 
          style={{ width: `${value * 10}%`, backgroundColor: color }}
        />
      </div>
      <span className="property-value">{value}/10</span>
    </div>
  )
}

function MaterialCard({ material, isRecommended, rank, onSelect, isSelected }) {
  const data = MATERIALS_DB[material]
  
  return (
    <div 
      className={`material-card ${isRecommended ? 'recommended' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(material)}
    >
      {isRecommended && <div className="recommendation-badge">#{rank} Recommended</div>}
      {isSelected && <div className="selected-badge">✓ Selected</div>}
      
      <div className="material-header" style={{ borderColor: data.color }}>
        <h3 style={{ color: data.color }}>{data.name}</h3>
        <span className="material-fullname">{data.fullName}</span>
      </div>
      
      <div className="properties-section">
        <PropertyBar label="Strength" value={data.properties.strength} color={data.color} />
        <PropertyBar label="Flexibility" value={data.properties.flexibility} color={data.color} />
        <PropertyBar label="Durability" value={data.properties.durability} color={data.color} />
        <PropertyBar label="Heat Resistance" value={data.properties.heatResistance} color={data.color} />
        <PropertyBar label="UV Resistance" value={data.properties.uvResistance} color={data.color} />
        <PropertyBar label="Ease of Printing" value={data.properties.easeOfPrinting} color={data.color} />
        <PropertyBar label="Surface Finish" value={data.properties.surfaceFinish} color={data.color} />
        <PropertyBar label="Cost Efficiency" value={data.properties.cost} color={data.color} />
      </div>
      
      <div className="specs-section">
        <h4>Print Specifications</h4>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Print Temp</span>
            <span className="spec-value">{data.specs.printTemp}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Bed Temp</span>
            <span className="spec-value">{data.specs.bedTemp}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Density</span>
            <span className="spec-value">{data.specs.density}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Tensile</span>
            <span className="spec-value">{data.specs.tensileStrength}</span>
          </div>
        </div>
      </div>

      <div className="pricing-section">
        <h4>💰 Cost (Bambu Lab, 1kg Spool)</h4>
        <div className="pricing-card">
          <div className="price-main">
            <span className="price-value">{data.pricing.pricePerKg}</span>
            <div className="price-level">
              {[1, 2, 3].map(level => (
                <span 
                  key={level} 
                  className={`price-dot ${level <= data.pricing.priceLevel ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <p className="price-description">{data.pricing.description}</p>
        </div>
      </div>
      
      <div className="pros-cons">
        <div className="pros">
          <h4>✓ Pros</h4>
          <ul>
            {data.pros.map((pro, i) => <li key={i}>{pro}</li>)}
          </ul>
        </div>
        <div className="cons">
          <h4>✗ Cons</h4>
          <ul>
            {data.cons.map((con, i) => <li key={i}>{con}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ApplicationSelector({ selected, onSelect, customWeights, onCustomWeightsChange }) {
  const applications = Object.entries(APPLICATIONS_DB)
  
  return (
    <div className="application-selector">
      <h3>Select Application Type</h3>
      <div className="application-grid">
        {applications.map(([key, app]) => (
          <button
            key={key}
            className={`application-btn ${selected === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
          >
            <span className="app-icon">{app.icon}</span>
            <span className="app-name">{app.name}</span>
          </button>
        ))}
      </div>
      
      {selected === 'custom' && (
        <div className="custom-weights">
          <h4>Adjust Property Importance</h4>
          <p className="hint">Drag sliders to weight what matters most for your application</p>
          {Object.entries(customWeights).map(([key, value]) => (
            <div key={key} className="weight-slider">
              <label>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input
                type="range"
                min="0"
                max="10"
                value={value * 10}
                onChange={(e) => onCustomWeightsChange(key, e.target.value / 10)}
              />
              <span className="weight-value">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RecommendationResult({ material, score, rank, totalScore }) {
  const data = MATERIALS_DB[material]
  const percentage = Math.round((score / totalScore) * 100)
  
  return (
    <div className={`recommendation-item rank-${rank}`}>
      <div className="rank-badge">{rank === 1 ? '🏆' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}</div>
      <div className="rec-content">
        <div className="rec-header">
          <h4 style={{ color: data.color }}>{data.name}</h4>
          <span className="match-score">{percentage}% Match</span>
        </div>
        <p className="rec-description">{data.fullName}</p>
        <div className="rec-reason">
          <strong>Why it's #{rank}:</strong>
          <span>
            {rank === 1 
              ? 'Best overall match for your requirements'
              : `Scores ${100 - percentage}% lower than top recommendation`}
          </span>
        </div>
      </div>
    </div>
  )
}

function CostComparisonTable() {
  const materials = Object.entries(MATERIALS_DB).sort((a, b) => 
    parseFloat(a[1].pricing.pricePerKg.replace('$', '')) - 
    parseFloat(b[1].pricing.pricePerKg.replace('$', ''))
  )

  return (
    <div className="cost-comparison">
      <h4>📊 Cost Comparison (Bambu Lab Filament)</h4>
      <div className="cost-table">
        <div className="cost-header">
          <span>Material</span>
          <span>Price/kg</span>
          <span>Relative Cost</span>
        </div>
        {materials.map(([key, data]) => (
          <div key={key} className="cost-row">
            <span className="cost-material" style={{ color: data.color }}>{data.name}</span>
            <span className="cost-price">{data.pricing.pricePerKg}</span>
            <div className="cost-bar">
              <div
                className="cost-bar-fill"
                style={{
                  width: `${(parseFloat(data.pricing.pricePerKg.replace('₱', '').replace(',', '')) / 1899) * 100}%`,
                  backgroundColor: data.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="cost-note">Prices based on Bambu Lab 1kg spools. Actual prices may vary by region and retailer.</p>
    </div>
  )
}

function ComparisonBuilder() {
  const materialOptions = Object.keys(MATERIALS_DB)
  const [selectedMaterials, setSelectedMaterials] = useState(['PLA', 'PETG', 'ABS'])
  const [basePrice, setBasePrice] = useState('')
  const [baseMaterial, setBaseMaterial] = useState('PLA')

  const handleMaterialChange = (index, value) => {
    const newSelection = [...selectedMaterials]
    newSelection[index] = value
    setSelectedMaterials(newSelection)
  }

  // Calculate scaled prices based on user input
  const getScaledPrice = (matKey) => {
    if (!basePrice || basePrice === '') {
      return MATERIALS_DB[matKey].pricing.pricePerKg
    }
    const baseMatBasePrice = parseFloat(MATERIALS_DB[baseMaterial].pricing.pricePerKg.replace('₱', '').replace(',', ''))
    const matBasePrice = parseFloat(MATERIALS_DB[matKey].pricing.pricePerKg.replace('₱', '').replace(',', ''))
    const ratio = matBasePrice / baseMatBasePrice
    const scaledPrice = Math.round(basePrice * ratio)
    return `₱${scaledPrice.toLocaleString()}`
  }

  // Calculate estimated print time (based on ease of printing and print temp)
  // Lower ease = slower printing needed, higher temp = longer heat time
  const getPrintTime = (matKey) => {
    const mat = MATERIALS_DB[matKey]
    const baseTime = 60 // minutes for a standard small print
    const easeFactor = 10 / mat.properties.easeOfPrinting // Lower ease = longer time
    const tempFactor = mat.specs.printTemp.includes('260') ? 1.1 : 
                       mat.specs.printTemp.includes('250') ? 1.05 : 1.0
    const estimatedTime = Math.round(baseTime * easeFactor * tempFactor)
    
    if (estimatedTime >= 60) {
      const hours = Math.floor(estimatedTime / 60)
      const mins = estimatedTime % 60
      return `${hours}h ${mins > 0 ? mins + 'm' : ''}`
    }
    return `${estimatedTime}m`
  }

  const comparisonRows = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'pricePerKg', label: 'Price (1kg)', isPricing: true },
    { key: 'printTime', label: 'Est. Print Time*', isCustom: true },
    { key: 'printTemp', label: 'Print Temperature', isSpec: true },
    { key: 'bedTemp', label: 'Bed Temperature', isSpec: true },
    { key: 'density', label: 'Density', isSpec: true },
    { key: 'tensileStrength', label: 'Tensile Strength', isSpec: true },
    { key: 'strength', label: 'Strength', isProperty: true },
    { key: 'flexibility', label: 'Flexibility', isProperty: true },
    { key: 'durability', label: 'Durability', isProperty: true },
    { key: 'heatResistance', label: 'Heat Resistance', isProperty: true },
    { key: 'uvResistance', label: 'UV Resistance', isProperty: true },
    { key: 'easeOfPrinting', label: 'Ease of Printing', isProperty: true },
    { key: 'surfaceFinish', label: 'Surface Finish', isProperty: true },
    { key: 'cost', label: 'Cost Efficiency', isProperty: true },
  ]

  return (
    <div className="comparison-builder">
      <h2>🔬 Side-by-Side Comparison</h2>
      <p className="comparison-intro">Select 3 materials to compare in detail</p>

      <div className="material-selectors">
        {[0, 1, 2].map(index => (
          <div key={index} className="selector-wrapper">
            <label>Material {index + 1}</label>
            <select
              value={selectedMaterials[index]}
              onChange={(e) => handleMaterialChange(index, e.target.value)}
            >
              {materialOptions.map(mat => (
                <option key={mat} value={mat}>{MATERIALS_DB[mat].name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="price-adjuster">
        <h4>💰 Price Adjuster</h4>
        <p className="adjuster-hint">Enter your actual price for a material to scale all prices proportionally</p>
        <div className="adjuster-inputs">
          <div className="adjuster-field">
            <label>If</label>
            <select value={baseMaterial} onChange={(e) => setBaseMaterial(e.target.value)}>
              {materialOptions.map(mat => (
                <option key={mat} value={mat}>{MATERIALS_DB[mat].name}</option>
              ))}
            </select>
          </div>
          <div className="adjuster-field">
            <label>costs</label>
            <input
              type="number"
              placeholder="Enter price"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value ? Number(e.target.value) : '')}
              min="0"
              step="1"
            />
          </div>
          <div className="adjuster-field">
            <label>per kg</label>
          </div>
        </div>
        {basePrice && (
          <button className="reset-btn" onClick={() => setBasePrice('')}>
            ✕ Reset to default prices
          </button>
        )}
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="feature-col">Feature</th>
              {selectedMaterials.map((matKey, index) => {
                const mat = MATERIALS_DB[matKey]
                return (
                  <th key={matKey} className="material-col" style={{ borderColor: mat.color }}>
                    <span className="mat-name" style={{ color: mat.color }}>{mat.name}</span>
                    <span className="mat-fullname">{mat.fullName}</span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map(row => (
              <tr key={row.key}>
                <td className="feature-label">{row.label}</td>
                {selectedMaterials.map(matKey => {
                  const mat = MATERIALS_DB[matKey]
                  let value

                  if (row.isPricing) {
                    value = getScaledPrice(matKey)
                  } else if (row.isCustom && row.key === 'printTime') {
                    value = getPrintTime(matKey)
                  } else if (row.isSpec) {
                    value = mat.specs[row.key]
                  } else if (row.isProperty) {
                    const propValue = mat.properties[row.key]
                    value = (
                      <div className="property-cell">
                        <span>{propValue}/10</span>
                        <div className="mini-bar">
                          <div
                            className="mini-bar-fill"
                            style={{ width: `${propValue * 10}%`, backgroundColor: mat.color }}
                          />
                        </div>
                      </div>
                    )
                  }

                  return (
                    <td key={matKey} className="feature-value">
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="table-note">*Est. Print Time based on a standard 100g benchmark print. Actual times vary by model and printer settings.</p>
      </div>

      <div className="comparison-pros-cons">
        {selectedMaterials.map(matKey => {
          const mat = MATERIALS_DB[matKey]
          return (
            <div key={matKey} className="pros-cons-col" style={{ borderColor: mat.color }}>
              <h4 style={{ color: mat.color }}>{mat.name}</h4>
              <div className="pros-list">
                <strong>✓ Pros:</strong>
                <ul>
                  {mat.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
              </div>
              <div className="cons-list">
                <strong>✗ Cons:</strong>
                <ul>
                  {mat.cons.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
              </div>
              <div className="best-for">
                <strong>Best For:</strong>
                <span>{mat.bestFor.join(', ')}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  const [selectedApplication, setSelectedApplication] = useState('video-game-cartridge')
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [customWeights, setCustomWeights] = useState({
    strength: 0.5,
    flexibility: 0.5,
    durability: 0.5,
    heatResistance: 0.5,
    uvResistance: 0.5,
    easeOfPrinting: 0.5,
    surfaceFinish: 0.5,
    cost: 0.5,
  })
  const [showAllMaterials, setShowAllMaterials] = useState(false)

  // Calculate recommendations based on application
  const recommendations = useMemo(() => {
    const app = APPLICATIONS_DB[selectedApplication]
    const weights = selectedApplication === 'custom' ? customWeights : app.weights
    
    if (!weights) return []
    
    const scores = Object.keys(MATERIALS_DB).map(material => {
      const props = MATERIALS_DB[material].properties
      let score = 0
      
      Object.entries(weights).forEach(([key, weight]) => {
        score += props[key] * weight
      })
      
      // Apply requirements filtering
      if (app.requirements) {
        Object.entries(app.requirements).forEach(([req, minValue]) => {
          const reqProp = req.replace('min', '')
          const actualKey = reqProp.charAt(0).toLowerCase() + reqProp.slice(1)
          if (props[actualKey] < minValue) {
            score -= (minValue - props[actualKey]) * 2
          }
        })
      }
      
      return { material, score }
    })
    
    return scores.sort((a, b) => b.score - a.score)
  }, [selectedApplication, customWeights])

  const handleCustomWeightsChange = (key, value) => {
    setCustomWeights(prev => ({ ...prev, [key]: value }))
  }

  const currentApp = APPLICATIONS_DB[selectedApplication]

  return (
    <div className="app">
      <header className="app-header">
        <h1>🖨️ 3D Printing Material Recommender</h1>
        <p>Find the perfect filament for your project</p>
      </header>

      <main className="app-main">
        <section className="selector-section">
          <ApplicationSelector
            selected={selectedApplication}
            onSelect={setSelectedApplication}
            customWeights={customWeights}
            onCustomWeightsChange={handleCustomWeightsChange}
          />
          
          {selectedApplication !== 'custom' && (
            <div className="application-info">
              <h3>{currentApp.icon} {currentApp.name}</h3>
              <p>{currentApp.description}</p>
              <div className="key-requirements">
                <h4>Key Considerations:</h4>
                {currentApp.weights && Object.entries(currentApp.weights)
                  .filter(([, v]) => v >= 0.7)
                  .map(([k]) => (
                    <span key={k} className="requirement-tag">
                      {k.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </section>

        <section className="recommendations-section">
          <h2>🎯 Top Recommendations</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <RecommendationResult
                key={rec.material}
                material={rec.material}
                score={rec.score}
                rank={index + 1}
                totalScore={recommendations[0]?.score || 1}
              />
            ))}
          </div>
        </section>

        <section className="cost-section">
          <CostComparisonTable />
        </section>

        <section className="materials-section">
          <div className="materials-header">
            <h2>📊 Material Comparison</h2>
            <button 
              className="toggle-btn"
              onClick={() => setShowAllMaterials(!showAllMaterials)}
            >
              {showAllMaterials ? 'Show Less' : 'Show All Details'}
            </button>
          </div>
          
          <div className="materials-grid">
            {recommendations.map((rec, index) => (
              <MaterialCard
                key={rec.material}
                material={rec.material}
                isRecommended={index < 3}
                rank={index + 1}
                isSelected={selectedMaterial === rec.material}
                onSelect={setSelectedMaterial}
              />
            ))}
          </div>
        </section>

        {selectedMaterial && (
          <section className="selected-summary">
            <h2>✓ Selected: {MATERIALS_DB[selectedMaterial].name}</h2>
            <p>{MATERIALS_DB[selectedMaterial].fullName}</p>
            <div className="quick-specs">
              <div className="quick-spec">
                <span className="qs-label">Print Temperature</span>
                <span className="qs-value">{MATERIALS_DB[selectedMaterial].specs.printTemp}</span>
              </div>
              <div className="quick-spec">
                <span className="qs-label">Bed Temperature</span>
                <span className="qs-value">{MATERIALS_DB[selectedMaterial].specs.bedTemp}</span>
              </div>
              <div className="quick-spec">
                <span className="qs-label">Best For</span>
                <span className="qs-value">{MATERIALS_DB[selectedMaterial].bestFor.slice(0, 2).join(', ')}</span>
              </div>
            </div>
          </section>
        )}

        <section className="comparison-section">
          <ComparisonBuilder />
        </section>
      </main>

      <footer className="app-footer">
        <p>3D Printing Material Recommender • Built for client consultations</p>
      </footer>
    </div>
  )
}

export default App
