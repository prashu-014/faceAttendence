// import React, { useState } from "react";
// import { Row, Col, Container } from "reactstrap";
// import { Navbar } from "./Reusable/Navbar";
// import { AttendenceCharts } from "./Reusable/AttendenceCharts";
// import { Calender } from "./Reusable/Calender";
// import { PiStudentThin } from "react-icons/pi";
// import { MdGirl } from "react-icons/md";
// import { SiVirustotal } from "react-icons/si";
// import { FaUserXmark } from "react-icons/fa6";
// import {
//   AiOutlineUsergroupAdd,
//   AiOutlineUsergroupDelete,
// } from "react-icons/ai";

// export const Dashboard = () => {
//   const Attendence = [
//     { num: 0, text: "Today Attendence", img: <AiOutlineUsergroupAdd /> },
//     { num: 0, text: "Boys Attendence", img: <PiStudentThin /> },
//     // { num: 2730, text: "Girl Attendence", img: <MdGirl /> },
//     { num: 0, text: "Total Absence", img: <AiOutlineUsergroupDelete /> },
//   ];

//   const [data,setData] = useState([])

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get('/api/dashboarddata');
//         setData(response.data); // Assuming response.data is an array of students
        
//       } catch (error) {
//         console.error('Error fetching student data:', error);
       
//       }
//     };

//     fetchStudents();
//   }, []);

//   return (
//     <>
//       <span style={{ fontSize: "0.8rem" }}>Student Attendence</span>
//       <h2 className="fw-bold m-0 ">Dashboard</h2>
//       <hr />

//       <div className=" d-flex ps-3" style={{ gap: "5rem" }}>
//         {Attendence.map((item, i) => {
//           return (
//             <div
//               className="d-flex border align-items-center justify-content-center p-2 bg-primary text-white rounded-3  gap-3"
//               key={i}
//             >
//               <div className="display-5 d-flex align-items-center bg-primary rounded-3 text-white bg-dark">
//                 {item.img}
//               </div>

//               <div key={i}>
//                 <h3 className="fw-bold m-0">{item.num}</h3>{" "}
//                 <span className="">{item.text}</span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <hr />

//       <Row className="">
//         <Col className="col-8 pe-0">
//           <AttendenceCharts />
//           <br />
//         </Col>
//         <Col className="col-4 p-0 pe-1   pt-4">
//           <Calender />
//         </Col>
//       </Row>
//     </>
//   );
// };


import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { AttendenceCharts } from "./Reusable/AttendenceCharts";
import { Calender } from "./Reusable/Calender";
import { PiStudentThin } from "react-icons/pi";
import { AiOutlineUsergroupAdd, AiOutlineUsergroupDelete } from "react-icons/ai";
import axios from "axios";

export const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/dashboarddata");
        setData(response.data); // Assuming response.data is an array of students
        // console.log(JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, []);

  // Calculate attendance numbers based on fetched data
  const calculateAttendanceNumbers = () => {
    let todayAttendance = 0;
    let boysAttendance = 0;
    let totalAbsence = 0;

    // Assuming data is an array of students with fields like 'name', 'gender', 'status'
    data.forEach((student) => {
      if (student) {
        todayAttendance++;
      }
      // Calculate boys attendance based on 'gender' field
      if (student) { // Adjust according to your data structure
        boysAttendance++;
      }
      // Calculate total absence based on 'status' field
      if (student.status === "Absent") {
        totalAbsence++;
      }
    });

    // Update Attendence array with calculated values
    const updatedAttendence = [
      {
        num: todayAttendance,
        text: "Today Attendance",
        img: <AiOutlineUsergroupAdd />,
      },
      {
        num: boysAttendance,
        text: "Boys Attendance",
        img: <PiStudentThin />,
      },
      {
        num: totalAbsence,
        text: "Total Absence",
        img: <AiOutlineUsergroupDelete />,
      },
    ];

    return updatedAttendence;
  };

  // Get updated attendance numbers
  const updatedAttendance = calculateAttendanceNumbers();

  return (
    <>
      <span style={{ fontSize: "0.8rem" }}>Student Attendance</span>
      <h2 className="fw-bold m-0">Dashboard</h2>
      <hr />

      <div className="d-flex ps-3" style={{ gap: "5rem" }}>
        {updatedAttendance.map((item, i) => (
          <div
            className="d-flex border align-items-center justify-content-center p-2 bg-primary text-white rounded-3 gap-3"
            key={i}
          >
            <div className="display-5 d-flex align-items-center bg-primary rounded-3 text-white bg-dark">
              {item.img}
            </div>

            <div key={i}>
              <h3 className="fw-bold m-0">{item.num}</h3>{" "}
              <span className="">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
      <hr />

      <Row className="">
        <Col className="col-8 pe-0">
          <AttendenceCharts chartData={data} />
          <br />
        </Col>
        <Col className="col-4 p-0 pe-1 pt-4">
          <Calender />
        </Col>
      </Row>
    </>
  );
};

