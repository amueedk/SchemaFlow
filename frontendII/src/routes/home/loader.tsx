import databaseInterface from "../../interface/database" 
import database from '../../tempData/databases.json'
// import fs from 'fs'

export interface loaderInterface {
  databases: Array<databaseInterface>
}

export const loader = () => {  
  // const database:loaderInterface = JSON.parse(fs.readFileSync('../../tempData/database.json', 'utf-8'))  
  return database; 
}