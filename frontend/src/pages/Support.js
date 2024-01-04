import  React, {useLayoutEffect, useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategory, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import Message from '../components/Message';
import {useAuth} from '../context/AuthContext';
import './Support.css'

import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Tab,
  Tabs
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [Categories, setCategories] = useState([]);

  const chatContainerRef = useRef(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      const newMessage = { role: "user", content: input };
      setChats((prev) => [...prev, newMessage]);
      setInput("")
      const chatData = await sendChatRequest(Categories[value].name, input);
      setChats((prev) => [...prev, chatData]);
    }
  };

  useLayoutEffect(() => {
    getAllCategory().then((categories) =>{
      getUserChats(categories[value].name)
        .then((data) =>  setChats(data.chats))
        .catch((e) => console.log(e));
      setCategories(categories);
    }
    );
  }, [auth]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [value, chats]);

  const handleChange = (e, newValue) => {
    e.preventDefault();
    setValue(newValue);
    setChats([]);
  };

  return (
    <div>
      <Box sx={{fontSize: 24, fontWeight: 600, alignItems: 'center', display: 'flex', justifyContent: 'center', padding: 2, borderBottom: 2}}>
        CHATBOT HỖ TRỢ SINH VIÊN
      </Box>
      {auth?.user ? (
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
              {Categories.map((category, index) => (
                <Tab label={category.name} {...a11yProps(index)} />
                ))}
            </Tabs>
            <TabPanel value={value} index={value} className="tab-panel">
              <Box
                sx={{
                  height: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "grey.200",
                }}
              >
                <Box sx={{ flexGrow: 1, overflow: "auto", p: 2}}>
                  {chats.map((message) => (
                    <Message message={message} />
                    ))}
                <div ref={chatContainerRef}></div>
                </Box>
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Nhập câu hỏi ..."
                        variant="outlined"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleSend}
                        >
                        Gửi
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </TabPanel>
          </Box>
        </div>
      ) : (
        <div>
          <Box sx={{fontSize: 18,  alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 5}}>
            Vui lòng đăng nhập để sử dụng tính năng này
            <button style={{margin: 20}} onClick={() => navigate('/login')}>Đăng nhập</button>
          </Box>
        </div>
      )}
    </div>
  );
}

