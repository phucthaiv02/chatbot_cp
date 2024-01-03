import {
    Box,
    Typography,
    Avatar,
    Paper,
} from "@mui/material";

const Message = ({ message }) => {
    const isBot = message.role === "bot";
  
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isBot ? "flex-start" : "flex-end",
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isBot ? "row" : "row-reverse",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ bgcolor: isBot ?  "secondary.main" : "primary.main" }}>
            {isBot ? "CB" : "SV"}
          </Avatar>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              ml: isBot ? 1 : 0,
              mr: isBot ? 0 : 1,
              backgroundColor: isBot ? "secondary.light" : "primary.light",
              borderRadius: isBot ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
          </Paper>
        </Box>
      </Box>
    );
  };

  export default Message;