import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Drawer, List, ListItem, ListItemText } from '@mui/material';
import NavBar from './NavBarT';
import Step1 from './Step1';
import Step2 from './Step2';
import Change from './Change';
import ChangeUpdate from './ChangeUpdate'; // Import the new ChangeUpdate component

const drawerWidth = 200;

const MasterData = () => {
    const [activeSection, setActiveSection] = useState('Step1'); // Default to 'Step1'

    // Update menuItems to include Step2 and Change Update
    const menuItems = [
        { text: 'Step 1', component: 'Step1' },
        { text: 'Step 2', component: 'Step2' },
        { text: 'Change Requirements', component: 'Change' },
        { text: 'Change Update', component: 'ChangeUpdate' }, // Add Change Update to the sidebar
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <CssBaseline />
            <NavBar />

            <Box
                sx={{
                    display: 'flex',
                    height: 'calc(100vh - 64px)',
                    marginTop: '10px',
                }}
            >
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        position: 'fixed',
                        left: '5%',
                        top: '12%',
                        transform: 'translateY(-50%)',
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

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        pb: 1,
                        maxWidth: '75%',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        marginLeft: '20%',
                    }}
                >
                    <Toolbar />

                    {/* Conditionally render sections */}
                    {activeSection === 'Step1' && <Step1 />}
                    {activeSection === 'Step2' && <Step2 />}
                    {activeSection === 'Change' && <Change />}
                    {activeSection === 'ChangeUpdate' && <ChangeUpdate />} {/* Render ChangeUpdate when selected */}
                </Box>
            </Box>
        </Box>
    );
};

export default MasterData;
