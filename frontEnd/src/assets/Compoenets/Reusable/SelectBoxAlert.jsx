import React from "react";
import { Alert } from "reactstrap";

import { Col } from "reactstrap";

export const SelectBoxAlert = () => {
  // console.log(Object.keys(alert)[0]);

  const Alerts = [
    {
      Roles: ['Roles',"Student", "Parent", "Teacher"],
    },
    {
      Attendence: ["Attendence","Absent", "Present", "Late"],
    },

    {
      Time: [ 'Time',"5 min", "10 min", "15 min ", "30 min", "60 min"],
    },
  ];

  return (
    <>
      {Alerts.map((alert, i) => {
        const key = Object.keys(alert)[0];
        // console.log(key);
        const options = alert[key];

        return (
          <Col className="col-4" key={i}>
            <select
              className="w-100 p-2 border-0  border-bottom  bg-transparent"
              key={i}
            >
              {options.map((option, optionsIndex) => (
                <option key={optionsIndex} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Col>
        );
      })}
    </>
  );
};
