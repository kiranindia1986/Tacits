import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField } from "@mui/material";
import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase config
import NavBar from "./NavBarT";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseData, selectedSchool } = location.state || {}; // Get course data and selected school

    // State to hold editable values
    const [editableData, setEditableData] = useState({
        fy2016Req: courseData.fy2016Req || "",
        fy2017Req: courseData.fy2017Req || "",
        remarks: courseData.remarks || "",
    });

    // Handle input change for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Function to update document based on schoolCode and level
    const updateChangeRequest = async (schoolCode, level, updateData) => {
        try {
            console.log("Attempting to update document with schoolCode:", schoolCode, "and level:", level);
            console.log("Update Data:", updateData);

            // Query the changereq collection for the document with matching schoolCode and level
            const changereqRef = collection(db, "changereq");
            const q = query(changereqRef, where("schoolCode", "==", schoolCode), where("level", "==", level));

            const querySnapshot = await getDocs(q);
            console.log("Query Snapshot:", querySnapshot);

            if (!querySnapshot.empty) {
                // Assume there's only one matching document (or you can loop if there are multiple matches)
                const docRef = querySnapshot.docs[0].ref; // Get the reference of the first matched document

                console.log("Found document with ID:", querySnapshot.docs[0].id);

                // Update the document with new data
                await updateDoc(docRef, updateData);
                console.log("Document updated successfully.");
                toast.success("Course updated successfully!");
            } else {
                console.log("No document found with the provided schoolCode and level.");
                toast.error("No matching document found for the provided schoolCode and level.");
            }
        } catch (error) {
            console.error("Error updating document:", error);
            toast.error("Failed to update the course.");
        }
    };

    // Example usage when handling the update (inside a button click handler or form submission)
    const handleUpdate = () => {
        const schoolCode = courseData.schoolCode; // Ensure this is coming from courseData
        const level = courseData.level; // Ensure this is coming from courseData

        const updateData = {
            fy2016Req: editableData.fy2016Req,
            fy2017Req: editableData.fy2017Req,
            remarks: editableData.remarks
        };

        console.log("Calling updateChangeRequest with schoolCode:", schoolCode, "level:", level, "updateData:", updateData);

        // Call the function to update the document
        updateChangeRequest(schoolCode, level, updateData);
    };

    // Handle reset action
    const handleReset = () => {
        setEditableData({
            fy2016Req: courseData.fy2016Req || "",
            fy2017Req: courseData.fy2017Req || "",
            remarks: courseData.remarks || "",
        });
    };

    return (
        <>
            <NavBar />
            <Box sx={{ padding: "20px" }}>
                <h2 style={{ textAlign: "center" }}>{selectedSchool} - Course: {courseData.code}</h2>

                <TableContainer component={Paper} sx={{ maxWidth: "none", margin: "0 auto" }}> {/* Full-width table */}
                    <Table sx={{ width: "100%" }}>
                        <TableHead sx={{ backgroundColor: "#007bff" }}>
                            <TableRow>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>QS</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>School Code</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Level</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>CP</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Orig 2016 Req</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Avg 2017 Req</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Avg 2010-2012 Req</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Inputs 2012</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Current TRAP</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Adjusted 2014 Req</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>FY 2016 Req</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>FY 2016 Last LID</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>FY 2017 Req</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>FY 2017 Last LID</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Highest Inputs 2010-2012</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Years With Inputs</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Remarks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{courseData.qs}</TableCell>
                                <TableCell>{courseData.schoolCode}</TableCell>
                                <TableCell>{courseData.level}</TableCell>
                                <TableCell>{courseData.cp}</TableCell>
                                <TableCell>{courseData.origReq2016}</TableCell>
                                <TableCell>{courseData.avgReq2017}</TableCell>
                                <TableCell>{courseData.avgReq2010_2012}</TableCell>
                                <TableCell>{courseData.inputs2012}</TableCell>
                                <TableCell>{courseData.currentTrap}</TableCell>
                                <TableCell>{courseData.adjustedReq2014}</TableCell>
                                <TableCell>
                                    <TextField
                                        name="fy2016Req"
                                        value={editableData.fy2016Req}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{courseData.fy2016LastLID}</TableCell>
                                <TableCell>
                                    <TextField
                                        name="fy2017Req"
                                        value={editableData.fy2017Req}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{courseData.fy2017LastLID}</TableCell>
                                <TableCell>{courseData.highestInputs}</TableCell>
                                <TableCell>{courseData.yearsWithInputs}</TableCell>
                                <TableCell>
                                    <TextField
                                        name="remarks"
                                        value={editableData.remarks}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Buttons for actions */}
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: "10px" }}
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ marginRight: "10px" }}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button variant="contained" onClick={() => navigate(-1)}>
                        Return to Course List
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </>
    );
};

export default CourseDetails;
