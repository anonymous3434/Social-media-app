import { z } from "zod";
export const SignupValidationSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(4),
  username: z.string().min(3),
});
export const SignInValidationSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const postValidationSchema = z.object({
  caption: z.string().min(5),
  photos: z.custom<File[]>(),
  location: z.string(),
  tags: z.string(),
});
