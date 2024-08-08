import {
  Card,
  CardBody,
  CardHeader,
  Stack,
  StackDivider,
  Text,
  Box,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPlan } from "../lib/utils/set-user-plan";
import { useParams } from "react-router-dom";

const UserPlanChoice = () => {
  const { id: recipientId } = useParams();
  const queryClient = useQueryClient();
  const { mutate: changeUserPlan, isLoading } = useMutation({
    mutationFn: updateUserPlan,
    onSuccess: () => queryClient.invalidateQueries(["messages"]),
    onError: (error) => console.log(error),
  });

  const handlePlanChange = async (plan: string) => {
    await changeUserPlan({ recipientId, plan });
  };

  return (
    <div>
      {!isLoading ? (
        <Card className="plan-choice-wrapper">
          <CardHeader>
            <Heading size="md">Choose your plan</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box
                onClick={() => handlePlanChange("meal-plan")}
                cursor="pointer"
              >
                <Heading
                  className="plan-choice-header"
                  size="xs"
                  textTransform="uppercase"
                >
                  Meal Plan
                </Heading>
                <Text className="plan-choice-subheading" pt="2">
                  Select a meal plan that complements your training regimen and
                  dietary preferences.
                </Text>
              </Box>
              <Box
                onClick={() => handlePlanChange("workout-plan")}
                cursor="pointer"
              >
                <Heading
                  className="plan-choice-header"
                  size="xs"
                  textTransform="uppercase"
                >
                  Workout Plan
                </Heading>
                <Text className="plan-choice-subheading" pt="2">
                  Select a workout plan that fits your lifestyle and helps you
                  achieve your objectives.
                </Text>
              </Box>
              <Box
                onClick={() => handlePlanChange("workout-and-meal-plan")}
                cursor="pointer"
              >
                <Heading
                  className="plan-choice-header"
                  size="xs"
                  textTransform="uppercase"
                >
                  Workout + Meal plan
                </Heading>
                <Text className="plan-choice-subheading" pt="2">
                  Select a combined meal and workout plan tailored to your
                  lifestyle and objectives.
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      ) : (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="lg"
          className="message-loading-state"
        />
      )}
    </div>
  );
};

export default UserPlanChoice;
