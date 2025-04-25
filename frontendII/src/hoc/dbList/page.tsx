import { FC, PropsWithChildren } from "react";
import config from '../../tailwindconfig'
import databaseInterface from "../../interface/database";
import Card from "../../components/card";
import Db from "../../routes/db/page";
import { Navigate, useNavigate } from "react-router-dom";


interface dbListProps {
  databases: Array<databaseInterface>,
  marginLeft?: string,
  minWidth?: string,
  className?: string

}

const DbList: FC<dbListProps> = ({
  databases,
  marginLeft = '3',
  minWidth = '10',

}) => {

  const navigate = useNavigate(); 
  const num: number = 5;

  const renderArray = Array.from({length: databases.length % num + 1}, (_, index ) => index * num);  
  const onClick = (e: React.MouseEvent<HTMLElement>, data: databaseInterface) => {
    navigate(`/db/${data.id}`); 
  }
  return (
    <div className={'p-12 h-min w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '+ String(num) + ' gap-4' }>

      {
        databases.map(db => {
          return <Card data={db} title='name' width='full' description='description' onClick={onClick} />
        })
      }
    </div >
  );
}

export default DbList;  