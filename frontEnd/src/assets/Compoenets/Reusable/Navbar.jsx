import React from 'react'
import logo from "../../Images/logo.png";
import { IoHomeOutline } from "react-icons/io5";
import { RiAncientGateLine } from "react-icons/ri";
import { IoAlertCircleOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";
import Image from "../../Images/profie.png";

import {Link } from 'react-router-dom'


export const Navbar = () => {
  return (
    <>
       <div>
              <img src={logo} alt="" className="img-fluid " />
              <hr />

              <ul>
                <li className="py-2 d-flex align-items-center gap-3">
                  <IoHomeOutline className="fs-5" />
                  <Link to='/' className="text-decoration-none text-white">
                    Dashboard
                  </Link>
                </li>
                <li className="py-2 d-flex align-items-center gap-3">
                  <RiAncientGateLine className="fs-5" />
                  <Link to='/gateAttendence' className="text-decoration-none text-white">
                    Gate Attendence
                  </Link>
                </li>
                <li className="py-2 d-flex align-items-center gap-3">
                  <SiGoogleclassroom className="fs-5" />
                  <Link to='classRoom' className="text-decoration-none text-white">
                    Classroom
                  </Link>
                </li>
                <li className="py-2 d-flex align-items-center gap-3">
                  <IoAlertCircleOutline className="fs-5" />
                  <Link to='alerts' className="text-decoration-none text-white">
                    Alerts
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-center">
                <img src={Image} alt="" className="img-fluid w-25" />
              </div>
              <span>Prashant Burde</span> <br />
              <span>Admin</span>
            </div>
    
    </>
  )
}
