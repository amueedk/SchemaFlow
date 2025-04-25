import { FC } from "react";
import LoginBox from "../../hoc/loginBox/page";

const Login : FC = () => {
    return(
       <div className="w-screen h-screen bg-background-primary dark:bg-background-primary-dark 
       flex justify-center items-center">
        <LoginBox/>
       </div> 
    )
}  
export default Login; 
