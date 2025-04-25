import { FC } from "react";

const styles: any = {
  small: 'w-min text-primary text-center font-bold tracking-wide dark:text-primary-dark text-1xl ', 
  medium: 'w-min text-primary text-center font-bold tracking-wide dark:text-primary-dark text-2xl ', 
  large: 'w-min text-primary text-center font-bold dark:text-primary-dark text-4xl ', 
}

export interface headingProps {
  title: string,
  style: "small" | "medium" | "large",
  className?: string
}

const Heading: FC<headingProps> = ({ title, style, className = '' }: headingProps) => {

  return (
      <p className={styles[style] + ' ' +  className}>
        {title}
      </p>
  );
}
export default Heading; 