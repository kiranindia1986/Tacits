import React from "react";
import { useNavigate } from "react-router-dom";
import "./TACITSDashboard.css"; // Assuming you want to use the same CSS file
import "./Bootstrap.css"
import NavBar from "./NavBarT";

const ReserveComponentSchool = () => {
    const navigate = useNavigate();

    return (
        <>
            <NavBar />
            <section id="QuotaSource" className="tabcontent">
                <div className="container h-100 mt-10">
                    <div className="row h-100 justify-content-center align-items-center">
                        <div className="col-auto">
                            <div className="row text-center g-2">
                                {/* Box 1 */}
                                <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                    <div
                                        className="rounded-box p-3 bg-box-color-1"
                                        id="QSM"
                                        onClick={() => navigate("/quota-source-manager")}
                                    >
                                        Quota Source Manager
                                    </div>
                                </div>

                                {/* Box 2 */}
                                <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                    <div className="rounded-box p-3 bg-box-color-2 bg-box-color-3">School, RTI, BDE, or DIV(IT) Manager</div>
                                </div>

                                {/* Box 3 */}
                                <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                    <div className="rounded-box p-3 bg-box-color-4">POI Manager</div>
                                </div>

                                {/* Box 4 */}
                                <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                    <div className="rounded-box p-3 bg-box-color-5">OASS Report</div>
                                </div>

                                {/* Box 5 */}
                                <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                    <div className="rounded-box p-3 bg-box-color-6">TACITS Information</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Go Back Button */}
                <div className="row">
                    <div className="col text-center mt-4">
                        <button
                            id="goBackButton"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)} // Go back to the previous page
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReserveComponentSchool;
