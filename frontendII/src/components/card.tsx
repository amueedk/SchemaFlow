import { FC, useEffect, useRef, useState } from "react";
import { listProps } from "./list";
import config from '../tailwindconfig'
import Heading from "./heading";
import useOverflowDetection from "../hooks/useOverflowDetection";

const styles: any = {
  default: {
    box: 'group p-4 pt-3 border-primary/50 bg-background-secondary/85 dark:bg-transparent dark:border-primary-dark/50 border-[1px] rounded-lg cursor-default',
    description: 'text-sm text-secondary mt-1 '
  }

}


export interface cardProps<T> {
  data: T
  title: string
  width?: string
  height?: string
  style?: 'default'
  description?: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>, data: T) => void
}

const Card: FC<cardProps<any>> = (
  {
    data, 
    title,
    width = '32',
    height = '36',
    style = 'default',
    description = null,
    className = '', 
    onClick = null
  }
) => {

  const {overflow, box}= useOverflowDetection(); 

  return (
    <div className={
        styles[style].box + ' ' 
        +(onClick && 'border-primary/20 dark:border-primary-dark/30 \
           hover:border-primary hover:bg-background-secondary hover:dark:bg-transparent hover:dark:border-primary-dark cursor-pointer ')
        +className
      }
      style={{
        width: config.theme.width[width],
        maxHeight: config.theme.height[height],
      }}
      onClick={(e) => onClick && onClick(e, data)}
    >
      
      <div className=" relative max-h-full overflow-hidden" ref={box}>
        <Heading title={data[title]} style="small" />
        {
          description &&
          <p className={styles[style].description}
            style={{
            }}
          >
            {data[description]}
          </p>
        }
        
        {
          overflow && 
          <div className="absolute  w-full h-1/3 left-0 bottom-0 z-10 
            bg-gradient-to-t dark:bg-gradient-to-t from-background-secondary
            dark:from-background-primary-dark group-hover:dark:from-bg-background-secondary-dark/50
            from-5% to-transparent dark:to-transparent">
          </div>
        }

      </div>

    </div>
  );
}
export default Card; 