import React, { useState, useEffect } from "react";

const CustomShadeMixer = ({ onSaveCustomShade, onClose }) => {
  const [selectedShades, setSelectedShades] = useState([]);
  const [mixedPreview, setMixedPreview] = useState(null);
  const [mixName, setMixName] = useState("My Custom Pearl");
  const [customNameInput, setCustomNameInput] = useState(false);

  // Enhanced base shades including brand colors
  const baseShades = [
    { id: "b1", name: "Pearl Light", color: "#FFE4E1" },
    { id: "b2", name: "Rose Gold", color: "#B76E79" },
    { id: "b3", name: "Pearl White", color: "#F8F6F4" },
    { id: "b4", name: "Light Beige", color: "#F5DCBE" },
    { id: "b5", name: "Natural", color: "#E8C5A5" },
    { id: "b6", name: "Medium Beige", color: "#D4A88B" },
    { id: "b7", name: "Golden", color: "#C08E6C" },
    { id: "b8", name: "Warm Sand", color: "#B67C51" },
    { id: "b9", name: "Deep Bronze", color: "#8D5524" },
    { id: "b10", name: "Rich Mocha", color: "#6B4423" },
    { id: "b11", name: "Soft Pink", color: "#FFD1DC" },
    { id: "b12", name: "Warm Rose", color: "#C4818B" },
  ];

  // Handle shade selection
  const handleShadeSelect = (shade) => {
    if (selectedShades.find((s) => s.id === shade.id)) {
      setSelectedShades(selectedShades.filter((s) => s.id !== shade.id));
    } else if (selectedShades.length < 4) {
      setSelectedShades([...selectedShades, shade]);
    }
  };

  // Enhanced mixing algorithm
  const mixShades = () => {
    if (selectedShades.length === 0) return null;

    const rgbValues = selectedShades.map((shade) => {
      const hex = shade.color.replace("#", "");
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    });

    const totalShades = selectedShades.length;
    const mixedRGB = rgbValues.reduce(
      (acc, curr) => ({
        r: acc.r + curr.r / totalShades,
        g: acc.g + curr.g / totalShades,
        b: acc.b + curr.b / totalShades,
      }),
      { r: 0, g: 0, b: 0 }
    );

    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(mixedRGB.r)}${toHex(mixedRGB.g)}${toHex(mixedRGB.b)}`;
  };

  // Update mixed preview when shades change
  useEffect(() => {
    setMixedPreview(mixShades());
  }, [selectedShades]);

  // Handle saving custom shade
  const handleSave = () => {
    if (mixedPreview) {
      onSaveCustomShade({
        id: `custom-${Date.now()}`,
        name: mixName,
        color: mixedPreview,
        price: "$24.99",
        isCustom: true,
      });
      onClose();
    }
  };

  const handleNameChange = (e) => {
    setMixName(e.target.value);
  };

  return (
    <div className="custom-shade-mixer">
      <div className="mixer-header">
        <h3>Create Your Custom Pearl Shade</h3>
        <p>Select up to 4 shades to create your perfect blend</p>
      </div>

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

      <div className="mixer-preview">
        <h4>Selected Shades: {selectedShades.length}/4</h4>
        <div className="selected-shades">
          {selectedShades.map((shade) => (
            <div
              key={shade.id}
              className="selected-shade-preview"
              style={{ backgroundColor: shade.color }}
              onClick={() => handleShadeSelect(shade)}
            >
              <span>{shade.name}</span>
            </div>
          ))}
        </div>

        {mixedPreview && (
          <div className="mixed-result">
            <h4>Your Custom Pearl Shade</h4>
            <div
              className="mixed-shade-preview"
              style={{ backgroundColor: mixedPreview }}
            />
            <div className="custom-name-section">
              {customNameInput ? (
                <input
                  type="text"
                  value={mixName}
                  onChange={handleNameChange}
                  className="custom-name-input"
                  placeholder="Enter custom shade name"
                  maxLength={20}
                />
              ) : (
                <button
                  className="name-edit-button"
                  onClick={() => setCustomNameInput(true)}
                >
                  {mixName} (Click to customize name)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mixer-actions">
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="save-button"
          disabled={!mixedPreview}
          onClick={handleSave}
        >
          Save Custom Shade
        </button>
      </div>
    </div>
  );
};

export default CustomShadeMixer;