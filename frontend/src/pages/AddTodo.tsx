import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { createTodo } from "../Api/serverAPI";
import { NavigateFunction, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface AddTodoProps {}

export const AddTodo: React.FC<AddTodoProps> = () => {
  const [name, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const navigate: NavigateFunction = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.id === "name") {
      setTitle(e.target.value);
    } else if (e.target.id === "description") {
      setDescription(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTodo(name, description);
      toast.success("Todo created successfully", { position: "bottom-left" });
      navigate("/");
    } catch (error) {
      console.log(error);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  return (
    <Layout title="Add new todo">
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold mt-2">Add new todo</h1>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Enter your new todo name"
            className="mb-4 border border-gray-300 rounded px-4 w-[150%] py-2 focus:outline-none"
          />
          <textarea
            id="description"
            value={description}
            rows={5}
            onChange={handleInputChange}
            placeholder="Enter your new todo description"
            className="mb-4 border border-gray-300 rounded px-4 py-2 w-[150%] focus:outline-none"
          />
          <button
            disabled={!name || !description}
            type="submit"
            className={`bg-blue-500 text-white rounded px-4 py-2 focus:outline-none ${
              !name || !description
                ? "cursor-not-allowed bg-gray-500"
                : "hover:bg-blue-600 cursor-pointer"
            }`}
          >
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </form>
      </div>
    </Layout>
  );
};
