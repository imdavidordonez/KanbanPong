import Layout from "../components/Layout";
import Grid from "../components/Grid";

// Import the generated Prisma client
import { prisma } from "../lib/prisma";

// // Instantiate it
// const prisma = new PrismaClient();

export async function getServerSideProps() {
  // Get all istories
  const stories = await prisma.userStorie.findMany();
  // Pass the data to the Home page
  return {
    props: {
      // props for the Home component
      stories: JSON.parse(JSON.stringify(stories)),
    },
  };
}

export default function Home({ stories = [] }) {
  // console.log(stories);
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-blue-500">
        Your Best Ideas Are Here!
      </h1>
      <p className="text-gray-500 ">
        Organize and Improve the Productivity in the Development of your
        Projects
      </p>
      <div className="mt-8">
        <Grid stories={stories} />
      </div>
    </Layout>
  );
}
