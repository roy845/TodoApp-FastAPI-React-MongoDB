import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faClose,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { register } from "../../Api/serverAPI";
import toast from "react-hot-toast";
import validator from "validator";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { HTTP_409_FORBIDDEN } from "../../constants/httpStatusCodes";
import Spinner from "../../components/Spinner";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordEntered, setPasswordEntered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const isEmailValid = validator.isEmail(formData.email);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword") {
      setConfirmPassword(value);

      // Check if passwords match
      if (value.length === 0) {
        // Clear the error message when the password is empty
        setPasswordsMatch(null);
      } else if (formData.password === value) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }

      // Check if password is entered
      setPasswordEntered(value.length > 0);
    }
  };

  useEffect(() => {
    if (formData.password === confirmPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [formData.password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await register(formData);
      toast.success(data.message, { position: "bottom-left" });
      setLoading(false);
      resetForm();
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.status === HTTP_409_FORBIDDEN) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setConfirmPassword("");
    setPasswordsMatch(null);
    setPasswordEntered(false);
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

  const passwordsMatchDetails =
    passwordsMatch === false && passwordEntered ? (
      <>
        <FontAwesomeIcon icon={faClose} color="red" />
        <span style={{ color: "red" }}> Passwords do not match</span>
      </>
    ) : passwordEntered ? (
      <>
        <FontAwesomeIcon icon={faCheck} color="green" />
        <span style={{ color: "green" }}> Passwords match</span>
      </>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-md border border-gray-300">
        <FontAwesomeIcon
          icon={faUser}
          className="mr-2"
          size={"2x"}
          color="blue"
        />
        <h2 className="text-3xl font-semibold mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
          </div>
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
              className="border border-gray-300 p-2 w-full rounded-md"
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
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              className="border border-gray-300 p-2 w-full rounded-md mb-2"
              required
            />
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
            {passwordsMatchDetails}
          </div>
          <button
            disabled={
              !isEmailValid ||
              !formData.email ||
              !formData.password ||
              !formData.username ||
              !confirmPassword
            }
            type="submit"
            className={`bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green ${
              isEmailValid ||
              formData.email ||
              formData.password ||
              formData.username ||
              confirmPassword
                ? ""
                : "cursor-not-allowed"
            } disabled:bg-gray-500`}
          >
            {loading ? <Spinner sm /> : "Register"}
          </button>
          <div className="mt-4">
            Already have an account?{" "}
            <Link to="/" className="mt-4 no-underline text-blue-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
