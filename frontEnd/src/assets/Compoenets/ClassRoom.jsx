import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "reactstrap";
import { CardsCounter } from "./Reusable/CardsCounter";
import VideoScan from "./Reusable/VideoScan";

import video from "../Images/video/classroom12.mp4";
import { StudentList } from "./Reusable/StudentList";
import { ClassRoomList } from "./Reusable/ClassRoomList";

export const ClassRoom = () => {


  const initialGateElement = [
    { name: "Total", count: 0 },
    { name: "Attended", count: 0 },
    { name: "Absence", count: 0 },
    { name: "Emotions", count: "Neutral" },
  ];



  const [attendanceData, setAttendanceData] = useState([]);
  const [gateAttendance, setGateAttendance] = useState([]);
  const [gateElement, setGateElement] = useState(initialGateElement);
  const [combinedAttendance, setCombinedAttendance] = useState([]);
  const [videoEnded, setVideoEnded] = useState(false);
  const [message, setMessage] = useState("");
  const [dataPosted, setDataPosted] = useState(false);
  const [dataExists, setDataExists] = useState(false);

 
 

  const processAttendanceData=(data)=> {

    console.log("data submiitedd to classroom"+JSON.stringify(data.length));
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

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const status = "Present"; // or any other status you need to filter by
        const response = await axios.get(
          `http://localhost:8080/api/students?date=${currentDate}&status=${status}`
        );
        setGateAttendance(response.data);
        console.log("Student data fetched for date", currentDate, ":", response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    const checkExistingData = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const response = await axios.get(`http://localhost:8080/api/classroom/${currentDate}`);

        

        if (response.data.exists) {
          setDataExists(true);
          setMessage("Data already submitted classrooom");
          setCombinedAttendance(response.data.records)
          processAttendanceData(response.data.records)
        } else {
          setDataExists(false);
          fetchStudentData(); // Only fetch student data if data does not already exist
        }
      } catch (error) {
        console.error("Error checking existing data:", error);
      } 
    };

    checkExistingData();
  }, []);

  useEffect(() => {
    if (gateAttendance.length > 0 && attendanceData.length > 0) {
      const combinedData = gateAttendance.map((student) => {
        const isPresent = attendanceData.some(
          (attendingStudent) => attendingStudent.name === student.name
        );
        return {
          ...student,
          status: isPresent ? "Present" : "Absent",
        };
      });
      setCombinedAttendance(combinedData);
      // console.log("datahj..............."+combinedData);
    }
  }, [gateAttendance, attendanceData]);

 
  const handleFinalDetectionData = async (data) => {
    setAttendanceData(data);
    

    
  };

  const postAttendanceData = async () => {
        try {
          const requests = combinedAttendance.map(async (student) => {
            // Make a POST request for each student's attendance data
            const response = await axios.post("http://localhost:8080/api/classroom", student);
            // console.log("Classroom data posted for:", student);
            return response.data; // Assuming you want to return something from each request
          });
      
          // Wait for all requests to complete
          await Promise.all(requests);
          setDataPosted(true);
          processAttendanceData(combinedAttendance)
          console.log(combinedAttendance);
          
          
          
        } catch (error) {
          console.error("Error posting classroom data:", error);
        }
      };

  useEffect(() => {
    if (videoEnded && combinedAttendance.length > 0) {
      
      postAttendanceData();
    }
  }, [videoEnded, combinedAttendance]);

  return (
    <>
      <span style={{ fontSize: "0.8rem" }}>Student Attendance</span>
      <h2 className="fw-bold">ClassRoom Attendance</h2>
      <hr />

      <Row className="px-1">
        <Col className="col-8">
          <Row>
            <VideoScan
              onFinalDetection={handleFinalDetectionData}
              video={video} message={message}
              setVideoEnded={setVideoEnded} videoEnded={videoEnded}
            />
          </Row>

          <Row>
            <Col className="col mt-3 d-flex">
              {gateElement.map((item, i) => {
                return (
                  <Col
                    className="m-1 border-bottom border-primary border-5 rounded-4 py-2"
                    key={i}
                  >
                    <CardsCounter element={item} />
                  </Col>
                );
              })}
            </Col>
          </Row>
        </Col>

        <Col className="col-4">
          
          

         <ClassRoomList data={combinedAttendance} />

        </Col>
      </Row>
    </>
  );
};


