import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const Instructor = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    // Load course data from state or localStorage
    const getSavedCourseData = () => {
        if (state?.course) {
            return state.course;  // Prioritize state if passed from navigation
        }
        const savedCourse = localStorage.getItem('instructorCourseData');
        return savedCourse ? JSON.parse(savedCourse) : {};  // Fallback to localStorage
    };

    const [course, setCourse] = useState(getSavedCourseData());

    // Define getSavedTableData function to load the saved table data from localStorage
    const getSavedTableData = () => {
        const savedData = localStorage.getItem('instructorTableData');
        return savedData ? JSON.parse(savedData) : [];
    };

    useEffect(() => {
        // Save course data to localStorage whenever the course state is updated
        if (state?.course) {
            localStorage.setItem('instructorCourseData', JSON.stringify(state.course));
        }
    }, [state?.course]);

    // Form state to manage input fields
    const [formData, setFormData] = useState({
        adjustedResourcedCapacity: '',
        constrainedRequirements: '',
        courseIVSRatio: '',
        totalAdditionalInstructors: '',
        courseLength: '',
        requiredManDays: '',
        funding: '',
        rtiJustification: '',
        ngbJustification: '',
        status: 'Requested',
        justification: ''
    });

    // State to manage table rows (loaded from localStorage)
    const [tableRows, setTableRows] = useState(getSavedTableData());

    // Save table rows to localStorage
    const saveTableData = (rows) => {
        localStorage.setItem('instructorTableData', JSON.stringify(rows));
    };

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Add form data to table
    const handleAddToTable = () => {
        const newRows = [...tableRows, formData];
        setTableRows(newRows);
        saveTableData(newRows);  // Save the new rows to localStorage

        // Clear input fields after adding to table
        setFormData({
            adjustedResourcedCapacity: '',
            constrainedRequirements: '',
            courseIVSRatio: '',
            totalAdditionalInstructors: '',
            courseLength: '',
            requiredManDays: '',
            funding: '',
            rtiJustification: '',
            ngbJustification: '',
            status: 'Requested',
            justification: ''
        });
    };

    // Clear input fields
    const handleClearFields = () => {
        setFormData({
            adjustedResourcedCapacity: '',
            constrainedRequirements: '',
            courseIVSRatio: '',
            totalAdditionalInstructors: '',
            courseLength: '',
            requiredManDays: '',
            funding: '',
            rtiJustification: '',
            ngbJustification: '',
            status: 'Requested',
            justification: ''
        });
    };

    // Clear entire table and localStorage
    const handleClearTable = () => {
        setTableRows([]);
        localStorage.removeItem('instructorTableData');  // Clear data from localStorage
    };

    // Navigate to Support page
    const handleNextPage = () => {
        navigate('/support', { state: { course } });  // Pass the course data to the next page
    };

    // Navigate back to Dashboard page
    const handlePrevPage = () => {
        navigate('/AFAMDashboard');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h5" sx={{ marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', color: '#343a40' }}>
                Instructor
            </Typography>

            {/* Top Table - Data from Dashboard or localStorage */}
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
                    label="Adjusted Resourced Capacity"
                    name="adjustedResourcedCapacity"
                    value={formData.adjustedResourcedCapacity}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Constrained Requirements"
                    name="constrainedRequirements"
                    value={formData.constrainedRequirements}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Course I/VS Ratio"
                    name="courseIVSRatio"
                    value={formData.courseIVSRatio}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Total Additional Instructors"
                    name="totalAdditionalInstructors"
                    value={formData.totalAdditionalInstructors}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Course Length"
                    name="courseLength"
                    value={formData.courseLength}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Required Man Days"
                    name="requiredManDays"
                    value={formData.requiredManDays}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="Funding"
                    name="funding"
                    value={formData.funding}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                />
                <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                >
                    <MenuItem value="Requested">Requested</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
                <TextField
                    label="RTI Justification"
                    name="rtiJustification"
                    value={formData.rtiJustification}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                />
                <TextField
                    label="NGB Justification"
                    name="ngbJustification"
                    value={formData.ngbJustification}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
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
                <Button variant="contained" color="success" onClick={handleAddToTable} sx={{ gridColumn: 'span 1', height: '50px', mt: 2 }}>
                    Add
                </Button>
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Adjusted Resourced Capacity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Constrained Requirements</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Course I/VS Ratio</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total Additional Instructors</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Course Length</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Required Man Days</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Funding</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>RTI Justification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>NGB Justification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Justification</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.adjustedResourcedCapacity}</TableCell>
                                <TableCell>{row.constrainedRequirements}</TableCell>
                                <TableCell>{row.courseIVSRatio}</TableCell>
                                <TableCell>{row.totalAdditionalInstructors}</TableCell>
                                <TableCell>{row.courseLength}</TableCell>
                                <TableCell>{row.requiredManDays}</TableCell>
                                <TableCell>{row.funding}</TableCell>
                                <TableCell>{row.rtiJustification}</TableCell>
                                <TableCell>{row.ngbJustification}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{row.justification}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Top-left button labeled "Dashboard" */}
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
                Dashboard
            </Button>

            {/* Top-right button labeled "Support" */}
            <Button
                onClick={handleNextPage}
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
                Support
            </Button>
        </Box>
    );
};

export default Instructor;
