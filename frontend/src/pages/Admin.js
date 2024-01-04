import React, { useEffect, useLayoutEffect, useState} from "react";

import { Box, Tabs, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Paper, TableBody} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { TabPanel, a11yProps } from "../components/Tab";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getAllCategory } from "../helpers/api-communicator";

const Categories = [
    "Người dùng",
    "Chủ đề",
]

const Admin = () => {
    const [value, setValue] = useState(0);
    const [rows, setRows] = useState([]);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleChange = (e, newValue) => {
        e.preventDefault();
        setValue(newValue);
        setRows([]);
    };
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
            .then((data) => setRows(data.categories))
            .catch((e) => console.log(e));
        }
    }, [value]);
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow
                                    key={row.name}
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
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value={value} index={1} className="tab-panel">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">STT</TableCell>
                                        <TableCell align="center">Chủ đề</TableCell>
                                        <TableCell align="center">Số lượng câu hỏi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row" align="center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">{row.count}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </Box>
            </div>
        </div>
    );
}

export default Admin;