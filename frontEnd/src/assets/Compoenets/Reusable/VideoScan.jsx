
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const VideoScan = ({ onFinalDetection, message, video, setVideoEnded }) => {
  const videoRef = useRef();
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  const [state, setState] = useState({
    loading: true,
    message: "Model loading, please wait...",
    modelsLoaded: false,
    facesDetected: false,
  });
  const [videoDimensions, setVideoDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [studentData, setStudentData] = useState([]);
  const [finalDetectionData, setFinalDetectionData] = useState([]);
  const MATCH_THRESHOLD = 0.7;
  

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
      setState((prev) => ({
        ...prev,
        modelsLoaded: true,
        loading: false,
        message: "Face detection starting soon...",
      }));
      console.log("Models loaded");
    };
    loadModels();
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/facedatas");
        setStudentData(response.data);
        // console.log("Student data fetched:", response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const videoElement = videoRef.current;
      const displaySize = {
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detect = async () => {
        const detections = await faceapi
          .detectAllFaces(
            videoElement,
            new faceapi.SsdMobilenetv1Options({
              inputSize: 608,
              scoreThreshold: 0.6,
            })
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender()
          .withFaceDescriptors();

        if (detections.length > 3 && !state.facesDetected) {
          videoElement
            .play()
            .then(() => {
              console.log("Video started playing");
              setState((prev) => ({ ...prev, facesDetected: true }));
            })
            .catch((error) => console.error("Error playing video:", error));
        }

        return detections;
      };

      const drawDetections = async () => {
        const detections = await detect();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvasRef.current.getContext("2d", {
          willReadFrequently: true,
        });

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

        // Track drawn positions to avoid overlap
        const drawnPositions = new Set();
        const uniqueNames = new Set(
          finalDetectionData.map((data) => data.name)
        );
        const detectionData = [...finalDetectionData];

        detections.forEach((detection) => {
          const detectionDescriptor = detection.descriptor;
          let bestMatch = {
            name: null,
            distance: MATCH_THRESHOLD,
            descriptor: null,
          };

          studentData.forEach((student) => {
            student.faceData.forEach((face) => {
              const studentDescriptor = face;
              const distance = faceapi.euclideanDistance(
                detectionDescriptor,
                studentDescriptor
              );

              if (distance < bestMatch.distance) {
                bestMatch = {
                  name: student.name,
                  distance,
                  descriptor: studentDescriptor,
                };
              }
            });
          });

          if (bestMatch.name && !uniqueNames.has(bestMatch.name)) {
            const box = detection.detection.box;
            let position = { x: box.x, y: box.y - 8 };

            // Adjust position to avoid overlap
            while (drawnPositions.has(`${position.x}-${position.y}`)) {
              position.y -= 20; // Move up to avoid overlap
            }

            drawnPositions.add(`${position.x}-${position.y}`);

            ctx.fillStyle = "blue";
            const textWidth = ctx.measureText(bestMatch.name).width;
            const textHeight = 16; // Approximate height of the text
            ctx.fillRect(
              position.x,
              position.y - textHeight,
              textWidth + 10,
              textHeight + 5
            );

            ctx.font = "16px Arial";
            ctx.fillStyle = "white"; // Set text color to white
            ctx.fillText(bestMatch.name, position.x + 5, position.y - 2);
            console.log(`Match found for ${bestMatch.name}`);

            detectionData.push({
              name: bestMatch.name,
              descriptor: bestMatch.descriptor,
              expressions: detection.expressions,
            });

            uniqueNames.add(bestMatch.name);
          }
        });

        setFinalDetectionData(detectionData);

        animationFrameId.current = window.requestAnimationFrame(drawDetections);

        
      };

      drawDetections();
    };

    if (state.modelsLoaded && !message) {
      detectFaces();
      console.log("Detect face function call");
    }

    return () => window.cancelAnimationFrame(animationFrameId.current);
  }, [state.modelsLoaded, state.facesDetected, studentData, message]);

  const handleVideoEnd = () => {
    window.cancelAnimationFrame(animationFrameId.current);
    console.log(cancelAnimationFrame(animationFrameId.current));
    if (finalDetectionData.length > 0) {
      console.log("Video ended. Final detection data:", finalDetectionData);
      
      onFinalDetection(finalDetectionData);
      setVideoEnded(true);
    }
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    setVideoDimensions({
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: videoDimensions.width,
        height: videoDimensions.height,
      }}
    >
      {(state.loading || !state.facesDetected || message) && (
        <div
          className="bg-dark text-white"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <h1>{message || state.message}</h1>{" "}
        </div>
      )}
      <video
        ref={videoRef}
        muted
        className="p-0 m-0"
        style={{
          display:
            state.modelsLoaded && !state.loading && !message ? "block" : "none",
          position: "absolute",
          top: 0,
          left: "0.7rem",
          width: "100%",
          height: "100%",
        }}
        width={videoDimensions.width}
        height={videoDimensions.height}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={() =>
          videoRef.current &&
          videoRef.current
            .play()
            .catch((error) =>
              console.error("Error trying to play video:", error)
            )
        }
        onEnded={handleVideoEnd}
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0,width:"100%" }}
      />
    </div>
  );
};

export default VideoScan;

