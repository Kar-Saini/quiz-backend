import { z } from "zod";

export const UserRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password mut be atleast of 6 characters" }),
    phoneNumber: z.string(),
    userRole: z.string().optional(),
  })
  .strict();

export const UserSignInSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password mut be atleast of 6 characters" }),
    phoneNumber: z.string(),
  })
  .strict();
