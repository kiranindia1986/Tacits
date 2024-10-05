import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firebase config
import NavBar from "./NavBarT"; // Assuming this is your NavBar component
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNewRequirements = () => {
    const [data, setData] = useState([]); // Store data from Firebase
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedSchool } = location.state || {}; // Get the selected school from the previous screen

    // Fetch data from changereq where needUpdate is false
    useEffect(() => {
        const fetchData = async () => {
            try {
                const changereqCollection = collection(db, "changereq"); // Reference to collection
                const q = query(changereqCollection, where("needUpdate", "==", false)); // Only where needUpdate is false
                const querySnapshot = await getDocs(q); // Fetch data from Firebase

                const fetchedData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setData(fetchedData); // Set fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load data.");
            }
        };

        fetchData(); // Call the fetch function on component mount
    }, []);

    const handleAddRequirement = (requirement) => {
        // You can add your logic here to handle adding the requirement.
        // This can be updating Firebase or performing any action when 'Add' is clicked.
        toast.success(`Added ${requirement.code} successfully!`);
    };

    return (
        <>
            <NavBar />
            <Box sx={{ padding: "20px" }}>
                <h3 style={{ textAlign: "center" }}>{selectedSchool}</h3>

                <TableContainer component={Paper} sx={{ maxWidth: "none", margin: "0 auto" }}>
                    <Table sx={{ width: "100%" }}>
                        <TableHead sx={{ backgroundColor: "#007bff" }}>
                            <TableRow>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Code</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Level</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Description</TableCell>
                                <TableCell style={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.schoolCode}</TableCell>
                                    <TableCell>{row.level}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleAddRequirement(row)}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: "20px" }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginLeft: "10px", marginTop: "20px" }}
                    onClick={() => {
                        // Logic for downloading Excel can go here
                        toast.info("Download Excel functionality is coming soon!");
                    }}
                >
                    Download Excel
                </Button>

                <ToastContainer />
            </Box>
        </>
    );
};

export default AddNewRequirements;
