import React, { useState, useRef, useEffect } from "react";
import CustomShadeMixer from "./CustomShadeMixer";

const VirtualTryOn = () => {
  // All the states we need
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedShade, setSelectedShade] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [inputMethod, setInputMethod] = useState(null);
  const [showMixer, setShowMixer] = useState(false);
  const [customShade, setCustomShade] = useState(null);

  // Default concealer shades
  const concealerShades = [
    { id: 1, name: "Fair Pearl", color: "#F5DCBE", price: "$24.99" },
    { id: 2, name: "Light Pearl", color: "#E8C5A5", price: "$24.99" },
    { id: 3, name: "Medium Pearl", color: "#D4A88B", price: "$24.99" },
    { id: 4, name: "Tan Pearl", color: "#C08E6C", price: "$24.99" },
    { id: 5, name: "Deep Pearl", color: "#8D5524", price: "$24.99" },
  ];

  // Camera cleanup on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Start camera function
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setCameraError(false);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(true);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input method selection (camera or upload)
  const handleInputMethodSelect = (method) => {
    setInputMethod(method);
    if (method === "camera") {
      startCamera();
      setUploadedImage(null);
    } else {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setIsStreaming(false);
    }
  };

  // Handle shade selection
  const handleShadeSelect = (shade) => {
    setSelectedShade(shade);
  };

  // Handle purchase button click
  const handlePurchase = () => {
    if (selectedShade) {
      alert(`Thank you for your interest in ${selectedShade.name}! 
      In a full implementation, this would add ${selectedShade.name} to your cart.`);
    }
  };

  return (
    <div className="try-on-container">
      {/* Method Selection (Camera or Upload) */}
      {!inputMethod && (
        <div className="method-selection">
          <h3>Choose Your Try-On Method</h3>
          <div className="method-buttons">
            <button onClick={() => handleInputMethodSelect("camera")}>
              Use Camera
            </button>
            <button onClick={() => handleInputMethodSelect("upload")}>
              Upload Photo
            </button>
          </div>
        </div>
      )}

      {/* Display Area */}
      {inputMethod && (
        <div className="display-area">
          <button
            className="change-method-btn"
            onClick={() => setInputMethod(null)}
          >
            Change Method
          </button>

          <div className="video-container">
            {inputMethod === "camera" &&
              (cameraError ? (
                <div className="camera-error">
                  <p>Camera access is required for virtual try-on.</p>
                  <button onClick={startCamera}>Try Again</button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-feed"
                />
              ))}

            {inputMethod === "upload" && (
              <div className="upload-area">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                ) : (
                  <div className="upload-prompt">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <p>Upload a front-facing photo</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shade Selection Area */}
      <div className="shade-selector">
        <h3>Select Your Shade</h3>
        <div className="shade-options">
          {/* Regular Shades */}
          {concealerShades.map((shade) => (
            <button
              key={shade.id}
              className={`shade-button ${
                selectedShade?.id === shade.id ? "selected" : ""
              }`}
              style={{ backgroundColor: shade.color }}
              onClick={() => handleShadeSelect(shade)}
              title={shade.name}
            >
              <span className="shade-name">{shade.name}</span>
            </button>
          ))}

          {/* Custom Shade (if created) */}
          {customShade && (
            <button
              className={`shade-button ${
                selectedShade?.id === customShade.id ? "selected" : ""
              }`}
              style={{ backgroundColor: customShade.color }}
              onClick={() => handleShadeSelect(customShade)}
              title={customShade.name}
            >
              <span className="shade-name">{customShade.name}</span>
            </button>
          )}

          {/* Create Custom Shade Button */}
          <button
            className="shade-button custom-shade-button"
            onClick={() => setShowMixer(true)}
          >
            <span className="shade-name">Create Custom Shade</span>
          </button>
        </div>

        {/* Selected Shade Info */}
        {selectedShade && (
          <div className="selected-shade-info">
            <h4>Selected Shade: {selectedShade.name}</h4>
            <p>Price: {selectedShade.price}</p>
            <button className="purchase-button" onClick={handlePurchase}>
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Custom Shade Mixer Modal */}
      {showMixer && (
        <div className="modal-overlay">
          <CustomShadeMixer
            onSaveCustomShade={(shade) => {
              setCustomShade(shade);
              setShowMixer(false);
            }}
            onClose={() => setShowMixer(false)}
          />
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
