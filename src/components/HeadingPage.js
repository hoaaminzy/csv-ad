import React, { useState, useEffect } from "react";

const HeadingPage = ({ title }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener to track resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="" style={{ padding: "20px 0px" }}>
      <span
        className={``}
        style={{
          color: "#276ca1",
          fontWeight: "bold",
          fontSize: "24px",
          textAlign: "center",
          display: "block",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
  );
};

export default HeadingPage;
