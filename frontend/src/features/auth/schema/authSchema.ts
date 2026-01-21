import { z } from "zod";

export const registrationSchema = z.object({
  firstname: z
    .string()
    .min(1, "First name is required"),
  
  lastname: z
    .string()
    .min(1, "Last name is required"),
  
  email: z
    .string()
    .email("Invalid email address"),
  
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?\d+$/, "Invalid phone number"),
  
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  
  passwordConfirmation: z
    .string()
})
.refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;