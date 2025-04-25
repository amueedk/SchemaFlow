import { FC, useEffect, useState } from "react";
import Header from "../../hoc/header/page";
import { buttons, handleCloseEsc, handleCloseClick} from "./util.tsx";
import FloatingDiv, { floatingDivProps } from "../../hoc/floatingDiv/page";
import { floatingDivStack } from "../floatingDivStack";
import { useLoaderData } from "react-router-dom";
import {loaderInterface} from '../../routes/home/loader.tsx'
import DbList from "../../hoc/dbList/page.tsx";

const Home: FC = () => {

  const [stack, setStack] = useState<floatingDivStack>({}) 
  const loaderData = useLoaderData() as loaderInterface



  useEffect(() => {
    document.addEventListener('mousedown', (e:MouseEvent) => handleCloseClick(e, setStack))
    document.addEventListener('keydown', (e:KeyboardEvent) => handleCloseEsc(e, setStack))

    return () => {
      document.removeEventListener('mousedown', (e:MouseEvent) => handleCloseClick(e, setStack))
      document.removeEventListener('keydown', (e:KeyboardEvent) => handleCloseEsc(e, setStack))
    }
  }, [])

  return (
    <>

      <div className="relative bg-background-primary dark:bg-background-primary-dark w-screen h-screen" 
        >
        {
          Object.keys(stack).map((key) => stack[key])
        }  

        <Header heading={`Home`} pagePadding="10" buttonProps={buttons(stack, setStack)} />
        <DbList databases={loaderData.databases}/>

      </div>
    </>
  )
}
export default Home; 
