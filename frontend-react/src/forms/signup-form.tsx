import { useForm } from "react-hook-form";
import { UserSignUpData, UserSignUpSchema } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import store, {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setPassword,
  setGender,
  setLanguage,
  setCounty,
  toggleComponent,
} from "../store";
import "react-phone-input-2/lib/style.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
// import { toast } from "sonner";

import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Box,
  Checkbox,
  Button,
  Stack,
  RadioGroup,
  Radio,
  useToast,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { PhoneIcon } from "lucide-react";

const SignupForm = () => {
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;

  const toast = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();

  const handleToggleComponent = () => {
    dispatch(toggleComponent());
  };

  const { mutate, isLoading } = useMutation(
    async ({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      agreed_to_terms,
      gender,
      language,
      country,
    }: UserSignUpData) => {
      const url = `${apiUrl}/register/`;
      const headers = {
        "Content-Type": "application/json",
      };
      const data = {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        agreed_to_terms,
        gender,
        language,
        country,
      };

      try {
        const response = await axios.post(url, data, { headers });
        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        handleToggleComponent();

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            title: `${error.response?.data?.error || "An error occurred"}`,
            status: "error",
            isClosable: true,
          });
        }
        console.log(error);
        throw error;
      }
    }
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSignUpData>({
    mode: "onChange",
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: { first_name: "", last_name: "", email: "", password: "" },
  });

  const onSubmit = async (data: UserSignUpData) => {
    await mutate(data);

    store.dispatch(setFirstName(data.first_name));
    store.dispatch(setLastName(data.last_name));
    store.dispatch(setEmail(data.email));
    store.dispatch(setPhoneNumber(data.phone_number));
    store.dispatch(setPassword(data.password));
    store.dispatch(setGender(data.gender));
    store.dispatch(setLanguage(data.language));
    store.dispatch(setCounty(data.country));

    // console.log("Redux state:", store.getState());
  };

  const LABEL_FONT_SIZE = "14PX";

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="firt-and-last-name">
          <FormControl mr="5px" mb="20px" isRequired>
            <FormLabel
              fontSize={LABEL_FONT_SIZE}
              color="rgba(102, 102, 102, 1)"
            >
              First Name
            </FormLabel>
            <Input
              borderColor="#cdc8c8"
              type="text"
              {...register("first_name")}
            />
            {errors.first_name && (
              <FormHelperText fontSize="12px">
                <span className="signup-error">
                  {errors.first_name.message}
                </span>
              </FormHelperText>
            )}
          </FormControl>
          <FormControl mb="20px" isRequired>
            <FormLabel
              fontSize={LABEL_FONT_SIZE}
              color="rgba(102, 102, 102, 1)"
            >
              Last Name
            </FormLabel>
            <Input
              borderColor="#cdc8c8"
              type="text"
              {...register("last_name")}
            />
            {errors.last_name && (
              <FormHelperText fontSize="12px">
                <span className="signup-error">{errors.last_name.message}</span>
              </FormHelperText>
            )}
          </FormControl>
        </div>
        <FormControl mb="20px" isRequired>
          <FormLabel fontSize={LABEL_FONT_SIZE} color="rgba(102, 102, 102, 1)">
            Email
          </FormLabel>
          <Input borderColor="#cdc8c8" type="email" {...register("email")} />
          {errors.email && (
            <FormHelperText fontSize="12px">
              <span className="signup-error">{errors.email.message}</span>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl mb="20px" isRequired>
          <FormLabel fontSize={LABEL_FONT_SIZE} color="rgba(102, 102, 102, 1)">
            Phone Number
          </FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <PhoneIcon color="purple" width="16px" height="16px" />
            </InputLeftElement>
            <Input
              borderColor="#cdc8c8"
              type="tel"
              {...register("phone_number")}
            />
          </InputGroup>
          {errors.phone_number && (
            <FormHelperText fontSize="12px">
              <span className="signup-error">
                {errors.phone_number.message}
              </span>
            </FormHelperText>
          )}
        </FormControl>
        <FormControl mb="20px" isRequired>
          <FormLabel fontSize={LABEL_FONT_SIZE} color="rgba(102, 102, 102, 1)">
            Password
          </FormLabel>
          <Input
            borderColor="#cdc8c8"
            type="password"
            {...register("password")}
          />

          {errors.password ? (
            <FormHelperText fontSize="12px">
              <span className="signup-error">{errors.password.message}</span>
            </FormHelperText>
          ) : (
            <FormHelperText fontSize="12px">
              Use 8 or more characters with a mix of letters, numbers & symbols.
            </FormHelperText>
          )}
        </FormControl>
        {/* <Stack spacing={3}>
          <Select variant="outline" placeholder="Gender" />
          <Select variant="outline" placeholder="Country" />
          <Select variant="outline" placeholder="Language" />
        </Stack> */}
        <RadioGroup mb="15px" defaultValue="2">
          <p className="radio-header">Gender</p>
          <Stack spacing={5} direction="row">
            <Radio
              width="100px"
              colorScheme="red"
              value="Male"
              {...register("gender")}
            >
              <p className="radio-text">Male</p>
            </Radio>
            <Radio colorScheme="green" value="Female" {...register("gender")}>
              <p className="radio-text">Female</p>
            </Radio>
          </Stack>
        </RadioGroup>
        <RadioGroup mb="15px" defaultValue="2">
          <p className="radio-header">Language</p>
          <Stack spacing={5} direction="row">
            <Radio
              className="radio-wrapper"
              width="100px"
              colorScheme="red"
              value="English"
              {...register("language")}
            >
              <p className="radio-text">English</p>
            </Radio>
            <Radio
              colorScheme="green"
              value="Spanish"
              {...register("language")}
            >
              <p className="radio-text">Spanish</p>
            </Radio>
          </Stack>
        </RadioGroup>
        <RadioGroup mb="15px" defaultValue="2">
          <p className="radio-header">Country</p>
          <Stack spacing={5} direction="row">
            <Radio
              width="100px"
              colorScheme="red"
              value="Mexico"
              {...register("country")}
            >
              <p className="radio-text">Mexico</p>
            </Radio>
            <Radio colorScheme="green" value="USA" {...register("country")}>
              <p className="radio-text">USA</p>
            </Radio>
          </Stack>
        </RadioGroup>
        <FormControl mt="40px" display="flex" alignItems="center" mb="40px">
          <Checkbox
            colorScheme="purple"
            size="md"
            {...register("agreed_to_terms", { required: true })}
          />
          <FormLabel mb="0" ml="10px" fontSize="12px">
            By creating an account, I agree to our Terms of use and Privacy
            Policy
          </FormLabel>
        </FormControl>
        <div className="already-have-account">
          <Button
            mt={4}
            isLoading={isLoading}
            colorScheme="purple"
            type="submit"
            width="100%"
          >
            submit
          </Button>
          <p className="have-account">
            Already have an ccount?{" "}
            <span onClick={handleToggleComponent}>Log in</span>
          </p>
        </div>
      </form>
    </Box>
  );
};

export default SignupForm;
