import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { User } from "../types";
import { getUser, updateProfile } from "../Api/serverAPI";
import Spinner from "../components/Spinner";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editProfilePicture, setEditProfilePicture] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const { auth, setAuth } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((prevUser) => ({
      ...prevUser!,
      [name]: value,
    }));
  };

  const toggleEditProfilePicture = () => {
    auth?.user?._id === userId && setEditProfilePicture((prev) => !prev);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await updateProfile(userId!, user!);
      toast.success(data.message);
      console.log(data.user);

      setAuth({ ...auth!, user: data.user });

      const authData = {
        access_token: auth?.access_token,
        token_type: auth?.token_type,
        user: data.user,
      };

      localStorage.setItem("auth", JSON.stringify(authData));

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await getUser(userId!);
        setUser({ ...data, password: "" });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <Layout title="Profile">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="bg-gray-300 min-h-screen">
          <section className="flex flex-col items-center justify-center">
            <div className="p-5 bg-gray-100 rounded-lg shadow-md mt-[5%]">
              <main className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold mb-4">Profile</h2>
                <div className="mb-4 relative flex flex-col justify-center items-center">
                  <img
                    src={user?.profilePic}
                    alt="Profile Picture"
                    className="w-24 h-24 rounded-full cursor-pointer mb-2"
                    onClick={toggleEditProfilePicture}
                  />
                  {editProfilePicture && (
                    <input
                      type="text"
                      className="opacity-1 border p-2 mb-2 rounded w-[100%]"
                      value={user?.profilePic}
                      name="profilePic"
                      onChange={handleChange}
                    />
                  )}
                </div>
                <input
                  type="text"
                  className="border p-2 mb-2 rounded w-[100%]"
                  placeholder="Username"
                  value={user?.username}
                  disabled={auth?.user?._id !== user?._id}
                  onChange={handleChange}
                  name="username"
                />
                <input
                  type="email"
                  className="border p-2 mb-2 rounded w-[100%]"
                  placeholder="Email"
                  value={user?.email}
                  disabled={auth?.user?._id !== user?._id}
                  onChange={handleChange}
                  name="email"
                />
                {auth?.user?._id === user?._id && (
                  <input
                    type="password"
                    className="border p-2 mb-2 rounded w-[100%]"
                    placeholder="Password"
                    value={user?.password}
                    onChange={handleChange}
                    name="password"
                  />
                )}
                <input
                  type="text"
                  className="border p-2 mb-2 rounded w-[100%]"
                  placeholder="Join in"
                  value={new Date(user?.createdAt!).toLocaleDateString()}
                  disabled
                />
              </main>
              {auth?.user?._id === user?._id && (
                <section className="flex flex-wrap gap-10 mt-4 items-center justify-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => navigate("/")}
                  >
                    Discard
                  </button>
                </section>
              )}
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
