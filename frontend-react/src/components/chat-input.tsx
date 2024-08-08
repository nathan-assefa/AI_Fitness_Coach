import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setContent } from "../store";
import { Textarea } from "@chakra-ui/react";
import SendMessageIcon from "../assets/send_message_icon";

interface ChatInputProps {
  isLoading?: boolean;
  isError: boolean;
  onSubmit: (content: string) => Promise<void>;
  initialValue?: string;
  autoFocus?: boolean;
  isInputDisabled?: boolean;
}

// Forward ref to the Textarea
const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ isError, onSubmit, autoFocus, isInputDisabled }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const content = useSelector((state: RootState) => state.content.value);
    const dispatch = useDispatch();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [inputFocused, setInputFocused] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      if (autoFocus && ref && typeof ref !== "function") {
        ref.current?.focus();
      }
    }, [autoFocus, ref]);

    const handleFocus = () => {
      setInputFocused(true);
    };

    const handleBlur = () => {
      setInputFocused(false);
    };

    const handleSubmit = (
      e:
        | React.MouseEvent<HTMLDivElement>
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      e.preventDefault();
      onSubmit(content).then(() => dispatch(setContent("")));
    };

    console.log(autoFocus);

    return (
      <div className="input-chat-wrapper">
        <div>
          <div>
            <Textarea
              ref={(instance) => {
                textareaRef.current = instance;
                if (typeof ref === "function") {
                  ref(instance);
                } else if (ref) {
                  ref.current = instance;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message"
              value={content}
              onChange={(e) => dispatch(setContent(e.target.value))}
              autoFocus={autoFocus}
              className="chakra-input"
              sx={{
                resize: "none",
                backgroundColor: "white",
                paddingRight: "5rem",
                borderRadius: windowWidth > 950 ? "21px" : "0",
                height: "42px",
                lineHeight: "normal",
              }}
              isDisabled={isInputDisabled}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <div className="send-message-btn">
              <div
                onClick={(e) => {
                  if (content) {
                    handleSubmit(e as React.MouseEvent<HTMLDivElement>);
                  }
                }}
                className={!content && !inputFocused ? "disabled" : ""}
              >
                <SendMessageIcon />
              </div>
            </div>

            <div className="error" style={{ color: "red" }}>
              {isError}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ChatInput;
