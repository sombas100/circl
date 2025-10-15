import { useEffect, useState } from "react";
import AuthButton from "../../components/ui/AuthButton";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../app/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/circl-logo.png";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, error, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex flex-col items-center justify-center max-w-[50rem] h-screen mx-auto">
        <div className="flex flex-col items-center justify-center mb-10">
          <img className="mb-4" src={logo} alt="circle logo" />
          <p className="font-bold">Welcome back</p>
        </div>
        <form
          className="flex flex-col items-center justify-center space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-start">
            <label className="pr-3 font-semibold" htmlFor="">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-lg w-96"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col items-start">
            <label className="pr-3 font-semibold" htmlFor="">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded-lg w-96"
              type="password"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <AuthButton
            disabled={loading}
            className="bg-zinc-900 w-full text-center font-semibold text-white py-3 px-4 rounded-3xl hover:bg-gray-500 transition-all ease-in cursor-pointer"
          >
            {loading ? "Logging in..." : "Continue"}
          </AuthButton>
          <p className="text-sm">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
          <p className="text-xs">
            Don't have an account?{" "}
            <span className="text-sky-500 hover:text-sky-700 transition-all ease-in-out cursor-pointer">
              <Link to={"/register"}>Sign up</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
