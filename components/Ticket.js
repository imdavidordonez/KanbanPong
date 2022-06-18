import { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useField } from "formik";
import { XIcon } from "@heroicons/react/solid";

const TicketInput = ({ type= "", label = "", onChange, className = "", ...props }) => {
  const [field, meta] = useField(props);
  const error = meta?.touched && meta?.error;

  const [inputTickets, setInputTickets] = useState([
    {
      ticket: "",
    },
  ]);

  const addInputTickets = () => {
    setInputTickets([
      ...inputTickets,
      {
        ticket: "",
      },
    ]);
  };

  const removeInputTickets = (index) => {
    const rows = [...inputTickets];
    rows.splice(index, 1);
    setInputTickets(rows);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputTickets];
    list[index][name] = value;
    setInputTickets(list);
  };

  return (
    <div className={classNames(className, "flex flex-col space-y-1")}>
      {label ? (
        <label htmlFor="ticket" className="text-blue-600">
          {label}
        </label>
      ) : null}

      {inputTickets.map((data, index) => {
        const { ticket, ticketOne, ticketTwo } = data;

        return (
          <>
            <div className={classNames(className, "flex flex-row space-y-1")}>
              <input
                {...field}
                {...props}
                value={ticket}
                autoComplete="off"
                onChange={(e) => handleChange(index, e)}
                className={classNames(
                  "w-full shadow-sm rounded-md py-2 pl-4 truncate border focus:outline-none focus:ring-4 focus:ring-opacity-20 transition disabled:opacity-50 disabled:cursor-not-allowed",
                  error
                    ? "border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                )}
              />
              <div className="flex flex-col">
                {inputTickets.length !== 1 ? (
                  <button
                    type="button"
                    className="focus:outline-none text-rose-900  hover:text-rose-600 focus:ring-4 focus:ring-red-300 font-medium rounded-md text-sm px-2 py-2 "
                    onClick={removeInputTickets}
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        );
      })}

      <div className="flex justify-start">
        <button
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          onClick={addInputTickets}
        >
          Add New Ticket
        </button>
      </div>

      <div className="flex flex-col space-y-1"></div>
      {error ? (
        <p className="text-red-600 text-sm first-letter:uppercase">{error}</p>
      ) : null}
    </div>
  );
};

export default TicketInput;

TicketInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
};
