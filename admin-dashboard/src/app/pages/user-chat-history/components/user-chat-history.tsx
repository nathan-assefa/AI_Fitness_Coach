import React from "react";
import { Messages } from "../../../../lib/types";
import clsx from "clsx";

interface UserChatListInterface {
  messages: Messages[];
  isDrawer: boolean;
}

const UserChatList: React.FC<UserChatListInterface> = ({
  messages,
  isDrawer,
}) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
  });
  return (
    <div
      className="scroll-y me-n5 pe-5"
      data-kt-element="messages"
      data-kt-scroll="true"
      data-kt-scroll-activate="{default: false, lg: true}"
      data-kt-scroll-max-height="auto"
      data-kt-scroll-dependencies={
        isDrawer
          ? "#kt_drawer_chat_messenger_header, #kt_drawer_chat_messenger_footer"
          : "#kt_header, #kt_app_header, #kt_app_toolbar, #kt_toolbar, #kt_footer, #kt_app_footer, #kt_chat_messenger_header, #kt_chat_messenger_footer"
      }
      data-kt-scroll-wrappers={
        isDrawer
          ? "#kt_drawer_chat_messenger_body"
          : "#kt_content, #kt_app_content, #kt_chat_messenger_body"
      }
      data-kt-scroll-offset={isDrawer ? "0px" : "5px"}
    >
      {messages.map((message, index) => {
        const state =
          (message?.recipient.first_name != "LLM" ? "info" : "primary") ||
          "primary";

        const templateAttr = {};
        if (message.template) {
          Object.defineProperty(templateAttr, "data-kt-element", {
            value: `template-in`,
          });
        }
        const contentClass = `${isDrawer ? "" : "d-flex"} justify-content-${
          message?.recipient.first_name != "LLM" ? "start" : "end"
        } mb-10`;
        return (
          <div
            key={`message${index}`}
            className={clsx("d-flex", contentClass, "mb-10", {
              "d-none": message.template,
            })}
            {...templateAttr}
          >
            <div
              className={clsx(
                "d-flex flex-column align-items",
                `align-items-${
                  message.recipient.first_name != "LLM" ? "start" : "end"
                }`
              )}
            >
              <div className="d-flex align-items-center mb-2">
                {message.recipient.first_name != "LLM" ? (
                  <>
                    <div className="ms-3">
                      <a
                        href="#"
                        className="fs-5 fw-bolder text-gray-900 text-hover-primary me-1"
                      >
                        {message?.sender.first_name}
                      </a>
                      <span className="text-muted fs-7 mb-1">
                        {dateFormatter.format(Date.parse(message?.created_at!))}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="me-3">
                      <span className="text-muted fs-7 mb-1">
                        {dateFormatter.format(Date.parse(message?.created_at!))}
                      </span>
                      <a
                        href="#"
                        className="fs-5 fw-bolder text-gray-900 text-hover-primary ms-1"
                      >
                        {message?.sender.first_name}
                      </a>
                    </div>
                  </>
                )}
              </div>

              <div
                className={clsx(
                  "p-5 rounded",
                  `bg-light-${state}`,
                  "text-gray-900 fw-bold mw-lg-400px",
                  `text-${
                    message.recipient.first_name != "LLM" ? "start" : "end"
                  }`
                )}
                data-kt-element="message-text"
                dangerouslySetInnerHTML={{
                  __html: message?.content!,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserChatList;
