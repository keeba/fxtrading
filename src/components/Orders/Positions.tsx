import Box from '@mui/material/Box'
import { Positions as DefaultPositions } from '../../model/data'
import ViewOnlyTable from './ViewOnlyTable'
import OrderTabs from './Tabs'

const Postions = () => {
	const Positions = (() => {
		let PositionsString = localStorage.getItem('Positions')
		if (!PositionsString) {
			localStorage.setItem('ChildOrders', JSON.stringify(DefaultPositions))
			return DefaultPositions
		}
		return JSON.parse(PositionsString)
	})()

	return (
		<Box sx={{ width: '100%' }}>
			<OrderTabs tab={'position'} />
			<ViewOnlyTable key={'position'} type={'position'} data={Positions}/>
		</Box>
	)
}

export default Postions