import Box from '@mui/material/Box'
import {  IChildOrder } from '../../model/interfaces'
import { ChildOrders as DefaultChildOrders } from '../../model/data'
import ViewOnlyTable from './ViewOnlyTable'
import { useParams} from 'react-router-dom'
import OrderTabs from './Tabs'

const ChildOrders = () => {
	let ChildOrders = (() => {
		let ChildOrdersString = localStorage.getItem('ChildOrders')
		if (!ChildOrdersString) {
			localStorage.setItem('ChildOrders', JSON.stringify(DefaultChildOrders))
			localStorage.setItem('ChildOrdersCount', DefaultChildOrders.length.toString())
			return DefaultChildOrders
		}
		return JSON.parse(ChildOrdersString)
	})()

    let { id } = useParams()
	ChildOrders = (id == 'all' ? ChildOrders : ChildOrders.filter((CO: IChildOrder) =>  CO.ParentOrderID == id))
	
	return (
		<Box sx={{ width: '100%' }}>
			<OrderTabs tab={'child'} />
			<ViewOnlyTable key={'child'} type={'child'} data={ChildOrders}/>
		</Box>
	)
}

export default ChildOrders