import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/providers/auth-provider";
import SignOutButton from "./Sign-out-button";
import { ChevronDown, CircleX, Menu } from "lucide-react";
import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState, toggleComponent } from "../store";
import { useForm } from "react-hook-form";
import { User, UserLanguagePreferenceData } from "../lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUserData } from "../lib/utils/update-user-language";
import { getUserData } from "../lib/utils/get-user-data";

const Header = () => {
  const { first_name, email, logOutUser: signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLanguageChanged, setIsLanguageChanged] = useState<boolean>(false);
  const currentPath = window.location.pathname;
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSignUpActive = useSelector(
    (state: RootState) => state.isSignUpActive
  );

  const {
    mutate: UpdateUserLanguage,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => queryClient.invalidateQueries(["user-data"]),
    onError: (error) => console.log(error),
  });

  const { data: user } = useQuery<User>(["user-data"], () => getUserData(), {
    initialData: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsMenuOpen(false);
      }
    };

    handleResize();

    // Add event listener for resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsMenuOpen]);

  const handleToggleComponent = () => {
    navigate("/auth-page");
    if (!isSignUpActive) dispatch(toggleComponent());
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { register, handleSubmit } = useForm<UserLanguagePreferenceData>({
    mode: "onChange",
  });

  const onSubmit = async (data: UserLanguagePreferenceData) => {
    console.log(data);
    await UpdateUserLanguage(data.language);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
    onClose();
    setIsLanguageChanged(true);
    setTimeout(() => {
      setIsLanguageChanged(false);
    }, 3000);
  };

  return (
    <div
      className={`logo-for-mobile ${
        currentPath === "/" ? "nav-wrapper" : "second-nav-wrapper"
      }`}
    >
      <Link
        to="/"
        className={`${currentPath === "/" ? "ptmx" : "not-home-page"}`}
      >
        PTMX
      </Link>
      {currentPath === "/" ? (
        <nav>
          {!isMenuOpen ? (
            <div>
              <Menu onClick={() => setIsMenuOpen(true)} className="menu-icon" />
            </div>
          ) : null}
          <ul
            className={`nav-items ${
              isMenuOpen ? "nav-items-lists" : "hide-nav-items"
            }`}
          >
            <li className="header-cta hidden">
              <CircleX
                onClick={() => setIsMenuOpen(false)}
                className="exit-btn"
              />
            </li>
            <li
              onClick={() => {
                scrollToSection("about-section");
                setIsMenuOpen(false);
              }}
              className="hidden"
            >
              About
            </li>
            <li
              onClick={() => {
                scrollToSection("plans-section");
                setIsMenuOpen(false);
              }}
              className="hidden"
            >
              Plans
            </li>
            <li
              onClick={() => {
                scrollToSection("testimonials-section");
                setIsMenuOpen(false);
              }}
              className="hidden"
            >
              Testimonials
            </li>
            <Link className="link" to="/chat-page/1">
              <li className="hidden past-chats">Chats</li>
            </Link>
            <li className="hidden">
              {first_name ? (
                <div className="user-info-wrapper">
                  <div className="name-and-email">
                    <p className="first-name">{first_name}</p>
                    <p className="email">{email}</p>
                  </div>
                  <SignOutButton className="sign-out-btn" />
                </div>
              ) : (
                <Link className="link" to="/auth-page">
                  <p className="auth-page user-login-btn">Log in</p>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul className="second-nav-list">
            {first_name ? (
              <>
                <li className="language">
                  <ButtonGroup size="sm" isAttached variant="outline">
                    <Button onClick={onOpen}>
                      {user?.language === "English"
                        ? "English(United States)"
                        : "Spanish"}
                    </Button>
                    <IconButton
                      className="down-arrow"
                      aria-label="Add to friends"
                      icon={
                        <ChevronDown
                          onClick={onOpen}
                          width="16px"
                          height="16px"
                        />
                      }
                    />
                  </ButtonGroup>
                </li>
                <Link to="/auth-page">
                  <Button
                    onClick={async () => {
                      try {
                        await signOut();
                      } catch (error) {
                        toast.error("There was a problem signing out");
                      }
                    }}
                    className="auth-btn"
                    colorScheme="purple"
                  >
                    log out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  size="md"
                  height="40px"
                  width="140px"
                  border="2px"
                  borderColor="purple"
                  className="get-started-btn"
                  onClick={handleToggleComponent}
                >
                  Get started
                </Button>
              </>
            )}
          </ul>
        </nav>
      )}
      <div>
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Choose your language preference</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Stack spacing={3}>
                <Select
                  {...register("language")}
                  variant="outline"
                  placeholder="Language"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </Select>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isLoading}
                onClick={handleSaveClick}
                colorScheme="purple"
                mr={3}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      {isLanguageChanged ? (
        <div className="language-change-alert">
          <Alert status="success">
            <AlertIcon />
            Your language has been changed.
          </Alert>
        </div>
      ) : null}
      {isError ? (
        <div className="language-change-alert">
          <Alert status="error">
            <AlertIcon />
            There was an error changing the language, please try again.
          </Alert>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
