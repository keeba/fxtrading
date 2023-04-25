import Typography  from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import WatchListItem from './WatchListItem'
import React, { useEffect, useState } from 'react'
import { addParentOrder, getNewOrderID, refreshCurrencyPairs } from '../model/operations'
import { ICurrencyPair } from '../model/interfaces'
import LocalModal from './LocalModal'
import { CurrencyPairs as DefaultCurrencyPairs } from '../model/data'

const WatchList: React.FC<{setOrdersCount: Function}> = ({setOrdersCount}) => {
	const [CurrencyPairs, setCurrencyPairs] = useState<ICurrencyPair[]>(() => {
		let CurrencyPairsString = localStorage.getItem('CurrencyPairs')
		if (!CurrencyPairsString) {
		  localStorage.setItem('CurrencyPairs', JSON.stringify(DefaultCurrencyPairs))
		  return DefaultCurrencyPairs
		}
		return JSON.parse(CurrencyPairsString)
	})
	const [open, setOpen] = useState(false)
	const [selectedCP, setSelectedCP] = useState<ICurrencyPair|null>(null)

	const handleOpen = (CP:ICurrencyPair) => { setOpen(true), setSelectedCP(CP) }
	const handleClose = () => { setOpen(false), setSelectedCP(null) }

	const  handleAddParentOrder = async (OrderID: string, Symbol: string, Price: number, Quantity: number, Side: string) => {
		await addParentOrder(selectedCP?.basePrice || 0, OrderID, Symbol, Price, Quantity, Side)
		setOrdersCount((oc:number) => oc + 1)
		handleClose()
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrencyPairs((lCP:ICurrencyPair[]) => refreshCurrencyPairs(lCP))
		}, 1000);
		return () => clearInterval(interval);
	}, [])

	return (
		<>
			<Box sx={{ml:1.5, mr:4.5}}>
				<Typography variant="h6" sx={{textAlign: "center", pb:2.5, pt: 2}}>WATCH LIST</Typography>
				<Stack spacing={0} sx={{pl:2}}>
					{CurrencyPairs.map(CP => <WatchListItem key={CP.name} CurrencyPair={CP} handleOpen={handleOpen}/>)}
				</Stack>
			</Box>
			<LocalModal
				title={'Add Order'}
				key={selectedCP?.name + 'NewOrder'}
				details={
					{
						Symbol: selectedCP?.name,
						Side: '',
						OrderID: getNewOrderID('Parent')
					}
				}
				open={open}
				handleClose={handleClose}
				handleSubmit={handleAddParentOrder}
			/>
		</>
	)
}

export default WatchList