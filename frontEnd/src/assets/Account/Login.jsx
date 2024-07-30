import React from "react";

import { Container, Row, Col } from "reactstrap";
import Image from "../Images/login.jpg";

import { TextField,Checkbox } from "@mui/material";

export const Login = () => {
  return (
    <>
      <Container className=" vh-100 d-flex align-items-center " fluid="lg">
        <Row className=" w-100 border border-info border-3 rounded-4 py-4 ">
          <Col className="col-7 d-flex justify-content-center">
            <img src={Image} alt="" className="img-fluid w-75" />
          </Col>
          <Col className="col-5 py-4 px-5">
            <article className="border border-info   border-3 rounded-4 p-5">
              <div className="text-center">
                <h1 className="fw-bold m-0">Welcome </h1>
                <span  >Login into your account</span>
              </div>

              <hr />
              <form action="">
                <div className="text-center d-flex flex-column gap-3">
                  <TextField
                    fullWidth
                    label="Username"
                    color="primary"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    color="primary"
                    size="small"
                  />
                </div>
                
                <div className="d-flex justify-content-between align-items-center my-2 ">
                  <span className="">
                  <Checkbox  size='small'/>
                    Remember me
                  </span>
                  <span className="text-danger">Recover Password</span>
                </div>

                <div className="text-center mt-4">
                  <button className="w-100 py-2 bg-dark text-white border-0">
                    Log In
                  </button>
                </div>
              </form>
            </article>
          </Col>
        </Row>
      </Container>
    </>
  );
};
