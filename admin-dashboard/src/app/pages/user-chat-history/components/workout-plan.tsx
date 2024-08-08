import React from "react";
import {
  MonthlyWorkoutPlan,
  DayPlanForWorkout,
  Workout,
} from "../../../../lib/types";
import CopyContent from "./llm-response-content";
import formatTimeWithAMPM from "./format-time";

interface TrainerResponseInterface {
  response: string;
  generated_time: string;
}

const LLMResponseForWorkoutPlan: React.FC<TrainerResponseInterface> = ({
  response,
  generated_time,
}) => {
  let formattedResponse = "";

  try {
    const fixedResponse = response.replace(/'/g, '"');

    const parsedResponse: MonthlyWorkoutPlan = JSON.parse(fixedResponse);
    console.log(parsedResponse);

    formattedResponse = `Month: ${parsedResponse.month}\nPlan Type: ${parsedResponse.plan_type}\n\nDays:\n`;

    if (parsedResponse && parsedResponse.days) {
      parsedResponse.days.forEach((day: DayPlanForWorkout) => {
        formattedResponse += `Day ${day.day} (${day.date}):\n`;

        if (day.workouts) {
          day.workouts.forEach((workout: Workout) => {
            formattedResponse += `Type: ${workout.type}\n`;
            formattedResponse += `Duration: ${workout.duration_minutes} minutes\n`;
            formattedResponse += `Intensity: ${workout.intensity}\n`;
            formattedResponse += `Description: ${workout.description}\n`;
            formattedResponse += `Equipment Needed: ${workout.equipment_needed.join(
              ", "
            )}\n`;
            formattedResponse += `Target Muscle Groups: ${workout.target_muscle_groups.join(
              ", "
            )}\n\n`;
          });
        }

        formattedResponse += `Notes: ${day.notes}\n\n`;
      });
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ color: "black" }}>Plan Details</h2>
      <div
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#fff",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <CopyContent
          content={formattedResponse}
          generated_date={formatTimeWithAMPM(generated_time)}
        />
      </div>
    </div>
  );
};

export default LLMResponseForWorkoutPlan;
