import React, { useState } from "react";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Container, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [project, setProject] = useState("");
    const [username, setUsername] = useState("admin"); // Default value 'admin'
    const [password, setPassword] = useState("admin"); // Default value 'admin'
    const navigate = useNavigate();

    const handleLogin = () => {
        // Add login validation here
        if (username === "admin" && password === "admin") { // Default credentials for now
            if (project === "AFAM") {
                navigate("/AFAMDashboard");
            } else if (project === "TACITS") {
                navigate("/tacits-dashboard");
            } else {
                alert("Please select a project.");
            }
        } else {
            alert("Invalid credentials.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: "20px", marginTop: "30%" }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Login
                </Typography>
                <Box component="form" noValidate autoComplete="off">
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Project</InputLabel>
                        <Select
                            value={project}
                            onChange={(e) => setProject(e.target.value)}
                            label="Select Project"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="AFAM">AFAM</MenuItem>
                            <MenuItem value="TACITS">TACITS</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: "20px" }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
