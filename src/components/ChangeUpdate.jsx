import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import Firebase config
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"; // Firestore methods
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    Typography,
    Box,
    Modal,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChangeTable = () => {
    const [data, setData] = useState([]); // State to store fetched data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRow, setSelectedRow] = useState(null); // Store the row to be edited
    const [open, setOpen] = useState(false); // Control modal open/close state
    const [needUpdate, setNeedUpdate] = useState(false); // State for dropdown value

    // Fetch data from Firebase and filter unique codes
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "changereq"));
            let fetchedData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log('Fetched Data:', fetchedData);  // Log fetched data

            // Filter unique codes (removing duplicates by 'code')
            const uniqueData = Object.values(
                fetchedData.reduce((acc, curr) => {
                    acc[curr.code] = curr; // Use `code` as a unique identifier
                    return acc;
                }, {})
            );

            console.log('Unique Data:', uniqueData);  // Log unique filtered data
            setData(uniqueData);  // Set state with the unique data
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("Failed to load data");
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Handle pagination change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Open the modal and set the selected row
    const handleEditClick = (row) => {
        setSelectedRow(row);
        setNeedUpdate(row.needUpdate); // Set the current value of 'Need Update'
        setOpen(true); // Open the modal
    };

    // Handle closing the modal
    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null); // Clear the selected row when closing
    };

    // Handle saving the updated "Need Update" value to Firestore
    const handleSave = async () => {
        if (selectedRow) {
            try {
                // Reference to the document to update
                const docRef = doc(db, "changereq", selectedRow.id);

                // Update only the "NeedUpdate" field in Firestore
                await updateDoc(docRef, {
                    needUpdate: needUpdate
                });

                toast.success("Updated successfully!");
                handleClose(); // Close modal after saving
                fetchData(); // Refresh data
            } catch (error) {
                toast.error("Failed to update the document.");
                console.error("Error updating document: ", error);
            }
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h6" align="center" gutterBottom>
                Existing Requirements (Filtered)
            </Typography>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Need Update</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.schoolCode || 'N/A'}</TableCell> {/* Ensure `schoolCode` exists */}
                                        <TableCell>{row.level}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{row.needUpdate ? "Yes" : "No"}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => handleEditClick(row)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Modal for Editing "Need Update" */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                    }}
                >
                    <Typography id="edit-modal-title" variant="h6" component="h2">
                        Edit {selectedRow?.schoolCode}
                    </Typography>

                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="School Code"
                            value={selectedRow?.schoolCode || ''}
                            margin="normal"
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Level"
                            value={selectedRow?.level || ''}
                            margin="normal"
                            disabled
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={selectedRow?.description || ''}
                            margin="normal"
                            disabled
                        />

                        {/* Dropdown for Need Update */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Need Update</InputLabel>
                            <Select
                                value={needUpdate}
                                onChange={(e) => setNeedUpdate(e.target.value)}
                                label="Need Update"
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{ mt: 2 }}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <ToastContainer />
        </Box>
    );
};

export default ChangeTable;
