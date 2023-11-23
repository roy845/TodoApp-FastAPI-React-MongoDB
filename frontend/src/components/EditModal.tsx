import React, { useState, useEffect } from "react";
import { Todo } from "../types";
import { getTodo, updateTodo } from "../Api/serverAPI";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

interface EditModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  selectedTodo: string | null | undefined;
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: React.FC<EditModalProps> = ({
  title,
  isOpen,
  onClose,
  selectedTodo,
  fetchAgain,
  setFetchAgain,
}) => {
  const [editedTodo, setEditedTodo] = useState<Todo>({} as Todo);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const { data } = await getTodo(selectedTodo!);
        setEditedTodo(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    isOpen && fetchTodo();
  }, [selectedTodo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setEditedTodo((prevTodo) => ({
      ...prevTodo,
      completed: !prevTodo.completed,
    }));
  };

  const handleSave = async () => {
    try {
      await updateTodo(selectedTodo, editedTodo);
      toast.success("Todo updated successfully", { position: "bottom-left" });
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } fixed inset-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white p-8 rounded-md">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              name="name"
              value={editedTodo.name}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </label>
          <label className="block mb-2">
            Description:
            <textarea
              name="description"
              value={editedTodo.description}
              onChange={handleInputChange}
              className="w-full border p-2"
            />
          </label>
          <label className="block mb-4">
            Completed:
            <input
              type="checkbox"
              name="completed"
              checked={editedTodo.completed}
              onChange={handleCheckboxChange}
              className="ml-2"
            />
          </label>
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditModal;
