import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { prisma } from "../../utils/prisma";
import { loginSchema, registerSchema } from "./schema";
import { hashPassword, isPasswordValid } from "./utils";

export const authRouter = new Hono()

  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { username, password, email } = await c.req.valid("json");

    // check collision
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new HTTPException(400, { message: "Email already exists" });
    }

    // check authentication
    const hassedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name: username,
        password: hassedPassword,
        email: email,
        setting: {
          create: {
            notificationsEnabled: true,
          },
        },
      },
    });

    return c.json({ message: "User registered successfully", newUser }, 200);
  })

  .post("/login", zValidator("json", loginSchema), async (c) => {
    // check collision
    const { email, password } = await c.req.valid("json");
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      throw new HTTPException(400, { message: "Invalid email or password" });
    }

    const isValidPassword = await isPasswordValid(
      password,
      existingUser.password,
    );
    if (!isValidPassword) {
      throw new HTTPException(400, { message: "Invalid email or password" });
    }

    // check authorization
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log("JWT secret key is not defined in environment variables");
      throw new HTTPException(500, { message: "internal server error" });
    }

    const token = await sign(
      { sub: existingUser.id, exp: Math.floor(Date.now() / 1000) + 60 * 5 },
      secret,
    );

    return c.json({ message: "Login successful", token }, 200);
  })

  .get("/tes", async (c) => {
    return c.json({ message: "percobaan berhasil" })
  })
