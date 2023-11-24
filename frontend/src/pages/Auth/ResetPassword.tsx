import React, { useEffect, useState } from "react";
import {
  Link,
  NavigateFunction,
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";
import { resetPassword } from "../../Api/serverAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { HTTP_400_BAD_REQUEST } from "../../constants/httpStatusCodes";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [passwordEntered, setPasswordEntered] = useState(false);

  const { token } = useParams();
  console.log(token);
  const navigate: NavigateFunction = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredPassword = e.target.value;
    setConfirmNewPassword(enteredPassword);

    // Check if passwords match
    if (enteredPassword.length === 0) {
      // Clear the error message when the password is empty
      setPasswordsMatch(null);
    } else if (newPassword === enteredPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }

    // Check if password is entered
    setPasswordEntered(enteredPassword.length > 0);
  };

  const handleResetPassword = async () => {
    try {
      const { data } = await resetPassword(newPassword, token!);
      toast.success(data.message, { position: "bottom-left" });
      navigate("/");
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === HTTP_400_BAD_REQUEST) {
        toast.error(error?.response?.data?.detail);
      }
    }
  };

  useEffect(() => {
    if (newPassword === confirmNewPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  }, [newPassword, confirmNewPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 rounded-md w-full sm:w-96 bg-white shadow-md">
        <div className="flex items-center justify-center mb-4">
          <FontAwesomeIcon
            icon={faLock}
            className="text-4xl text-blue-500 mr-2"
          />

          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>
        <p className="mb-4 text-center text-gray-500">
          Enter your new password below. Make sure it's secure and easy to
          remember.
        </p>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type="password"
              className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 ${
                passwordsMatch === false && passwordEntered
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="absolute top-3 right-3">
              {passwordEntered ? (
                passwordsMatch === true ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-2xl text-green-500 mr-2"
                  />
                ) : passwordsMatch === false ? (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-2xl text-red-500 mr-2"
                  />
                ) : null
              ) : (
                <FontAwesomeIcon icon={faLock} />
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmNewPassword"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type="password"
              className={`w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 ${
                passwordsMatch === false && passwordEntered
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Confirm your new password"
              value={confirmNewPassword}
              onChange={handlePasswordChange}
            />
            <div className="absolute top-3 right-3">
              {passwordEntered ? (
                passwordsMatch === true ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-2xl text-green-500 mr-2"
                  />
                ) : passwordsMatch === false ? (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-2xl text-red-500 mr-2"
                  />
                ) : null
              ) : (
                <FontAwesomeIcon icon={faLock} />
              )}
            </div>
          </div>
        </div>
        <button
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${
            newPassword || confirmNewPassword ? "" : "cursor-not-allowed"
          } disabled:bg-gray-500`}
          onClick={handleResetPassword}
          disabled={!newPassword || newPassword !== confirmNewPassword}
        >
          Reset Password
        </button>
        <p className="mt-4 text-center text-sm">
          Remember your password ?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
