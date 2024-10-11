import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Import Firebase config
import { collection, getDocs, query, where } from 'firebase/firestore'; // Firebase Firestore functions

const Support = () => {
    const navigate = useNavigate();

    // Load course data from localStorage
    const getSavedCourseData = () => {
        const savedCourse = localStorage.getItem('instructorCourseData');
        return savedCourse ? JSON.parse(savedCourse) : {};
    };

    const [course, setCourse] = useState(getSavedCourseData());

    const [supportTabs, setSupportTabs] = useState([]);
    const [grades, setGrades] = useState([]);
    const [formData, setFormData] = useState({
        supportTab: '',
        grade: '',
        quantity: '',
        iterationsOfTravel: '',
        supportDuration: '',
        travelCost: '',
        perDiem: '',
        justification: ''
    });
    const [tableRows, setTableRows] = useState(() => {
        // Load table data from localStorage if available
        const savedRows = localStorage.getItem('supportTableData');
        return savedRows ? JSON.parse(savedRows) : [];
    });

    // Fetch Support Tab and Grade data from Firebase
    useEffect(() => {
        const fetchSupportTabsAndGrades = async () => {
            try {
                const supportTabData = await getDocs(collection(db, 'SupportTabs')); // Fetch 'Support' collection
                const gradeData = await getDocs(collection(db, 'Grades')); // Fetch 'Grade' collection

                setSupportTabs(supportTabData.docs.map(doc => doc.data().SupportTab)); // Assuming 'SupportTab' is the field for support options
                setGrades(gradeData.docs.map(doc => doc.data().Grade)); // Assuming 'Grade' is the field for grades
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchSupportTabsAndGrades();
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
        const { grade, quantity, supportDuration } = formData;

        // Fetch the "For30Days" value from Firebase for the selected grade
        const for30DaysValue = await fetchGradeFor30Days(grade);

        let payAndAllowances = 0;
        if (for30DaysValue) {
            // Perform the calculation: ((For30Days / 30) * supportDuration) * quantity
            payAndAllowances = ((for30DaysValue / 30) * parseFloat(supportDuration)) * parseFloat(quantity);
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
        localStorage.setItem('supportTableData', JSON.stringify(updatedRows));

        // Clear input fields after adding to table
        setFormData({
            supportTab: '',
            grade: '',
            quantity: '',
            iterationsOfTravel: '',
            supportDuration: '',
            travelCost: '',
            perDiem: '',
            justification: ''
        });
    };

    // Clear input fields
    const handleClearFields = () => {
        setFormData({
            supportTab: '',
            grade: '',
            quantity: '',
            iterationsOfTravel: '',
            supportDuration: '',
            travelCost: '',
            perDiem: '',
            justification: ''
        });
    };

    // Clear entire table and localStorage
    const handleClearTable = () => {
        setTableRows([]);
        localStorage.removeItem('supportTableData'); // Clear data from localStorage
    };

    // Navigate to different pages
    const handleInstructorPage = () => navigate('/instructor');
    const handleOMPage = () => navigate('/om');

    return (
        <Box sx={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h5" sx={{ marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', color: '#343a40' }}>
                Support Page
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
                <Select
                    name="supportTab"
                    value={formData.supportTab}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select Option</MenuItem>
                    {supportTabs.map((supportTab, index) => (
                        <MenuItem key={index} value={supportTab}>
                            {supportTab}
                        </MenuItem>
                    ))}
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
                    label="Iterations Of Travel"
                    name="iterationsOfTravel"
                    value={formData.iterationsOfTravel}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Support Duration"
                    name="supportDuration"
                    value={formData.supportDuration}
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Support Tab</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Iterations Of Travel</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Support Duration</TableCell>
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
                                <TableCell>{row.supportTab}</TableCell>
                                <TableCell>{row.grade}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{row.iterationsOfTravel}</TableCell>
                                <TableCell>{row.supportDuration}</TableCell>
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

            {/* Top-left button labeled "Instructor" */}
            <Button
                onClick={handleInstructorPage}
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
                Instructor
            </Button>

            {/* Top-right button labeled "O&M" */}
            <Button
                onClick={handleOMPage}
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
                O&M
            </Button>
        </Box>
    );
};

export default Support;