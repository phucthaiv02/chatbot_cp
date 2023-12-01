import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import Footer from "../components/footer/Footer";

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box width={"100%"} height={"100%"}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
          mt: 3,
        }}
      >
        <Box>
        {/* <p style={{ fontSize: "60px", textAlign: "center", padding: "20px" }}> */}
        <span style={{ fontSize: "40px", textAlign: "center", padding: "20px" }}>
          Welcome to my CHATBOT
        </span>
        {/* </p> */}
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { md: "row", xs: "column", sm: "column" },
            gap: 5,
            my: 10,
          }}
        >
          <img
            src="robot.png"
            alt="robot"
            style={{ width: "200px", margin: "auto" }}
          />
          <img
            src="chat.png"
            alt="chatbot"
            style={{
              display: "flex",
              margin: "auto",
              width: isBelowMd ? "60%" : "40%",
              borderRadius: 20,
              boxShadow: "-5px -5px 105px #64f3d5",
              padding: 10,
            }}
          />
          <img
            className="image-inverted rotate"
            src="openai.png"
            alt="openai"
            style={{ width: "200px", margin: "auto" }}
          />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
