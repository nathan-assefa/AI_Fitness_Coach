const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="footer-nav-wrapper">
      <nav>
        <ul className="footer-nav-items">
          <li
            onClick={() => scrollToSection("about-section")}
            className="footer-nav"
          >
            About
          </li>
          <li
            onClick={() => scrollToSection("plans-section")}
            className="footer-nav"
          >
            Plans
          </li>
          <li
            onClick={() => scrollToSection("testimonials-section")}
            className="footer-nav"
          >
            Testimonials
          </li>
        </ul>
      </nav>
      <div className="terms-and-conditions">
        <p>Copyright @2024 PTMX. All Rights Reserved.</p>
        <p>Terms & Conditions ~ Privacy Policy</p>
      </div>
    </div>
  );
};

export default Footer;
