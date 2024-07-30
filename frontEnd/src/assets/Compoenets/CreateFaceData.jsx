



import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import "./FaceData.css";

const CreateFaceData = () => {
  const [image, setImage] = useState(null);
  const [faceData, setFaceData] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const imageRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleImageLoad = async () => {
    const img = imageRef.current;
    if (img) {
      console.log("Image loaded:", img);
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      setLoading(true);

      try {
        const options = new faceapi.SsdMobilenetv1Options({
          inputSize: 512,
          scoreThreshold: 0.5,
        });
        const detections = await faceapi
          .detectAllFaces(img, options)
          .withFaceLandmarks()
          .withFaceDescriptors();
        console.log("Detections:", detections);

        if (detections.length > 0) {
          const faceDescriptors = detections.map(d => Array.from(d.descriptor));
          setFaceData(faceDescriptors);
          const resizedDetections = faceapi.resizeResults(detections, {
            width: img.width,
            height: img.height,
          });
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        } else {
          console.log("No faces detected");
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image || !faceData) {
      console.error("No image uploaded or no face data detected");
      return;
    }

    try {
      const formData = {
        name,
        data: faceData,
      };

      const response = await axios.post(
        "http://localhost:8080/api/face-detection",
        formData
      );
      console.log("Response:", response.data);
      setMessage("Data saved successfully");
    } catch (error) {
      console.error("Error saving detection data:", error);
      setMessage("Error saving data");
    }
  };

  return (
    <div>
      <h1>Face Detection App</h1>
      <input type="file" onChange={handleImageChange} />
      {image && (
        <div
          className="position-relative"
          style={{ width: "fit-content", height: "fit-content" }}
        >
          <img
            id="inputImage"
            src={image}
            alt="Uploaded"
            ref={imageRef}
            onLoad={handleImageLoad}
            style={{ display: "block" }}
          />
          <canvas
            id="overlay"
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          {loading && (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      )}
      {faceData && (
        <div>
          <h2>Face Detected</h2>
          {/* Optionally display face data */}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter name"
          required
        />
        <button type="submit">Save Data</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateFaceData;

