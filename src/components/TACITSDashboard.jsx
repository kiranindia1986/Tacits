import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBarT";
import "./TACITSDashboard.css"; // Ensure your CSS file is properly linked

const TACITSDashboard = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };
    return (
        <section id="Home" className="tabcontent">
            <NavBar /> {/* Include NavBar here */}
            <div className="container1">
                <div className="hexagon-grid">
                    <div className="hexagon-item">Active Civilian Component School Input</div>
                    <div className="hexagon-item" onClick={() => handleNavigation("/reserve-component-school")}>
                        Reserve Component School Input
                    </div>
                    <div className="hexagon-item">Non-ATRRS Managed Courses for Civilians</div>
                    <div className="hexagon-item">User POC Profile Menu</div>
                    <div className="hexagon-item">Course Listing (New & Existing)</div>
                    <div className="hexagon-item">TACITS Information</div>
                    <div className="hexagon-item">Point of Contact Help Document</div>
                </div>

                <div className="info-box">
                    <p>
                        <strong>NOTE: School code 911 will be excluded from the survey.</strong>{" "}
                        Please contact the AMC Logistics Leadership Center (formerly the School of
                        Engineering and Logistics) at (903) 334-3335 or DSN 829-3335.
                    </p>
                    <strong>Active Component Status:</strong>
                    <p style={{ color: "red" }}>The Active Component will close COB 29 Mar.</p>
                    <p>
                        The <strong>Subquota Source Manager input will <u>open 16 Jan 2024 and close 4 Feb 2024.</u> NO Extensions will be given.</strong>
                    </p>
                    <p>
                        The <strong>Quota Source Manager input will <u>open 5 Feb 2024 and close 5 Mar 2024.</u></strong> NO Extensions will be given. QS Managers should review the training requirements identified by their SQS units and make any required changes.
                    </p>
                    <p>
                        <strong>MACOM Review/Update will <u>open 6 Mar 2024 and close 29 Mar 2024.</u> NO Extensions will be given.</strong> Managers should review the training requirements identified by their QS units and make any required changes.
                    </p>
                    <p>Questions can be addressed to:</p>
                    <p>
                        <strong>Mr. George Jeter</strong>, DSN 983-4354, comm (502)613-4354, e-mail:{" "}
                        <a href="mailto:george.i.jeter2.civ@army.mil">george.i.jeter2.civ@army.mil</a>
                    </p>
                    <p><strong>Reserve Component Status:</strong></p>
                    <p>
                        <strong>The Quota Source Manager input will <u>open 16 Jan 2024 and close 5 Mar 2024.</u> NO Extensions will be given.</strong>
                    </p>
                    <p>
                        <strong>The School (RTI/TASS Bn) <u>open 6 Mar 2024 and close 31 Mar 2024.</u> NO Extensions will be given.</strong>
                    </p>
                    <p>
                        <strong style={{ color: "red" }}>
                            All Reserve Component input areas will close 1 May 2024.
                        </strong>{" "}
                        Questions can be addressed to <strong>SFC Daniel Mcclelland</strong> at DSN 327-7343, comm (703) 607-7343 or <strong>Armando Munoz</strong> at DSN 670-8940, comm (910)570-8940.
                    </p>
                    <p><strong>Having Problems?</strong> <a href="your-support-page-url">Click here</a> to view our Support page.</p>
                </div>
            </div>
        </section>
    );
};

export default TACITSDashboard;
