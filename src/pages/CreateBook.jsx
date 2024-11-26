import React, { useContext } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext.jsx';

function CreateBook() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    return (
        <>
            <Formik
                initialValues={{
                    label: '',
                    description: ''
                }}
                validationSchema={Yup.object({
                    label: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                    description: Yup.string().max(200, 'Must be 15 characters or less')
                })}
                onSubmit={async (values) => {
                    try {
                        const response = await fetch(
                            'https://nodeexpresscourse-m1-dev-g3-effrei.onrender.com/api/books',
                            {
                                method: 'POST',
                                body: JSON.stringify(values),
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        navigate('/');
                    } catch (error) {
                        console.error('Failed to register:', error);
                    }
                }}
            >
                <Form>
                    <div className="form-group">
                        <label htmlFor="label">Label: </label>
                        <Field className="form-control" type="label" name="label" />
                        <ErrorMessage style={{ color: 'red' }} name="label" component="div" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <Field className="form-control" type="description" name="description" />
                        <ErrorMessage style={{ color: 'red' }} name="description" component="div" />
                    </div>
                    <button className="btn btn-primary mt-3" type="submit">
                        Submit
                    </button>
                </Form>
            </Formik>
        </>
    );
}

export default CreateBook;
