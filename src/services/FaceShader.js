// src/services/FaceShader.js
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

class FaceShader {
  constructor() {
    this.detector = null;
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      try {
        await tf.setBackend('webgl');
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = {
          runtime: 'tfjs',
          maxFaces: 1,
          refineLandmarks: true,
        };
        this.detector = await faceDetection.createDetector(model, detectorConfig);
        this.initialized = true;
        console.log('Face detector initialized successfully');
      } catch (error) {
        console.error('Failed to initialize face detector:', error);
        throw error;
      }
    }
  }

  async detectFace(input) {
    if (!this.initialized) {
      await this.initialize();
    }
    try {
      const faces = await this.detector.estimateFaces(input);
      return faces;
    } catch (error) {
      console.error('Error detecting face:', error);
      return [];
    }
  }

  hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  drawConcealerArea(ctx, keypoints, shade, opacity) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = this.hexToRgba(shade, opacity);
    ctx.filter = 'blur(8px)';

    // Draw under-eye area
    ctx.beginPath();
    const leftEye = keypoints.filter(point => point.name.includes('leftEye'));
    const rightEye = keypoints.filter(point => point.name.includes('rightEye'));

    if (leftEye.length > 0) {
      const leftCenter = {
        x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
        y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length
      };
      ctx.ellipse(
        leftCenter.x,
        leftCenter.y + 10,
        20,
        10,
        0,
        0,
        2 * Math.PI
      );
    }

    if (rightEye.length > 0) {
      const rightCenter = {
        x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
        y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length
      };
      ctx.ellipse(
        rightCenter.x,
        rightCenter.y + 10,
        20,
        10,
        0,
        0,
        2 * Math.PI
      );
    }

    ctx.fill();
    ctx.restore();
  }

  async applyShade(ctx, input, shade, opacity = 0.4) {
    try {
      const faces = await this.detectFace(input);
      
      if (faces && faces.length > 0) {
        const face = faces[0];
        if (face.keypoints) {
          this.drawConcealerArea(ctx, face.keypoints, shade, opacity);
        }
      }
    } catch (error) {
      console.error('Error applying shade:', error);
    }
  }

  async processVideoFrame(videoElement, canvasContext, shade) {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      if (canvasContext.canvas.width !== videoElement.videoWidth ||
          canvasContext.canvas.height !== videoElement.videoHeight) {
        canvasContext.canvas.width = videoElement.videoWidth;
        canvasContext.canvas.height = videoElement.videoHeight;
      }

      // Clear previous frame
      canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
      
      // Draw current video frame
      canvasContext.drawImage(videoElement, 0, 0);
      
      // Apply shade if provided
      if (shade) {
        await this.applyShade(canvasContext, videoElement, shade);
      }
    }
  }

  async processImage(imageElement, canvasContext, shade) {
    // Set canvas dimensions to match image
    canvasContext.canvas.width = imageElement.width;
    canvasContext.canvas.height = imageElement.height;
    
    // Clear canvas
    canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    
    // Draw image
    canvasContext.drawImage(imageElement, 0, 0);
    
    // Apply shade if provided
    if (shade) {
      await this.applyShade(canvasContext, imageElement, shade);
    }
  }

  dispose() {
    if (this.detector) {
      this.detector.dispose();
    }
    this.initialized = false;
  }
}

// Export singleton instance
export default new FaceShader();