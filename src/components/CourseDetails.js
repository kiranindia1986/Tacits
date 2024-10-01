import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField } from "@mui/material";
import NavBar from "./NavBarT";

const CourseDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseData, selectedSchool } = location.state || {}; // Get course data and selected school

    // State to hold editable values
    const [editableData, setEditableData] = useState({
        FY2016Req: courseData.FY2016Req || "",
        FY2017Req: courseData.FY2017Req || "",
        remarks: courseData.remarks || "",
    });

    // Handle input change for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle save/update action
    const handleUpdate = () => {
        console.log("Updated Data:", editableData);
        // Add logic to update Firebase with the new data here
    };

    // Handle reset action
    const handleReset = () => {
        setEditableData({
            FY2016Req: courseData.FY2016Req || "",
            FY2017Req: courseData.FY2017Req || "",
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
                                <TableCell>{courseData.QS}</TableCell>
                                <TableCell>{courseData.code}</TableCell>
                                <TableCell>{courseData.level}</TableCell>
                                <TableCell>{courseData.CP}</TableCell>
                                <TableCell>{courseData.orig2016Req}</TableCell>
                                <TableCell>{courseData.avg2017Req}</TableCell>
                                <TableCell>{courseData.avg2010_2012Req}</TableCell>
                                <TableCell>{courseData.inputs2012}</TableCell>
                                <TableCell>{courseData.currentTRAP}</TableCell>
                                <TableCell>{courseData.adjusted2014Req}</TableCell>
                                <TableCell>
                                    <TextField
                                        name="FY2016Req"
                                        value={editableData.FY2016Req}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{courseData.FY2016LastLID}</TableCell>
                                <TableCell>
                                    <TextField
                                        name="FY2017Req"
                                        value={editableData.FY2017Req}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{courseData.FY2017LastLID}</TableCell>
                                <TableCell>{courseData.highestInputs2010_2012}</TableCell>
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
        </>
    );
};

export default CourseDetails;
