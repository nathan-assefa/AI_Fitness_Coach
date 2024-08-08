import React from "react";
import TrainerResponseForMealPlan from "./meal-plan";
import LLMResponseForWorkoutPlan from "./workout-plan";
import {
  Messages,
  MonthlyMealPlan,
  MonthlyWorkoutPlan,
} from "../../../../lib/types";
import DownloadDocumentButton from "./download-document";

interface TrainerChatListInterface {
  messages: Messages[];
}

const TrainerChatList: React.FC<TrainerChatListInterface> = ({ messages }) => {
  return (
    <div className="col">
      {messages &&
        messages.map((message: any) => {
          let planType: MonthlyWorkoutPlan | MonthlyMealPlan | undefined;

          if (message.sender.first_name === "LLM") {
            const fixedResponse = message.content.replace(/'/g, '"');
            planType = JSON.parse(fixedResponse) as
              | MonthlyWorkoutPlan
              | MonthlyMealPlan;
          }

          return (
            <div key={message.id} className="card mb-3">
              <div className="card-body">
                {message.sender.first_name === "LLM" ? (
                  planType?.plan_type === "meal" ||
                  planType?.plan_type === "meals" ||
                  planType?.plan_type === "meal_plan" ? (
                    <TrainerResponseForMealPlan
                      response={message.content}
                      generated_time={message.created_at}
                    />
                  ) : (
                    <LLMResponseForWorkoutPlan
                      response={message.content}
                      generated_time={message.created_at}
                    />
                  )
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TrainerChatList;
