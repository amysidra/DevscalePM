import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRouter } from "./modules/auth/router";
import { projectsRouter } from "./modules/projects/router";

const app = new Hono()

	.route("/api", authRouter)

	.route("/api/projects", projectsRouter)

	.get("/", (c) => {
		return c.text("Hello Hono!");
	});

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
