import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, Select, MenuItem, FormControl, InputLabel, TablePagination
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [newCourseName, setNewCourseName] = useState('');
    const [newPhaseNumber, setNewPhaseNumber] = useState('');
    const [selectedSchool, setSelectedSchool] = useState('');
    const [newTrainingProgram, setNewTrainingProgram] = useState('');
    const [annualCapacity, setAnnualCapacity] = useState('');
    const [resourcedCapacity, setResourcedCapacity] = useState('');
    const [schoolCodes, setSchoolCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null); // Track the ID of the course being edited
    const [page, setPage] = useState(0); // State for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

    const schoolCodeCollectionRef = collection(db, 'School');
    const courseCollectionRef = collection(db, 'Courses');

    // Fetch school codes from Firebase
    useEffect(() => {
        const fetchSchoolCodes = async () => {
            const data = await getDocs(schoolCodeCollectionRef);
            setSchoolCodes(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchSchoolCodes();
    }, []);

    // Fetch courses from Firebase
    useEffect(() => {
        const fetchCourses = async () => {
            const data = await getDocs(courseCollectionRef);
            setCourses(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchCourses();
    }, []);

    // Add or Update course
    const saveCourse = async () => {
        if (
            newCourseName.trim() &&
            newPhaseNumber.trim() &&
            selectedSchool &&
            newTrainingProgram.trim() &&
            annualCapacity.trim() &&
            resourcedCapacity.trim()
        ) {
            setLoading(true);

            if (editId) {
                // If an edit is in progress, update the existing course
                const courseDoc = doc(db, 'Courses', editId);
                await updateDoc(courseDoc, {
                    School: selectedSchool,
                    CourseName: newCourseName,
                    PhaseNumber: newPhaseNumber,
                    TrainingProgram: newTrainingProgram,
                    AnnualCapacity: annualCapacity,
                    ResourcedCapacity: resourcedCapacity,
                });
                toast.success('Course updated successfully.');
            } else {
                // Add a new course
                await addDoc(courseCollectionRef, {
                    School: selectedSchool,
                    CourseName: newCourseName,
                    PhaseNumber: newPhaseNumber,
                    TrainingProgram: newTrainingProgram,
                    AnnualCapacity: annualCapacity,
                    ResourcedCapacity: resourcedCapacity,
                });
                toast.success('Course added successfully.');
            }

            setLoading(false);
            resetForm();
            window.location.reload(); // Reload to fetch updated list
        }
    };

    // Reset form fields
    const resetForm = () => {
        setNewCourseName('');
        setNewPhaseNumber('');
        setSelectedSchool('');
        setNewTrainingProgram('');
        setAnnualCapacity('');
        setResourcedCapacity('');
        setEditId(null); // Clear the edit ID after saving
    };

    // Edit course
    const handleEdit = (course) => {
        setEditId(course.id);
        setNewCourseName(course.CourseName);
        setNewPhaseNumber(course.PhaseNumber);
        setSelectedSchool(course.School);
        setNewTrainingProgram(course.TrainingProgram);
        setAnnualCapacity(course.AnnualCapacity);
        setResourcedCapacity(course.ResourcedCapacity);
    };

    // Delete course
    const handleDelete = async (id) => {
        const courseDoc = doc(db, 'Courses', id);
        await deleteDoc(courseDoc);
        toast.success('Course deleted successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    // Handle pagination change
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
                Manage Courses
            </Typography>

            {/* Add or Edit course */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                <FormControl sx={{ width: '200px', marginRight: '20px' }}>
                    <InputLabel>Select School</InputLabel>
                    <Select
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                        label="Select School"
                    >
                        {schoolCodes.map((school) => (
                            <MenuItem key={school.id} value={school.Code}>
                                {school.Code}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Course Name"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    sx={{ width: '150px', marginRight: '20px' }}
                />

                <TextField
                    label="Phase No."
                    value={newPhaseNumber}
                    onChange={(e) => setNewPhaseNumber(e.target.value)}
                    sx={{ width: '120px', marginRight: '20px' }}
                />

                <TextField
                    label="Training Program"
                    value={newTrainingProgram}
                    onChange={(e) => setNewTrainingProgram(e.target.value)}
                    sx={{ width: '150px', marginRight: '20px' }}
                />

                <TextField
                    label="Annual Capacity"
                    value={annualCapacity}
                    onChange={(e) => setAnnualCapacity(e.target.value)}
                    sx={{ width: '180px', marginRight: '20px' }}
                />

                <TextField
                    label="Resourced Capacity"
                    value={resourcedCapacity}
                    onChange={(e) => setResourcedCapacity(e.target.value)}
                    sx={{ width: '180px', marginRight: '20px' }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', fontWeight: 'bold', marginTop: '10px' }}
                    onClick={saveCourse}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : editId ? 'Update Course' : 'Add Course'}
                </Button>

                {editId && (
                    <Button
                        variant="outlined"
                        sx={{ padding: '10px 20px', fontWeight: 'bold', marginTop: '10px', marginLeft: '20px' }}
                        onClick={resetForm}
                    >
                        Cancel Edit
                    </Button>
                )}
            </Box>

            {/* List of courses */}
            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>School</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Course Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Phase Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Training Program</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Annual Capacity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Resourced Capacity</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                            <TableRow key={course.id} hover sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{course.School}</TableCell>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{course.CourseName}</TableCell>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{course.PhaseNumber}</TableCell>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{course.TrainingProgram}</TableCell>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{course.AnnualCapacity}</TableCell>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>{course.ResourcedCapacity}</TableCell>
                                <TableCell align="right" sx={{ padding: '15px 20px' }}>
                                    <IconButton onClick={() => handleEdit(course)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(course.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={courses.length}
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

export default CourseManagement;
