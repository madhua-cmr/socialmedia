import { Link } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import { toast } from "react-toastify";
import userAtom from "../atoms/userAtom";

const SignupCard = () => {
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const setUser = useSetRecoilState(userAtom);
  const handleSignup = async (event) => {
    event.preventDefault();
    try {
        
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      
      const data = await res.json();
     
      if (data.error) {
        toast.error(data.error);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
     
        toast.success("User registered successfully");
    
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };
  const { colormode } = useContext(AppContext);
  const [showpassword, setShowPassword] = useState(false);
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  return (
    <section className="container flex flex-col items-center justify-center h-[550px]">
      <div
        className={`flex flex-col items-center ${
          colormode === "dark" ? "bg-[#30343f]" : "bg-white"
        } rounded p-8 justify-center gap-8 my-auto`}
      >
        <h2 className="font-semibold">Sign up</h2>
        <form action="" className="flex flex-col gap-4 items-center">
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-3">
              <h3>Full Name</h3>
              <input
                className={`rounded outline-none border-2 border-[#807d8055] p-2 ${
                  colormode === "dark" ? "bg-[#30343f]" : "bg-white"
                } w-[150px]`}
                type="text"
                placeholder="Fullname"
                value={inputs.name}
                onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              required/>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <h3>User Name</h3>
              <input
                className={`rounded outline-none border-2 border-[#807d8055] p-2 ${
                  colormode === "dark" ? "bg-[#30343f]" : "bg-white"
                } w-[150px]`}
                type="text"
                placeholder="username"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3>Email</h3>
            <input
              className={`rounded outline-none border-2 border-[#807d8055] p-2 ${
                colormode === "dark" ? "bg-[#30343f]" : "bg-white"
              } w-[300px]`}
              type="email"
              placeholder="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
           required />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <h3>Password</h3>
            <div className="flex justify-between items-center">
              <input
                className={`rounded outline-none border-2 border-[#807d8055] p-2 ${
                  colormode === "dark" ? "bg-[#30343f]" : "bg-white"
                } w-[280px]`}
                type={showpassword ? "text" : "password"}
                placeholder="password"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                required
              />
              <FaRegEyeSlash
                className="cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
          </div>
          <button
            className="bg-stone-900 hover:bg-slate-900 p-2 w-[300px] rounded text-white"
            onClick={handleSignup}
          >
            Sign up
          </button>
          <p>
            Already a user?{" "}
            <Link
              className="text-blue-600"
              onClick={() => setAuthScreenState("login")}
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupCard;
