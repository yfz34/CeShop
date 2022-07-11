import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import "./Carouselbar.css";
import { Box } from "@mui/material";

import C1 from "../../../assets/Carousel/1.jpg";
import C2 from "../../../assets/Carousel/2.jpg";
import C3 from "../../../assets/Carousel/3.jpg";

const Carouselbar = () => {
  return (
    <Box>
      <Carousel autoPlay showThumbs={false} infiniteLoop>
        <div>
          <img src={C1} alt="" />
        </div>
        <div>
          <img src={C2} alt="" />
        </div>
        <div>
          <img src={C3} alt="" />
        </div>
      </Carousel>
    </Box>
  );
};

export default Carouselbar;
