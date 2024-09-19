import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, CircularProgress, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const GradeManagement = () => {
    const [grade, setGrade] = useState('');
    const [for30Days, setFor30Days] = useState('');
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editGrade, setEditGrade] = useState('');
    const [editFor30Days, setEditFor30Days] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const gradeCollectionRef = collection(db, 'Grades'); // Firebase collection for Grades

    // Fetch grades from Firebase
    useEffect(() => {
        const fetchGrades = async () => {
            const data = await getDocs(gradeCollectionRef);
            setGrades(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        fetchGrades();
    }, []);

    // Add new grade
    const addGrade = async () => {
        if (grade.trim() && for30Days.trim()) {
            setLoading(true);
            await addDoc(gradeCollectionRef, { Grade: grade, For30Days: for30Days });
            setLoading(false);
            setGrade('');
            setFor30Days('');
            toast.success('Grade added successfully.');
            window.location.reload(); // Reload to fetch updated list
        }
    };

    // Edit grade
    const updateGrade = async (id) => {
        const gradeDoc = doc(db, 'Grades', id);
        await updateDoc(gradeDoc, { Grade: editGrade, For30Days: editFor30Days });
        setEditId(null);
        setEditGrade('');
        setEditFor30Days('');
        toast.success('Grade updated successfully.');
        window.location.reload();
    };

    // Delete grade
    const deleteGrade = async (id) => {
        const gradeDoc = doc(db, 'Grades', id);
        await deleteDoc(gradeDoc);
        toast.success('Grade deleted successfully.');
        window.location.reload();
    };

    // Pagination handler
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ padding: '5px 20px', textAlign: 'center' }}> {/* Adjusted padding */}
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333', marginTop: '-50px' }}> {/* Removed margin-top */}
                Manage Grades
            </Typography>

            {/* Add new grade */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
                <TextField
                    label="Grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    sx={{ width: '200px', marginRight: '20px' }}
                />
                <TextField
                    label="For 30 Days"
                    value={for30Days}
                    onChange={(e) => setFor30Days(e.target.value)}
                    sx={{ width: '200px', marginRight: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', fontWeight: 'bold', marginTop: '10px' }}
                    onClick={addGrade}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add Grade'}
                </Button>
            </Box>

            {/* List of grades */}
            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Grade</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>For 30 Days</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {grades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((grade) => (
                            <TableRow key={grade.id} hover sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>
                                    {editId === grade.id ? (
                                        <TextField
                                            value={editGrade}
                                            onChange={(e) => setEditGrade(e.target.value)}
                                            sx={{ width: '100%' }}
                                        />
                                    ) : (
                                        grade.Grade
                                    )}
                                </TableCell>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>
                                    {editId === grade.id ? (
                                        <TextField
                                            value={editFor30Days}
                                            onChange={(e) => setEditFor30Days(e.target.value)}
                                            sx={{ width: '100%' }}
                                        />
                                    ) : (
                                        grade.For30Days
                                    )}
                                </TableCell>
                                <TableCell align="right" sx={{ padding: '15px 20px' }}>
                                    {editId === grade.id ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ marginRight: '10px' }}
                                            onClick={() => updateGrade(grade.id)}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => { setEditId(grade.id); setEditGrade(grade.Grade); setEditFor30Days(grade.For30Days); }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => deleteGrade(grade.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={grades.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <ToastContainer />
        </Box>
    );
};

export default GradeManagement;
