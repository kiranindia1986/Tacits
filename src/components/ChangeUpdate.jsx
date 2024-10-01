import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import Firebase config
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TablePagination,
    Typography,
    Box
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ChangeTable = () => {
    const [data, setData] = useState([]); // State to store fetched data
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Fetch data from Firebase and filter unique codes
    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "changereq"));
            let fetchedData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Filter unique codes (removing duplicates by 'code')
            const uniqueData = Object.values(
                fetchedData.reduce((acc, curr) => {
                    acc[curr.code] = curr;
                    return acc;
                }, {})
            );

            setData(uniqueData);
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("Failed to load data");
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Handle pagination change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h6" align="center" gutterBottom>
                Existing Requirements (Filtered)
            </Typography>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code</TableCell>
                                <TableCell>Level</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Need Update</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.schoolCode}</TableCell>
                                        <TableCell>{row.level}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{row.needUpdate ? "Yes" : "No"}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => toast.info(`Edit ${row.code}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={data.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <ToastContainer />
        </Box>
    );
};

export default ChangeTable;
