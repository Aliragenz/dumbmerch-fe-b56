import { z } from "zod";

export const registerSchema = z
   .object({
      fullName: z
         .string()
         .min(4, "Fullname need to be at least 4 characters")
         .max(20, "Fullname need to be below 20 characters"),
      email: z.string().email("invalid email address"),
      password: z
         .string()
         .min(8, "Password need to be at least 8 characters")
         
   })
   .required();

export type RegisterSchema = z.infer<typeof registerSchema>;
