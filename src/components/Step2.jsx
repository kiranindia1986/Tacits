import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import the Firebase Firestore instance
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
    TextField,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Paper,
    Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Step2 = () => {
    const [fieldValue, setFieldValue] = useState(""); // State for the input field
    const [dataList, setDataList] = useState([]); // State to hold data from Firebase
    const [editingId, setEditingId] = useState(null); // State to track which item is being edited

    // Function to handle input change
    const handleChange = (e) => {
        setFieldValue(e.target.value);
    };

    // Function to add data to Firebase
    const addData = async () => {
        if (fieldValue.trim() !== "") {
            try {
                await addDoc(collection(db, "step2Data"), {
                    field: fieldValue,
                });
                setFieldValue(""); // Clear the input field
                fetchData(); // Refresh the data
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    // Function to fetch data from Firebase
    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "step2Data"));
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setDataList(data);
    };

    // Function to delete data from Firebase
    const deleteData = async (id) => {
        try {
            await deleteDoc(doc(db, "step2Data", id));
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    // Function to edit data in Firebase
    const editData = async () => {
        if (fieldValue.trim() !== "" && editingId) {
            try {
                const docRef = doc(db, "step2Data", editingId);
                await updateDoc(docRef, {
                    field: fieldValue,
                });
                setFieldValue("");
                setEditingId(null);
                fetchData(); // Refresh the data
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        }
    };

    // Function to load data for editing
    const loadEditData = (id, currentValue) => {
        setFieldValue(currentValue);
        setEditingId(id);
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                marginTop: '0px'
            }}
        >
            <Paper sx={{ padding: '20px', width: '100%', maxWidth: '500px' }} elevation={3}>
                <Typography variant="h4" align="center" gutterBottom>
                    Step 2 - Data Management
                </Typography>
                <Typography align="center" gutterBottom>
                    Manage data for Step 2.
                </Typography>

                {/* Input Field */}
                <TextField
                    fullWidth
                    label="Enter Data"
                    variant="outlined"
                    value={fieldValue}
                    onChange={handleChange}
                    sx={{ marginBottom: '20px' }}
                />

                {/* Add or Edit button */}
                {editingId ? (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={editData}
                        sx={{ marginBottom: '20px' }}
                    >
                        Edit
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={addData}
                        sx={{ marginBottom: '20px' }}
                    >
                        Add
                    </Button>
                )}

                {/* Data List */}
                <List>
                    {dataList.map((item) => (
                        <React.Fragment key={item.id}>
                            <ListItem
                                secondaryAction={
                                    <Box>
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => loadEditData(item.id, item.field)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => deleteData(item.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemText primary={item.field} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default Step2;
