import React from "react";
import { useNavigate } from "react-router-dom";
import './NavBarT.css'; // Ensure the CSS file is properly linked

const NavBar = () => {
    const navigate = useNavigate();

    // Handle logout logic (adjust based on your authentication method)
    const handleLogout = () => {
        // Perform logout actions (e.g., Firebase sign out or token removal)
        // For Firebase signOut you can use: auth.signOut();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <div className="navbar">
            <h2 className="navbar-title">WELCOME TO TACITS</h2>

            {/* Right side buttons */}
            <div className="navbar-buttons">
                <button
                    className="dashboard-button"
                    onClick={() => navigate("/AFAMDashboard")} // Add navigation to Dashboard
                >
                    GOTO AFAM
                </button>
                <button
                    className="dashboard-button"
                    onClick={() => navigate("/tacitsDashboard")} // Add navigation to Dashboard
                >
                    DASHBOARD
                </button>

                <button
                    className="master-button"
                    onClick={() => navigate("/mastert")} // Add navigation to Master
                >
                    MASTER
                </button>


            </div>
        </div>
    );
};

export default NavBar;
