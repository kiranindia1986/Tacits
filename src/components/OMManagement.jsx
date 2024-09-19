import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination
} from '@mui/material';
import { db } from '../firebaseConfig';  // Import Firebase config
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OMManagement = () => {
    const [categories, setCategories] = useState([]); // State for categories
    const [newCategory, setNewCategory] = useState(''); // State for new category
    const [editId, setEditId] = useState(null); // State to track the category being edited
    const [editCategory, setEditCategory] = useState(''); // State for category being edited
    const [loading, setLoading] = useState(false); // Loading state for add/update operations
    const [page, setPage] = useState(0); // Current page for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page for pagination

    const categoryCollectionRef = collection(db, 'Categories'); // Firebase collection reference for categories

    // Fetch categories from Firebase
    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getDocs(categoryCollectionRef);
            setCategories(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchCategories();
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

    // Add new category
    const addCategory = async () => {
        if (newCategory.trim()) {
            // Check for duplicates
            const duplicate = categories.some(category => category.Category === newCategory);
            if (duplicate) {
                toast.error('Duplicate entry. Category already exists.');
                return;
            }

            setLoading(true);
            await addDoc(categoryCollectionRef, { Category: newCategory });
            setLoading(false);
            setNewCategory('');
            toast.success('Category added successfully.');
            window.location.reload(); // Reload to fetch updated list
        }
    };

    // Edit category
    const updateCategory = async (id) => {
        const categoryDoc = doc(db, 'Categories', id);
        await updateDoc(categoryDoc, { Category: editCategory });
        setEditId(null);
        setEditCategory('');
        toast.success('Category updated successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    // Delete category
    const deleteCategory = async (id) => {
        const categoryDoc = doc(db, 'Categories', id);
        await deleteDoc(categoryDoc);
        toast.success('Category deleted successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    return (
        <Box sx={{ padding: '5px 20px', textAlign: 'center' }}> {/* Adjusted padding */}
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333', marginTop: '-50px' }}>
                Manage Categories
            </Typography>

            {/* Add new category */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    label="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    sx={{ width: '300px', marginRight: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', fontWeight: 'bold' }}
                    onClick={addCategory}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add Category'}
                </Button>
            </Box>

            {/* List of categories */}
            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Category</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
                            <TableRow key={category.id} hover sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>
                                    {editId === category.id ? (
                                        <TextField
                                            value={editCategory}
                                            onChange={(e) => setEditCategory(e.target.value)}
                                            sx={{ width: '100%' }}
                                        />
                                    ) : (
                                        category.Category
                                    )}
                                </TableCell>
                                <TableCell align="right" sx={{ padding: '15px 20px' }}>
                                    {editId === category.id ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ marginRight: '10px' }}
                                            onClick={() => updateCategory(category.id)}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => { setEditId(category.id); setEditCategory(category.Category); }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => deleteCategory(category.id)}>
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
                    component="div"
                    count={categories.length}
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

export default OMManagement;
