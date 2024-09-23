import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Scenarios = () => {
    const navigate = useNavigate();

    // Navigate to Instructor page
    const handleNextPage = () => {
        navigate('/instructor');
    };

    // Navigate back to the Dashboard page
    const handlePrevPage = () => {
        navigate('/AFAMDashboard');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            <Box sx={{ flexGrow: 1, padding: '20px', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ marginBottom: '16px' }}>Scenarios</Typography>
                {/* Add your scenarios content here */}
            </Box>

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
                    gap: '8px',
                }}
            >
                Dashboard
            </Button>

            {/* Top-right button labeled "Instructor" */}
            <Button
                onClick={handleNextPage}
                variant="contained"
                sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                Instructor
            </Button>
        </Box>
    );
};

export default Scenarios;
