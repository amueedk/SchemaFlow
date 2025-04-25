import { FC } from "react"


export interface inputProps {
  placeHolder: string
  style: 'login'
  className?: string
}

const styles: any =  {
  login:  `w-full p-3 bg-transparent text-primary dark:text-primary-dark text-sm / 
  rounded-lg  border-[1px] border-primary/50 dark:border-primary-dark/30`, 
}
const Input: FC<inputProps> = ({ placeHolder, style, className = '' }: inputProps) => {

  return (
    <input className={styles[style] + ' ' + className} placeholder={placeHolder} type="text" />

  )
}
export default Input;  
