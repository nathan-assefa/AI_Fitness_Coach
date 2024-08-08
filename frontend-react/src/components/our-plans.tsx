import { useQuery } from "@tanstack/react-query";
import ChoosePlan from "./choose-plan";
import { StripApiResponse } from "../lib/types";

const OurPlans = () => {
  const PRODUCT_ID_1 = "product_id_1";
  const PRODUCT_ID_2 = "product_id_2";
  const PRODUCT_ID_3 = "product_id_3";

  const fetchStripeProducts = async () => {
    const apiUrl: string = import.meta.env.VITE_SERVER_URL;
    const response = await fetch(`${apiUrl}/stripe-products/`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  };

  const {
    data: stripeProducts,
    isLoading,
    isError,
  } = useQuery<StripApiResponse>(["stripeProducts"], fetchStripeProducts);

  console.log("strip_products: ", stripeProducts);

  return (
    <div>
      <div className="all-plans">
        <div className="left-plan plan">
          <h3 className="first-plan">MEAL PLAN</h3>
          <p className="membership">Membership</p>
          <div>
            <p className="per-month">
              {/* <span className="one-dollar">$5</span> */}
              <span className="one-dollar">
                $
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error"
                  : stripeProducts.products[2]?.pricing}
              </span>
              <span className="slash-month">/month</span>
            </p>
          </div>
          <p className="save-30">Save $30</p>
          <ul>
            <li>Customized weekly menu and grocery lists</li>
            <li>Includes 3-5 meals and snacks per day</li>
            <li>Focused on lean proteins, complex carbs, healthy fats</li>
            <li>
              Meals can be prep-cooked or raw ingredients for clients to cook
            </li>
            <li>Tailored for goals of weight loss, muscle gain, nutrition</li>
            <li>Includes macro and calorie breakdowns for each meal</li>
          </ul>
          <ChoosePlan
            product_id={PRODUCT_ID_1}
            price_id={stripeProducts?.products[2].default_price!}
          />
        </div>

        <div className="middle-plan plan">
          <h3>MEAT + WORKOUT PLAN</h3>
          <p className="membership">Membership</p>
          <div>
            <p className="per-month">
              {/* <span className="one-dollar">$8</span> */}
              <span className="one-dollar">
                $
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error"
                  : stripeProducts.products[0]?.pricing}
              </span>
              <span className="slash-month">/month</span>
            </p>
          </div>
          <p className="save-30">Save $30</p>
          <ul>
            <li>Includes all details of the individual plans above</li>
            <li>
              Meal plan macros and calories are tailored to support workout
              routine and goals
            </li>
            <li>
              Trainer available to ensure workouts and nutrition are synergized
            </li>
            <li>
              Weekly check-ins to ensure clients are on track with both plans
            </li>
            <li>
              Most comprehensive support for achieving fitness and physique
              transformations
            </li>
          </ul>
          <ChoosePlan
            className="midle-checkout-btn"
            product_id={PRODUCT_ID_2}
            price_id={stripeProducts?.products[0].default_price!}
          />
        </div>

        <div className="right-plan plan">
          <h3>WORKOUT</h3>
          <p className="membership">Membership</p>
          <div>
            <p className="per-month">
              {/* <span className="one-dollar">$5</span> */}
              <span className="one-dollar">
                $
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error"
                  : stripeProducts.products[1]?.pricing}
              </span>
              <span className="slash-month">/month</span>
            </p>
          </div>
          <p className="save-30">Save $30</p>
          <ul>
            <li>Schedule of 3-5 workouts per week</li>
            <li>
              Each workout 1-1.5 hours and targets full body or specific muscle
              groups
            </li>
            <li>
              Includes list of exercises, sets, reps, weight or intensity level
            </li>
            <li>
              Workouts can be bodyweight, with equipment like dumbbells or at
              the gym
            </li>
            <li>
              Exercises target strength training, cardiovascular fitness,
              mobility
            </li>
          </ul>
          <ChoosePlan
            product_id={PRODUCT_ID_3}
            price_id={stripeProducts?.products[1].default_price!}
          />
        </div>
      </div>
    </div>
  );
};

export default OurPlans;
