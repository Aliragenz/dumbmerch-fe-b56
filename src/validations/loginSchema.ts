import { z } from "zod";


export const loginSchema = z
   .object({
      email: z.string().email("invalid email address"),
      password: z
         .string()
         .min(8, "Password need to be at least 8 characters")
         
   })
   .required();

export type LoginSchema = z.infer<typeof loginSchema>;
