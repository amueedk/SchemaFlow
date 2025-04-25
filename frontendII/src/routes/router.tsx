import { createBrowserRouter, Navigate } from "react-router-dom"; 
import { loader as homeLoader } from "./home/loader";
import Login from "./login/page";
import Home from "./home/page";
import Db from "./db/page";

const router = createBrowserRouter([
    {
        path: '/', 
        element: <Navigate to='/login'/>
    }, 
    {
        path: '/login', 
        element: <Login/>
    }, 
    {
        path: '/home', 
        loader: homeLoader, 
        element: <Home/>
    }, 
    {
        path: '/db/:db_id', 
        element: <Db/>
    }
    
])

export default router; 