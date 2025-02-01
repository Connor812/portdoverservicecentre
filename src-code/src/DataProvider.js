import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext();

const DataProvider = ({ children }) => {
    const environment = "sandbox";
    const url = environment === "production" ? "http://markgamble.ca/" : "https://localhost/mark-gamble/";

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const userData = sessionStorage.getItem('userData');

        if (userData === null || userData === undefined || userData === "undefined") {
            sessionStorage.clear();
            return false;
        }
        return true;
    });

    const navigate = useNavigate();

    function logout(e) {
        e.preventDefault();
        sessionStorage.removeItem('userData');
        setIsLoggedIn(false);
        navigate('/');
    }

    useEffect(() => {
        if (isLoggedIn) {
            const userData = JSON.parse(sessionStorage.getItem('userData'));
            const loginTime = new Date(userData.timestamp);
            const currentTime = new Date();
            const hoursDifference = Math.abs(currentTime - loginTime) / 36e5;

            if (hoursDifference > 12) {
                sessionStorage.removeItem('userData');
                setIsLoggedIn(false);
                navigate('/login');
            }
        }
    }, [isLoggedIn]);

    return (
        <DataContext.Provider value={{ environment, url, isLoggedIn, setIsLoggedIn, logout }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataContext, DataProvider };