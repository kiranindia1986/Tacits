import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TACITSDashboard.css"; // Assuming the same CSS styles are needed
import NavBar from "./NavBarT";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firestore methods

const QuotaSourceManager = () => {
    const [schoolData, setSchoolData] = useState([]); // State to store school data
    const [selectedSchool, setSelectedSchool] = useState(""); // State to store selected value
    const [step2Data, setStep2Data] = useState([]); // State to store Step 2 data
    const [selectedStep2Option, setSelectedStep2Option] = useState(""); // Selected option for step 2
    const navigate = useNavigate();

    // Fetch data from Firebase collection "schoolData"
    useEffect(() => {
        const fetchSchoolData = async () => {
            try {
                const schoolCollection = collection(db, "schoolData"); // Reference to the collection
                const schoolSnapshot = await getDocs(schoolCollection); // Fetch all documents
                const schoolList = schoolSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map data
                setSchoolData(schoolList); // Set the state with fetched data
            } catch (error) {
                console.error("Error fetching school data: ", error);
            }
        };

        fetchSchoolData(); // Call the fetch function on component mount
    }, []);

    // Fetch data for Step 2 from Firebase collection "step2Data"
    useEffect(() => {
        const fetchStep2Data = async () => {
            try {
                const step2Collection = collection(db, "step2Data"); // Reference to the collection
                const step2Snapshot = await getDocs(step2Collection); // Fetch all documents
                const step2List = step2Snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map data

                // Sort step2List: 'Review and Change Requirements' and 'Add New Requirements' first
                const sortedStep2List = [
                    ...step2List.filter((item) => item.field === "Review and Change Requirements"),
                    ...step2List.filter((item) => item.field === "Add New Requirements"),
                    ...step2List.filter(
                        (item) =>
                            item.field !== "Review and Change Requirements" &&
                            item.field !== "Add New Requirements"
                    ),
                ];

                setStep2Data(sortedStep2List); // Set the state with sorted data
            } catch (error) {
                console.error("Error fetching step 2 data: ", error);
            }
        };

        fetchStep2Data(); // Fetch step 2 data on component mount
    }, []);

    // Navigate to Change Requirements page with selected school passed as state
    const handleContinue = () => {
        if (selectedSchool && selectedStep2Option === "Review and Change Requirements") {
            navigate("/change-requirements", { state: { selectedSchool } });
        }
    };

    return (
        <>
            <NavBar />
            <section id="QuotaSourceManager" className="tabcontent">
                <div className="bg-header" style={{ marginTop: "20px" }}>
                    <h5 style={{ padding: "10px" }}>Quota Source Manager</h5>
                </div>

                <p>
                    Perform the following three steps to pull TACITS information based on Quota Source. Your ability to perform updates
                    are based on the locks assigned to AR0145 having the ability to make reservations on the RL, RP, or RC displays in
                    ATTRS.
                </p>

                {/* Step 1 */}
                <div className="step-header">
                    <h5 className="rounded-info-box bg-info text-white">Step 1</h5>
                    <p>
                        The first step is to select a quota source from the list. If you have not validated the Quota Manager POC
                        information, please select QS Registry/POC in Step 2 below before updating any requirements.
                    </p>
                </div>

                <div className="quota-dropdown-container">
                    <select
                        id="quotaSourceDropdown"
                        className="quota-dropdown"
                        value={selectedSchool} // Bind to selected value
                        onChange={(e) => setSelectedSchool(e.target.value)} // Update the selected value on change
                    >
                        <option value=""> -- Select Options -- </option>
                        {schoolData.map((school) => (
                            <option key={school.id} value={school.field}> {/* Assuming "field" is the name of the school */}
                                {school.field}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="container">
                    <div className="row">
                        {/* Step 2 Column */}
                        <div className="col-md-6">
                            <div className="step-header">
                                <h5 className="rounded-info-box bg-info text-white">Step 2</h5>
                                <p className="step-description">The next step is to choose what you want to do.</p>

                                {step2Data.map((option, index) => (
                                    <div className="row" key={index} style={{ marginTop: "1%" }}>
                                        <div className="col-md-12">
                                            <input
                                                type="radio"
                                                name="step2Options"
                                                id={option.field}
                                                value={option.field}
                                                className="form-check-input"
                                                checked={selectedStep2Option === option.field}
                                                onChange={() => setSelectedStep2Option(option.field)} // Set the selected value
                                            />
                                            <label
                                                className="option-label form-check-label"
                                                htmlFor={option.field}
                                            >
                                                {option.field}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Step 3 Column */}
                        <div className="col-md-6">
                            <div className="step-header">
                                <h5 className="rounded-info-box bg-info text-white">Step 3</h5>
                            </div>

                            <div className="mt-3 d-grid gap-2 d-md-block">
                                <button
                                    id="goBackDashboard"
                                    className="btn btn-secondary btn-lg mt-3"
                                    style={{ marginRight: "10px" }}  // Add margin between buttons
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                                <button
                                    id="continueButton"
                                    className="btn btn-primary btn-lg mt-3"
                                    style={{ marginLeft: "10px" }}  // Add margin between buttons
                                    onClick={handleContinue} // Call the handleContinue function
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default QuotaSourceManager;
