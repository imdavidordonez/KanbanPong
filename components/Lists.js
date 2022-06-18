import { useField } from "formik";
import PropTypes from "prop-types";
import classNames from "classnames";

const ListSelect = ({ className = "", label = "", ...props }) => {
  const [field, meta] = useField(props);
  const error = meta?.touched && meta?.error;

  const lists = [
    { label: "Active", value: "ACTIVE" },
    { label: "In Development", value: "IN DEVELOPMENT" },
    { label: "Finished", value: "FINISHED" },
  ];

  const listOptions = lists.map((list, key) => (
    <option value={list.value} key={key}>
      {list.label}
    </option>
  ));

  return (
    <div className={classNames(className, "flex flex-col space-y-1")}>
      {label ? (
        <label htmlFor="email" className="text-blue-600">
          {label}
        </label>
      ) : null}
      <div className="flex-1">
        <select
          {...field}
          {...props}
          className={classNames(
            "w-full shadow-sm rounded-md py-2 pl-4 truncate border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400"
              : "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
          )}
        >
          <option value={" "}>Select a list</option>
          {listOptions}
        </select>
      </div>
      {error ? (
        <p className="text-red-600 text-sm first-letter:uppercase">{error}</p>
      ) : null}
    </div>
  );
};

ListSelect.propTypes = {
  className: PropTypes.string,
};

export default ListSelect;
