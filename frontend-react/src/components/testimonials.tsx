import { testimonials } from "../lib/constants";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css";
import { useEffect, useState } from "react";

const Testimonials = () => {
  const [slidesPerView, setSlidesPerView] = useState(2);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1000) {
        setSlidesPerView(1);
      } else {
        setSlidesPerView(2);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={slidesPerView}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      // onSlideChange={() => console.log("slide change")}
      // onSwiper={(swiper) => console.log(swiper)}
      // effect={"cube"}
      // cubeEffect={{
      //   shadow: true,
      //   slideShadows: true,
      //   shadowOffset: 20,
      //   shadowScale: 0.94,
      // }}
    >
      {testimonials.map((testimony, idx) => (
        <SwiperSlide className="slider-tst" key={idx}>
          <div className="testimonial-image">
            <img src={testimony.image} alt="testimonials" />
          </div>
          <div className="testimonial-info">
            <p className="testimonial-date">{testimony.date}</p>
            <h3 className="testimonial-title">{testimony.title}</h3>
            <p className="testimonial-description">{testimony.description}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Testimonials;
