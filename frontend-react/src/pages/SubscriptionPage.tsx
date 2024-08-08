import Wheel from "../assets/wheel";
import OurPlans from "../components/our-plans";

const SubscriptionPage = () => {
  return (
    <div>
      <div className="sub-wrapper">
        <h3>Subscribe now!</h3>
        <p>
          Once you subscribe, your plan will be generated and delivered to you
          shortly.
        </p>
      </div>
      <section id="plans-section" className="section-five">
        <h1 className="our-plan-header">OUR PLANS</h1>
        <div className="wheel">
          <Wheel />
        </div>
        <OurPlans />
      </section>
    </div>
  );
};

export default SubscriptionPage;
