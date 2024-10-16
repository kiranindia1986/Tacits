import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, FormControl, InputLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig'; // Make sure you import your Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore functions

const OM = () => {
    const navigate = useNavigate();

    // Navigate back to the previous page (Support)
    const handlePrevPage = () => {
        navigate('/support');
    };

    // Navigate forward to the next page (Certification)
    const handleNextPage = () => {
        navigate('/certification');
    };

    // Load course data from localStorage
    const getSavedCourseData = () => {
        const savedCourse = localStorage.getItem('instructorCourseData');
        return savedCourse ? JSON.parse(savedCourse) : {};
    };

    // Load table data from localStorage
    const getSavedTableData = () => {
        const savedTableData = localStorage.getItem('OMTableData');
        return savedTableData ? JSON.parse(savedTableData) : [];
    };

    const [course, setCourse] = useState(getSavedCourseData());
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [quantities, setQuantity] = useState([]);
    const [costs, setCost] = useState([]);
    const [justifications, setJustification] = useState([]);


    const [radioValue, setRadioValue] = useState('spread'); // Default to 'Spread Across Training Program'
    const [formData, setFormData] = useState({
        category: '',
        item: '',
        quantity: '',
        totalCost: '',
        cost: '',
        justification: ''
    });
    const [tableRows, setTableRows] = useState(getSavedTableData());

    // Fetch Categories data from Firebase
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getDocs(collection(db, 'Categories')); // Fetch 'Categories' collection
                setCategories(categoryData.docs.map(doc => doc.data().Category)); // Assuming 'Category' is the field for categories
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const itemData = await getDocs(collection(db, 'Items')); // Fetch 'Categories' collection
                setItems(itemData.docs.map(doc => doc.data().Item)); // Assuming 'Category' is the field for categories
            } catch (error) {
                console.error("Error fetching items: ", error);
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const fetchQuantity = async () => {
            try {
                const quantityData = await getDocs(collection(db, 'Quantities')); // Fetch 'Categories' collection
                setQuantity(quantityData.docs.map(doc => doc.data().Quantity)); // Assuming 'Category' is the field for categories
            } catch (error) {
                console.error("Error fetching quantity: ", error);
            }
        };
        fetchQuantity();
    }, []);

    useEffect(() => {
        const fetchCost = async () => {
            try {
                const costData = await getDocs(collection(db, 'TotalCosts')); // Fetch 'Categories' collection
                setCost(costData.docs.map(doc => doc.data().TotalCost)); // Assuming 'Category' is the field for categories
            } catch (error) {
                console.error("Error fetching costs: ", error);
            }
        };
        fetchCost();
    }, []);

    useEffect(() => {
        const fetchJustification = async () => {
            try {
                const JustificationData = await getDocs(collection(db, 'Justifications')); // Fetch 'Categories' collection
                setJustification(JustificationData.docs.map(doc => doc.data().Justification)); // Assuming 'Category' is the field for categories
            } catch (error) {
                console.error("Error fetching justifications: ", error);
            }
        };
        fetchJustification();
    }, []);


    // Save the table data to localStorage whenever tableRows change
    useEffect(() => {
        localStorage.setItem('OMTableData', JSON.stringify(tableRows));
    }, [tableRows]);

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    // Handle radio button change
    const handleRadioChange = (e) => {
        setRadioValue(e.target.value);
    };

    // Add form data to table
    const handleAddToTable = () => {
        let newRow = { ...formData };

        if (radioValue === 'spread') {
            // Spread Across Training Program selected
            newRow.spread = 'Spread';
        } else {
            // Select Funding Months selected
            newRow.fundingMonths = 'Funding'; // This can be more dynamic if needed
        }

        // Add row to the table
        setTableRows((prevRows) => [...prevRows, newRow]);

        // Clear input fields after adding to table
        setFormData({
            category: '',
            item: '',
            quantity: '',
            totalCost: '',
            justification: ''
        });
    };

    // Clear input fields
    const handleClearFields = () => {
        setFormData({
            category: '',
            item: '',
            quantity: '',
            totalCost: '',
            justification: ''
        });
    };

    // Clear entire table and localStorage
    const handleClearTable = () => {
        setTableRows([]);
        localStorage.removeItem('OMTableData'); // Clear data from localStorage
    };

    // Calculate the sum of the "Total Cost" column
    const calculateTotalCostSum = () => {
        return tableRows.reduce((sum, row) => {
            const cost = parseFloat(row.totalCost) || 0; // Parse as float, default to 0 if invalid
            return sum + cost;
        }, 0);
    };

    // Save the total cost sum to localStorage whenever tableRows change
    useEffect(() => {
        const totalCostSum = calculateTotalCostSum();
        localStorage.setItem('totalCostSum', totalCostSum.toFixed(2)); // Save as a string with 2 decimal places
    }, [tableRows]);


    return (
        <Box sx={{ padding: '20px', position: 'relative', height: '100vh' }}>

            <Typography variant="h5" sx={{ marginBottom: '16px', textAlign: 'center', fontWeight: 'bold', color: '#343a40' }}>
                OM Page
            </Typography>

            {/* Top-left Previous button labeled "Support" */}
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
                Support
            </Button>

            {/* Top-right Next button labeled "Certification" */}
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
                Certification
            </Button>

            {/* Top Table - Same as in Support/Instructor */}
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
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select a Category</MenuItem>
                    {categories.map((category, index) => (
                        <MenuItem key={index} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    name="item"
                    value={formData.item}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select a Item</MenuItem>
                    {items.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select a Quantity</MenuItem>
                    {quantities.map((quantity, index) => (
                        <MenuItem key={index} value={quantity}>
                            {quantity}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    name="totalCost"
                    value={formData.totalCost}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    displayEmpty
                >
                    <MenuItem value="">Select a Cost</MenuItem>
                    {costs.map((cost, index) => (
                        <MenuItem key={index} value={cost}>
                            {cost}
                        </MenuItem>
                    ))}
                </Select>

                <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
                    <InputLabel id="totalCost-label">Cost</InputLabel>
                    <Select
                        labelId="totalCost-label"
                        name="totalCost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        label="totalCost"
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        <MenuItem value=" We need funding for repairs because the equipment has been used a lot and might break soon.">
                            We need funding for repairs because the equipment has been used a lot and might break soon.
                        </MenuItem>
                        <MenuItem value="The requested O&M funding for equipment repair and maintenance ensures all Howitzers and the M992 vehicle remain fully operational, directly supporting critical training phases and mission readiness.">
                            The requested O&M funding for equipment repair and maintenance ensures all Howitzers and the M992 vehicle remain fully operational, directly supporting critical training phases and mission readiness.
                        </MenuItem>
                        <MenuItem value="Things break sometimes, so repairs might be a good idea.">
                            Things break sometimes, so repairs might be a good idea.
                        </MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{ marginBottom: '20px' }}>
                    <InputLabel id="justification-label">Justification</InputLabel>
                    <Select
                        labelId="justification-label"
                        name="justification"
                        value={formData.justification}
                        onChange={handleInputChange}
                        label="Justification"
                    >
                        <MenuItem value="">Please Select</MenuItem>
                        <MenuItem value=" We need funding for repairs because the equipment has been used a lot and might break soon.">
                            We need funding for repairs because the equipment has been used a lot and might break soon.
                        </MenuItem>
                        <MenuItem value="The requested O&M funding for equipment repair and maintenance ensures all Howitzers and the M992 vehicle remain fully operational, directly supporting critical training phases and mission readiness.">
                            The requested O&M funding for equipment repair and maintenance ensures all Howitzers and the M992 vehicle remain fully operational, directly supporting critical training phases and mission readiness.
                        </MenuItem>
                        <MenuItem value="Things break sometimes, so repairs might be a good idea.">
                            Things break sometimes, so repairs might be a good idea.
                        </MenuItem>
                    </Select>
                </FormControl>



                {/* Radio Buttons for Spread and Funding Months */}
                <Box sx={{ gridColumn: 'span 4' }}>
                    <RadioGroup row value={radioValue} onChange={handleRadioChange}>
                        <FormControlLabel value="spread" control={<Radio />} label="Spread Across Training Program" />
                        <FormControlLabel value="funding" control={<Radio />} label="Select Funding Months" />
                    </RadioGroup>
                </Box>

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
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Funding Months</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>RTI Justification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>NGB Justification</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableRows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.category}</TableCell>
                                <TableCell>{row.item}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{row.totalCost}</TableCell>
                                <TableCell>{row.fundingMonths || row.spread}</TableCell>
                                <TableCell>{row.justification}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OM;
