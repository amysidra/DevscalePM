import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth";
import { prisma } from "../../utils/prisma";

export const projectsRouter = new Hono()

  .use("*", authMiddleware)

  .get("/", async (c) => {

    const projectsList = await prisma.project.findMany({
      where: {
        userId,
      },
    });
    return c.json({ message: "List of projects" }, 200);
  })

  .get("/:id", async (c) => {
    const { id } = c.req.param();
    return c.json({ message: `Project details for ID: ${id}` }, 200);
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    return c.json({ message: "Project created", data: body }, 201);
  })

  .put("/:id", async (c) => {
    const { id } = c.req.param();
    const body = await c.req.json();
    return c.json(
      { message: `Project with ID: ${id} updated`, data: body },
      200,
    );
  })

  .delete("/:id", async (c) => {
    const { id } = c.req.param();
    return c.json({ message: `Project with ID: ${id} deleted` }, 200);
  });
