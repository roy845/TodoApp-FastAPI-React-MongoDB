import { useEffect } from "react";
import { useLocation, useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth } from "../context/auth";
import { checkTokenExpiration } from "../Api/serverAPI";
import TodoList from "../components/TodoList";
import { Layout } from "../components/Layout";

const Home = () => {
  const { setAuth } = useAuth();
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const checkToken = async () => {
      try {
        await checkTokenExpiration();
      } catch (error) {
        setAuth(null);
        localStorage.removeItem("auth");
        navigate("/");
      }
    };

    checkToken();
  }, [pathname]);

  return (
    <Layout title="Home">
      <TodoList />
    </Layout>
  );
};

export default Home;
