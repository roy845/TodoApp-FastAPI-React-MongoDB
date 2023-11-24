import { Todo } from "../types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { deleteTodo } from "../Api/serverAPI";
import toast from "react-hot-toast";
import AlertModal from "./AlertModal";
import { useModal } from "../hooks/useModal";
import EditModal from "./EditModal";

interface TodoItemProps {
  todo: Todo;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  fetchAgain,
  setFetchAgain,
}: TodoItemProps) => {
  const { isOpen, closeModal, openModal, modalData, modalType } = useModal();

  const handleDelete = async (todoId: string): Promise<void> => {
    try {
      openModal("delete", todoId);
      await deleteTodo(todoId);
      closeModal();
      toast.success("Todo deleted successfully", { position: "bottom-left" });
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
      closeModal();
    }
  };

  return (
    <div
      key={todo._id}
      className={`bg-white p-4 rounded-md border border-gray-300 flex justify-between items-center
              ${
                todo.completed
                  ? "hover:bg-green-500 cursor-pointer text-black"
                  : "hover:bg-red-500 cursor-pointer"
              }`}
    >
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 transition-colors duration-300 ease-in-out hover:text-white">
          {todo.name}
        </h2>
        <p className="text-gray-800 mb-2 transition-colors duration-300 ease-in-out hover:text-white">
          {todo.description}
        </p>
        <p className="text-gray-800 mb-2 transition-colors duration-300 ease-in-out hover:text-white">
          From {new Date(todo.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-800 mb-2 transition-colors duration-300 ease-in-out hover:text-white">
          Updated at {new Date(todo.updatedAt).toLocaleString()}
        </p>
        <p
          className={`text-${
            todo.completed ? "white" : "black"
          }-500 transition-colors duration-300 ease-in-out hover:text-white`}
        >
          Completed: {todo.completed ? "Yes" : "No"}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon
          icon={faEdit}
          className={`text-blue-500 transition-colors duration-300 ease-in-out hover:text-white cursor-pointer`}
          onClick={() => openModal("edit", todo._id)}
        />
        <FontAwesomeIcon
          icon={faTrash}
          className={`text-purple-500 transition-colors duration-300 ease-in-out hover:text-white cursor-pointer`}
          onClick={() => {
            openModal("delete", todo._id);
          }}
        />
        {todo.completed ? (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="transition-colors duration-300 ease-in-out hover:text-white text-black"
          />
        ) : (
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="transition-colors duration-300 ease-in-out hover:text-white text-black"
          />
        )}
      </div>
      <AlertModal
        deleteAll={false}
        onDeleteAll={(): any => {}}
        isOpen={isOpen && modalType === "delete"}
        onClose={closeModal}
        message="Are you sure you want to delete this todo ?"
        onConfirm={handleDelete}
        selectedTodo={modalData}
        title="Delete todo"
      />
      <EditModal
        isOpen={isOpen && modalType === "edit"}
        onClose={closeModal}
        selectedTodo={modalData}
        title="Edit todo"
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </div>
  );
};

export default TodoItem;
