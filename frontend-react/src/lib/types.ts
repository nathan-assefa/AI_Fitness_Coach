import * as z from "zod";

export const UserSignUpSchema = z.object({
  first_name: z
    .string()
    .describe("First Name")
    .min(1, "First name is required"),
  last_name: z.string().describe("Last Name").min(1, "Last name is required"),
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  phone_number: z
    .string()
    .describe("Phone Number")
    .min(1, "Phone number is required"),
  password: z.string().describe("Password").min(8, "Password is required"),
  agreed_to_terms: z.boolean(),
  gender: z.enum(["Male", "Female", ""]),
  country: z.enum(["Mexico", "USA", ""]),
  language: z.enum(["English", "Spanish", ""]),
});

export type UserSignUpData = z.infer<typeof UserSignUpSchema>;

export const UserLoginSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(1, "Password is required"),
});

export type UserLoginData = z.infer<typeof UserLoginSchema>;

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

export const UserGreetingFormSchema = z.object({
  gender: z.enum(["Male", "Female"]),
  country: z.enum(["Mexico", "USA"]),
  language: z.enum(["English", "Spanish"]),
});

export type UserGreetingData = z.infer<typeof UserGreetingFormSchema>;

export const UserLanguagePreferenceSchema = z.object({
  language: z.enum(["english", "spanish"]),
});

export type UserLanguagePreferenceData = z.infer<
  typeof UserLanguagePreferenceSchema
>;
