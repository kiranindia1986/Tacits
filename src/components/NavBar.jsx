import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#4CAF50', padding: '10px 0' }}>
            <Toolbar variant="dense" sx={{ justifyContent: 'center' }}>
                <Button
                    component={Link}
                    to="/AFAMDashboard"
                    sx={{
                        color: '#fff',
                        mx: 1,
                        fontSize: '18px',
                        fontFamily: 'APTOS-DISPLAY',
                        textTransform: 'uppercase',
                        '&:hover': {
                            backgroundColor: '#388E3C',
                            borderRadius: '8px',
                        },
                    }}
                >
                    Dashboard
                </Button>

            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
