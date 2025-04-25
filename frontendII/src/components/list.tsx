import { PropsWithChildren, FC } from "react";
import ListItem from './listItem/page'
import { listItemProps, listItemGlobalProps } from './listItem/interface'
import config from '../tailwindconfig.js'

export interface listProps<T> {
  listGlobal: listItemGlobalProps<T>
  list: Array<Partial<listItemProps<T>>>
  width?: string
  style?: 'default'
  className?: string
}

const styles = {
  default: 'list-none p-1'
}

const List: FC<listProps<any>> = ({ listGlobal, list, width = 'full', style = 'default', className }) => {
  return (
    <ul className={styles[style] + ' ' + className}
      style={{
        width: config.theme.width[width]
      }}
    >
      {
        list.map((currentListItemProps, index) => {
          const props: listItemProps<any> = {
            ...listGlobal,
            ...currentListItemProps,
            data: currentListItemProps.data,
            index: index,
          };

          return (<ListItem {...props} />);
        })

      }
    </ul>
  )
}

export default List