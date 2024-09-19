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

const SupportManagement = () => {
    const [supportTabs, setSupportTabs] = useState([]); // State for SupportTabs
    const [newSupportTab, setNewSupportTab] = useState(''); // State for new support tab
    const [editId, setEditId] = useState(null); // State to track the support tab being edited
    const [editSupportTab, setEditSupportTab] = useState(''); // State for support tab being edited
    const [loading, setLoading] = useState(false); // Loading state for add/update operations
    const [page, setPage] = useState(0); // Current page for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page for pagination

    const supportTabCollectionRef = collection(db, 'SupportTabs'); // Firebase collection reference for support tabs

    // Fetch support tabs from Firebase
    useEffect(() => {
        const fetchSupportTabs = async () => {
            const data = await getDocs(supportTabCollectionRef);
            setSupportTabs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchSupportTabs();
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

    // Add new support tab
    const addSupportTab = async () => {
        if (newSupportTab.trim()) {
            // Check for duplicates
            const duplicate = supportTabs.some(tab => tab.SupportTab === newSupportTab);
            if (duplicate) {
                toast.error('Duplicate entry. Support tab already exists.');
                return;
            }

            setLoading(true);
            await addDoc(supportTabCollectionRef, { SupportTab: newSupportTab });
            setLoading(false);
            setNewSupportTab('');
            toast.success('Support tab added successfully.');
            window.location.reload(); // Reload to fetch updated list
        }
    };

    // Edit support tab
    const updateSupportTab = async (id) => {
        const supportTabDoc = doc(db, 'SupportTabs', id);
        await updateDoc(supportTabDoc, { SupportTab: editSupportTab });
        setEditId(null);
        setEditSupportTab('');
        toast.success('Support tab updated successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    // Delete support tab
    const deleteSupportTab = async (id) => {
        const supportTabDoc = doc(db, 'SupportTabs', id);
        await deleteDoc(supportTabDoc);
        toast.success('Support tab deleted successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    return (
        <Box sx={{ padding: '5px 20px', textAlign: 'center' }}> {/* Adjusted padding */}
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333', marginTop: '-50px' }}>
                Manage Support Tabs
            </Typography>

            {/* Add new support tab */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    label="New Support Tab"
                    value={newSupportTab}
                    onChange={(e) => setNewSupportTab(e.target.value)}
                    sx={{ width: '300px', marginRight: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', fontWeight: 'bold' }}
                    onClick={addSupportTab}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add Support Tab'}
                </Button>
            </Box>

            {/* List of support tabs */}
            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Support Tab</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {supportTabs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tab) => (
                            <TableRow key={tab.id} hover sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>
                                    {editId === tab.id ? (
                                        <TextField
                                            value={editSupportTab}
                                            onChange={(e) => setEditSupportTab(e.target.value)}
                                            sx={{ width: '100%' }}
                                        />
                                    ) : (
                                        tab.SupportTab
                                    )}
                                </TableCell>
                                <TableCell align="right" sx={{ padding: '15px 20px' }}>
                                    {editId === tab.id ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ marginRight: '10px' }}
                                            onClick={() => updateSupportTab(tab.id)}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => { setEditId(tab.id); setEditSupportTab(tab.SupportTab); }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => deleteSupportTab(tab.id)}>
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
                    count={supportTabs.length}
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

export default SupportManagement;
