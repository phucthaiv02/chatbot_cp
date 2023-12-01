import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        // Same substring at the start will only be typed once, initially
        "Thái Văn Phúc",
        1000,
        "Trần Quang Huyên",
        2000,
        "Võ Nguyễn Vĩ Nhân",
        1500,
      ]}
      speed={50}
      style={{
        fontSize: "30px",
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
      }}
      cursor={false}
      repeat={Infinity}
    />
  );
};

const Footer = () => {
  const danhSachA = ["Thái Văn Phúc", "Trần Quang Huyên", "Võ Nguyễn Vĩ Nhân"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(true); 
      setTimeout(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === danhSachA.length - 1 ? 0 : prevIndex + 1
        );
        setIsFlipped(false); 
      }, 500); 
    }, 5000); 

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <footer>
      <div
        style={{
          width: "100%",
          minHeight: "10vh",
          maxHeight: "30vh",
        }}
      >
        <p style={{ fontSize: "30px", textAlign: "center", padding: "20px" }}>
          Built With love by 
          <span style={{ padding: "10px" }}>
            <TypingAnim />
          </span>
          💘
        </p>
      </div>
    </footer>
  );
};

export default Footer;