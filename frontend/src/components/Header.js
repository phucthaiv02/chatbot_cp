// src/components/Header.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Link, useNavigate} from "react-router-dom";

import { useAuth } from '../context/AuthContext';

const Header = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await auth.logout();
        return navigate('/');
    };

    return (
        <div>
        <Link to="/">
            <img src="../bkdn.png" alt=""/>
        </Link>
        <AppBar position="static">
            <Toolbar style={{paddingLeft: "100px"}}>
            <Button color="inherit" onClick={() => navigate('/')}>Trang chủ</Button>
            <Button color="inherit" onClick={() => navigate('/program')}>Chương trình</Button>
            <Button color="inherit" onClick={() => navigate('/plan')}>Kế hoạch</Button>
            <Button color="inherit" onClick={() => navigate('/list')}>Danh sách</Button>
            <Button color="inherit" onClick={() => navigate('/alumni')}>Cựu sinh viên</Button>
            <Button color="inherit" onClick={() => navigate('/system')}>Phòng học & Hệ thống</Button>
            <Button color="inherit" onClick={() => navigate('/link')}>Liên kết</Button>
            <Button color="inherit" onClick={() => navigate('/support')}>Hỗ trợ</Button>
            {auth?.isLoggedIn ? (
                <div> 
                    <Button color="inherit" onClick={() => navigate('/')}>{auth.user.name}</Button> 
                    <Button color="inherit" onClick={() => handleLogout()}>Thoát</Button>
                </div> 
            ) : (
                <Button color="inherit" onClick={() => navigate('/login')}>Đăng nhập</Button>
            )}
            </Toolbar>
        </AppBar>
        <div >
            <img style={{width: '100%'}} src="../SlideShow01.png" alt=""/>
        </div>
        </div>
    );
};

export default Header;
