import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';
import AddHodForm from '../components/Dashboard/HODHandler/AddHodForm'; // Add HOD form component
import FetchHod from '../components/Dashboard/HODHandler/FetchHod'; // Fetch HOD component
import { Box, Toolbar } from '@mui/material';
import AddFaculty from '../components/Dashboard/FacultyHandler/AddFaculty';
import Requests from '../components/Dashboard/RequestHandler/Request'
import FetchFaculty from '../components/Dashboard/FacultyHandler/FetchFaculty';
import UpdateRequest from '../components/Dashboard/RequestHandler/UpdateRequest'


const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar Navigation */}
            <Sidebar />
            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: '#f9f9f9',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Routes>
                    <Route path="add-hod" element={<AddHodForm />} />
                    <Route path="fetch-hod" element={<FetchHod />} />

                    <Route path="add-faculty" element={<AddFaculty />} />
                    <Route path="fetch-faculty" element={<FetchFaculty />} />
                    <Route path="track-requests-add-faculty" element={<Requests />} />
                    <Route path="track-requests-update-faculty" element={<UpdateRequest />} />
                


                </Routes>
            </Box>
        </Box>
    );
};

export default Dashboard;
