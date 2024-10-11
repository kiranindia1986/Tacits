import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SchoolManagement = () => {
    const [schoolCodes, setSchoolCodes] = useState([]);
    const [newSchoolCode, setNewSchoolCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const schoolCodeCollectionRef = collection(db, 'School'); // Firebase collection reference

    // Fetch school codes from Firebase
    useEffect(() => {
        const fetchSchoolCodes = async () => {
            const data = await getDocs(schoolCodeCollectionRef);
            setSchoolCodes(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchSchoolCodes();
    }, []);

    // Handle page change for pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change for pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Add new school code
    const addSchoolCode = async () => {
        if (newSchoolCode.trim()) {
            // Check for duplicates
            const duplicate = schoolCodes.some(code => code.Code === newSchoolCode);
            if (duplicate) {
                toast.error('Duplicate entry. School code already exists.');
                return;
            }

            setLoading(true);
            await addDoc(schoolCodeCollectionRef, { Code: newSchoolCode });
            setLoading(false);
            setNewSchoolCode('');
            toast.success('School code added successfully.');
            // Reload the school codes list
            const updatedData = await getDocs(schoolCodeCollectionRef);
            setSchoolCodes(updatedData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        }
    };

    // Delete school code
    const deleteSchoolCode = async (id) => {
        try {
            await deleteDoc(doc(db, 'School', id));
            setSchoolCodes(schoolCodes.filter(code => code.id !== id));
            toast.success('School code deleted successfully.');
        } catch (error) {
            toast.error('Error deleting school code: ' + error.message);
        }
    };

    return (
        <Box sx={{ padding: '5px 20px', textAlign: 'center' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
                Manage School Codes
            </Typography>

            {/* Add new school code */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    label="New School Code"
                    value={newSchoolCode}
                    onChange={(e) => setNewSchoolCode(e.target.value)}
                    sx={{ width: '300px', marginRight: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', fontWeight: 'bold' }}
                    onClick={addSchoolCode}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add School Code'}
                </Button>
            </Box>

            {/* List of school codes */}
            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>School Code</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schoolCodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((code) => (
                            <TableRow key={code.id} hover sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{code.Code}</TableCell>
                                <TableCell align="right" sx={{ padding: '15px 20px' }}>
                                    <IconButton><EditIcon /></IconButton>
                                    <IconButton onClick={() => deleteSchoolCode(code.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <TablePagination
                    component="div"
                    count={schoolCodes.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <ToastContainer />
        </Box>
    );
};

export default SchoolManagement;
