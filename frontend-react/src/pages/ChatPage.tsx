import ChatInput from "../components/chat-input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../lib/utils/send-message";
import { getMessages } from "../lib/utils/get-messages";
import { Messages } from "../lib/types";
import { useParams } from "react-router-dom";
import ChatMessages from "../components/chat-messages";
import Header from "../components/header";
import { useDispatch } from "react-redux";
import { setContent } from "../store";
import UserPlanChoice from "../components/user-plan-choice";
import messageSound from "../assets/message-notification-sound/message.mp3";
import { Spinner } from "@chakra-ui/react";
import ChatFinshAlert from "../components/chat-finish-alert";
import SubscriptionPropmt from "../components/prompt-user-for-subscription";

import { useEffect, useRef, useState } from "react";

const ChatPage = () => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const queryClient = useQueryClient();
  const { id: recipientId } = useParams();
  const [messagesData, setMessagesData] = useState<Messages[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);
  const [isChatCompleted, setIsChatCompleted] = useState<boolean>(false);
  const [isSubscriptionInactive, setIsSubscriptionInactive] =
    useState<boolean>(false);
  const [isAiResponseLoading, setIsAiResponseLoading] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const { isLoading, isError } = useQuery<Messages[]>(
    ["messages", recipientId],
    () => getMessages(recipientId!),
    {
      onSuccess: (data) => {
        console.log("data: ", data);
        setMessagesData(data);
        setMessagesLoaded(true);

        const chatCompleted = data.some(
          (message) =>
            (message.recipient.first_name !== "LLM" &&
              message.recipient.chat_status === "Completed") ||
            (message.sender.first_name !== "LLM" &&
              message.sender.chat_status === "Completed")
        );
        setIsChatCompleted(chatCompleted);

        const subscriptionInactive = data.some(
          (message) =>
            (message.recipient.first_name !== "LLM" &&
              message.recipient.subscription_status === "Inactive") ||
            (message.sender.first_name !== "LLM" &&
              message.sender.subscription_status === "Inactive")
        );
        setIsSubscriptionInactive(subscriptionInactive);
      },
    }
  );

  const sendMessageMutation = useMutation(
    (content: string) => {
      setIsAiResponseLoading(true);
      return sendMessage(recipientId, content);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["messages", recipientId]);
        const sound = new Audio(messageSound);
        sound.play();
        setIsAiResponseLoading(false);
        scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      onError: () => {
        setIsAiResponseLoading(false);
      },
    }
  );

  const handleMessageSend = async (content: string): Promise<void> => {
    try {
      const currentTime = new Date().toISOString();
      setMessagesData([
        ...messagesData,
        {
          id: 7890,
          content: content,
          recipient: messagesData[messagesData.length - 1].sender,
          sender: messagesData[messagesData.length - 1].recipient,
          created_at: currentTime,
          updated_at: currentTime,
        },
      ]);
      dispatch(setContent(""));
      await sendMessageMutation.mutateAsync(content);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    if (!isAiResponseLoading) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  }, [isAiResponseLoading]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, []);

  if (isError) {
    return (
      <div>
        <p>Can't fetch messages</p>
      </div>
    );
  }

  useEffect(() => {
    window.location.href = window.location.toString().split("#")[0] + "#scroll";
  }, [messagesData]);

  console.log(isChatCompleted);

  return (
    <div>
      {!isChatCompleted ? (
        <div>
          {!isSubscriptionInactive ? (
            <ChatFinshAlert />
          ) : (
            <SubscriptionPropmt />
          )}
        </div>
      ) : (
        <div className="chat-room">
          <Header />

          <div>
            <section>
              <div className="chat-page-wrapper">
                <section className="chat-header">
                  <div className="trainer-data">
                    <div className="trainer-image"></div>
                    <div className="trainer-info">
                      <h3 className="trainer-name">Jake Tran</h3>
                      <p className="trainer-profession">
                        Fitness influencer and trainer
                      </p>
                    </div>
                  </div>
                </section>
                <section className="list-message">
                  <div className="list-msg-height">
                    {isLoading || !messagesLoaded ? (
                      <div>
                        <Spinner
                          thickness="4px"
                          speed="0.65s"
                          emptyColor="gray.200"
                          color="blue.500"
                          size="lg"
                          className="message-loading-state"
                        />
                      </div>
                    ) : messagesData.length > 0 ? (
                      <ChatMessages
                        messages={messagesData}
                        recipientId={recipientId!}
                        forwardedRef={scrollDownRef}
                      />
                    ) : (
                      <div className="user-choice-container">
                        <UserPlanChoice />
                      </div>
                    )}
                  </div>
                </section>

                {messagesData.length !== 0 ? (
                  <section className="chat-input">
                    {isLoading || !messagesLoaded ? null : (
                      <ChatInput
                        isLoading={sendMessageMutation.isLoading}
                        isError={sendMessageMutation.isError}
                        autoFocus={true}
                        onSubmit={handleMessageSend}
                        isInputDisabled={isAiResponseLoading}
                        ref={inputRef} // Pass the ref to ChatInput
                      />
                    )}
                  </section>
                ) : null}
              </div>
            </section>
          </div>
          <p className="powered_by">
            {" "}
            <a href="https://startupagile.ai/" target="_blank">
              Powered by <span>Startupagile AI</span>
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

// import ChatInput from "../components/chat-input";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { sendMessage } from "../lib/utils/send-message";
// import { getMessages } from "../lib/utils/get-messages";
// import { Messages } from "../lib/types";
// import { useNavigate, useParams } from "react-router-dom";
// import ChatMessages from "../components/chat-messages";
// import Header from "../components/header";
// import { useDispatch } from "react-redux";
// import { setContent } from "../store";
// import UserPlanChoice from "../components/user-plan-choice";
// import messageSound from "../assets/message-notification-sound/message.mp3";
// import { Spinner } from "@chakra-ui/react";
// import ChatFinshAlert from "../components/chat-finish-alert";
// // import SubscriptionPropmt from "../components/prompt-user-for-subscription";

// import { useEffect, useRef, useState } from "react";

// const ChatPage = () => {
//   const scrollDownRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLTextAreaElement | null>(null);
//   const queryClient = useQueryClient();
//   const { id: recipientId } = useParams();
//   const [messagesData, setMessagesData] = useState<Messages[]>([]);
//   const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);
//   const [isChatCompleted, setIsChatCompleted] = useState<boolean>(false);
//   const [isSubscriptionInactive, setIsSubscriptionInactive] =
//     useState<boolean>(false);
//   const [isAiResponseLoading, setIsAiResponseLoading] =
//     useState<boolean>(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { isLoading, isError } = useQuery<Messages[]>(
//     ["messages", recipientId],
//     () => getMessages(recipientId!),
//     {
//       onSuccess: (data) => {
//         console.log("data: ", data);
//         setMessagesData(data);
//         setMessagesLoaded(true);

//         const chatCompleted = data.some(
//           (message) =>
//             (message.recipient.first_name !== "LLM" &&
//               message.recipient.chat_status === "Completed") ||
//             (message.sender.first_name !== "LLM" &&
//               message.sender.chat_status === "Completed")
//         );
//         setIsChatCompleted(chatCompleted);

//         const subscriptionInactive = data.some(
//           (message) =>
//             (message.recipient.first_name !== "LLM" &&
//               message.recipient.subscription_status === "Inactive") ||
//             (message.sender.first_name !== "LLM" &&
//               message.sender.subscription_status === "Inactive")
//         );
//         setIsSubscriptionInactive(subscriptionInactive);
//       },
//     }
//   );

//   const sendMessageMutation = useMutation(
//     (content: string) => {
//       setIsAiResponseLoading(true);
//       return sendMessage(recipientId, content);
//     },
//     {
//       onSuccess: async () => {
//         await queryClient.invalidateQueries(["messages", recipientId]);
//         const sound = new Audio(messageSound);
//         sound.play();
//         setIsAiResponseLoading(false);
//         scrollDownRef.current?.scrollIntoView({ behavior: "smooth" });
//       },
//       onError: () => {
//         setIsAiResponseLoading(false);
//       },
//     }
//   );

//   const handleMessageSend = async (content: string): Promise<void> => {
//     try {
//       const currentTime = new Date().toISOString();
//       setMessagesData([
//         ...messagesData,
//         {
//           id: 7890,
//           content: content,
//           recipient: messagesData[messagesData.length - 1].sender,
//           sender: messagesData[messagesData.length - 1].recipient,
//           created_at: currentTime,
//           updated_at: currentTime,
//         },
//       ]);
//       dispatch(setContent(""));
//       await sendMessageMutation.mutateAsync(content);
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   };

//   useEffect(() => {
//     if (!isAiResponseLoading) {
//       setTimeout(() => {
//         if (inputRef.current) {
//           inputRef.current.focus();
//         }
//       }, 0);
//     }
//   }, [isAiResponseLoading]);

//   useEffect(() => {
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus();
//       }
//     }, 0);
//   }, []);

//   useEffect(() => {
//     if (isChatCompleted && isSubscriptionInactive) {
//       navigate("/subscription-page");
//     }
//   }, [isChatCompleted, isSubscriptionInactive, navigate]);

//   if (isError) {
//     return (
//       <div>
//         <p>Can't fetch messages</p>
//       </div>
//     );
//   }

//   useEffect(() => {
//     window.location.href = window.location.toString().split("#")[0] + "#scroll";
//   }, [messagesData]);

//   return (
//     <div>
//       {isChatCompleted ? (
//         <div>{!isSubscriptionInactive ? <ChatFinshAlert /> : null}</div>
//       ) : (
//         <div className="chat-room">
//           <Header />

//           <div>
//             <section>
//               <div className="chat-page-wrapper">
//                 <section className="chat-header">
//                   <div className="trainer-data">
//                     <div className="trainer-image"></div>
//                     <div className="trainer-info">
//                       <h3 className="trainer-name">Jake Tran</h3>
//                       <p className="trainer-profession">
//                         Fitness influencer and trainer
//                       </p>
//                     </div>
//                   </div>
//                 </section>
//                 <section className="list-message">
//                   <div className="list-msg-height">
//                     {isLoading || !messagesLoaded ? (
//                       <div>
//                         <Spinner
//                           thickness="4px"
//                           speed="0.65s"
//                           emptyColor="gray.200"
//                           color="blue.500"
//                           size="lg"
//                           className="message-loading-state"
//                         />
//                       </div>
//                     ) : messagesData.length > 0 ? (
//                       <ChatMessages
//                         messages={messagesData}
//                         recipientId={recipientId!}
//                         forwardedRef={scrollDownRef}
//                       />
//                     ) : (
//                       <div className="user-choice-container">
//                         <UserPlanChoice />
//                       </div>
//                     )}
//                   </div>
//                 </section>

//                 {messagesData.length !== 0 ? (
//                   <section className="chat-input">
//                     {isLoading || !messagesLoaded ? null : (
//                       <ChatInput
//                         isLoading={sendMessageMutation.isLoading}
//                         isError={sendMessageMutation.isError}
//                         autoFocus={true}
//                         onSubmit={handleMessageSend}
//                         isInputDisabled={isAiResponseLoading}
//                         ref={inputRef}
//                       />
//                     )}
//                   </section>
//                 ) : null}
//               </div>
//             </section>
//           </div>
//           <p className="powered_by">
//             {" "}
//             <a href="https://startupagile.ai/" target="_blank">
//               Powered by <span>Startupagile AI</span>
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;
