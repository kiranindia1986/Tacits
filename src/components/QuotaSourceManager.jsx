import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TACITSDashboard.css"; // Assuming the same CSS styles are needed
import NavBar from "./NavBarT";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import { toast } from 'react-toastify';
import {
    Radio, RadioGroup, FormControlLabel,
    Box, Typography, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, CssBaseline, Button
} from '@mui/material';

const QuotaSourceManager = () => {
    const [schoolData, setSchoolData] = useState([]); // State to store school data
    const [selectedSchool, setSelectedSchool] = useState(""); // State to store selected value
    const [step2Data, setStep2Data] = useState([]); // State to store Step 2 data
    const [selectedStep2Option, setSelectedStep2Option] = useState(""); // Selected option for step 2
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    // Fetch data from Firebase collection "schoolData"
    useEffect(() => {
        const fetchSchoolData = async () => {
            try {
                const schoolCollection = collection(db, "schoolData");
                const schoolSnapshot = await getDocs(schoolCollection);
                const schoolList = schoolSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setSchoolData(schoolList);
                console.log("School Data:", schoolList); // Log the fetched school data for debugging
                setLoading(false); // Set loading to false after fetching
            } catch (error) {
                console.error("Error fetching school data: ", error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchSchoolData();
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
                console.log(sortedStep2List);

                setStep2Data(sortedStep2List); // Set the state with sorted data
            } catch (error) {
                console.error("Error fetching step 2 data: ", error);
            }
        };

        fetchStep2Data(); // Fetch step 2 data on component mount
    }, []);

    // Navigate to Change Requirements page with selected school passed as state
    const handleContinue = () => {
        console.log("Selected School:", selectedSchool);  // Log the selectedSchool for debugging
        console.log("Selected Step2 Option:", selectedStep2Option);  // Log the selectedStep2Option for debugging

        if (selectedSchool && selectedStep2Option === "Review and Change Requirements") {
            navigate("/change-requirements", { state: { selectedSchool } });
        } else if (selectedSchool && selectedStep2Option === "Add New Requirements") {
            navigate("/add-new-requirements", { state: { selectedSchool } });  // Pass selectedSchool to the next page
        } else {
            toast.error("Please select a school and an option.");
        }
    };

    if (loading) return <div>Loading...</div>; // Move this after the hooks

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
                    <FormControl fullWidth variant="outlined" size="small" style={{ marginTop: "1rem" }}>
                        <InputLabel id="quota-source-label">Select Quota Source</InputLabel>
                        <Select
                            labelId="quota-source-label"
                            id="quotaSourceDropdown"
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                            label="Select Quota Source"
                        >
                            <MenuItem value="">
                                <em>-- Select Options --</em>
                            </MenuItem>
                            {schoolData.map((school) => (
                                <MenuItem key={school.id} value={school.field}>
                                    {school.field}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </div>

                <div className="container">
                    <div className="row">
                        {/* Step 2 Column */}
                        <div className="col-md-6">
                            <div className="step-header">
                                <h5 className="rounded-info-box bg-info text-white">Step 2</h5>
                                <p className="step-description">The next step is to choose what you want to do.</p>

                                <Select
                                    labelId="step2-options-label"
                                    id="step2OptionsDropdown"
                                    value={selectedStep2Option}
                                    onChange={(e) => setSelectedStep2Option(e.target.value)}
                                    label="Select Step 2 Option"
                                    sx={{ width: 400 }} // Set default width here
                                >
                                    <MenuItem value="">
                                        <em>-- Select Options --</em>
                                    </MenuItem>
                                    {step2Data.map((option) => (
                                        <MenuItem key={option.id} value={option.field}>
                                            {option.field}
                                        </MenuItem>
                                    ))}
                                </Select>


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
