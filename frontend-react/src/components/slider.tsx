import Slider from "react-slick";

import { USERS } from "../lib/constants";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div className="slider-wrapper">
        {USERS.map((user, index) => (
          <div key={index}>
            <p className="slider-message">{user.date}</p>
          </div>
        ))}
      </div>
    </Slider>
  );
}
