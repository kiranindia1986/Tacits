import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#4CAF50', padding: '10px 0' }}>
            <Toolbar variant="dense" sx={{ justifyContent: 'center' }}>
                <Button
                    component={Link}
                    to="/afam-dashboard"
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
                <Button
                    component={Link}
                    to="/scenarios"
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
                    Scenarios
                </Button>
                <Button
                    component={Link}
                    to="/instructor"
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
                    Instructor
                </Button>
                <Button
                    component={Link}
                    to="/support"
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
                    Support
                </Button>
                <Button
                    component={Link}
                    to="/om"
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
                    O&M
                </Button>
                <Button
                    component={Link}
                    to="/certification"
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
                    Certification
                </Button>
                <Button
                    component={Link}
                    to="/export"
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
                    Export
                </Button>
                <Button
                    component={Link}
                    to="/master-data"
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
                    Master Data
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
