import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import Paper from '@mui/material/Paper'
import {StyledTableCell, StyledTableRow } from './ParentOrders'
import useTablePagination from '../../useTablePagination'

const ViewOnlyTable: React.FC<{data: any[], type: string}> = ({data, type}) => {
	const {page, visibleRows, paddingHeight, handleChangePage} = useTablePagination(data || [])
	let hColumns: {[key: string]: string} = {}
	if (type == 'child') {
		hColumns = {
			'OrderID' : 'Order ID',
			'ParentOrderID' : 'Parent Order ID',
			'Symbol' : 'Symbol',
			'Price' : 'Price',
			'Quantity' : 'Quantity',
			'Side' : 'Side',
			'OrderStatus' : 'Order Status'
		}
	}
	else if (type == 'position') {
		hColumns = {
			Symbol : 'Symbol',
			NetQuantity : 'Net Quantity',
			AvgPrice: 'Average Price'
		}
	}

	return (
		<>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							{Object.values(hColumns).map((colLabel) => <StyledTableCell key={type + colLabel}>{colLabel}</StyledTableCell>)}
						</TableRow>
					</TableHead>
					<TableBody>
						{visibleRows && visibleRows.length > 0 ? visibleRows.map((d:any) => (
							<StyledTableRow
								key={(type + (type == 'child' ? d.OrderID : d.Symbol)) + 'row'}
								data-key={(type + (type == 'child' ? d.OrderID : d.Symbol)) + 'row'}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								{Object.keys(hColumns).map((col) => 
									<StyledTableCell key={(type + (type == 'child' ? d.OrderID : d.Symbol)) + col}>
										{d[col]}
									</StyledTableCell>)}
							</StyledTableRow>
						)) : 
							(<StyledTableRow style={{height: paddingHeight}}>
								<StyledTableCell colSpan={Object.keys(hColumns).length}>
									No {type == 'child' ? 'child orders' : 'postions'} to show.
								</StyledTableCell>
							</StyledTableRow>)
						}
						{paddingHeight > 0 && (
							<StyledTableRow style={{height: paddingHeight}}>
								<StyledTableCell colSpan={Object.keys(hColumns).length} />
							</StyledTableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[8]}
				component="div"
				count={data.length}
				rowsPerPage={8}
				page={page}
				onPageChange={handleChangePage}
			/>
		</>
	)
}

export default ViewOnlyTable