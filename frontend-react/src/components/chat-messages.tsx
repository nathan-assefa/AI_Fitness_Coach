import React, { useMemo, useState } from "react";
import { Messages } from "../lib/types";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../lib/providers/auth-provider";
import formatTimeWithAMPM from "./getTimeAgo";

interface ChatMessagesProps {
  messages: Messages[];
  recipientId: string;
  forwardedRef?: React.RefObject<HTMLSpanElement>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  recipientId,
  forwardedRef,
}) => {
  const { email } = useAuth();
  const [lastIdx, setLastIdx] = useState<number>(0);

  useMemo(() => {
    setLastIdx(messages.length - 1);
  }, [messages]);

  return (
    <div className="llm-responses">
      {messages.map((message, idx) => (
        <div
          key={idx}
          className={`${
            message.recipient.id == recipientId
              ? "recipinet-response"
              : "sender-response"
          }`}
        >
          <div
            className={`${
              message.recipient.id != recipientId
                ? "trainer-image trainer-image-in-the-chat"
                : null
            }`}
          ></div>
          <p
            className={`${
              message.recipient.id == recipientId
                ? "recipinet-message"
                : "sender-message"
            }`}
          >
            {message.content}
            <span
              className={`${
                message.recipient.id == recipientId
                  ? "u-date-formatter-recipient"
                  : "u-date-formatter-sender"
              }`}
            >
              {formatTimeWithAMPM(message?.created_at)}
            </span>
          </p>
        </div>
      ))}
      {messages[lastIdx]?.sender?.email == email ? (
        <div className="wait-llm-div recipinet-message">
          <div className="trainer-image trainer-image-in-the-chat llm-img"></div>
          <LoaderCircle className="wait-llm" />
        </div>
      ) : null}
      <span ref={forwardedRef} className="ref-span" id="scroll" />
    </div>
  );
};

export default ChatMessages;
