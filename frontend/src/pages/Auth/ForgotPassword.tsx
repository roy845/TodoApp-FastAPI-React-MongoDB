import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClose,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import validator from "validator";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HTTP_404_NOT_FOUND } from "../../constants/httpStatusCodes";
import { forgotPassword } from "../../Api/serverAPI";

interface ForgotPasswordProps {}

const ForgotPassword: React.FC<ForgotPasswordProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isEmailValid = validator.isEmail(email);

  const sendResetPasswordLink = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await forgotPassword(email);
      setLoading(false);

      toast.success(data.message, { position: "bottom-left" });
      setEmail("");
    } catch (error: any) {
      if (error?.response?.status === HTTP_404_NOT_FOUND) {
        toast.error(error?.response?.data?.detail, { position: "bottom-left" });
      }
      setLoading(false);
    }
  };

  const emailValidationDetails =
    !isEmailValid && email ? (
      <div className="mt-1">
        <FontAwesomeIcon icon={faClose} color="red" />
        <span style={{ color: "red" }}> Invalid email</span>
      </div>
    ) : isEmailValid && email ? (
      <div className="mt-1">
        <FontAwesomeIcon icon={faCheck} color="green" />
        <span style={{ color: "green" }}> Valid email</span>
      </div>
    ) : null;

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-gray p-8 rounded shadow-md w-96 border border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <p className="text-gray-600 mb-4">
          No worries! If you've forgotten your password, enter your email
          address below, and we'll send you a link to reset it.
        </p>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
            Email Address
          </label>
          <div className="relative">
            <input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              type="email"
              id="email"
              name="email"
              className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {emailValidationDetails}
        </div>
        <button
          type="button"
          onClick={sendResetPasswordLink}
          disabled={!isEmailValid || !email}
          className={`bg-blue-500 text-white py-2 px-4 rounded-md ${
            isEmailValid && email
              ? "hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 cursor-pointer"
              : "cursor-not-allowed bg-gray-500"
          }`}
        >
          {loading ? <Spinner sm /> : "Reset Password"}
        </button>
        <div className="mt-4">
          <Link to="/" className="text-blue-500 no-underline">
            Remember your Password ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
