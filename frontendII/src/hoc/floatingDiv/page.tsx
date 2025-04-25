import { FC , PropsWithChildren} from "react";
import config from '../../tailwindconfig'

export interface floatingDivProps {
  width?: string,   
  height?: string, 
  padding?: string, 
  pos: {x: number, y: number}
  classname?: string

}

const FloatingDiv: FC<PropsWithChildren<floatingDivProps>> = ({
    pos, 
    width = 'min', 
    height = 'min', 
    padding = '2', 
    children
  }) => {

    return (
      <div className={
        `floating-div absolute z-10 bg-background-secondary dark:bg-background-secondary-dark shadow-md `  
        // + `top-[${String(pos.y)}px] left-[${String(pos.x)}px] p-${padding} border-${padding} w-${width} h-${height}` 
      }

      style={{
        width:config.theme.width[width], 
        height: config.theme.width[height], 
        top: pos.y, 
        left: pos.x, 
        padding: config.theme.padding[padding],  
        borderRadius: config.theme.padding[padding], 
      }}
      >
        {children} 

      </div>
    );
}

export default FloatingDiv;  