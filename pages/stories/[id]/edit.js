import Layout from "../../../components/Layout";
import StoryForm from "../../../components/StoryForm";
import { getSession } from "next-auth/react";
import { prisma } from "../../../lib/prisma";
import axios from "axios";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };

  // Check if the user is authenticated
  if (!session) {
    return redirect;
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedStories: true },
  });

  // Check if authenticated user is the owner of this home
  const id = context.params.id;
  const story = user?.listedStories?.find((story) => story.id === id);
  if (!story) {
    return redirect;
  }

  return {
    props: JSON.parse(JSON.stringify(story)),
  };
}

const Edit = (story = null) => {
  const handleOnSubmit = (data) =>
    axios.patch(`/api/stories/${story.id}`, data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-2xl font-bold text-blue-500">Edit your Story</h1>
        <p className="text-gray-500">
          Fill out the form below to update your user history.
        </p>
        <div className="mt-8">
          {story ? (
            <StoryForm
              initialValues={story}
              buttonText="Update User History"
              redirectPath={`/stories/${story.id}`}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;
