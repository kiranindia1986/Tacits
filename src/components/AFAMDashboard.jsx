import React, { useState, useEffect } from 'react';
import {
    Box, Typography, CircularProgress, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, CssBaseline, Button
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [schoolCodes, setSchoolCodes] = useState([]);  // To store school codes
    const [selectedSchoolCode, setSelectedSchoolCode] = useState('');
    const [courses, setCourses] = useState([]);  // To store course listing data
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();  // Use React Router's useNavigate for page navigation

    // Fetch school codes from Firebase
    useEffect(() => {
        const fetchSchoolCodes = async () => {
            const data = await getDocs(collection(db, 'School'));  // Assumes 'School' collection in Firebase
            setSchoolCodes(data.docs.map(doc => doc.data().Code));  // Assuming 'Code' is the field for school codes
        };
        fetchSchoolCodes();
    }, []);

    // Load selected school code from local storage on mount
    useEffect(() => {
        const savedSchoolCode = localStorage.getItem('selectedSchoolCode');
        if (savedSchoolCode) {
            setSelectedSchoolCode(savedSchoolCode);  // Set saved value if exists
            fetchCourses(savedSchoolCode);  // Fetch courses for the saved school code
        }
    }, []);

    // Handle navigation to Master Data page
    const handleMasterDataClick = () => {
        navigate('/master');  // Replace '/master-data' with the actual route for your Master Data page
    };

    // Fetch course listing based on the selected school code
    const handleSchoolCodeChange = async (event) => {
        const selectedCode = event.target.value;

        // Clear all local storage data before proceeding
        localStorage.clear();

        // Now save the selected school code
        setSelectedSchoolCode(selectedCode);
        localStorage.setItem('selectedSchoolCode', selectedCode);  // Save selected value to local storage
        fetchCourses(selectedCode);  // Fetch courses for the new selected code
    };

    // Function to fetch courses based on school code
    const fetchCourses = async (schoolCode) => {
        setLoading(true);
        try {
            const courseQuery = query(collection(db, 'Courses'), where('School', '==', schoolCode));
            const courseSnapshot = await getDocs(courseQuery);
            const coursesData = courseSnapshot.docs.map(doc => doc.data());
            setCourses(coursesData);

            // Save table data to localStorage after fetching the courses
            saveDashboardDataToLocalStorage(coursesData);
        } catch (error) {
            toast.error("Error fetching course data");
        } finally {
            setLoading(false);
        }
    };

    // Function to save Dashboard data to localStorage
    const saveDashboardDataToLocalStorage = (coursesData) => {
        // Collect data from the three tables
        const dashboardSummary = [{
            totalTrainingProgram: 3,
            coursesExcludedFromFunding: 0,
            coursesIncludedForFunding: 3,
            coursesWithNoTrainingProgram: 0,
            totalRequested: 0.00,
            totalValidated: '$0',
            percentageValidated: '0%'
        }];

        const additionalSupport = [
            {
                additionalSupport: 'ARNC National Program',
                pending: 0,
                rejected: 5,
                valid: 2,
                validWithChanges: 0,
                added: 0,
                total: 7,
                reviewCompletion: '100%'
            },
            {
                additionalSupport: 'School Dining Facility',
                pending: 0,
                rejected: 0,
                valid: 4,
                validWithChanges: 0,
                added: 0,
                total: 4,
                reviewCompletion: '100%'
            },
            {
                additionalSupport: 'Transportation-Contract',
                pending: 0,
                rejected: 0,
                valid: 1,
                validWithChanges: 0,
                added: 0,
                total: 1,
                reviewCompletion: '100%'
            }
        ];

        // Save all three tables (summary, additional support, courses)
        const dashboardData = {
            summary: dashboardSummary,
            additionalSupport: additionalSupport,
            courses: coursesData
        };

        // Save data to localStorage
        localStorage.setItem('dashboardTableData', JSON.stringify(dashboardData));
    };

    // Handle navigation to Instructor page with the selected course's data
    const handleCourseClick = (course) => {
        navigate('/instructor', { state: { course } });  // Navigate to Instructor page with course data
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />

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
                <Box sx={{ display: 'flex', gap: 2, marginBottom: '20px', width: '100%', maxWidth: '500px' }}>

                    <FormControl fullWidth>
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

                    {/* Add Master Data Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleMasterDataClick}
                        sx={{ whiteSpace: 'nowrap', minWidth: '150px' }}
                    >
                        MASTER DATA
                    </Button>
                </Box>

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
                                        <TableRow sx={{ '& th': { border: '1px solid #ccc', fontWeight: 'bold' } }}>
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
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}>
                                            <TableCell>3</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>3</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0.00</TableCell>
                                            <TableCell>$0</TableCell>
                                            <TableCell>0%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Second Table - Additional Support */}
                        <Box sx={{ marginBottom: '30px', width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow sx={{ '& th': { border: '1px solid #ccc', fontWeight: 'bold' } }}>
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
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}>
                                            <TableCell>ARNC National Program</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>5</TableCell>
                                            <TableCell>2</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>7</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}>
                                            <TableCell>School Dining Facility</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>4</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>4</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ '& td': { border: '1px solid #ccc' } }}>
                                            <TableCell>Transportation-Contract</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>100%</TableCell>
                                        </TableRow>
                                        {/* More rows here */}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Third Table - Course Listing */}
                        <Box sx={{ width: '100%' }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow sx={{ '& th': { border: '1px solid #ccc', fontWeight: 'bold' } }}>
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
                                            <TableRow key={index} sx={{ cursor: 'pointer' }} onClick={() => handleCourseClick(course)}>
                                                <TableCell>{course.CourseName}</TableCell>
                                                <TableCell>{course.PhaseNumber}</TableCell>
                                                <TableCell>{course.TrainingProgram}</TableCell>
                                                <TableCell>{course.AnnualCapacity}</TableCell>
                                                <TableCell>{course.ResourcedCapacity}</TableCell>
                                                <TableCell>0</TableCell>
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
