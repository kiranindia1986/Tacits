import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Import Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firebase Firestore functions
import * as XLSX from 'xlsx'; // Import the XLSX library


const Certification = () => {
    const navigate = useNavigate();

    // Load table data for each tab from localStorage
    const dashboardData = JSON.parse(localStorage.getItem('dashboardTableData') || '[]');
    const instructorData = JSON.parse(localStorage.getItem('instructorTableData') || '[]');
    const supportData = JSON.parse(localStorage.getItem('supportTableData') || '[]');
    const omData = JSON.parse(localStorage.getItem('omTableData') || '[]');
    const certificationData = JSON.parse(localStorage.getItem('certificationTableData') || '[]');

    // Function to export to Excel
    const handleExportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Extract data from dashboardData
        const dashboardData = JSON.parse(localStorage.getItem('dashboardTableData') || '{}');

        let combinedDashboardData = [];

        // Ensure that each section is an array of arrays
        if (dashboardData.summary && Array.isArray(dashboardData.summary)) {
            combinedDashboardData.push(['Dashboard Summary']);
            combinedDashboardData.push([
                'totalTrainingPrograms', 'coursesExcludedFromFunding', 'coursesIncludedForFunding',
                'coursesWithNoTrainingProgram', 'totalRequested', 'totalValidated', '% Validated'
            ]);
            combinedDashboardData.push(Object.values(dashboardData.summary[0])); // Push the first row
            combinedDashboardData.push([]); // Empty row to separate sections
        }

        // Add Additional Support section
        if (dashboardData.additionalSupport && Array.isArray(dashboardData.additionalSupport)) {
            combinedDashboardData.push(['Additional Support']);
            combinedDashboardData.push([
                'Additional Support', 'Pending', 'Rejected', 'Valid', 'Valid With Changes', 'Added', 'Total', 'Review Completion %'
            ]);
            dashboardData.additionalSupport.forEach((row) => {
                combinedDashboardData.push(Object.values(row)); // Ensure each row is an array
            });
            combinedDashboardData.push([]); // Empty row to separate sections
        }

        // Add Courses section
        if (dashboardData.courses && Array.isArray(dashboardData.courses)) {
            combinedDashboardData.push(['Courses']);
            combinedDashboardData.push([
                'CourseName', 'PhaseNumber', 'TrainingProgram', 'AnnualCapacity', 'ResourcedCapacity',
                'Pending', 'Rejected', 'Valid', 'Valid With Changes', 'Added', 'Total', 'Review Completion %'
            ]);
            dashboardData.courses.forEach((row) => {
                combinedDashboardData.push(Object.values(row)); // Ensure each row is an array
            });
        }

        // Create a sheet for the combined dashboard data
        if (combinedDashboardData.length > 0) {
            const dashboardSheet = XLSX.utils.aoa_to_sheet(combinedDashboardData);
            XLSX.utils.book_append_sheet(workbook, dashboardSheet, 'Dashboard');
        }

        // Add Instructor Data (Last table)
        const instructorData = JSON.parse(localStorage.getItem('instructorTableData') || '[]');
        if (instructorData.length > 0) {
            const instructorSheet = XLSX.utils.json_to_sheet(instructorData);
            XLSX.utils.book_append_sheet(workbook, instructorSheet, 'Instructor');
        }

        // Add Support Data (Last table)
        const supportData = JSON.parse(localStorage.getItem('supportTableData') || '[]');
        if (supportData.length > 0) {
            const supportSheet = XLSX.utils.json_to_sheet(supportData);
            XLSX.utils.book_append_sheet(workbook, supportSheet, 'Support');
        }

        // Add OM Data (Last table)
        const omData = JSON.parse(localStorage.getItem('omTableData') || '[]');
        if (omData.length > 0) {
            const omSheet = XLSX.utils.json_to_sheet(omData);
            XLSX.utils.book_append_sheet(workbook, omSheet, 'OM');
        }

        // Add Certification Data (Last table)
        const certificationData = JSON.parse(localStorage.getItem('certificationTableData') || '[]');
        if (certificationData.length > 0) {
            const certificationSheet = XLSX.utils.json_to_sheet(certificationData);
            XLSX.utils.book_append_sheet(workbook, certificationSheet, 'Certification');
        }

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'CourseData.xlsx');
    };




    // Load course data from localStorage
    const getSavedCourseData = () => {
        const savedCourse = localStorage.getItem('instructorCourseData');
        return savedCourse ? JSON.parse(savedCourse) : {};
    };

    const [course, setCourse] = useState(getSavedCourseData());
    const [grades, setGrades] = useState([]);
    const [formData, setFormData] = useState({
        event: '',
        agrAdosMday: '',
        grade: '',
        quantity: '',
        duration: '',
        noOfAttendees: '',
        travelCost: '',
        perDiem: '',
        justification: ''
    });
    const [tableRows, setTableRows] = useState(() => {
        const savedRows = localStorage.getItem('certificationTableData');
        return savedRows ? JSON.parse(savedRows) : [];
    });

    // Fetch Grades data from Firebase
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const gradeData = await getDocs(collection(db, 'Grades')); // Fetch 'Grade' collection
                setGrades(gradeData.docs.map(doc => doc.data().Grade)); // Assuming 'Grade' is the field for grades
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchGrades();
    }, []);

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Function to fetch the "For30Days" value for the selected grade from Firebase
    const fetchGradeFor30Days = async (selectedGrade) => {
        try {
            const gradeQuery = query(collection(db, 'Grades'), where('Grade', '==', selectedGrade));
            const gradeSnapshot = await getDocs(gradeQuery);

            if (!gradeSnapshot.empty) {
                const gradeDoc = gradeSnapshot.docs[0].data(); // Assuming one document for the grade
                return gradeDoc.For30Days; // Assuming 'For30Days' is the field containing the value
            }
            return null;
        } catch (error) {
            console.error("Error fetching grade data: ", error);
            return null;
        }
    };

    // Add form data to table with the calculation for "Pay and Allowances"
    const handleAddToTable = async () => {
        const { grade, quantity, duration, noOfAttendees } = formData;

        // Fetch the "For30Days" value from Firebase for the selected grade
        const for30DaysValue = await fetchGradeFor30Days(grade);

        let payAndAllowances = 0;
        if (for30DaysValue) {
            // Perform the calculation: ((For30Days / 30) * duration * noOfAttendees)
            payAndAllowances = ((for30DaysValue / 30) * parseFloat(duration)) * parseFloat(noOfAttendees);
        }

        // Add calculated value to the table row
        const newRow = {
            ...formData,
            payAndAllowances: payAndAllowances.toFixed(2) // Add the calculated pay and allowances to the row
        };

        // Update the table rows
        const updatedRows = [...tableRows, newRow];
        setTableRows(updatedRows);

        // Save the new rows to localStorage
        localStorage.setItem('certificationTableData', JSON.stringify(updatedRows));

        // Clear input fields after adding to table
        setFormData({
            event: '',
            agrAdosMday: '',
            grade: '',
            quantity: '',
            duration: '',
            noOfAttendees: '',
            travelCost: '',
            perDiem: '',
            justification: ''
        });
    };

    // Clear input fields
    const handleClearFields = () => {
        setFormData({
            event: '',
            agrAdosMday: '',
            grade: '',
            quantity: '',
            duration: '',
            noOfAttendees: '',
            travelCost: '',
            perDiem: '',
            justification: ''
        });
    };

    // Clear entire table and localStorage
    const handleClearTable = () => {
        setTableRows([]);
        localStorage.removeItem('certificationTableData'); // Clear data from localStorage
    };

    // Navigate to different pages
    const handlePrevPage = () => navigate('/om');
    const handleNextPage = () => navigate('/export');

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h5" sx={{ marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', color: '#343a40' }}>
                Certification Page
            </Typography>

            {/* Top Table - Data loaded from localStorage */}
            <TableContainer component={Paper} elevation={3} sx={{ marginBottom: '30px', backgroundColor: '#ffffff' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#e9ecef' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>School</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Course Number</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Phase</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Training Program</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Annual Capacity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Resourced Capacity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Original Additional Instructors</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Baseload</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>BFDA</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{course.School || ''}</TableCell>
                            <TableCell>{course.CourseName || ''}</TableCell>
                            <TableCell>{course.PhaseNumber || ''}</TableCell>
                            <TableCell>{course.TrainingProgram || ''}</TableCell>
                            <TableCell>{course.AnnualCapacity || ''}</TableCell>
                            <TableCell>{course.ResourcedCapacity || ''}</TableCell>
                            <TableCell>{course.OriginalInstructors || ''}</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Input Fields Section */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 2,
                    marginBottom: '30px',
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)'
                }}
            >
                <TextField
                    label="Event"
                    name="event"
                    value={formData.event}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <Select
                    name="agrAdosMday"
                    value={formData.agrAdosMday}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select Option</MenuItem>
                    <MenuItem value="AGR">AGR</MenuItem>
                    <MenuItem value="ADOS">ADOS</MenuItem>
                    <MenuItem value="MDAY">MDAY</MenuItem>
                </Select>
                <Select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select Grade</MenuItem>
                    {grades.map((grade, index) => (
                        <MenuItem key={index} value={grade}>
                            {grade}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    label="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="No Of Attendees"
                    name="noOfAttendees"
                    value={formData.noOfAttendees}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Travel Cost"
                    name="travelCost"
                    value={formData.travelCost}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Per Diem"
                    name="perDiem"
                    value={formData.perDiem}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Justification"
                    name="justification"
                    value={formData.justification}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                />

                {/* Move Add Button to the right */}
                <Box sx={{ gridColumn: 'span 4', textAlign: 'right' }}>
                    <Button variant="contained" color="success" onClick={handleAddToTable} sx={{ height: '50px' }}>
                        Add
                    </Button>
                </Box>
            </Box>

            {/* Buttons - Clear Fields and Clear Table */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: '20px' }}>
                <Button variant="outlined" color="error" onClick={handleClearFields} sx={{ padding: '12px 24px', fontSize: '16px' }}>
                    Clear Fields
                </Button>
                <Button variant="outlined" color="warning" onClick={handleClearTable} sx={{ padding: '12px 24px', fontSize: '16px' }}>
                    Clear Table
                </Button>
            </Box>

            {/* Bottom Table */}
            <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#e9ecef' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>AGR/ADOS/MDAY</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}># of Attendees</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Pay and Allowances</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Travel Costs</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Per Diem</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total Funding</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>RTI Justification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>NGB Justification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.event}</TableCell>
                                <TableCell>{row.agrAdosMday}</TableCell>
                                <TableCell>{row.grade}</TableCell>
                                <TableCell>{row.noOfAttendees}</TableCell>
                                <TableCell>{row.duration}</TableCell>
                                <TableCell>{row.payAndAllowances}</TableCell>
                                <TableCell>{row.travelCost}</TableCell>
                                <TableCell>{row.perDiem}</TableCell>
                                <TableCell>
                                    {(parseFloat(row.travelCost || 0) +
                                        parseFloat(row.perDiem || 0) +
                                        parseFloat(row.payAndAllowances || 0)).toFixed(2)}
                                </TableCell>
                                <TableCell>{row.justification}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Top-left button labeled "O&M" */}
            <Button
                onClick={handlePrevPage}
                variant="contained"
                sx={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '8px'
                }}
            >
                O&M
            </Button>

            {/* Top-right button labeled "Export" */}

            <Button
                onClick={handleExportToExcel}
                variant="contained"
                sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '8px'
                }}
            >
                Export to Excel
            </Button>


        </Box>
    );
};

export default Certification;
