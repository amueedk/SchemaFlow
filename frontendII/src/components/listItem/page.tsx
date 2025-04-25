import { PropsWithChildren, FC } from "react";
import {listItemProps, listItemGlobalProps} from './interface'


const styles: any = {
	default: {
		li: 'flex flex-row items-center w-full mb-2' , 
		text: 'text-sm text-primary dark:text-primary-dark font-semibold -mt-[4px]', 

		icon: 'text-xs text-primary/50 dark:text-primary-dark/50 mr-2 ',
		contextButton: ''
	}
}

const ListItem: FC<PropsWithChildren<listItemProps<any>>> = ({
	data,
	display,
	index,
	selected = false,
	icon = null,
	taggedColor = '',

	contextButton = false,
	style = 'default',
	className = { li: '', text: '', icon: '', contextButton: '' },

	onClick = undefined,
	onIconClick = undefined,
	onContextButtonClick = undefined,

}) => {

	className = {
		li : styles[style].li + ' ' + (className.li !== undefined ? className.li : '') , 
		icon: 'fas fa-' + icon + ' ' + styles[style].icon + ' ' + (onIconClick && 'hover:text-primary  dark:hover:text-primary-dark') +  (className.icon !== undefined ? className.icon : ''), 
		text: styles[style].text  + ' bg-tag-' + taggedColor+ ' ' + (className.text !== undefined ? className.text: ''), 
		contextButton: 'fas fa-eplipses-v'

	}

	return (
		<li 
			className={className.li} 
			onClick={(e) => onClick && onClick(e, data, selected, index)}
			style={{
				cursor: (onClick ? 'pointer' : 'default')
			}}		
		>
			{
				icon &&
				<i 
					className={className.icon} 
					onClick={(e) => onIconClick && onIconClick(e, data, selected, index)}
				/>
			}

			<p className={className.text}>
				{data[display]}
			</p>


			{
				contextButton &&
				<div className='w-full flex flex-col items-center justify-end'>
					<button className={className.contextButton}
						onClick={(e) => onContextButtonClick && onContextButtonClick(e, data, selected, index)} />
				</div>
			}


		</li>
	);
}



export default ListItem; 