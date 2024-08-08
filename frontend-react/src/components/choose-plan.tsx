import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/providers/auth-provider";
import { Button } from "@chakra-ui/react";

type ChoosePlanProps = {
  product_id: string;
  className?: string;
  price_id: string;
};

const ChoosePlan: React.FC<ChoosePlanProps> = ({
  product_id,
  className,
  price_id,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;
  const { userId } = useAuth();
  const navigate = useNavigate();
  console.log("price_id: ", price_id);

  const handleSubmit = () => {
    setIsLoading(true);
  };

  const loginFirst = () => {
    navigate("/auth-page");
  };

  return (
    <div>
      {userId ? (
        <form
          action={`${apiUrl}/stripe/create-checkout-session/${product_id}/?userId=${userId}&price_id=${price_id}`}
          method="POST"
          onSubmit={handleSubmit}
        >
          <Button
            background="black"
            _hover={{ color: "white" }}
            color="white"
            className={`${className} choose-plan choose-first-plan button`}
            type="submit"
            isLoading={isLoading}
          >
            Choose plan
          </Button>
        </form>
      ) : (
        <Button
          className="choose-plan choose-first-plan button"
          onClick={loginFirst}
          disabled={!product_id}
        >
          Choose plan
        </Button>
      )}
    </div>
  );
};

export default ChoosePlan;
