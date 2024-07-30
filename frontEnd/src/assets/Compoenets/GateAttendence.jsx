

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import { CardsCounter } from "./Reusable/CardsCounter";
import { StudentList } from "./Reusable/StudentList";
import VideoScan from "./Reusable/VideoScan";
import videoStudent from "../Images/video/speed1.mp4";

export const GateAttendence = () => {
  const initialGateElement = [
    { name: "Total", count: 0 },
    { name: "Attended", count: 0 },
    { name: "Absence", count: 0 },
    { name: "Emotions", count: "Neutral" },
  ];

  const [studentData, setStudentData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gateElement, setGateElement] = useState(initialGateElement);
  const [message, setMessage] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/facedatas");
        setStudentData(response.data);
        // Update total count based on fetched student data
        setGateElement((prevState) => [
          { ...prevState[0], count: 0}, // Update total count
          { ...prevState[1] ,count: 0}, // Attended count remains the same
          { ...prevState[2], count: 0}, // Absence count initially same as total
          { ...prevState[3] }, // Emotions count remains the same
        ]);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudentData();
  }, []);



  // Check if attendance data for today already exists on component mount
  useEffect(() => {
    const checkExistingData = async () => {
      const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/${currentDate}`
          
        );
        
        if (response.data.exists) {
          setMessage("Data already submitted...");
          const attendanceResponse = await axios.get(
            `http://localhost:8080/api/students/${currentDate}`
          );
          setAttendanceData(attendanceResponse.data);
          processAttendanceData(attendanceResponse.data.records)

        } else {
          setMessage("");
        }
      } catch (error) {
        console.error("Error checking existing attendance data:", error);
      }
    };
    checkExistingData();
  }, []);


  
  const processAttendanceData=(data)=> {

    // console.log(data);
    const total = data.length;
    let attended = 0;
    let absence = 0;
    const emotionCounts = {};
  
    data.forEach(person => {
      if (person.status === 'Present') {
        attended++;
        const emotion = person.expressions;
        if (emotion) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      } else if (person.status === 'Absent') {
        absence++;
      }
    });
  
    const predominantEmotion = Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b, 'None');
  
    setGateElement([
      { name: "Total", count: total },
      { name: "Attended", count: attended },
      { name: "Absence", count: absence },
      { name: "Emotions", count: predominantEmotion },
    ]);
  }

  const getMainEmotion = (expressions) => {
    if (
      expressions &&
      typeof expressions === "object" &&
      Object.keys(expressions).length > 0
    ) {
      return Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );
    }
    return "Neutral";
  };

  const handleFinalDetectionData = (data) => {
    setAttendanceData(data);
    console.log("handlefinaldetection data..." + videoEnded);
    // Set video ended to true when detection data is finalized
  };

 




  const storeAttendanceData = async () => {
   
    
    // Store attendance data in the database if not already stored
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    const detectionNames = new Set(
      attendanceData.map((student) => student.name)
    );

    for (const student of studentData) {
      const isPresent = detectionNames.has(student.name);
      const detectedStudent = attendanceData.find(
        (s) => s.name === student.name
      );
      const flattenedFaceData = Array.isArray(student.faceData)
        ? student.faceData.flat()
        : [];

      const attendanceRecord = {
        name: student.name,
        expressions: detectedStudent
          ? getMainEmotion(detectedStudent.expressions)
          : "None",
        faceData: flattenedFaceData,
        status: isPresent ? "Present" : "Absent",
        date: currentDate,
      };

      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/${student.name}/${currentDate}`
        );
        if (!response.data.exists) {
          const postResponse = await axios.post(
            "http://localhost:8080/api/attendance",
            attendanceRecord
          );

          const attendanceResponse = await axios.get(
            `http://localhost:8080/api/students/${currentDate}`
          );
          setAttendanceData(attendanceResponse.data);
          processAttendanceData(attendanceResponse.data.records)

          // setAttendanceData(attendanceRecord);
          // processAttendanceData(attendanceResponse1.data.records);

          
         
         
          // console.log("Post Response:", JSON.stringify(postResponse.data));
          
        } else {
          setMessage("Data submitted successfully");

          
          
          
          
         

          

          
          
          

        
        }
      } catch (error) {
        console.error("Error saving attendance record:", error);
      }
    }
    // alert("Data submitted");
    const attendanceResponse1 = await axios.get(
      `http://localhost:8080/api/students/${currentDate}`
    );
    // console.log(attendanceResponse1.data.records);

   
    setAttendanceData(attendanceResponse1.data.records);
     processAttendanceData(attendanceResponse1.data.records);



  };

  useEffect(() => {
    if (videoEnded) {
      storeAttendanceData();
      console.log("before storeAttendence data..." + videoEnded);
    }
  }, [videoEnded]);



  

  return (
    <>
      <span style={{ fontSize: "0.8rem" }}>Student Attendance</span>
      <h2 className="fw-bold">Gate Attendance</h2>
      <hr />

      <Row className="px-1">
        <Col className="col-8">
          <Row className="d-flex justify-content-center">
            <VideoScan
              onFinalDetection={handleFinalDetectionData}
              message={message}
              video={videoStudent}
              setVideoEnded={setVideoEnded} videoEnded={videoEnded}
            />
          </Row>

          <Row>
            <Col className="col mt-3 d-flex">
              {gateElement.map((item, i) => (
                <Col
                  className="m-1 border-bottom border-primary border-5 rounded-4 py-2"
                  key={i}
                >
                  <CardsCounter element={item} />
                </Col>
              ))}
            </Col>
          </Row>
        </Col>
       <Col className="col-4"> <StudentList data={attendanceData} /></Col>
      </Row>
    </>
  );
};
