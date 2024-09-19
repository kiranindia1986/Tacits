import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import NavBar from './NavBar';
import SchoolManagement from './SchoolManagement';
import CourseManagement from './CourseManagement';
import GradeManagement from './GradeManagement';
import OMManagement from './OMManagement'; // New component for O&M
import SupportManagement from './SupportManagement'; // New component for Support
import CertificationManagement from './CertificationManagement'; // New component for Certification

const drawerWidth = 200; // Adjust sidebar width

const MasterData = () => {
    const [activeSection, setActiveSection] = useState('School'); // Default to 'School'

    // Sidebar menu items
    const menuItems = [
        { text: 'School', component: 'School' },
        { text: 'Course', component: 'Course' },
        { text: 'Grade', component: 'Grade' },
        { text: 'O&M', component: 'OM' }, // New O&M tab
        { text: 'Support', component: 'Support' }, // New Support tab
        { text: 'Certification', component: 'Certification' }, // New Certification tab
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />

            {/* Main NavBar */}
            <NavBar /> {/* This is your primary navigation bar */}

            <Box
                sx={{
                    display: 'flex',
                    height: 'calc(100vh - 64px)', // Adjust for NavBar height
                    marginTop: '10px',
                }}
            >
                {/* Vertically Centered Sidebar at Left */}
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        position: 'fixed',       // Use fixed positioning to keep it at the left
                        left: '5%',               // Align with the left edge of the screen
                        top: '12%',              // Move to vertical center
                        transform: 'translateY(-50%)',  // Center the sidebar vertically
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            height: 'auto',
                            boxSizing: 'border-box',
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            borderRadius: '8px',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem button key={item.text} onClick={() => setActiveSection(item.component)}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        pb: 1,
                        maxWidth: '75%', // Limit the content width
                        textAlign: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        marginLeft: '20%',  // Add space to the right of the sidebar
                    }}
                >
                    <Toolbar />

                    {/* Conditionally render sections */}
                    {activeSection === 'School' && <SchoolManagement />}
                    {activeSection === 'Course' && <CourseManagement />}
                    {activeSection === 'Grade' && <GradeManagement />}
                    {activeSection === 'OM' && <OMManagement />} {/* Render O&M Management */}
                    {activeSection === 'Support' && <SupportManagement />} {/* Render Support Management */}
                    {activeSection === 'Certification' && <CertificationManagement />} {/* Render Certification Management */}
                </Box>
            </Box>
        </Box>
    );
};

export default MasterData;
