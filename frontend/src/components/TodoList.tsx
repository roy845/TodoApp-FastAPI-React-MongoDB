import { useEffect, useState } from "react";
import { Todo } from "../types";
import { deleteAllTodos, getTodosByUserId } from "../Api/serverAPI";
import TodoItem from "./TodoItem";
import NoTodosToShow from "./NoTodos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import AlertModal from "./AlertModal";
import { useModal } from "../hooks/useModal";
import Tooltip from "./Tooltip";
import Spinner from "./Spinner";
import { useSearch } from "../context/search";
import { debounce } from "lodash";

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  const { isOpen, closeModal, openModal, modalData, modalType } = useModal();

  const { searchTerm } = useSearch();

  const debouncedSearch = debounce(async (searchTerm: string) => {
    try {
      setLoading(true);
      const { data: todos } = await getTodosByUserId(searchTerm);
      setTodos(todos);
      setLoading(false);
    } catch (error: any) {
      console.error("Error searching todos:", error);
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, fetchAgain]);

  const handleDeleteAll = async () => {
    try {
      await deleteAllTodos();
      toast.success("All todos deleted successfully", {
        position: "bottom-left",
      });
      closeModal();
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error);
      closeModal();
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="container mx-auto max-w-screen-md p-4">
          {todos.length > 0 && (
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-4">TodoList</h1>

              <Tooltip text="Delete all todos">
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() => openModal("deleteAll", null)}
                  icon={faTrash}
                  size="2x"
                  color="purple"
                />
              </Tooltip>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            {todos.length === 0 && <NoTodosToShow />}
            {todos.map((todo) => (
              <TodoItem
                todo={todo}
                key={todo._id}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            ))}
          </div>
        </div>
      )}

      <AlertModal
        deleteAll={true}
        onConfirm={(todo: string | null | undefined): any => {}}
        isOpen={isOpen && modalType === "deleteAll"}
        onClose={closeModal}
        message="Are you sure you want to delete all todos ?"
        onDeleteAll={handleDeleteAll}
        selectedTodo={modalData}
        title="Delete todo"
      />
    </div>
  );
};

export default TodoList;
