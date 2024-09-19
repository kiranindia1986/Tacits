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

const CertificationManagement = () => {
    const [certifications, setCertifications] = useState([]); // State for Certification entries
    const [newCertification, setNewCertification] = useState(''); // State for new certification
    const [editId, setEditId] = useState(null); // State to track the certification being edited
    const [editCertification, setEditCertification] = useState(''); // State for certification being edited
    const [loading, setLoading] = useState(false); // Loading state for add/update operations
    const [page, setPage] = useState(0); // Current page for pagination
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page for pagination

    const certificationCollectionRef = collection(db, 'Certifications'); // Firebase collection reference for certifications

    // Fetch certifications from Firebase
    useEffect(() => {
        const fetchCertifications = async () => {
            const data = await getDocs(certificationCollectionRef);
            setCertifications(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchCertifications();
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

    // Add new certification
    const addCertification = async () => {
        if (newCertification.trim()) {
            // Check for duplicates
            const duplicate = certifications.some(cert => cert.Certification === newCertification);
            if (duplicate) {
                toast.error('Duplicate entry. Certification already exists.');
                return;
            }

            setLoading(true);
            await addDoc(certificationCollectionRef, { Certification: newCertification });
            setLoading(false);
            setNewCertification('');
            toast.success('Certification added successfully.');
            window.location.reload(); // Reload to fetch updated list
        }
    };

    // Edit certification
    const updateCertification = async (id) => {
        const certificationDoc = doc(db, 'Certifications', id);
        await updateDoc(certificationDoc, { Certification: editCertification });
        setEditId(null);
        setEditCertification('');
        toast.success('Certification updated successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    // Delete certification
    const deleteCertification = async (id) => {
        const certificationDoc = doc(db, 'Certifications', id);
        await deleteDoc(certificationDoc);
        toast.success('Certification deleted successfully.');
        window.location.reload(); // Reload to fetch updated list
    };

    return (
        <Box sx={{ padding: '5px 20px', textAlign: 'center' }}> {/* Adjusted padding */}
            <Typography variant="h4" sx={{ marginBottom: '20px', fontWeight: 'bold', color: '#333', marginTop: '-50px' }}>
                Manage Certifications
            </Typography>

            {/* Add new certification */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    label="New Certification"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    sx={{ width: '300px', marginRight: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ padding: '10px 20px', fontWeight: 'bold' }}
                    onClick={addCertification}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Add Certification'}
                </Button>
            </Box>

            {/* List of certifications */}
            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '16px' }}>Certification</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {certifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cert) => (
                            <TableRow key={cert.id} hover sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ padding: '15px 20px', fontSize: '15px' }}>
                                    {editId === cert.id ? (
                                        <TextField
                                            value={editCertification}
                                            onChange={(e) => setEditCertification(e.target.value)}
                                            sx={{ width: '100%' }}
                                        />
                                    ) : (
                                        cert.Certification
                                    )}
                                </TableCell>
                                <TableCell align="right" sx={{ padding: '15px 20px' }}>
                                    {editId === cert.id ? (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ marginRight: '10px' }}
                                            onClick={() => updateCertification(cert.id)}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => { setEditId(cert.id); setEditCertification(cert.Certification); }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => deleteCertification(cert.id)}>
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
                    count={certifications.length}
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

export default CertificationManagement;
