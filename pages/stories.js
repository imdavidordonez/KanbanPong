import Layout from "../components/Layout";
import Grid from "../components/Grid";
import { getSession } from "next-auth/react";
import { prisma } from "../lib/prisma";

const Stories = ({ stories = [] }) => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-blue-500">Your Listings</h1>
      <p className="text-gray-400">
        Manage your User Stories and Update your Listings
      </p>
      <div className="mt-8">
        <Grid stories={stories} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  //  Check if user is authenticated

  const session = await getSession(context);

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Get all stories from the authenticated user
  const stories = await prisma.userStorie.findMany({
    where: { owner: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  // Pass the data to the Stories component

  return {
    props: {
      stories: JSON.parse(JSON.stringify(stories)),
    },
  };
}
export default Stories;
