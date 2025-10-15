import { useEffect, useState } from "react";
import AuthButton from "../../components/ui/AuthButton";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { register } from "../../app/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../public/circl-logo.png";

type FieldErrors = Partial<Record<"name" | "email" | "password", string[]>>;

export default function Register() {
  const {
    user,
    error: globalError,
    loading,
  } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!name || !email || !password) return;

    try {
      await dispatch(
        register({
          name,
          email,
          password,
        })
      ).unwrap();

      navigate("/");
    } catch (err: any) {
      if (err && typeof err === "object" && err.errors) {
        setFieldErrors(err.errors as FieldErrors);
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex flex-col items-center justify-center max-w-[50rem] h-screen mx-auto">
        <div className="flex flex-col items-center justify-center mb-10">
          <img className="mb-4 " src={logo} alt="Circl logo" />
          <p className="font-bold">Create your account</p>
        </div>

        <form
          className="flex flex-col items-center justify-center space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex flex-col items-start w-96">
            <label className="pr-3 font-semibold" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded-lg w-full"
              type="text"
              autoComplete="name"
              required
            />
            {fieldErrors.name && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="flex flex-col items-start w-96">
            <label className="pr-3 font-semibold" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-lg w-full"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start w-96">
            <label className="pr-3 font-semibold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded-lg w-full"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              required
              minLength={6} // mirrors backend rule
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {/* Global error fallback */}
          {globalError && (
            <p className="text-red-600 text-sm w-96 text-left">{globalError}</p>
          )}

          <AuthButton
            disabled={loading || !name || !email || !password}
            className="bg-zinc-900 w-full text-center font-semibold text-white py-3 px-4 rounded-3xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all ease-in"
          >
            {loading ? "Creating account…" : "Register"}
          </AuthButton>

          <p className="text-sm">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
          <p className="text-xs">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-500 hover:text-sky-700 transition-all ease-in-out"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
