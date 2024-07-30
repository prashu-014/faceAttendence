import React from "react";
import { Container, Row, Col } from "reactstrap";

import alerts from "../Images/alertsBg.png";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextareaAutosize } from "@mui/base";
import { TextField } from "@mui/material";
import { SelectBoxAlert } from "./Reusable/SelectBoxAlert";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

import Table from "react-bootstrap/Table";

export const Alerts = () => {
  return (
    <>
      <Container className="position-relative ">
        <Row
          className="  mt-2  px-2  bg-primary"
          // style={{ height: "15rem" }}
        >
          <Col className="col-3  z-3 p-0">
            <img src={alerts} alt="" className="img-fluid w-75" />{" "}
          </Col>
          <Col
            className="col-12 bg-primary    bottom-0  "
            // style={{ height: "10rem" }}
          ></Col>
        </Row>

        <Row className=" border py-4  ">
          <SelectBoxAlert />

          <Col className="col-8 mt-2">
            <FloatingLabel controlId="floatingTextarea2" label="Message">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px", resize: "none", border: "none" }}
                className="border-bottom "
              />
            </FloatingLabel>
          </Col>

          <Col className="col-4 d-flex align-items-center ">
            <button className="btn bg-success text-white px-5">ADD</button>
          </Col>
        </Row>

        <Row className="mt-4">
          <Table responsive bordered hover size="sm">
            <thead>
              <tr>
                <th>No.</th>
                <th>Roles</th>
                <th>Attendence</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Parent</td>
                <td>Late</td>
                <td>15 min</td>
                <td>Delete</td>
              </tr>

              <tr>
                <td>2</td>
                <td>Teacher</td>
                <td>Absent</td>
                <td>5 min</td>
                <td>Delete</td>
              </tr>
            </tbody>
          </Table>
        </Row>
      </Container>
    </>
  );
};
