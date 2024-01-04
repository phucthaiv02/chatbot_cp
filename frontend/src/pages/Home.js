import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const data = [
    {
        time: "18/12/2023", 
        title: "TB về đăng ký học kỳ 2/2023-2024 (TB số 7)", 
        description: [
            "Điều chỉnh thời gian hiệu chỉnh đăng ký: Từ 7h ngày 20/12 đến hết ngày 22/12",
            "Danh sách lớp học phần Huỷ do ít sinh viên đăng ký: Tại đây. Trường đã chuyển lớp cho một số sinh viên, các sinh viên còn lại tự điều chỉnh, đăng ký bổ sung học phần còn thiếu",
            "Danh sách sinh viên chưa đăng ký đủ cặp học phần tích hợp: Tại đây. Sinh viên cần đăng ký đủ học phần tích hợp, nếu không có thể không được chấp nhận học/không được thi."
        ]
    },
    {
        time: "15/12/2023",
        title: "TB về đợt thi TOEIC ngày 23&25/12/2023",
        description: [
            "Danh sách thi ngày 23/12: tại đây. Danh sách thi ngày 25/12: tại đây. Địa điểm thi: Văn phòng IIG Đà Nẵng - 19 Hoàng Văn Thụ",
            "Danh sách sinh viên nộp ảnh bị mờ, phải nộp lại ảnh thẻ khi dự thi: tại đây",
        ]
    },
    {
        time: "15/12/2023",
        title: "Kế hoạch tổ chức đánh giá năng lực Tiếng Anh dành cho sinh viên đại học hệ chính quy các cơ sở đào tạo thuộc Đại học Đà Nẵng năm 2024",
        description: [
            "Sinh viên xem thông báo tại đây",
        ]
    },
    {
        time: "15/12/2023",
        title: "Thay đổi phòng thi cuối kỳ 1 năm học 2023-2024 từ ngày 16/12/2023 đến 06/01/2024",
        description: [
            "Sinh viên xem thông báo tại đây",
        ]
    },
    {
        time: "14/12/2023",
        title: "TB điều chỉnh tuần thực tập kỹ thuật của nhóm 22.03 (22CKHK)",
        description: [
            "Điều chỉnh tuần thực tập kỹ thuật của nhóm 22.03 (22CKHK): thực tập vào tuần 24 (từ ngày 08/01/2024-14/01/2024). Khoa sẽ thông báo cụ thể cho sinh viên",
        ]
    },
    {
        time: "12/12/2023",
        title: "Lịch thi đợt thi tiếng Anh chuẩn đầu ra (VSTEP) ngày 17/12/2023 do ĐH Ngoại ngữ tổ chức",
        description: [
            "Sinh viên xem thông báo tại đây",
        ]
    }
];


const Home = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if(auth?.user && auth.user.role === 'admin')
        {
            console.log(auth?.user.role);
            return navigate('/admin');
        }
    })
    return (
        <div>
        <Box sx={{fontSize: 24, fontWeight: 600, alignItems: 'center', display: 'flex', justifyContent: 'center', padding: 2, borderBottom: 2}}>
            THÔNG BÁO
        </Box>
        {data.map((d) => (
            <div style={{paddingLeft: 30}}>
                <div style={{display: 'flex'}}>
                    <p style={{fontWeight: 600, color: 'red'}}>{d.time}:</p> 
                    <p style={{fontWeight: 600, color: 'blue', paddingLeft: 10}}>{d.title}</p>
                </div>
                <div>
                    {d.description.map((content) => 
                        <p>- {content}</p>
                    )}
                </div>
            </div>
        ))}
    </div>
)};

export default Home;