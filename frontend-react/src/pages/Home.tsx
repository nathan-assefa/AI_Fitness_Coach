import HeroTitle from "../assets/hero-title";
import { CircleArrowOutUpRight, MoveUpRight } from "lucide-react";
import UsaFlag from "../images/us-flag.jpg";
import SpanishFlag from "../images/spanish-flag.jpg";
import Wheel from "../assets/wheel";
import Start from "../assets/start";
import Today from "../assets/today";
import OurPlans from "../components/our-plans";
import Logo from "../images/main-logo.png";
import Testimonials from "../components/testimonials";
import SubscriptionByEmail from "../components/subscribe_by_email";
import Footer from "../components/footer";
import Header from "../components/header";
import HeroImage from "../images/hiro_image.png";
import WomenStreching from "../images/women-streching.png";
import { Link } from "react-router-dom";

const Home = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page-wrapper">
      <Header />
      <section className="section-one">
        <div className="logo-in-home">
          <img className="project-logo" src={Logo} alt="main logo" />
        </div>
        <div className="hero-section">
          <div className="hero-title">
            <HeroTitle />
          </div>
          <div className="hero-image">
            <img className="home-hero-img" src={HeroImage} alt="testimonials" />
          </div>
        </div>
        <div className="meta-data">
          <h3 className="home-sub-heading">Transforming Bodies</h3>
          <h2 className="home-heading">Transforming Lives</h2>
          <p className="description">
            As a personal trainer professionalas, our goal is to help you
            achieve your fitness goals and feel confident in your own skin.
          </p>
        </div>
        <div className="hero-footer">
          <p className="promting-user-to-choose-language">
            Continue to sign up by choosing language
          </p>
          <div className="hero-footer-btn">
            <Link to="chat-page/1#scroll" className="usa link">
              <img className="home-us-flag" src={UsaFlag} alt="USA flag" />
              <p>English</p>
              <MoveUpRight className="right-arrow" color="white" />
            </Link>

            <Link to="chat-page/1#scroll" className="spanish link">
              <img
                className="home-spanish-flag"
                src={SpanishFlag}
                alt="spanish flag"
              />
              <p>Spanish</p>
              <MoveUpRight className="right-arrow" color="white" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section-two">
        <div>
          <Start />
          <div className="wheel">
            <Wheel />
          </div>
          <div className="inspiration">
            <h1>Today is the best day to start!</h1>
            <p className="inspiratioin-discription">
              Whether you want to lose weight, build muscle, or simply maintain
              an active lifestyle, I have the experience and expertise to get
              you results!
            </p>
            <div
              onClick={() => scrollToSection("plans-section")}
              className="view-our-plan"
            >
              <p>View Our Plans</p>{" "}
              <CircleArrowOutUpRight className="circle-arrow" />
            </div>
          </div>
        </div>
        <div className="women-stretching">
          <img
            className="home-women-stretching"
            src={WomenStreching}
            alt="women streching"
          />
        </div>
        <div className="today-image">
          <Today />
        </div>
      </section>
      <section className="section-three">
        <div className="illustration">
          <p className="top-illustration">
            Founded in 2020, PTmx is a leading personal training studio located
            in downtown Austin. We provide one-on-one and group training in a
            relaxed yet results-driven environment. In addition to personal
            training, we offer nutrition coaching, yoga classes, and corporate
            wellness programs.
          </p>
          <div id="about-section" className="about">
            <h1>ABOUT</h1>
            <p className="bottom-illustration">
              Our trainers are certified through top organizations like ACSM and
              NASM. With over 10 years of experience in the fitness industry, We
              can create a customized program tailored to your needs and goals
            </p>
          </div>
        </div>
      </section>
      <section id="testimonials-section" className="testimonial-section">
        <h1>What Our Clients Say About Us</h1>
        <Testimonials />
      </section>
      <section id="plans-section" className="section-five">
        <h1 className="our-plan-header">OUR PLANS</h1>
        <div className="wheel">
          <Wheel />
        </div>
        <OurPlans />
      </section>
      <section className="section-six">
        <SubscriptionByEmail />
      </section>
      <section className="section-seven">
        <Footer />
      </section>
    </div>
  );
};

export default Home;
