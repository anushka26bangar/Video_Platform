import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Removed Navigate import
import UserHomePage from './components/user/UserHomePage';
import HomePage from './components/Home';
import GroupsPage from './components/GroupsPage'; // Adjust path if needed
import GroupForm from './components/GroupForm'; // Adjust path if needed
import GroupList from './components/GroupList'; // Adjust path if needed
import GroupDetails from './components/GroupDetails'; // Adjust path if needed
import UpgradePlan from './components/UpgradePlan';
import DownloadPage from './components/DownloadPage';
import VideoCall from './components/VideoCalls'; // Import VideoCall
import LoginPage from './components/LoginPage'; // Import LoginPage
import SignupPage from './components/SignupPage'; // Import SignupPage
import VideoPage from './components/VideoPage'; // Import the VideoPage
import CreateGroupAdmin from './components/admin/CreateGroupAdmin'; // Import CreateGroupAdmin
import ManageGroupsAdmin from './components/admin/ManageGroupsAdmin'; // Import ManageGroupsAdmin
import AdminHomePage from './components/admin/AdminHomePage'; // Import AdminHomePage
import UploadVideo from './components/admin/UploadVideo';
import AdminVideoPage from './components/admin/AdminVideoPage';
import UserProfile from './components/UserProfile';

const southernStates = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'];

function App() {
    const [theme, setTheme] = useState('dark-theme'); // Default theme
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

    useEffect(() => {
        const currentHour = new Date().getHours();
        const userLocation = 'South India'; // Replace with actual location detection

        if (currentHour >= 10 && currentHour < 12) {
            if (southernStates.includes(userLocation)) {
                setTheme('white-theme');
            }
        } else {
            if (southernStates.includes(userLocation)) {
                setTheme('white-theme');
            } else {
                setTheme('dark-theme');
            }
        }

        // Implement OTP sending based on location here
        // Use email for southern states and mobile for others
    }, []);

    return (
        <Router>
            <div className={theme}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} /> {/* Pass login state to LoginPage */}
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/userhome" element={<UserHomePage />} /> {/* Removed Navigate */}
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/create-group" element={<GroupForm />} />
                    <Route path="/search-groups" element={<GroupList />} />
                    <Route path="/group/:groupId" element={<GroupDetails />} />
                    <Route path="/plans" element={<UpgradePlan />} />
                    <Route path="/downloads" element={<DownloadPage />} />
                    <Route path="/user-videos" element={<VideoPage />} />
                    <Route path="/videocall" element={<VideoCall />} />
                    <Route path="/admin-home" element={<AdminHomePage />} /> {/* Admin home route */}
                    <Route path="/create-group-admin" element={<CreateGroupAdmin />} /> {/* Admin route */}
                    <Route path="/manage-group-admin" element={<ManageGroupsAdmin />} /> {/* Admin route */}
                    <Route path="/upload-video" element={<UploadVideo />} /> {/* admin upload video route */}
                    <Route path="/admin-videos" element={<AdminVideoPage />} /> {/* admin video route */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
