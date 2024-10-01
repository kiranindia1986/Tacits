import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig"; // Import your Firebase configuration
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBarT";

const ChangeRequirements = () => {
    const [requirements, setRequirements] = useState([]); // State to store requirements data
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get the passed state
    const { selectedSchool } = location.state || {}; // Get selected school from the passed state

    // Fetch data from Firebase collection "changereq"
    useEffect(() => {
        const fetchRequirements = async () => {
            try {
                const reqCollection = collection(db, "changereq"); // Reference to the collection
                const reqSnapshot = await getDocs(reqCollection); // Fetch all documents
                const reqList = reqSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map data
                setRequirements(reqList); // Set the state with fetched data
            } catch (error) {
                console.error("Error fetching requirements: ", error);
            }
        };

        fetchRequirements(); // Fetch data on component mount
    }, []);

    // Navigate to the editable course details page
    const handleUpdate = (req) => {
        navigate("/CourseDetails", { state: { courseData: req, selectedSchool } });
    };

    return (
        <>
            <NavBar />

            <Box sx={{ padding: "20px" }}>
                {/* Navigation Bar */}
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => console.log("Download Excel")}>
                        Download Excel
                    </Button>
                </Box>

                {/* Table Title */}
                <h2 style={{ textAlign: "center" }}>{selectedSchool}</h2>

                {/* Table */}
                <TableContainer component={Paper} sx={{ maxWidth: "900px", margin: "0 auto" }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#007bff" }}>
                            <TableRow>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Code</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Level</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requirements.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.schoolCode}</TableCell>
                                    <TableCell>{req.level}</TableCell>
                                    <TableCell>{req.description}</TableCell>
                                    <TableCell>
                                        {/* Conditional rendering of Update button */}
                                        {req.needUpdate ? (
                                            <Button variant="contained" color="primary" onClick={() => handleUpdate(req)}>
                                                Update
                                            </Button>
                                        ) : (
                                            <span></span> // No button if needUpdate is false
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default ChangeRequirements;
