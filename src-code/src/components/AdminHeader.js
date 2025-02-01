import React, { useContext } from 'react';
import { DataContext } from "../DataProvider";

function AdminHeader() {

    const { isLoggedIn, logout } = useContext(DataContext);

    return (
        <>
            <nav className='navbar'>
                <div className='nav-images-container'>
                    <img className="nav-logo" src="/assets/images/md-auto-logo.png" alt="Logo" />
                    <img className="nav-service-center" src="/assets/images/service-center-logo.png" alt="Service Center" />
                    <img className="nav-napa-logo" src="/assets/images/napa-logo.png" alt="NAPA Logo" />
                    {isLoggedIn ? <button className='admin-logout-btn' onClick={(e) => logout(e)}>Logout</button> : ''}
                </div>
            </nav>
        </>
    )
}

export default AdminHeader;