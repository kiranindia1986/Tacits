import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, Select, MenuItem, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Toolbar, CssBaseline
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './NavBar';  // Import your NavBar component

const Dashboard = () => {
    const [schoolCodes, setSchoolCodes] = useState([]);  // To store school codes
    const [selectedSchoolCode, setSelectedSchoolCode] = useState('');
    const [courses, setCourses] = useState([]);  // To store course listing data
    const [loading, setLoading] = useState(false);

    // Fetch school codes from Firebase
    useEffect(() => {
        const fetchSchoolCodes = async () => {
            const data = await getDocs(collection(db, 'School'));  // Assumes 'School' collection in Firebase
            setSchoolCodes(data.docs.map(doc => doc.data().Code));  // Assuming 'Code' is the field for school codes
        };
        fetchSchoolCodes();
    }, []);

    // Fetch course listing based on the selected school code
    const handleSchoolCodeChange = async (event) => {
        const selectedCode = event.target.value;
        setSelectedSchoolCode(selectedCode);
        setLoading(true);

        try {
            // Query Firebase for courses related to the selected school code
            const courseQuery = query(collection(db, 'Courses'), where('School', '==', selectedCode));
            const courseSnapshot = await getDocs(courseQuery);
            const coursesData = courseSnapshot.docs.map(doc => doc.data());
            setCourses(coursesData);
        } catch (error) {
            toast.error("Error fetching course data");
        } finally {
            setLoading(false);
        }
    };

    return (

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            {/* Add the NavBar */}
            <NavBar />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '24px',  // Adjust this to account for the NavBar height
                    flexDirection: 'column',
                    padding: '20px',
                }}
            >
                {/* School Code Dropdown */}
                <FormControl fullWidth sx={{ marginBottom: '20px', maxWidth: '400px' }}>
                    <InputLabel>School Code</InputLabel>
                    <Select
                        value={selectedSchoolCode}
                        onChange={handleSchoolCodeChange}
                        label="School Code"
                    >
                        {schoolCodes.map((code, index) => (
                            <MenuItem key={index} value={code}>{code}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Loading Spinner */}
                {loading && <CircularProgress />}

                {/* Tables */}
                {!loading && selectedSchoolCode && (
                    <>

                        {/* First Table - Summary Information */}
                        <Box sx={{ marginBottom: '30px', width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow sx={{ '& th': { border: '1px solid #ccc', fontWeight: 'bold' } }}> {/* Add border to header cells */}
                                            <TableCell>Total Training Program</TableCell>
                                            <TableCell>Courses Excluded From Funding</TableCell>
                                            <TableCell>Courses Included for Funding</TableCell>
                                            <TableCell>Courses with No Training Program</TableCell>
                                            <TableCell>Total Requested</TableCell>
                                            <TableCell>Total Validated</TableCell>
                                            <TableCell>% Validated</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}> {/* Add border to body cells */}
                                            <TableCell>3</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>3</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0.00</TableCell>
                                            <TableCell>$0</TableCell>
                                            <TableCell>0%</TableCell>
                                        </TableRow>
                                        {/* Add more rows here if needed */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>



                        {/* First Table - Additional Support */}
                        <Box sx={{ marginBottom: '30px', width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow sx={{ '& th': { border: '1px solid #ccc', fontWeight: 'bold' } }}> {/* Add border to header cells */}
                                            <TableCell>Additional Support</TableCell>
                                            <TableCell>Pending</TableCell>
                                            <TableCell>Rejected</TableCell>
                                            <TableCell>Valid</TableCell>
                                            <TableCell>Valid with Changes</TableCell>
                                            <TableCell>Added</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Review Completion %</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}> {/* Add border to body cells */}
                                            <TableCell>ARNC National Program</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>5</TableCell>
                                            <TableCell>2</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>7</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}> {/* Add border to body cells */}
                                            <TableCell>School Dining Facility</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>4</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>4</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}> {/* Add border to body cells */}
                                            <TableCell>Transportation-Contract</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                        {/* Add more rows here */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>


                        {/* Second Table - Course Listing */}
                        <Box sx={{ width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow sx={{ '& th': { border: '1px solid #ccc', fontWeight: 'bold' } }}> {/* Add border to header */}
                                            <TableCell>Course</TableCell>
                                            <TableCell>Phase</TableCell>
                                            <TableCell>Training Program</TableCell>
                                            <TableCell>Annual Capacity</TableCell>
                                            <TableCell>Resourced Capacity</TableCell>
                                            <TableCell>Pending</TableCell>
                                            <TableCell>Rejected</TableCell>
                                            <TableCell>Valid</TableCell>
                                            <TableCell>Valid with Changes</TableCell>
                                            <TableCell>Added</TableCell>
                                            <TableCell>Total</TableCell>
                                            <TableCell>Review Completion %</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {courses.map((course, index) => (
                                            <TableRow key={index} sx={{ '& td': { border: '1px solid #ccc' } }}>
                                                <TableCell>{course.CourseName}</TableCell>
                                                <TableCell>{course.PhaseNumber}</TableCell>
                                                <TableCell>{course.TrainingProgram}</TableCell>
                                                <TableCell>{course.AnnualCapacity}</TableCell>
                                                <TableCell>{course.ResourcedCapacity}</TableCell><TableCell>0</TableCell>
                                                <TableCell>0</TableCell>
                                                <TableCell>0</TableCell>
                                                <TableCell>0</TableCell>
                                                <TableCell>0</TableCell>
                                                <TableCell>0</TableCell>
                                                <TableCell>0%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                )}

                <ToastContainer />
            </Box>
        </Box>
    );
};

export default Dashboard;
