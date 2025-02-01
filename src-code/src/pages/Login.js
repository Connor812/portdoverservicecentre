import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../DataProvider";
import AdminHeader from "../components/AdminHeader";
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { PostData } from "../utils/PostData";

import "../assets/css/admin-login.css";

function Login() {

    const { setIsLoggedIn } = useContext(DataContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [buttonStatus, setButtonDisabled] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { error: errorParam } = useParams();

    useEffect(() => {
        if (errorParam) {
            if (errorParam === 'Successfully_Created_Account_Please_Login') {
                setSuccess('Account created successfully. Please login.');
                return;
            } else if (errorParam === 'Password_reset_successfully') {
                setSuccess('Password reset successfully. Please login.');
                return;
            }
            setError(errorParam.replace(/_/g, ' '));
        }
    }, [errorParam]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonDisabled(true);

        if (email === '' || password === '') {
            setError('Please fill in all fields');
            setButtonDisabled(false);
            return;
        }

        PostData('login.php', { "email": email, "password": password })
            .then((result) => {

                if (!result.status) {
                    setError(result.message);
                    setButtonDisabled(false);
                    return;
                }

                const userData = result.data;
                sessionStorage.setItem('userData', JSON.stringify(userData));
                setIsLoggedIn(true);
                navigate('/dashboard');
            })
            .catch((error) => {
                setError(error.message);
                setButtonDisabled(false);
            });
    }

    return (
        <>

            <AdminHeader />
            <main className="admin-login">
                <center className="admin-login-form">
                    <Form className="w-50">
                        <h2>
                            Login
                        </h2>
                        <hr />
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email or Username</Form.Label>
                            <Form.Control type="email" placeholder="Enter or Username" onInput={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onInput={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <button className="login-submit-btn px-5 py-3" type="submit" onClick={(e) => handleSubmit(e)} disabled={buttonStatus}>
                            Submit
                        </button>
                    </Form>
                </center>
            </main>
        </>
    );
}

export default Login;
