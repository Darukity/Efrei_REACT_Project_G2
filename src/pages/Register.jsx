import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

function Register() {
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: ''
            }}
            validationSchema={Yup.object({
                firstname: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                lastname: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                email: Yup.string().email().max(15, 'Must be 15 characters or less').required('Required'),
                password: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    .required('Required')
            })}
            onSubmit={async (values) => {
                try {
                    const response = await fetch(
                        'https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/auth/register',
                        {
                            method: 'POST',
                            body: JSON.stringify(values),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status} ${data.error}`);
                    }
                    alert('Le compte a bien été créé');
                    navigate('/login');
                } catch (error) {
                    console.error('Failed to register:', error);
                }
            }}
        >
            <Form>
                <div className="form-group">
                    <label htmlFor="firstname">Firstname:</label>
                    <Field className="form-control" type="firstname" name="firstname" />
                    <ErrorMessage style={{ color: 'red' }} name="firstname" component="div" />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Lastname:</label>
                    <Field className="form-control" type="lastname" name="lastname" />
                    <ErrorMessage style={{ color: 'red' }} name="lastname" component="div" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <Field className="form-control" type="email" name="email" />
                    <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <Field className="form-control" type="password" name="password" />
                    <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <Field className="form-control" type="confirmPassword" name="confirmPassword" />
                    <ErrorMessage style={{ color: 'red' }} name="confirmPassword" component="div" />
                </div>
                <button className="btn btn-primary mt-3" type="submit" disabled>
                    Submit
                </button>
            </Form>
        </Formik>
    );
}

export default Register;
