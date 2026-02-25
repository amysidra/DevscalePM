import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
	const token = c.req.header("Authorization")?.split(" ")[1];
	if (!token) {
		throw new HTTPException(401, { message: "token is required" });
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		console.log("JWT secret key is not defined in environment variables");
		throw new HTTPException(500, { message: "internal server error" });
	}

	try {
		const payload = await verify(token, secret, "HS256");
		c.set("jwtPayload", payload);
		await next();
	} catch (_error) {
		throw new HTTPException(401, { message: "invalid token" });
	}
};
