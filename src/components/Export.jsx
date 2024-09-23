import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const Export = () => {
    const navigate = useNavigate();

    // Navigate back to the previous page (Certification)
    const handlePrevPage = () => {
        navigate('/certification');
    };

    return (
        <Box sx={{ padding: '20px', position: 'relative', height: '100vh' }}>
            <Typography variant="h4" gutterBottom>
                Export Page
            </Typography>
            <Typography variant="body1">
                This is the Export page. You can add export-related content here.
            </Typography>

            {/* Top-left Previous button with arrow labeled "Certification" */}
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
                <ArrowBackIosIcon />
                Certification
            </Button>
        </Box>
    );
};

export default Export;
