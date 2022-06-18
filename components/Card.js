import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";

const Card = ({
  id = "",
  image = "",
  title = "",
  lists = "",
  //   description = "",
  //   ticket = [],
  //   comment = "",
}) => (
  <Link href={`/stories/${id}`}>
    <a className="block w-full">
      <div className="relative">
        <div className="bg-gray-200 rounded-lg shadow overflow-hidden aspect-w-16 aspect-h-9">
          {image ? (
            <Image
              src={image}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="hover:opacity-80 transition"
            />
          ) : null}
        </div>
      
      </div>
      <div className="mt-2 w-full text-gray-700 font-semibold leading-tight">
        {title ?? ""}
      </div>
      <div className="mt-1 inline-flex items-center space-x-1 text-gray-500">
        <p>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-700">
            <svg
              className="mr-1 w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              ></path>
            </svg>
            {lists ?? ""}
          </span>
        </p>
      </div>
    </a>
  </Link>
);

Card.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string,
  lists: PropTypes.string,
  description: PropTypes.string,
  ticket: PropTypes.string,
  comment: PropTypes.string,
};

export default Card;
