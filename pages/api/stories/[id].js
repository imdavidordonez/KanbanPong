import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  // Ckeck if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedStories: true },
  });
  // Check if authenticated user is the owner of this home
  const { id } = req.query;
  if (!user?.listedStories?.find((story) => story.id === id)) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Update Story
  if (req.method === "PATCH") {
    try {
      const story = await prisma.userStorie.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(story);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  // Delete Story
  else if (req.method === "DELETE") {
    try {
      const story = await prisma.userStorie.delete({
        where: { id },
      });
      // Remove image from Supabase storage
      if (story.image) {
        const path = story.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
        await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([path]);
      }
      res.status(200).json(story);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  // HTTP Method not Supported!
  else {
    res.setHeader("Allow", ["PATCH", "DELETE"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not Supported.` });
  }
}
