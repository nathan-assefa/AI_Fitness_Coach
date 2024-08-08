import { useForm } from "react-hook-form";
import { UserLoginData, UserLoginSchema } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import store, {
  setUserEmail,
  setUserPassword,
  toggleComponent,
} from "../store";
import "react-phone-input-2/lib/style.css";
import { useAuth } from "../lib/providers/auth-provider";
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Box, Button, Input } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import GoogleLoginComponent from "../components/google-auth";

const LoginForm = () => {
  const { loginUser } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleComponent = () => {
    dispatch(toggleComponent());
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginData>({
    mode: "onChange",
    resolver: zodResolver(UserLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (formData: UserLoginData) => {
    await loginUser(formData);

    store.dispatch(setUserEmail(formData.email));
    store.dispatch(setUserPassword(formData.password));

    console.log("Redux state:", store.getState());
  };

  return (
    <Box>
      <div className="login-form-wrapper">
        <div className="login-form">
          <div className="login-form-header">
            <h3>Welcome back.</h3>
            <h3>Sign into your account</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb="20px" isRequired>
              <FormLabel color="rgba(102, 102, 102, 1)">Email</FormLabel>
              <Input
                borderColor="#cdc8c8"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <FormHelperText fontSize="12px">
                  <span className="signup-error">{errors.email.message}</span>
                </FormHelperText>
              )}
            </FormControl>
            <FormControl mb="20px" isRequired>
              <FormLabel color="rgba(102, 102, 102, 1)">Password</FormLabel>
              <Input
                borderColor="#cdc8c8"
                type="password"
                {...register("password")}
              />

              {errors.password && (
                <FormHelperText fontSize="12px">
                  <span className="signup-error">
                    {errors.password.message}
                  </span>
                </FormHelperText>
              )}
            </FormControl>
            <div className="already-have-account">
              <Button
                mt={4}
                isLoading={isSubmitting}
                colorScheme="purple"
                type="submit"
                className="login-btn"
              >
                Login
              </Button>
              <p className="have-account">
                Already have an ccount?{" "}
                <span onClick={handleToggleComponent}>sign up</span>
              </p>
            </div>
          </form>
          <p className="separator">OR</p>
          <div className="gooogle-auth-btn">
            <GoogleLoginComponent />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default LoginForm;
