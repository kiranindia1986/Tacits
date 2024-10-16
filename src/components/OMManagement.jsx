import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OMManagement = () => {
    const [selectedSection, setSelectedSection] = useState('Category');
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [totalCosts, setTotalCosts] = useState([]);
    const [justifications, setJustifications] = useState([]);

    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState('');
    const [newQuantity, setNewQuantity] = useState('');
    const [newTotalCost, setNewTotalCost] = useState('');
    const [newJustification, setNewJustification] = useState('');
    const [loading, setLoading] = useState(false);

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Firebase collection references
    const categoryCollectionRef = collection(db, 'Categories');
    const itemCollectionRef = collection(db, 'Items');
    const quantityCollectionRef = collection(db, 'Quantities');
    const totalCostCollectionRef = collection(db, 'TotalCosts');
    const justificationCollectionRef = collection(db, 'Justifications');

    // Fetch data from Firebase
    useEffect(() => {
        const fetchData = async () => {
            const categoryData = await getDocs(categoryCollectionRef);
            setCategories(categoryData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

            const itemData = await getDocs(itemCollectionRef);
            setItems(itemData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

            const quantityData = await getDocs(quantityCollectionRef);
            setQuantities(quantityData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

            const totalCostData = await getDocs(totalCostCollectionRef);
            setTotalCosts(totalCostData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

            const justificationData = await getDocs(justificationCollectionRef);
            setJustifications(justificationData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
    }, []);

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    // Functions to add new data
    const addCategory = async () => {
        if (newCategory.trim()) {
            setLoading(true);
            await addDoc(categoryCollectionRef, { Category: newCategory });
            setLoading(false);
            setNewCategory('');
            toast.success('Category added successfully.');
            window.location.reload(); // Reload to fetch updated list
        }
    };

    const addItem = async () => {
        if (newItem.trim()) {
            setLoading(true);
            await addDoc(itemCollectionRef, { Item: newItem });
            setLoading(false);
            setNewItem('');
            toast.success('Item added successfully.');
            window.location.reload();
        }
    };

    const addQuantity = async () => {
        if (newQuantity.trim()) {
            setLoading(true);
            await addDoc(quantityCollectionRef, { Quantity: newQuantity });
            setLoading(false);
            setNewQuantity('');
            toast.success('Quantity added successfully.');
            window.location.reload();
        }
    };

    const addTotalCost = async () => {
        if (newTotalCost.trim()) {
            setLoading(true);
            await addDoc(totalCostCollectionRef, { TotalCost: newTotalCost });
            setLoading(false);
            setNewTotalCost('');
            toast.success('Total cost added successfully.');
            window.location.reload();
        }
    };

    const addJustification = async () => {
        if (newJustification.trim()) {
            setLoading(true);
            await addDoc(justificationCollectionRef, { Justification: newJustification });
            setLoading(false);
            setNewJustification('');
            toast.success('Justification added successfully.');
            window.location.reload();
        }
    };

    // Functions to delete data
    const deleteCategory = async (id) => {
        await deleteDoc(doc(db, 'Categories', id));
        toast.success('Category deleted successfully.');
        window.location.reload();
    };

    const deleteItem = async (id) => {
        await deleteDoc(doc(db, 'Items', id));
        toast.success('Item deleted successfully.');
        window.location.reload();
    };

    const deleteQuantity = async (id) => {
        await deleteDoc(doc(db, 'Quantities', id));
        toast.success('Quantity deleted successfully.');
        window.location.reload();
    };

    const deleteTotalCost = async (id) => {
        await deleteDoc(doc(db, 'TotalCosts', id));
        toast.success('Total cost deleted successfully.');
        window.location.reload();
    };

    const deleteJustification = async (id) => {
        await deleteDoc(doc(db, 'Justifications', id));
        toast.success('Justification deleted successfully.');
        window.location.reload();
    };

    // Render forms and tables based on selected section
    const renderSection = () => {
        let data = [];
        let addFunction;
        let newValue, setNewValue, label;
        let deleteFunction;

        switch (selectedSection) {
            case 'Category':
                data = categories;
                addFunction = addCategory;
                newValue = newCategory;
                setNewValue = setNewCategory;
                label = 'New Category';
                deleteFunction = deleteCategory;
                break;
            case 'Item':
                data = items;
                addFunction = addItem;
                newValue = newItem;
                setNewValue = setNewItem;
                label = 'New Item';
                deleteFunction = deleteItem;
                break;
            case 'Quantity':
                data = quantities;
                addFunction = addQuantity;
                newValue = newQuantity;
                setNewValue = setNewQuantity;
                label = 'New Quantity';
                deleteFunction = deleteQuantity;
                break;
            case 'TotalCost':
                data = totalCosts;
                addFunction = addTotalCost;
                newValue = newTotalCost;
                setNewValue = setNewTotalCost;
                label = 'New Total Cost';
                deleteFunction = deleteTotalCost;
                break;
            case 'Justification':
                data = justifications;
                addFunction = addJustification;
                newValue = newJustification;
                setNewValue = setNewJustification;
                label = 'New Justification';
                deleteFunction = deleteJustification;
                break;
            default:
                return null;
        }

        return (
            <Box sx={{ marginTop: '-10px' }}>
                {/* Input and Add Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '20px' }}>
                    <TextField
                        label={label}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        sx={{ width: '300px', marginRight: '20px' }}
                    />
                    <Button variant="contained" onClick={addFunction} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : `Add ${label}`}
                    </Button>
                </Box>

                {/* Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{label.replace('New ', '')}</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry[label.replace('New ', '')]}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => deleteFunction(entry.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={data.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </Box>
        );
    };

    return (
        <Box sx={{ padding: '5px 20px', textAlign: 'center', marginTop: '-50px' }}>
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333' }}>
                Manage Data
            </Typography>+

            {/* Buttons for navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <Button variant="outlined" onClick={() => setSelectedSection('Category')} sx={{ marginRight: '10px' }}>
                    Category
                </Button>
                <Button variant="outlined" onClick={() => setSelectedSection('Item')} sx={{ marginRight: '10px' }}>
                    Item
                </Button>
                <Button variant="outlined" onClick={() => setSelectedSection('Quantity')} sx={{ marginRight: '10px' }}>
                    Quantity
                </Button>
                <Button variant="outlined" onClick={() => setSelectedSection('TotalCost')} sx={{ marginRight: '10px' }}>
                    Total Cost
                </Button>
                <Button variant="outlined" onClick={() => setSelectedSection('Justification')}>
                    Justification
                </Button>
            </Box>

            {/* Render the selected section */}
            {renderSection()}

            <ToastContainer />
        </Box>
    );
};

export default OMManagement;
