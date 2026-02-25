import z from "zod";

export const registerSchema = z.object({
	username: z.string().min(3, "username minimal 3 karakter"),
	email: z.email("format email tidak benar"),
	password: z.string().min(8, "password minimal 8 karakter"),
});

export const loginSchema = z.object({
	email: z.email("format email tidak benar"),
	password: z.string().min(8, "password minimal 8 karakter"),
});
