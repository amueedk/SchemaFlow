import { listItemProps, listItemGlobalProps } from '../../components/listItem/interface'

export interface data {
  title: string
}

export const profileListGlobal: listItemGlobalProps<data> = {
  display: 'title',
}

export const profileList: Array<Partial<listItemProps<data>>> = [
  {
    data: {title: 'settings'}, 
    icon: 'gear'
  }, 
  {
    data: {title: 'logout'}, 
    className: {li: '!mb-0', text: 'text-tag-red dark:text-tag-red', icon: 'text-tag-red/50 dark:text-tag-red/100'}, 
    icon: 'sign-out-alt'
  }, 
  
] 