export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  agreed_to_terms: boolean;
  country: string;
  language: string;
  gender: string;
  stripe_id: string | null;
  is_active: boolean;
  is_staff: boolean;
  chat_status: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  subscription_plan?: string;
  plan_generated_status?: string;
}

export interface Subscription {
  id: string;
  user: User;
  plan: "basic" | "standard" | "premium";
  subscription_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface Messages {
  id: number;
  created_at: string;
  updated_at: string;
  sender: User;
  recipient: User;
  content: string;
  template?: boolean;
}

export interface UserListResponse {
  count: number;
  users: User[];
}

export interface RevenueResponse {
  total_revenue: number;
  meal_plan_revenue: number;
  workout_plan_revenue: number;
  meal_workout_plan_revenue: number;
}

export interface UserListResponse {
  count: number;
  users: User[];
}

export interface AnalyticsResponse {
  plan_information: {
    meal_plan_users: number;
    workout_plan_users: number;
    meal_workout_plan_users: number;
  };
  revenue_information: {
    total_revenue: number;
    revenue_by_month: {
      month: string;
      total: number;
    }[];
    revenue_by_plan: {
      plan: string;
      total: number;
    }[];
    revenue_by_month_plan: {
      month: string;
      plan: string;
      total: number;
    }[];
  };
  activity_information: {
    total_logins: number;
    completed_chats: number;
    total_users: number;
    not_started_chats: number;
    in_progress_chats: number;
  };
  performance_information: {
    trial_to_paid_conversion_rate: number;
  };
  subscription_information: {
    popular_plan: {
      plan: string;
      count: number;
    };
  };
  comparative_analysis: {
    current_month_metrics: number;
    previous_month_metrics: number;
    plan_comparison: {
      plan: string;
      total: number;
    }[];
  };
  profit_by_month: {
    [month: string]: number;
  };
}

/* Interface for the workouot plan */
export interface Workout {
  type: string;
  duration_minutes: number;
  intensity: string;
  description: string;
  equipment_needed: string[];
  target_muscle_groups: string[];
}

export interface DayPlanForWorkout {
  day: number;
  date: string;
  workouts: Workout[];
  notes: string;
}

export interface MonthlyWorkoutPlan {
  month: string;
  year: number;
  plan_type: string;
  days: DayPlanForWorkout[];
}

/* Interface for the meal plan */

export interface NutritionalInfo {
  calories: number;
  protein_grams: number;
  carbs_grams: number;
  fat_grams: number;
}

export interface Meal {
  type: string;
  items: string[];
  nutritional_info: NutritionalInfo[];
  time: string;
}

export interface DayPlanForMeal {
  day: number;
  date: string;
  meals: Meal[];
}

export interface MonthlyMealPlan {
  month: string;
  year: number;
  plan_type: string;
  days: DayPlanForMeal[];
}

interface Product {
  product_id: string;
  name: string;
  description: string | null;
  pricing: string;
  currency: string;
  default_price?: string;
}

export interface StripApiResponse {
  products: Product[];
}
