import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./assets/Compoenets/Dashboard";
import { GateAttendence } from "./assets/Compoenets/GateAttendence";
import { Alerts } from "./assets/Compoenets/Alerts";
import { ClassRoom } from "./assets/Compoenets/ClassRoom";
import { Row, Col, Container } from "reactstrap";
import { Navbar } from "./assets/Compoenets/Reusable/Navbar";
import VideoScan from "./assets/Compoenets/Reusable/VideoScan";
import CreateFaceData from "./assets/Compoenets/CreateFaceData";
import * as faceapi from "face-api.js";

function App() {
  return (
    <>
      <Container className="border border-dark vh-100 " fluid>
        <Row className="h-100  ">
          <Col className="col-2 bg-primary text-white d-flex flex-column justify-content-between  py-2">
            <Navbar />
          </Col>

          <Col className="col-10  ">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/gateAttendence" element={<GateAttendence />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/classRoom" element={<ClassRoom />} />
              <Route path="/CreateFaceData" element={<CreateFaceData />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
