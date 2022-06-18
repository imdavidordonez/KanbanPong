import { prisma } from "../../lib/prisma";
import { getSession } from "next-auth/react";

// handler
export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Create new Story
  if (req.method === "POST") {
    // TODO
    try {
      const { image, title, lists, description, ticket, comment } = req.body;

      // Retrieve the current authenticated user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const story = await prisma.userStorie.create({
        data: {
          image,
          title,
          lists,
          description,
          ticket,
          comment,
          ownerId: user.id,
        },
      });

      res.status(200).json(story);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
