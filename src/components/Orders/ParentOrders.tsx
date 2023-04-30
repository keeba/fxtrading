import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { IParentOrder } from '../../model/interfaces'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'
import { OrdersCountContext } from '../../context'
import LocalModal from '../LocalModal'
import { addChildOrder, cancelOrder, getNewOrderID } from '../../model/operations'
import useTablePagination from '../../useTablePagination'
import { ParentOrders as DefaultParentOrders } from '../../model/data'
import OrderTabs from './Tabs'
import Box from '@mui/material/Box'

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
			backgroundColor: '#333',
			color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
			fontSize: 14,
	},
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
			border: 0,
	},
}))

const ParentOrders = () => {
	const ordersCountContext = React.useContext(OrdersCountContext)
	const [selectedPO, setSelectedPO] = React.useState<null | IParentOrder>(null)
	const [modalType, setModalType] = React.useState('')

	const [ParentOrders, setParentOrders] = React.useState(() => {
		let ParentOrdersString = localStorage.getItem('ParentOrders')
		if (!ParentOrdersString) {
			localStorage.setItem('ParentOrders', JSON.stringify(DefaultParentOrders))
			localStorage.setItem('ParentOrdersCount', DefaultParentOrders.length.toString())
			return DefaultParentOrders
		}
		return JSON.parse(ParentOrdersString)
	})

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>, PO: IParentOrder) => {setAnchorEl(event.currentTarget), setSelectedPO(PO) }
	const handleClose = () => setAnchorEl(null)

	const {page, visibleRows, paddingHeight, handleChangePage} = useTablePagination(ParentOrders)

	React.useEffect(()=> {
		if (ordersCountContext && ordersCountContext?.OrdersCount > 0) {
			let ParentOrdersString = localStorage.getItem('ParentOrders')
			if (ParentOrdersString)
				setParentOrders(JSON.parse(ParentOrdersString))
		}
	},[ordersCountContext?.OrdersCount])
	
	const handleOptionClick = (Type: string) => {
		if (Type == 'SO') 
				window.location.href = '/#/childorders/' + selectedPO?.OrderID
		else
				setModalType(Type)
		handleClose()
	}

	const handleModalClose = () => {
		setModalType('')
		setSelectedPO(null)
	}

	const  handleAddChildOrder = async (ParentOrderID: string, OrderID: string, Symbol: string, Price: number, Quantity: number, Side: string) => {
		const newParentOrders = await addChildOrder(ParentOrderID, OrderID, Symbol, Price, Quantity, Side)
		setParentOrders(newParentOrders)
		handleModalClose()
		window.location.href = '/#/childorders/' + ParentOrderID
	}

	const handleCancelOrder = async (OrderID:string) => {
		const newParentOrders = await cancelOrder(OrderID)
		setParentOrders(newParentOrders)
		handleModalClose()
	}

	return (
		<Box sx={{ width: '100%' }}>
			<OrderTabs tab={'parent'}/>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Order ID</StyledTableCell>
							<StyledTableCell>Symbol</StyledTableCell>
							<StyledTableCell>Price</StyledTableCell>
							<StyledTableCell>Quantity</StyledTableCell>
							<StyledTableCell>Side</StyledTableCell>
							<StyledTableCell>Order Status</StyledTableCell>
							<StyledTableCell>Actions</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{visibleRows ? visibleRows.map((PO) => (
							<StyledTableRow
								key={PO.OrderID + 'row'}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<StyledTableCell component="th" scope="row">{PO.OrderID}</StyledTableCell>
								<StyledTableCell>{PO.Symbol}</StyledTableCell>
								<StyledTableCell>{PO.Price}</StyledTableCell>
								<StyledTableCell>{PO.TradedQuantity} / {PO.Quantity}</StyledTableCell>
								<StyledTableCell>{PO.Side}</StyledTableCell>
								<StyledTableCell>{PO.OrderStatus}</StyledTableCell>
								<StyledTableCell>
									<IconButton
											aria-label="more"
											id="long-button"
											aria-controls={open ? 'long-menu' : undefined}
											aria-expanded={open ? 'true' : undefined}
											aria-haspopup="true"
											onClick={(e) => handleClick(e, PO)}
									>
											<MoreVertIcon />
									</IconButton>
								</StyledTableCell>
							</StyledTableRow>
						))
						: (
							<StyledTableRow style={{height: paddingHeight}}>
								<StyledTableCell colSpan={7}>
									No parent orders to show.
								</StyledTableCell>
							</StyledTableRow>
						)
						}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[8]}
				component="div"
				count={ParentOrders.length || 0}
				rowsPerPage={8}
				page={page}
				onPageChange={handleChangePage}
			/>
			<Menu
				id="long-menu"
				MenuListProps={{
				'aria-labelledby': 'long-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				PaperProps={{
						style: {
								maxHeight: '30ch',
								width: '20ch',
						},
				}}
			>
				{(selectedPO && selectedPO.OrderStatus != 'Rejected' && selectedPO.TradedQuantity < selectedPO.Quantity) && <MenuItem key={'EO'} onClick={() => handleOptionClick('EO')}>Execute Order</MenuItem>}
				<MenuItem key={'SO'} onClick={() => handleOptionClick('SO')}>Show Child Orders</MenuItem>
				{(selectedPO && (selectedPO.OrderStatus == 'Open' || selectedPO.OrderStatus == 'Rejected')) && <MenuItem key={'CO'} onClick={() => handleOptionClick('CO')}>Cancel Order</MenuItem>}
			</Menu>
			{
				modalType == 'EO' && 
				<LocalModal
					title={'Execute Order'}
					key={'ChildOrder' + selectedPO?.OrderID}
					details={
						{
							ParentOrderID: selectedPO?.OrderID,
							Symbol: selectedPO?.Symbol,
							Side: selectedPO?.Side,
							Quantity: selectedPO?.Quantity,
							Price: selectedPO?.Price,
							TradedQuantity: selectedPO?.TradedQuantity,
							OrderID: getNewOrderID('Child')
						}
					}
					open={true}
					handleClose={handleModalClose}
					handleSubmit={handleAddChildOrder}
				/>
			}
			{
				modalType == 'CO' && 
				<LocalModal
					title={'Cancel Order'}
					key={'CancelOrder' + selectedPO?.OrderID}
					details={selectedPO || {}}
					open={true}
					handleClose={handleModalClose}
					handleSubmit={handleCancelOrder}
				/>
			}
		</Box>
	)
}

export default ParentOrders