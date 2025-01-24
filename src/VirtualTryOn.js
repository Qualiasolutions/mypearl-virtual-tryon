// VirtualTryOn.js
import React, { useState, useRef, useEffect } from "react";
import CustomShadeMixer from "./CustomShadeMixer";
import FaceShader from "./services/FaceShader";

const VirtualTryOn = () => {
  const videoRef = useRef(null);
  const [inputMethod, setInputMethod] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedShade, setSelectedShade] = useState(null);
  const [showMixer, setShowMixer] = useState(false);
  const [customShade, setCustomShade] = useState(null);

  const concealerShades = [
    { id: 1, name: "Fair Pearl", color: "#F5DCBE", price: "$24.99" },
    { id: 2, name: "Light Pearl", color: "#E8C5A5", price: "$24.99" },
    { id: 3, name: "Medium Pearl", color: "#D4A88B", price: "$24.99" },
    { id: 4, name: "Tan Pearl", color: "#C08E6C", price: "$24.99" },
    { id: 5, name: "Deep Pearl", color: "#8D5524", price: "$24.99" }
  ];

  // Clean up video stream on unmount
  useEffect(() => {
    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo?.srcObject) {
        const tracks = currentVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraError(false);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(true);
    }
  };

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

  const handleInputMethodSelect = (method) => {
    setInputMethod(method);
    if (method === "camera") {
      startCamera();
      setUploadedImage(null);
    } else {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  const handleShadeSelect = (shade) => {
    setSelectedShade(shade);
  };

  const handlePurchase = () => {
    if (selectedShade) {
      alert(`Thank you for your interest in ${selectedShade.name}! 
      In a full implementation, this would add ${selectedShade.name} to your cart.`);
    }
  };

  return (
    <div className="try-on-container">
      {!inputMethod ? (
        <div className="method-selection">
          <h2>Choose Your Try-On Method</h2>
          <div className="method-buttons">
            <button onClick={() => handleInputMethodSelect("camera")}>
              Use Camera
            </button>
            <button onClick={() => handleInputMethodSelect("upload")}>
              Upload Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="try-on-section">
          <button
            className="change-method-btn"
            onClick={() => setInputMethod(null)}
          >
            Change Method
          </button>

          <div className="display-area">
            {inputMethod === "camera" ? (
              cameraError ? (
                <div className="camera-error">
                  <p>Camera access is required for virtual try-on.</p>
                  <button onClick={startCamera}>Try Again</button>
                </div>
              ) : (
                <div className="camera-container">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="camera-feed"
                  />
                </div>
              )
            ) : (
              <div className="upload-area">
                {uploadedImage ? (
                  <div className="image-container">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="uploaded-image"
                    />
                  </div>
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

          <div className="shade-selector">
            <h3>Select Your Shade</h3>
            <div className="shade-options">
              {concealerShades.map((shade) => (
                <button
                  key={shade.id}
                  className={`shade-button ${
                    selectedShade?.id === shade.id ? "selected" : ""
                  }`}
                  style={{ backgroundColor: shade.color }}
                  onClick={() => handleShadeSelect(shade)}
                >
                  <span className="shade-name">{shade.name}</span>
                </button>
              ))}
              {customShade && (
                <button
                  className={`shade-button ${
                    selectedShade?.id === customShade.id ? "selected" : ""
                  }`}
                  style={{ backgroundColor: customShade.color }}
                  onClick={() => handleShadeSelect(customShade)}
                >
                  <span className="shade-name">{customShade.name}</span>
                </button>
              )}
              <button
                className="shade-button custom-shade-button"
                onClick={() => setShowMixer(true)}
              >
                <span>Create Custom</span>
              </button>
            </div>

            {selectedShade && (
              <div className="selected-shade-info">
                <h4>Selected: {selectedShade.name}</h4>
                <p>Price: {selectedShade.price}</p>
                <button className="purchase-button" onClick={handlePurchase}>
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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