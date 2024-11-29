import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import React, { useContext } from 'react';
import Users from './pages/Users.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import NotFound from './pages/NotFound.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import CreatorCv from './pages/CreatorCv.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import MyCv from './pages/MyCv.jsx';
import Profil from './pages/Profil.jsx';
//import Welcome from './components/Bonjour.jsx';

function App() {
    return (
        <>
                <div className="row">
                    <Header />
                </div>
                <div className="p-3">
                    <Routes>
                        {/*Public Routes*/}
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        {/*<Route path="/browse-cvs" element={<??? />} />*/}
                        {/*<Route path="/welcome" element={<Welcome />} />*/}

                        {/*Private Routes*/}
                        <Route
                            path="/create-cv"
                            element={
                                <ProtectedRoute>
                                    <CreatorCv />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-cv"
                            element={
                                <ProtectedRoute>
                                    <MyCv />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profil"
                            element={
                                <ProtectedRoute>
                                    <Profil />
                                </ProtectedRoute>
                            }
                        />

                        {/*404*/}
                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                    <ToastContainer />
                </div>
            
        </>
    );
}

export default App;