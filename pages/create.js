import Layout from "../components/Layout";
import StoryForm from "../components/StoryForm";
import axios from "axios";
import { getSession } from "next-auth/react";

const Create = () => {
  const addStory = (data) => axios.post("/api/stories", data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-2xl font-bold text-blue-500">
          Create a user story
        </h1>
        <p className="text-gray-500">
          Fill out the form below and expose the user story to your team.
        </p>
        <div className="mt-8">
          <StoryForm
            buttonText="Add User Story"
            redirectPath="/"
            onSubmit={addStory}
          />
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  // Check if user is authenticated
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

  return {
    props: {},
  };
}

export default Create;
