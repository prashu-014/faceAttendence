import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { FaRegUserCircle } from "react-icons/fa";
import Card from "react-bootstrap/Card";

import user from "../../Images/user.png";
export const ClassRoomList = ({ data }) => {
  const [studentData, setStudentData] = useState([]);

  // console.log("classroom list....."+JSON.stringify(data));

  useEffect(() => {
    // Check if data and data.data.records exist before setting the state
    if (data) {
      setStudentData(data);
      
    }

    // console.log("student data...... "+studentData);
  }, [data]);

  return (
    <>
      <Col className="col-12 border-bottom border-5 rounded-4 border p-0" >
        <h3 className="fw-bold bg-primary py-2 text-center text-white mb-2">
          Student Data
        </h3>

        <div style={{height:'550px',overflowY:'scroll'}}>
        {studentData.length > 0 ? (
          studentData.map((student, index) => (
            <Card key={index} className="mb-2 p-2 mx-2" >
              <div className="d-flex gap-2 align-items-center justify-content-between mx-1">
                <div className="d-flex gap-2 align-items-center">
                  <div >
                    <img
                      src={user}
                      alt=""
                      className="img-fluid "
                      style={{ width: "3.5rem", }}
                    />
                  </div>
                  <div>
                    <h6 className="fw-bold p-0 m-0">{student.name}</h6>
                  </div>
                </div>
                <div className={` ${student.status === 'Present' ? 'bg-success text-white px-2 rounded-pill' : 'bg-danger text-white px-2 rounded-pill'}`}>
                    {student.status}
                  </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center">No student data available.</p>
        )}
        </div>
      </Col>
    </>
  );
};
