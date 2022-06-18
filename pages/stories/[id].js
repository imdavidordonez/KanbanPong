import Image from "next/image";
import Layout from "../../components/Layout";
import { prisma } from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import toast from 'react-hot-toast';

const ListedStory = (story = null) => {
  const { data: session } = useSession();
  const [ isOwner, setIsOwner ] = useState(false);

  useEffect(() => {
    (async () => {
      if (session?.user) {
        try {
          const owner = await axios.get(`/api/stories/${story.id}/owner`);
          setIsOwner(owner?.id === session.user.id);
        } catch (e) {
          setIsOwner(false);
        }
      }
    })();
  }, [session?.user]);
  

  const router = useRouter();

  const [deleting, setDeleting] = useState(false);

  const deleteStory = async () => {
    let toastId;
    try {
      toastId = toast.loading('Deleting...');
      setDeleting(true),
      // Delete home from DB
      await axios.delete(`/api/stories/${story.id}`);

      //Redirect user
        toast.success('Successfully deleted', { id: toastId });
        router.push('/stories');
    } catch (e) {
      console.log(e);
      toast.error('Unable to delete home', { id: toastId });
      setDeleting(false);
    }
  };


  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden">
          {story?.image ? (
            <Image
              src={story.image}
              alt={story.title}
              layout="fill"
              objectFit="cover"
            />
          ) : null}
        </div>

        <div className="flex mt-4 flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {story?.title ?? ""}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                  In the list{" "}
                  <span className="underline"> {story?.lists ?? ""} </span>
                </span>
              </li>
            </ol>
          </div>
          {isOwner ? (
            <div className="flex items-center space-x-2 ">
              <button
                type="button"
                onClick={() => router.push(`/stories/${story.id}/edit`)}
                className="px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={deleteStory}
                className="rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>
            <div className="mt-8">
            <h1 className="mt-4 bg-gray-200 text-gray-800 text-md font-semibold mr-2 px-2.5 max-w-min py-0.5 rounded ">
          DESCRIPTION
        </h1>
        <p className="mt-1 text-base  rounded max-w-max p-2"> &#8226; {story?.description ?? ""}</p>
            </div>
            <div>
            <h1 className="mt-4 bg-gray-200 text-gray-800 text-md font-semibold mr-2 px-2.5 max-w-min py-0.5 rounded ">
          COMMENT
        </h1>
        <p className="mt-1 text-base  rounded max-w-max p-2"> &#8226; {story?.comment ?? ""}</p>
            </div>

      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  // Get all the stories IDs from the database
  const stories = await prisma.userStorie.findMany({
    select: { id: true },
  });

  return {
    paths: stories.map((story) => ({
      params: { id: story.id },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // Get the current story from the database
  const story = await prisma.userStorie.findUnique({
    where: { id: params.id },
  });

  if (story) {
    return {
      props: JSON.parse(JSON.stringify(story)),
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}


export default ListedStory;