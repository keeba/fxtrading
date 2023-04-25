import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import ParentOrdersTable from './ParentOrdersTable'
import { IParentOrder, IChildOrder, IPosition } from '../model/interfaces'
import { ParentOrders as DefaultParentOrders, ChildOrders as DefaultChildOrders, Positions as DefaultPositions } from '../model/data'
import ViewOnlyTable from './ViewOnlyTable'
import {useLocation, useParams} from 'react-router-dom'

const Orders = () => {
	const [ParentOrders, setParentOrders] = React.useState<IParentOrder[]>(() => {
		let ParentOrdersString = localStorage.getItem('ParentOrders')
		if (!ParentOrdersString) {
			localStorage.setItem('ParentOrders', JSON.stringify(DefaultParentOrders))
			localStorage.setItem('ParentOrdersCount', DefaultParentOrders.length.toString())
			return DefaultParentOrders
		}
		return JSON.parse(ParentOrdersString)
	})
	const [ChildOrders, setChildOrders] = React.useState<IChildOrder[]>(() => {
		let ChildOrdersString = localStorage.getItem('ChildOrders')
		if (!ChildOrdersString) {
			localStorage.setItem('ChildOrders', JSON.stringify(DefaultChildOrders))
			localStorage.setItem('ChildOrdersCount', DefaultChildOrders.length.toString())
			return DefaultChildOrders
		}
		return JSON.parse(ChildOrdersString)
	})
	const [Positions, setPositions] = React.useState<IPosition[]>(() => {
		let PositionsString = localStorage.getItem('Positions')
		if (!PositionsString) {
		localStorage.setItem('Positions', JSON.stringify(DefaultPositions))
		return DefaultPositions
		}
		return JSON.parse(PositionsString)
	})
	const [data, setData] = React.useState<any[]>([])
	const [tab, setTab] = React.useState('parent') 

	const location = useLocation()
	let { id } = useParams()
	React.useEffect(() => {
		if (location.pathname.match('childorders')) {
			setTab('child')
			setData(id == 'all' ? ChildOrders : ChildOrders.filter((CO) =>  CO.ParentOrderID == id))
		}
		else if (location.pathname.match('positions')) {
			setTab('position')
			setData(Positions)
		}
		else {
			setTab('parent')
			setData(ParentOrders)
		}
	}, [location])

	const handleChange = (e: React.SyntheticEvent, newValue: string) => {
		console.log(e.target)
		if (newValue == 'parent')
			window.location.href = '/#/parentorders'
		else if (newValue == 'child')
			window.location.href = '/#/childorders/all'
		else if (newValue == 'position')
			window.location.href = '/#/positions'
	}

	return (
		<Box sx={{ width: '100%' }}>
			<Tabs
				value={tab}
				onChange={handleChange}
				textColor="secondary"
				indicatorColor="secondary"
				aria-label="secondary tabs example"
				sx={{pb:2}}
			>
				<Tab value="parent" label="Parent Orders" />
				<Tab value="child" label="Child Orders" />
				<Tab value="position" label="Positions" />
			</Tabs>
			{
				tab == 'parent' && 
				<ParentOrdersTable
				ParentOrders={ParentOrders}
				setParentOrders={setParentOrders}
				setChildOrders={setChildOrders}
				setPositions={setPositions}
				/>
			}
			{(tab == 'child' || tab == 'position') && <ViewOnlyTable key={tab} type={tab} data={data}/>}
		</Box>
	)
}

export default Orders