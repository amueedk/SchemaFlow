import { FC } from "react";
import List , {listProps} from '../../components/list'
import ListItem from '../../components/listItem/page'
import {listItemGlobalProps, listItemProps} from  '../../components/listItem/interface'
import {data, profileListGlobal, profileList} from './util'

const list: listProps<data> = {
  listGlobal: profileListGlobal, 
  list: profileList, 
  className: 'p-3'
} 


const Profile: FC = () => {
  return (
    <div className="w-32 h-min">
      <List {...list} />
    </div>
  );
}

export default Profile;  