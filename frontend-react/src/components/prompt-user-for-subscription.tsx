import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import ChoosePlan from "./choose-plan";
import { useQuery } from "@tanstack/react-query";
import { StripApiResponse } from "../lib/types";

const SubscriptionPrompt = () => {
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
  return (
    <div className="sub-prompt">
      <div>
        <div>
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="160px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Subscribe now!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Once you subscribe, your plan will be generated and delivered to
              you shortly.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Center w="100%">
        <div className="three-plan-cards">
          <Card className="single-plan" height="430px" marginTop="1em">
            <CardHeader>
              <Heading size="md">Meal Plan</Heading>
            </CardHeader>
            <CardHeader textAlign="left" marginTop="-1em">
              <Heading size="md" className="price-in-sub">
                $
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error"
                  : stripeProducts.products[2]?.pricing}{" "}
                <span className="per-month-sub">/ month</span>
              </Heading>
            </CardHeader>
            <CardBody
              className="plan-lists"
              maxH="265px"
              // minH="150px"
            >
              <UnorderedList h="240px">
                <ListItem>Customized weekly menu and grocery lists</ListItem>
                <ListItem>Includes 3-5 meals and snacks per day</ListItem>
                <ListItem>
                  Focused on lean proteins, complex carbs, healthy fats
                </ListItem>
                <ListItem>
                  Meals can be prep-cooked or raw ingredients for clients to
                  cook
                </ListItem>
                <ListItem>
                  Tailored for goals of weight loss, muscle gain, nutrition
                </ListItem>
                <ListItem>
                  Includes macro and calorie breakdowns for each meal
                </ListItem>
              </UnorderedList>
            </CardBody>
            <CardFooter textAlign="left">
              <ChoosePlan
                product_id={PRODUCT_ID_1}
                price_id={stripeProducts?.products[2].default_price!}
              />
            </CardFooter>
          </Card>
          <Card className="single-plan" height="430px" marginTop="1em">
            <CardHeader>
              <Heading size="md">Meal + Workout Plan</Heading>
            </CardHeader>
            <CardHeader textAlign="left" marginTop="-1em">
              <Heading size="md" className="price-in-sub">
                $
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error"
                  : stripeProducts.products[0]?.pricing}{" "}
                <span className="per-month-sub">/ month</span>
              </Heading>
            </CardHeader>
            <CardBody className="plan-lists" minH="265px">
              <UnorderedList h="240px">
                <ListItem>
                  Includes all details of the individual plans above
                </ListItem>
                <ListItem>
                  Meal plan macros and calories are tailored to support workout
                  routine and goals
                </ListItem>
                <ListItem>
                  Trainer available to ensure workouts and nutrition are
                  synergized
                </ListItem>
                <ListItem>
                  Weekly check-ins to ensure clients are on track with both
                  plans
                </ListItem>
                <ListItem>
                  Most comprehensive support for achieving fitness and physique
                  transformations
                </ListItem>
              </UnorderedList>
            </CardBody>
            <CardFooter textAlign="left">
              <ChoosePlan
                product_id={PRODUCT_ID_2}
                price_id={stripeProducts?.products[0].default_price!}
              />
            </CardFooter>
          </Card>
          <Card className="single-plan" height="430px" marginTop="1em">
            <CardHeader>
              <Heading size="md">Workout Plan</Heading>
            </CardHeader>
            <CardHeader textAlign="left" marginTop="-1em">
              <Heading size="md" className="price-in-sub">
                $
                {isLoading
                  ? "Loading..."
                  : isError
                  ? "Error"
                  : stripeProducts.products[1]?.pricing}{" "}
                <span className="per-month-sub">/ month</span>
              </Heading>
            </CardHeader>
            <CardBody className="plan-lists" minH="265px">
              <UnorderedList h="240px" className="plan-lists">
                <ListItem>Schedule of 3-5 workouts per week</ListItem>
                <ListItem>
                  Each workout 1-1.5 hours and targets full body or specific
                  muscle groups
                </ListItem>
                <ListItem>
                  Includes list of exercises, sets, reps, weight or intensity
                  level
                </ListItem>
                <ListItem>
                  Workouts can be bodyweight, with equipment like dumbbells or
                  at the gym
                </ListItem>
                <ListItem>
                  Exercises target strength training, cardiovascular fitness,
                  mobility
                </ListItem>
              </UnorderedList>
            </CardBody>
            <CardFooter textAlign="left">
              <ChoosePlan
                product_id={PRODUCT_ID_3}
                price_id={stripeProducts?.products[1].default_price!}
              />
            </CardFooter>
          </Card>
        </div>
      </Center>
    </div>
  );
};

export default SubscriptionPrompt;
