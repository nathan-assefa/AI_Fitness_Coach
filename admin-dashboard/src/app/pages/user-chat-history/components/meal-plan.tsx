import React from "react";
import CopyContent from "./llm-response-content";
import { MonthlyMealPlan } from "../../../../lib/types";
import formatTimeWithAMPM from "./format-time";

interface TrainerResponseInterface {
  response: string;
  generated_time: string;
}

const TrainerResponseForMealPlan: React.FC<TrainerResponseInterface> = ({
  response,
  generated_time,
}) => {
  let formattedResponse = "";

  try {
    // Fix single quotes in JSON
    const fixedResponse = response.replace(/'/g, '"');
    // Parse the JSON response
    const parsedResponse: MonthlyMealPlan = JSON.parse(fixedResponse);

    formattedResponse = `Month: ${parsedResponse.month}\nYear: ${parsedResponse.year}\nPlan Type: ${parsedResponse.plan_type}\n\nDays:\n`;

    if (parsedResponse.days) {
      parsedResponse.days.forEach((day) => {
        formattedResponse += `Day ${day.day} (${day.date}):\n`;

        if (day.meals) {
          day.meals.forEach((meal) => {
            formattedResponse += `  Type: ${meal.type}\n`;
            formattedResponse += `  Time: ${meal.time}\n`;
            formattedResponse += `  Items:\n`;
            meal.items.forEach((item) => {
              formattedResponse += `    - ${item}\n`;
            });

            if (meal.nutritional_info && meal.nutritional_info.length > 0) {
              const nutrition = meal.nutritional_info[0];
              formattedResponse += `  Nutritional Info:\n`;
              formattedResponse += `    Calories: ${nutrition.calories} kcal\n`;
              formattedResponse += `    Protein: ${nutrition.protein_grams} g\n`;
              formattedResponse += `    Carbs: ${nutrition.carbs_grams} g\n`;
              formattedResponse += `    Fat: ${nutrition.fat_grams} g\n`;
            }
            formattedResponse += "\n";
          });
        }
      });
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    formattedResponse =
      "Error parsing plan details. Please check the data format.";
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

export default TrainerResponseForMealPlan;
