import Logo from "../images/main-logo.png";
import SignupForm from "../forms/signup-form";
import AuthBackgroundImage from "../images/AuthBackground.png";
import LoginForm from "../forms/login-form";
import { RootState } from "../store"; // Assuming the path to your Redux store
import { useSelector } from "react-redux";
import Header from "../components/header";
// import { useQuery } from "@tanstack/react-query";

// import { User } from "../lib/types";
// import { getUsersList } from "../lib/utils/test-user-list";
// import GoogleLoginComponent from "../components/google-auth";

const AuthPage = () => {
  // const { data: users } = useQuery<User[]>(["messages"], () => getUsersList(), {
  //   initialData: [],
  // });

  const isSignUpActive = useSelector(
    (state: RootState) => state.isSignUpActive
  );

  // console.log("users-list: ", users);

  return (
    <div>
      <Header />
      <main className="sign-up">
        <div>
          <div
            className={`auth-background ${
              !isSignUpActive ? "auth-background-in-login" : ""
            }`}
          >
            <img
              className={` ${
                !isSignUpActive
                  ? "auth-background-img-in-login"
                  : "auth-background-img"
              }`}
              src={AuthBackgroundImage}
              alt="man lifting weight"
            />
            <div className="left-col">
              <img className="project-logo" src={Logo} alt="main logo" />
              <h1 className="auth-heading">Train with us</h1>
              <p className="auth-subheading">
                Prepare your meal plan & workout routine and level up
              </p>
            </div>
          </div>
          <div className={`${isSignUpActive ? "right-col" : null}`}>
            <div>{isSignUpActive ? <SignupForm /> : <LoginForm />}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
