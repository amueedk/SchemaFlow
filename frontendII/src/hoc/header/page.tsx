import { PropsWithChildren, FC } from "react";
import Heading from "../../components/heading";
import Button, { buttonProps } from "../../components/button";


export interface headerProp {
  heading: string,
  pagePadding?: string 
  buttonProps?: Array<buttonProps>
}

const Header: FC<headerProp> = ({heading, buttonProps = []}) => {
  return (
    <>
      <div className="flex flex-row pt-4 px-4 justify-end w-full">
        {
          buttonProps.map((prop: buttonProps) => {
            return(<Button {...prop}/>)    
          })
        }
      
      </div>
      <div className={"w-full" + ' p-10' }>
        <Heading title={heading} style="large" className='ml-5' />   
      </div> 
    </>
  )
}

export default Header