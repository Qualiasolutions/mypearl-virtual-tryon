// CustomShadeMixer.js
import React, { useState, useEffect, useCallback } from "react";

const CustomShadeMixer = ({ onSaveCustomShade, onClose }) => {
  const [selectedShades, setSelectedShades] = useState([]);
  const [mixedColor, setMixedColor] = useState(null);

  const baseShades = [
    { id: "b1", name: "Ultra Light", color: "#FFE4D0" },
    { id: "b2", name: "Light Beige", color: "#F5DCBE" },
    { id: "b3", name: "Natural", color: "#E8C5A5" },
    { id: "b4", name: "Medium Beige", color: "#D4A88B" },
    { id: "b5", name: "Golden", color: "#C08E6C" },
    { id: "b6", name: "Warm Sand", color: "#B67C51" },
    { id: "b7", name: "Deep Bronze", color: "#8D5524" },
    { id: "b8", name: "Rich Mocha", color: "#6B4423" }
  ];

  const mixShades = useCallback(() => {
    if (selectedShades.length === 0) return null;

    const rgbValues = selectedShades.map(shade => {
      const hex = shade.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    });

    const mixedRGB = rgbValues.reduce(
      (acc, curr, _, array) => ({
        r: acc.r + curr.r / array.length,
        g: acc.g + curr.g / array.length,
        b: acc.b + curr.b / array.length
      }),
      { r: 0, g: 0, b: 0 }
    );

    const toHex = n => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(mixedRGB.r)}${toHex(mixedRGB.g)}${toHex(mixedRGB.b)}`;
  }, [selectedShades]);

  useEffect(() => {
    const newMixedColor = mixShades();
    setMixedColor(newMixedColor);
  }, [mixShades]);

  const handleShadeSelect = (shade) => {
    if (selectedShades.find(s => s.id === shade.id)) {
      setSelectedShades(prev => prev.filter(s => s.id !== shade.id));
    } else if (selectedShades.length < 4) {
      setSelectedShades(prev => [...prev, shade]);
    }
  };

  const handleSave = () => {
    if (mixedColor) {
      onSaveCustomShade({
        id: `custom-${Date.now()}`,
        name: "My Custom Pearl",
        color: mixedColor,
        price: "$24.99"
      });
      onClose();
    }
  };

  return (
    <div className="custom-shade-mixer">
      <div className="mixer-header">
        <h3>Create Your Perfect Shade</h3>
        <button className="close-button" onClick={onClose}>×</button>
        <p>Select up to 4 shades to create your unique blend</p>
      </div>

      <div className="mixer-content">
        <div className="selected-shades-section">
          <h4>Selected Shades: {selectedShades.length}/4</h4>
          <div className="selected-shades-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="shade-slot">
                {selectedShades[index] ? (
                  <div 
                    className="selected-shade"
                    style={{ backgroundColor: selectedShades[index].color }}
                    onClick={() => handleShadeSelect(selectedShades[index])}
                  >
                    <span className="remove-shade">×</span>
                  </div>
                ) : (
                  <div className="empty-slot">+</div>
                )}
              </div>
            ))}
          </div>

          {mixedColor && (
            <div className="mixed-result">
              <h4>Your Custom Shade</h4>
              <div 
                className="mixed-shade-preview"
                style={{ backgroundColor: mixedColor }}
              >
                <div className="shine-effect"></div>
              </div>
            </div>
          )}
        </div>

        <div className="available-shades-section">
          <h4>Available Shades</h4>
          <div className="available-shades-grid">
            {baseShades.map(shade => (
              <button
                key={shade.id}
                onClick={() => handleShadeSelect(shade)}
                disabled={selectedShades.length >= 4 && !selectedShades.find(s => s.id === shade.id)}
                className={`base-shade ${
                  selectedShades.find(s => s.id === shade.id) ? 'selected' : ''
                }`}
                style={{ backgroundColor: shade.color }}
              >
                <div className="shade-info">
                  <span className="shade-name">{shade.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mixer-actions">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="save-button"
          onClick={handleSave}
          disabled={!mixedColor}
        >
          Create My Shade
        </button>
      </div>
    </div>
  );
};

export default CustomShadeMixer;