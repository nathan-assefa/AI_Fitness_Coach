import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const ChatFinshAlert = () => {
  return (
    <div>
      <Alert
        status="success"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Thank You!
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Your plan is generating and will be emailed soon.
        </AlertDescription>
        <Link to="/">
          <Button mt="12px">Go to home page</Button>
        </Link>
      </Alert>
    </div>
  );
};

export default ChatFinshAlert;
