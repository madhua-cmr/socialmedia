import { useContext, useEffect, useState } from "react";
import lightlogo from "../assets/1.svg";
import darklogo from "../assets/2.png";
import { AppContext } from "../context/AppContext";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { FaHome } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import useLogout from "../hooks/useLogout";
import { IoMdSettings } from "react-icons/io";
import authScreenAtom from "../atoms/authAtom";
const Header = () => {
  const { handleLogout } = useLogout();
  const user = useRecoilValue(userAtom);
  const setAuthScreenState = useSetRecoilState(authScreenAtom);
  const { colormode, toggleColorMode } = useContext(AppContext);
  const [logo, setLogo] = useState(lightlogo);
  useEffect(() => {
    
    setLogo(colormode === "dark" ? darklogo : lightlogo);
  }, [colormode]);
  return (
    <section className="container flex  items-center  relative text-[22px] p-2 justify-between mt-6 mb-12">
      {user && (
        <Link to="/">
          
          <FaHome />
        </Link>
      )}
      {!user && (
        <Link
          to="/auth"
          className="text-[17px]  "
          onClick={() =>setAuthScreenState("login")}
        >
          
          Login
        </Link>
      )}
      <img
        src={logo}
        alt="logo"
        className="cursor-pointer  w-12"
        onClick={() => toggleColorMode()}
      />

      {user?.name ? (
        <>
        
          <Link to={`/getprofile/${user?.username}`}>
            <FaRegUserCircle className="mr-4" />
          </Link>
         <Link to={`/chat`}><IoChatbubbleEllipses  /></Link> 
        <Link to={`/settings`}> <IoMdSettings/></Link>
          <div>
            <button>
              <TbLogout
                className="text-2xl absolute top-5 right-5 cursor-pointer  "
                onClick={handleLogout}
              />
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      {!user && (
        <Link
          to={"/auth"}
          onClick={()=>setAuthScreenState("signup")}
          className="text-[17px]"
        >
         
          Sign up
        </Link>
      )}
    </section>
  );
};

export default Header;
