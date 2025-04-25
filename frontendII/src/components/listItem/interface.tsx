export interface listItemGlobalProps<T>{
	display: string
	contextButton?: boolean
	
	style?: 'default'
	iconStyle?: 'default'
	className?: { li?: string, text?: string, icon?: string, contextButton?: string }
	
	onClick?: (e: React.MouseEvent<HTMLElement>, data: T, selected: boolean, index: number) => void
	onIconClick?: (e: React.MouseEvent<HTMLElement>, data: T, selected: boolean, index: number) => void
	onContextButtonClick?: (e: React.MouseEvent<HTMLElement>, data: T, selected: boolean, index: number) => void
	
}

export interface listItemProps<T> extends listItemGlobalProps<T> {
	data: T
	index: number

	icon?: string | null
	selected?: boolean
	taggedColor?: string
	className?: { li?: string, text?: string, icon?: string, contextButton?: string }
  
	onClick?: (e: React.MouseEvent<HTMLElement>, data: T, selected: boolean, index: number) => void
	onIconClick?: (e: React.MouseEvent<HTMLElement>, data: T, selected: boolean, index: number) => void
	onContextButtonClick?: (e: React.MouseEvent<HTMLElement>, data: T, selected: boolean, index: number) => void
}