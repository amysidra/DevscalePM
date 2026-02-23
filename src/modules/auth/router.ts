import { Hono } from "hono";
import { prisma } from "../../utils/prisma";

export const authRouter = new Hono().post("/register", async (c) => {
	const { username, password, email } = await c.req.json();
	const newUser = await prisma.user.create({
		data: {
			name: username,
			password: password,
			email: email,
		},
	});
	return c.json({ message: "User registered successfully", newUser }, 200);
});
