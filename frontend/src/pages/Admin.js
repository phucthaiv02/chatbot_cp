import React, { useEffect, useLayoutEffect, useState} from "react";
import { toast } from "react-hot-toast";

import { Box, Tabs, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Paper, TableBody, Button, TextField, MenuItem, Select} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { TabPanel, a11yProps } from "../components/Tab";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getAllCategory, addCategory, signupUser, deleteCategory, deleteUser } from "../helpers/api-communicator";

import './Login.css';

const Categories = [
    "Người dùng",
    "Chủ đề",
]

const Admin = () => {
    const [value, setValue] = useState(0);
    const [rows, setRows] = useState([]);
    const [addCat, setAddCat] = useState(false);
    const [cate, setCate] = useState("");

    const [name, setName] = useState("");
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!auth?.user || auth?.user.role !== 'admin') {
            return navigate("/");
        }
        if(value === 0) {
            getAllUsers()
            .then((data) => setRows(data.users))
            .catch((e) => console.log(e));
        }
        else if(value === 1) {
            getAllCategory()
            .then((data) => setRows(data))
            .catch((e) => console.log(e));
        }
        setAddCat(false);
    }, [value]);

    const handleChange = (e, newValue) => {
        e.preventDefault();
        setValue(newValue);
        setRows([]);
    };

    const handleAddCat = async (e) => {
        e.preventDefault();
        try {
            const newCat = await addCategory(cate);
            setRows((prev) => [...prev, newCat]);
            setAddCat(false);
            setCate("");
            toast.success("Thêm chủ đề thành công");
        }
        catch(e){
            toast.error("Thêm chủ đề thất bại");
        } 
    }

    const handleDeleteCat = async (del) => {
        try {
            const newCat = await deleteCategory(del);
            setRows(newCat);
            toast.success("Xóa chủ đề thành công");
        }
        catch(e){
            toast.error("Xóa chủ đề thất bại");
        } 
        
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const newUser = await signupUser(name, email, password, role);
            setRows((prev) => [...prev, newUser.user]);
            setAddCat(false);
            toast.success("Thêm người dùng thành công");
        }
        catch(e){
            toast.error("Thêm người dùng thất bại");
        } 
    }

    const handleDeleteUser = async (del) => {
        try {
            const newUsers = await deleteUser(del);
            setRows(newUsers.users);
            toast.success("Xóa người dùng thành công");
        }
        catch(e){
            toast.error("Xóa người dùng thất bại");
        } 
    }

    return (
        <div>
            <Box sx={{fontSize: 24, fontWeight: 600, alignItems: 'center', display: 'flex', justifyContent: 'center', padding: 2, borderBottom: 2}}>
                THỐNG KÊ
            </Box>
            <div>
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 500 }}
                    >
                    <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                    {Categories.map((value, index) => (
                        <Tab label={value} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                    <TabPanel value={value} index={0} className="tab-panel">
                    {!addCat ? (
                            <div>
                                <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">STT</TableCell>
                                            <TableCell align="center">MSSV</TableCell>
                                            <TableCell align="center">Họ và tên</TableCell>
                                            <TableCell align="center">Quyền</TableCell>
                                            <TableCell align="center">Số lượng chủ đề</TableCell>
                                            <TableCell align="center">Số lượng câu hỏi</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.role}</TableCell>
                                        <TableCell align="center">{row.numCat}</TableCell>
                                        <TableCell align="center">{row.numChat}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" onClick={() => handleDeleteUser(row.email)}>Xóa</Button>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button variant="contained" style={{marginTop: 10}} onClick={() => setAddCat(true)}>Thêm người dùng</Button>
                        </div>
                        ) : (
                        <div className='Login'>
                            <form onSubmit={handleAddUser}>
                                <label>
                                    Họ và tên:
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        />
                                </label>
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
                                <label>
                                    Phân quyền: 
                                    <select id="categories" value={role} onChange={(e)=>setRole(e.target.value)}>
                                        <option key={0} value='user'>
                                            user
                                        </option>
                                        <option key={1} value='admin'>
                                            admin
                                        </option>
                                    </select>
                                </label>
                                <button type="submit">
                                    Thêm người dùng
                                </button>
                            </form>
                        </div>
                        )}
                    </TabPanel>
                    <TabPanel value={value} index={1} className="tab-panel">
                        {!addCat ? (
                        <div>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">STT</TableCell>
                                            <TableCell align="center">Chủ đề</TableCell>
                                            <TableCell align="center">Số lượng người dùng</TableCell>
                                            <TableCell align="center">Số lượng câu hỏi</TableCell>
                                            <TableCell align="center">Hành động</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {rows.map((row, index) => (
                                        <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                        <TableCell component="th" scope="row" align="center">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.userCount}</TableCell>
                                        <TableCell align="center">{row.messageCount}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" onClick={() => handleDeleteCat(row.name)}>Xóa</Button>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button variant="contained" style={{marginTop: 10}} onClick={() => setAddCat(true)}>Thêm chủ đề</Button>
                        </div>
                        ) : (
                        <div className='Login'>
                            <form 
                                onSubmit={handleAddCat} 
                                sx={
                                    `display: flex;
                                    flex-direction: column;
                                    max-width: 300px;
                                    margin: 0 auto;`
                            }>
                                <label>
                                    Tên chủ đề:
                                    <input
                                        type="text"
                                        value={cate}
                                        onChange={(e) => setCate(e.target.value)}
                                        />
                                </label>
                                <button type="submit">
                                    Thêm chủ đề
                                </button>
                            </form>
                        </div>
                        )}
                    </TabPanel>
                </Box>
            </div>
        </div>
    );
}

export default Admin;