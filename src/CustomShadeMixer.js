import React, { useState } from "react";

const CustomShadeMixer = ({ onSaveCustomShade, onClose }) => {
  const [selectedShades, setSelectedShades] = useState([]);

  // All available base shades for mixing
  const baseShades = [
    { id: "b1", name: "Ultra Light", color: "#FFE4D0" },
    { id: "b2", name: "Light Beige", color: "#F5DCBE" },
    { id: "b3", name: "Natural", color: "#E8C5A5" },
    { id: "b4", name: "Medium Beige", color: "#D4A88B" },
    { id: "b5", name: "Golden", color: "#C08E6C" },
    { id: "b6", name: "Warm Sand", color: "#B67C51" },
    { id: "b7", name: "Deep Bronze", color: "#8D5524" },
    { id: "b8", name: "Rich Mocha", color: "#6B4423" },
  ];

  // Handle selecting/deselecting shades
  const handleShadeSelect = (shade) => {
    if (selectedShades.find((s) => s.id === shade.id)) {
      // If already selected, remove it
      setSelectedShades(selectedShades.filter((s) => s.id !== shade.id));
    } else if (selectedShades.length < 4) {
      // If not selected and less than 4 selections, add it
      setSelectedShades([...selectedShades, shade]);
    }
  };

  // Mix the selected shades to create a new color
  const mixShades = () => {
    if (selectedShades.length !== 4) return null;

    // Convert hex colors to RGB and calculate average
    const rgbValues = selectedShades.map((shade) => {
      const hex = shade.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    });

    // Calculate the mixed color by averaging RGB values
    const mixedRGB = rgbValues.reduce(
      (acc, curr) => ({
        r: acc.r + curr.r / 4,
        g: acc.g + curr.g / 4,
        b: acc.b + curr.b / 4,
      }),
      { r: 0, g: 0, b: 0 }
    );

    // Convert back to hex
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(mixedRGB.r)}${toHex(mixedRGB.g)}${toHex(mixedRGB.b)}`;
  };

  // Save the custom shade
  const handleSave = () => {
    const mixedColor = mixShades();
    if (mixedColor) {
      onSaveCustomShade({
        id: "custom-1",
        name: "My Custom Pearl",
        color: mixedColor,
        price: "$24.99",
      });
      onClose();
    }
  };

  return (
    <div className="custom-shade-mixer">
      <div className="mixer-header">
        <h3>Create Your Custom Shade</h3>
        <p>Select exactly 4 shades to create your perfect blend</p>
      </div>

      {/* Grid of base shades */}
      <div className="base-shades-grid">
        {baseShades.map((shade) => (
          <button
            key={shade.id}
            className={`base-shade-button ${
              selectedShades.find((s) => s.id === shade.id) ? "selected" : ""
            }`}
            style={{ backgroundColor: shade.color }}
            onClick={() => handleShadeSelect(shade)}
            disabled={
              selectedShades.length >= 4 &&
              !selectedShades.find((s) => s.id === shade.id)
            }
          >
            <span className="shade-name">{shade.name}</span>
          </button>
        ))}
      </div>

      {/* Preview section */}
      <div className="mixer-preview">
        <h4>Selected Shades: {selectedShades.length}/4</h4>
        <div className="selected-shades">
          {selectedShades.map((shade) => (
            <div
              key={shade.id}
              className="selected-shade-preview"
              style={{ backgroundColor: shade.color }}
            >
              <span>{shade.name}</span>
            </div>
          ))}
        </div>

        {/* Show mixed result when 4 shades are selected */}
        {selectedShades.length === 4 && (
          <div className="mixed-result">
            <h4>Your Custom Shade</h4>
            <div
              className="mixed-shade-preview"
              style={{ backgroundColor: mixShades() }}
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mixer-actions">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="save-button"
          disabled={selectedShades.length !== 4}
          onClick={handleSave}
        >
          Save Custom Shade
        </button>
      </div>
    </div>
  );
};

export default CustomShadeMixer;
