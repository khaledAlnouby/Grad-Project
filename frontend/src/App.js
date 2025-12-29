// frontend/src/App.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FirstLoginPage from './pages/FirstLoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import EducationalInfoPage from './pages/EducationalInfoPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SkillSearchPage from './pages/SkillSearchPage';
import Notifications from './components/Notifications';
import CollaboratorsPage from './pages/CollaboratorsPage';
import ChatsPage from './pages/ChatsPage';
import NotificationProvider from './context/NotificationContext';

const App = () => {
    const location = useLocation();
    return (        
        /*
         ( The entire application is wrapped with NotificationProvider, which provides the notifications context to all components within the app. 
           This ensures that any component can access and use the notifications state. )
        */
        /*
         ( Wrapping the app with NotificationProvider ensures that the notifications context is available to all components within the app. 
           This is essential for the real-time notification system to work, as it allows components to receive and display notifications. )
        */
        <NotificationProvider> {/* Wrap the entire application with NotificationProvider to make notifications context available */}
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/first-login" element={<FirstLoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify/:token" element={<VerifyPage />} />
                <Route path="/personal-info" element={<ProtectedRoute component={PersonalInfoPage} />} />
                <Route path="/educational-info" element={<ProtectedRoute component={EducationalInfoPage} />} />
                <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
                <Route path="/profile/:id" element={<PublicProfilePage />} />
                <Route path="/search-skill" element={<SkillSearchPage />} />
                <Route path="/collaborators" element={<ProtectedRoute component={CollaboratorsPage} />} />
                <Route path="/chats" element={<ProtectedRoute component={ChatsPage} />} />
                <Route path="/notifications" element={<ProtectedRoute component={Notifications} />} />               
            </Routes>
             {location.pathname !== '/chats' && <Footer />}
        </NotificationProvider>
    );
};

export default App;