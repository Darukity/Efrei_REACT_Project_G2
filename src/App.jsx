import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import Home from './pages/Home.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Header from './components/Header.jsx';
import React, { useContext } from 'react';
import Users from './pages/Users.jsx';
import { ThemeContext } from './context/ThemeContext.jsx';
import classNames from 'classnames';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import CreateBook from './pages/CreateBook.jsx';
import NotFound from './pages/NotFound.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
    const { theme } = useContext(ThemeContext);

    return (
        <>
            <div
                className={classNames('w-100 vh-100', {
                    'bg-dark text-light': theme === 'dark',
                    'bg-light text-dark': theme === 'light'
                })}
            >
                <div className="row">
                    <Header />
                </div>
                <div className="p-3">
                    <Routes>
                        {/*Public Routes*/}
                        <Route path="/" element={<Home />} />
                        <Route path="/welcome" element={<Welcome />} />
                        <Route path="/books/:id" element={<BookDetails />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        {/*Private Routes*/}
                        <Route
                            path="/create-book"
                            element={
                                <ProtectedRoute>
                                    <CreateBook />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />

                        {/*404*/}
                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default App;
