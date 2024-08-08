import { ArrowUpRight } from "lucide-react";
import { useReducer } from "react";
import { ClockLoader } from "react-spinners";

type UserInvitationtFormProps = {
  isLoading: boolean;
  isError: boolean;
  onSubmit: (formData: { email: string }) => Promise<void>;
  initialValue?: {
    email: string;
  };
  autoFocus: boolean;
};

const JoininForm: React.FC<UserInvitationtFormProps> = ({
  isLoading,
  isError,
  onSubmit,
  // initialValue = {
  //   email: "",
  // },
  autoFocus = false,
}) => {
  type PostState = {
    email: string;
  };

  type PostAction = { type: "setEmail"; payload: string };

  const reducer = (state: PostState, action: PostAction) => {
    switch (action.type) {
      case "setEmail":
        return { ...state, email: action.payload };
    }
  };

  const [{ email }, dispatch] = useReducer(reducer, {
    email: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      email,
    });
  }

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="email-subscribe-form">
      <form onSubmit={handleSubmit}>
        <div className="email-subscribe-form-wrapper">
          <div className="email-subscribe-input">
            <input
              id="email"
              autoFocus={autoFocus}
              placeholder="Your email"
              value={email}
              onChange={(e) =>
                dispatch({ type: "setEmail", payload: e.target.value })
              }
            />
          </div>
          {isLoading ? (
            <ClockLoader
              className="email-subscribe-waiting"
              color="#4b9cd7"
              size={25}
            />
          ) : (
            <button
              className={`email-subscribe-save-btn ${
                isEmailValid(email) ? "active" : "disabled"
              }`}
              type="submit"
              disabled={!isEmailValid(email) || isLoading}
            >
              {isLoading ? "cancel" : "JOIN US"}
              <ArrowUpRight className="email-btn-left-arrow" />
            </button>
          )}
        </div>
        <div className="error" style={{ color: "red" }}>
          {isError}
        </div>
      </form>
    </div>
  );
};

export default JoininForm;
