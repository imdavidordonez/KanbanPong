import PropTypes from "prop-types";
import Card from "./Card";
import { ExclamationIcon } from "@heroicons/react/outline";
// import { DragDropContext } from 'react-beautiful-dnd';

const Grid = ({ stories = [] }) => {
  const isEmpty = stories.length === 0;

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stories.map((story) => (
        <Card key={story.id} {...story} />
      ))}
    </div>
  );
};

Grid.propTypes = {
  stories: PropTypes.array,
};

export default Grid;
