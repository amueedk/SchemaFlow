import { FC } from "react";

import Heading, { headingProps } from "../../components/heading";
import Input from "../../components/input";
import Button from "../../components/button";


const LoginBox: FC = () => {


  return (
    <div className="flex items-center flex-col w-80 p-6 rounded-[1.125rem] bg-background-secondary/90 dark:bg-background-secondary-dark shadow-lg ">

      <Heading title="Login" style="medium" className='mb-6' />
      <Input placeHolder="username" style = 'login' className="mb-4" />
      <Input placeHolder="password" style = 'login' className="mb-5"/>

      <div className="flex w-full justify-end">
        <Button text="Login" style='primary' onClick={() :void => {}} className="mr-1 py-2 px-3"/>
      </div>

    </div>
  );
}

export default LoginBox;  