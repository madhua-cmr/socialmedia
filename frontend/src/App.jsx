import {Routes,Route, Navigate} from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"

import{ToastContainer} from "react-toastify"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import { useRecoilValue } from "recoil"
import userAtom from "./atoms/userAtom"

import UpdateProfilePage from "./pages/UpdateProfilePage"
import CreatePost from "./components/CreatePost"
import ChatPage from "./pages/ChatPage"
import SettingsPage from "./pages/SettingsPage"


function App() {
 const user=useRecoilValue(userAtom)||null;


  return (
 <> 
<ToastContainer/>

   
<Header/>

<Routes>
  <Route path="/" element={user?.name?<HomePage/>:<Navigate to="/auth"/>}/>
  <Route path="/auth" element={!user?.name?<AuthPage/>:<Navigate to="/"/>}/>
  <Route path="/update" element={user?.name?< UpdateProfilePage/>:<Navigate to="/auth"/>}/>

<Route path="/getprofile/:username" element={user?(<> <UserPage/>
<CreatePost/> </>):(<UserPage/>)}/>
<Route path="/:username/post/:pid" element={<PostPage/>}/>


<Route path="/chat" element={user?<ChatPage/>:<Navigate to={"/auth"}/>}/>
<Route path="/settings" element={user?<SettingsPage/>:<Navigate to={"/auth"}/>}/>
</Routes>   

</>
  )
}

export default App
