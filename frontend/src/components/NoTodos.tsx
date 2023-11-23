import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

const NoTodosToShow: React.FC = () => {
  return (
    <div className="flex flex-col items-center mt-8 justify-center h-screen">
      <FontAwesomeIcon
        icon={faClipboardList}
        className="text-5xl text-gray-500 mb-4"
      />
      <p className="text-gray-600">No todos to show yet.</p>
    </div>
  );
};

export default NoTodosToShow;
