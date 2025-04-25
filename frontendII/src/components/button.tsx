import { FC } from "react";

export interface buttonProps {
  text?: string
  icon?: string 
  style: "primary" | 'icon'
  className?: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void   

}

const styles: any = {
  primary : `w-min bg-button dark:bg-button-dark \ 
    text-primary dark:text-primary-dark text-sm rounded-lg py-2 px-3`, 
  icon : `text-sm tracking-wide w-min fas text-primary/70 hover:text-primary dark:text-primary-dark/70 dark:hover:text-primary-dark`
}

const Button: FC<buttonProps> = ({text = '', style, icon = '', onClick, className = ''}) => {
  
 
  return (
    <button className={styles[style] + ' ' +  icon + ' ' + className}
      onClick={(e: React.MouseEvent<HTMLElement>) => onClick(e)}  
    >
      {style !== "icon" && text}
    </button>
  )
}

export default Button; 