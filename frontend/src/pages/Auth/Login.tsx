import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClose,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { login } from "../../Api/serverAPI";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import validator from "validator";
import { Link } from "react-router-dom";
import { HTTP_403_FORBIDDEN } from "../../constants/httpStatusCodes";
import Spinner from "../../components/Spinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const { auth, setAuth } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEmailValid = validator.isEmail(formData.email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObject: FormData = new FormData();
    formDataObject.append("username", formData.email);
    formDataObject.append("password", formData.password);
    try {
      setLoading(true);
      const { data } = await login(formDataObject);
      setLoading(false);
      toast.success(data.message, { position: "bottom-left" });

      setAuth({
        ...auth,
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user,
      });

      const authData = {
        access_token: data.access_token,
        token_type: data.token_type,
        user: data.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
    } catch (error: any) {
      if (
        (error?.response?.status === HTTP_403_FORBIDDEN,
        { position: "bottom-left" })
      ) {
        toast.error(error?.response?.data?.detail);
      }
      setLoading(false);
    }
  };

  const emailValidationDetails =
    !isEmailValid && formData.email ? (
      <>
        <FontAwesomeIcon icon={faClose} color="red" />
        <span style={{ color: "red" }}> Invalid email</span>
      </>
    ) : isEmailValid && formData.email ? (
      <>
        <FontAwesomeIcon icon={faCheck} color="green" />
        <span style={{ color: "green" }}> Valid email</span>
      </>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md border border-gray-300">
        <FontAwesomeIcon icon={faLock} size={"2x"} color="blue" />
        <h2 className="text-3xl font-semibold mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
            {emailValidationDetails}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!isEmailValid || !formData.email || !formData.password}
            className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-green ${
              isEmailValid || formData.email || formData.password
                ? ""
                : "cursor-not-allowed"
            } disabled:bg-gray-500`}
          >
            {loading ? <Spinner sm /> : "Login"}
          </button>
          <div className="mt-4">
            <Link to="/forgotpassword" className="text-blue-500 no-underline">
              Forgot Password ?
            </Link>
          </div>
          <div className="text-sm mt-4">
            Don't have an account ?{" "}
            <Link to="/signup" className="text-blue-500 no-underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
