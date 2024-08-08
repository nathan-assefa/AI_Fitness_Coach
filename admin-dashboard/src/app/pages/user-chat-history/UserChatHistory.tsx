import { FC, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { defaultUserInfos, UserInfoModel } from "../../../_metronic/helpers";
import { getChatHistory } from "../../../lib/utils/get-chat-history";
import { useParams } from "react-router-dom";
import { sendTrainerOpinion } from "../../../lib/utils/trainer-chat";
import LoadingMessage from "./components/loading-message";
import DownloadDocumentButton from "./components/download-document";
import { Messages } from "../../../lib/types";
import { getTrainerChatHistory } from "../../../lib/utils/get-trainer-chat-history";
import UserChatList from "./components/user-chat-history";
import TrainerChatList from "./components/trainer-chat-history";

type Props = {
  isDrawer?: boolean;
};

const UserChatHistory: FC<Props> = ({ isDrawer = false }) => {
  const [message, setMessage] = useState<string>("");
  const { id: user_id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [messagesLoaded, setMessagesLoaded] = useState<boolean>(false);
  const [userPreviousPlan, setUserPreviousPlan] = useState<Messages[] | null>(
    null
  );

  const [trainerChatHistory, setTrainerChatHistory] = useState<
    Messages[] | null
  >(null);
  const [response, setResponse] = useState(null);

  const {} = useQuery<Messages[]>(
    ["messages", user_id],
    () => getTrainerChatHistory(user_id!),
    {
      onSuccess: (data) => {
        setUserPreviousPlan(data);
        setMessagesLoaded(true);
      },
    }
  );

  const {
    mutate: getTrainerChathistory,
    isLoading: trainerChatHistoryLoading,
  } = useMutation(
    (data: { user_id: string }) => getTrainerChatHistory(data.user_id!),
    {
      onSuccess: (data: any) => {
        setTrainerChatHistory(data);
      },
      onError: (error: any) => {
        setError(error.message || "An error occurred");
      },
    }
  );

  const { mutate: getLlmResponse, isLoading: llmResponseLoading } = useMutation(
    (data: { user_id: string; trainer_opinion: string }) =>
      sendTrainerOpinion(data.user_id, data.trainer_opinion),
    {
      onSuccess: (data: any) => {
        console.log("data: ", data);
        console.log(typeof data);
        setResponse(data.chat_history);
        setError(null);
      },
      onError: (error: any) => {
        setError(error.message || "An error occurred");
      },
    }
  );

  const handleSubmit = async () => {
    if (message !== "") {
      await getLlmResponse({ user_id: user_id!, trainer_opinion: message });
      setMessage("");
    }
  };

  const getUserPreviousPlan = async () => {
    await getTrainerChathistory({ user_id: user_id! });
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const { data: messages, isLoading: messageLoading } = useQuery(
    ["chatHistory", user_id],
    async () => {
      return await getChatHistory(user_id!);
    }
  );

  let pardedUserPrevChatHistory: any;

  try {
    pardedUserPrevChatHistory = userPreviousPlan!;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  console.log(!!messagesLoaded);
  console.log(pardedUserPrevChatHistory?.chat_history.length > 0);
  // console.log(!!pardedUserPrevChatHistory?.chat_history);

  let parsedResponse: any;

  try {
    parsedResponse = response!;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  let paredTrainerChatHistory: any;

  try {
    paredTrainerChatHistory = trainerChatHistory;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return (
    <div>
      {llmResponseLoading ? (
        <div>
          <LoadingMessage />
        </div>
      ) : (
        <div>
          {!response ? (
            <div
              className="card-body  mx-auto"
              style={{ width: "100%", maxWidth: "90%" }}
              id={
                isDrawer
                  ? "kt_drawer_chat_messenger_body"
                  : "kt_chat_messenger_body"
              }
            >
              <div>
                {messageLoading ? (
                  <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ marginRight: "10px" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mb-0">Loading user chat history...</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {!trainerChatHistory ? (
                      messages ? (
                        <UserChatList messages={messages} isDrawer={isDrawer} />
                      ) : (
                        <p className="text-dark">
                          The user doesn't have any message history
                        </p>
                      )
                    ) : (
                      <div>
                        {!trainerChatHistoryLoading ? (
                          <div className="container-fluid vh-70">
                            <div className="row">
                              <TrainerChatList
                                messages={paredTrainerChatHistory.chat_history}
                              />
                            </div>
                            <div
                              style={{
                                position: "sticky",
                                bottom: 0,
                                backgroundColor: "white",
                              }}
                            >
                              <DownloadDocumentButton userId={user_id!} />
                              <div
                                className="card-footer pt-4"
                                id={
                                  isDrawer
                                    ? "kt_drawer_chat_messenger_footer"
                                    : "kt_chat_messenger_footer"
                                }
                              >
                                <textarea
                                  className="form-control form-control-flush mb-3"
                                  rows={1}
                                  data-kt-element="input"
                                  placeholder="Type a message"
                                  autoFocus={true}
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  onKeyDown={onEnterPress}
                                ></textarea>

                                <div className="d-flex flex-stack">
                                  <div className="d-flex align-items-center me-2"></div>
                                  <button
                                    style={{
                                      position: "absolute",
                                      top: "70%",
                                      right: "10px",
                                      transform: "translateY(-50%)",
                                      boxShadow: "0px 0px 4px gray",
                                      marginBottom: "10px",
                                    }}
                                    className="btn btn-primary"
                                    type="button"
                                    data-kt-element="send"
                                    onClick={handleSubmit}
                                  >
                                    Send
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!messageLoading && !trainerChatHistory ? (
                <div
                  style={{
                    position: "sticky",
                    bottom: 0,
                    backgroundColor: "white",
                  }}
                >
                  {messages![0]?.recipient.subscription_status === "Active" &&
                  messages![0]?.recipient.chat_status === "Completed" ? (
                    <div
                      style={{
                        position: "sticky",
                        bottom: 0,
                        backgroundColor: "white",
                      }}
                    >
                      {pardedUserPrevChatHistory?.chat_history.length > 0 &&
                      messagesLoaded ? (
                        <button
                          style={{
                            width: "100%",
                            borderRadius: "0",
                          }}
                          className="btn btn-primary"
                          onClick={getUserPreviousPlan}
                          disabled={trainerChatHistoryLoading}
                        >
                          {!trainerChatHistoryLoading
                            ? "See The Previous Plan To This User"
                            : "Extracting previous plans..."}
                        </button>
                      ) : null}

                      <div
                        className="card-footer pt-4"
                        id={
                          isDrawer
                            ? "kt_drawer_chat_messenger_footer"
                            : "kt_chat_messenger_footer"
                        }
                      >
                        <textarea
                          className="form-control form-control-flush mb-3"
                          rows={1}
                          data-kt-element="input"
                          placeholder="Type a message"
                          autoFocus={true}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={onEnterPress}
                        ></textarea>

                        <div className="d-flex flex-stack">
                          <div className="d-flex align-items-center me-2"></div>
                          <button
                            style={{
                              position: "absolute",
                              top:
                                pardedUserPrevChatHistory?.chat_history.length >
                                  0 && messagesLoaded
                                  ? "70%"
                                  : "50%",
                              right: "10px",
                              transform: "translateY(-50%)",
                              boxShadow: "0px 0px 4px gray",
                              marginBottom: "10px",
                            }}
                            className="btn btn-primary"
                            type="button"
                            data-kt-element="send"
                            onClick={handleSubmit}
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p
                      style={{
                        color: "red",
                        padding: "10px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {messages!.length > 0
                        ? "This user hasn't subscribed or hasn't completed the chat, so we cannot generate a plan for them."
                        : "This user does not have any chat history yet."}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      {response && !llmResponseLoading ? (
        <div>
          <div className="container-fluid vh-70">
            <div className="row">
              <TrainerChatList messages={parsedResponse} />
            </div>
          </div>
          <div
            style={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "white",
            }}
          >
            <DownloadDocumentButton userId={user_id!} />
            <div
              className="card-footer pt-4"
              id={
                isDrawer
                  ? "kt_drawer_chat_messenger_footer"
                  : "kt_chat_messenger_footer"
              }
            >
              <textarea
                className="form-control form-control-flush mb-3"
                rows={1}
                data-kt-element="input"
                placeholder="Type a message"
                autoFocus={true}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onEnterPress}
              ></textarea>

              <div className="d-flex flex-stack">
                <div className="d-flex align-items-center me-2"></div>
                <button
                  style={{
                    position: "absolute",
                    top: "70%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    boxShadow: "0px 0px 4px gray",
                    marginBottom: "10px",
                  }}
                  className="btn btn-primary"
                  type="button"
                  data-kt-element="send"
                  onClick={handleSubmit}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserChatHistory;
