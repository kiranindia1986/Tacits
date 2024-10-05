import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Firebase config
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"; // Firestore methods
import {
    Button,
    TextField,
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    TablePagination,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

const Change = () => {
    const [requirements, setRequirements] = useState([]); // State to store the list of requirements
    const [editableRow, setEditableRow] = useState(null); // State to track the row being edited
    const [formData, setFormData] = useState({
        qs: "",
        schoolCode: "",
        level: "",
        description: "",
        cp: "",
        origReq2016: "",
        avgReq2017: "",
        avgReq2010_2012: "",
        inputs2012: "",
        currentTrap: "",
        adjustedReq2014: "",
        fy2016Req: "",
        fy2017Req: "",
        fy2016LastLID: "",
        fy2017LastLID: "",
        highestInputs: "",
        yearsWithInputs: "",
        remarks: "",
    });
    const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is enabled
    const [currentId, setCurrentId] = useState(null); // Track the ID of the current editing row
    const [page, setPage] = useState(0); // For pagination
    const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

    // Function to fetch requirements from Firestore
    const fetchRequirements = async () => {
        const reqCollection = collection(db, "changereq");
        const reqSnapshot = await getDocs(reqCollection);
        const reqList = reqSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setRequirements(reqList); // Update the state with the fetched data
    };

    // Fetch data initially when the component is mounted
    useEffect(() => {
        fetchRequirements();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission to Firebase (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            // Update requirement
            const reqDoc = doc(db, "changereq", currentId);
            await updateDoc(reqDoc, {
                ...formData,
            });
            setEditableRow(null);
            toast.success("Requirement updated successfully");
        } else {
            // Add new requirement
            await addDoc(collection(db, "changereq"), {
                ...formData,
                needUpdate: false, // Add default value for needUpdate
            });
            toast.success("Requirement added successfully");
        }

        // Clear the form and reset states
        setFormData({
            qs: "",
            schoolCode: "",
            level: "",
            description: "",
            cp: "",
            origReq2016: "",
            avgReq2017: "",
            avgReq2010_2012: "",
            inputs2012: "",
            currentTrap: "",
            adjustedReq2014: "",
            fy2016Req: "",
            fy2017Req: "",
            fy2016LastLID: "",
            fy2017LastLID: "",
            highestInputs: "",
            yearsWithInputs: "",
            remarks: "",
        });
        setIsEditing(false);
        setCurrentId(null);

        // Fetch the updated requirements after adding/updating
        fetchRequirements();
    };

    // Handle editing of existing fields
    const handleEdit = (id) => {
        const requirement = requirements.find((req) => req.id === id);
        setFormData({
            qs: requirement.qs || "",
            schoolCode: requirement.schoolCode || "",
            level: requirement.level || "",
            description: requirement.description || "",
            cp: requirement.cp || "",
            origReq2016: requirement.origReq2016 || "",
            avgReq2017: requirement.avgReq2017 || "",
            avgReq2010_2012: requirement.avgReq2010_2012 || "",
            inputs2012: requirement.inputs2012 || "",
            currentTrap: requirement.currentTrap || "",
            adjustedReq2014: requirement.adjustedReq2014 || "",
            fy2016Req: requirement.fy2016Req || "",
            fy2017Req: requirement.fy2017Req || "",
            fy2016LastLID: requirement.fy2016LastLID || "",
            fy2017LastLID: requirement.fy2017LastLID || "",
            highestInputs: requirement.highestInputs || "",
            yearsWithInputs: requirement.yearsWithInputs || "",
            remarks: requirement.remarks || "",
        });
        setIsEditing(true); // Enable editing mode
        setCurrentId(id); // Store the current row ID
    };

    // Handle delete of a record from Firebase
    const handleDelete = async (id) => {
        const reqDoc = doc(db, "changereq", id);
        await deleteDoc(reqDoc);
        toast.success("Requirement deleted successfully");

        // Fetch the updated requirements after deletion
        fetchRequirements();
    };

    // Handle pagination change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when rows per page change
    };

    return (
        <Box sx={{ padding: "20px", marginTop: "-50px" }}>
            <ToastContainer /> {/* This will render the toast notifications */}
            <Typography variant="h4" align="center" gutterBottom>
                Change Requirements
            </Typography>

            {/* Form to add or update requirements */}
            <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: "40px", marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <TextField
                            label="QS"
                            variant="outlined"
                            fullWidth
                            name="qs"
                            value={formData.qs}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="School Code"
                            variant="outlined"
                            fullWidth
                            name="schoolCode"
                            value={formData.schoolCode}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Level"
                            variant="outlined"
                            fullWidth
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    {/* New Description Field */}
                    <Grid item xs={4}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="CP"
                            variant="outlined"
                            fullWidth
                            name="cp"
                            value={formData.cp}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Orig 2016 Req"
                            variant="outlined"
                            fullWidth
                            name="origReq2016"
                            value={formData.origReq2016}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Avg 2017 Req"
                            variant="outlined"
                            fullWidth
                            name="avgReq2017"
                            value={formData.avgReq2017}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Avg 2010-2012 Req"
                            variant="outlined"
                            fullWidth
                            name="avgReq2010_2012"
                            value={formData.avgReq2010_2012}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Inputs 2012"
                            variant="outlined"
                            fullWidth
                            name="inputs2012"
                            value={formData.inputs2012}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Current TRAP"
                            variant="outlined"
                            fullWidth
                            name="currentTrap"
                            value={formData.currentTrap}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Adjusted 2014 Req"
                            variant="outlined"
                            fullWidth
                            name="adjustedReq2014"
                            value={formData.adjustedReq2014}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="FY 2016 Req"
                            variant="outlined"
                            fullWidth
                            name="fy2016Req"
                            value={formData.fy2016Req}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="FY 2017 Req"
                            variant="outlined"
                            fullWidth
                            name="fy2017Req"
                            value={formData.fy2017Req}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="FY 2016 Last LID"
                            variant="outlined"
                            fullWidth
                            name="fy2016LastLID"
                            value={formData.fy2016LastLID}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="FY 2017 Last LID"
                            variant="outlined"
                            fullWidth
                            name="fy2017LastLID"
                            value={formData.fy2017LastLID}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Highest Inputs"
                            variant="outlined"
                            fullWidth
                            name="highestInputs"
                            value={formData.highestInputs}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Years With Inputs"
                            variant="outlined"
                            fullWidth
                            name="yearsWithInputs"
                            value={formData.yearsWithInputs}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            label="Remarks"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={1}
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}

                        />
                    </Grid>
                </Grid>

                <Button type="submit" variant="contained" color="primary" sx={{ marginTop: "20px" }}>
                    {isEditing ? "Update Requirement" : "Add New Requirement"}
                </Button>
            </Box>

            {/* Existing requirements table */}
            <Box sx={{ marginTop: "50px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Existing Requirements
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: "500px", overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>QS</TableCell>
                                <TableCell>School Code</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>CP</TableCell>
                                <TableCell>Orig 2016 Req</TableCell>
                                <TableCell>Avg 2017 Req</TableCell>
                                <TableCell>Avg 2010-2012 Req</TableCell>
                                <TableCell>Inputs 2012</TableCell>
                                <TableCell>Current TRAP</TableCell>
                                <TableCell>Adjusted 2014 Req</TableCell>
                                <TableCell>FY 2016 Req</TableCell>
                                <TableCell>FY 2017 Req</TableCell>
                                <TableCell>FY 2016 Last LID</TableCell>
                                <TableCell>FY 2017 Last LID</TableCell>
                                <TableCell>Highest Inputs</TableCell>
                                <TableCell>Years With Inputs</TableCell>
                                <TableCell>Remarks</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requirements
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.qs}</TableCell>
                                        <TableCell>{req.schoolCode}</TableCell>
                                        <TableCell>{req.level}</TableCell>
                                        <TableCell>{req.description}</TableCell>
                                        <TableCell>{req.cp}</TableCell>
                                        <TableCell>{req.origReq2016}</TableCell>
                                        <TableCell>{req.avgReq2017}</TableCell>
                                        <TableCell>{req.avgReq2010_2012}</TableCell>
                                        <TableCell>{req.inputs2012}</TableCell>
                                        <TableCell>{req.currentTrap}</TableCell>
                                        <TableCell>{req.adjustedReq2014}</TableCell>
                                        <TableCell>{req.fy2016Req}</TableCell>
                                        <TableCell>{req.fy2017Req}</TableCell>
                                        <TableCell>{req.fy2016LastLID}</TableCell>
                                        <TableCell>{req.fy2017LastLID}</TableCell>
                                        <TableCell>{req.highestInputs}</TableCell>
                                        <TableCell>{req.yearsWithInputs}</TableCell>
                                        <TableCell>{req.remarks}</TableCell>
                                        <TableCell sx={{ minWidth: '150px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Button variant="contained" color="secondary" onClick={() => handleEdit(req.id)} sx={{ marginRight: "10px" }}>
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(req.id)}>
                                                    Delete
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={requirements.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
};

export default Change;
