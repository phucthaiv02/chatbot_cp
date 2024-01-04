import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { toast } from "react-hot-toast";
import './Login.css';

const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await auth?.login(email, password);
            toast.success("Đăng nhập thành công", { id: "login" });
        }
        catch(e){
            toast.error("Đăng nhập thất bại", { id: "login" });
        } 
    };
    
    useEffect(() => {
        if (auth?.user) {
          return navigate("/");
        }
      }, [auth]);
    return (
        <>
            <Box sx={{fontSize: 24, fontWeight: 600, alignItems: 'center', display: 'flex', justifyContent: 'center', padding: 2, borderBottom: 2}}>
                ĐĂNG NHẬP
            </Box>
            <div className='Login'>
                <form onSubmit={handleLogin}>
                <label>
                    Tài khoản:
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                    Mật khẩu:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <button type="submit">
                        Đăng nhập
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;