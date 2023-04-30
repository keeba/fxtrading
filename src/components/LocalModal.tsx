import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography  from '@mui/material/Typography'
import * as React from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormLabel  from '@mui/material/FormLabel'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { showCurrencyValues } from './WatchListItem'
import { ICurrencyPair } from '../model/interfaces'

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 245,
	bgcolor: 'background.paper',
	border: '2px solid #444',
	boxShadow: 24,
	p: 4,
	pt: 2,
}

const LocalModal: React.FC<{open: boolean, handleClose: any, title: string, details: any, handleSubmit: Function}> = ({title, open, handleClose, details, handleSubmit}) => {
	const [Side, setSide] = React.useState(details.Side)
	const [Price, setPrice] = React.useState<number>()
	const [Quantity, setQuantity] = React.useState<number>()
	const [CurrencyDetails, setCurrencyDetails] = React.useState<ICurrencyPair|null>(null)

	React.useEffect(() => {
		if (title != 'Cancel Order' ) {
			const interval = setInterval(() => {
				const CurrencyPairsString = localStorage.getItem('CurrencyPairs')
				if (CurrencyPairsString) {
					const CurrencyPairs = JSON.parse(CurrencyPairsString)
					const newCD = CurrencyPairs.filter((CP: ICurrencyPair) => CP.name == details.Symbol)[0]
					setCurrencyDetails(newCD)
				}
			}, 1000)
			return () => clearInterval(interval)
		}
	}, [])
	let executePrice: number = details.Price
	if (title == 'Execute Order' && CurrencyDetails) {
		let {basePrice, noOfTicks, tickSize, increment} = CurrencyDetails
		executePrice = parseFloat((basePrice + (noOfTicks * tickSize * (increment ? 1 : -1))).toFixed(5))
	}

	const handleSide = (e: React.ChangeEvent<HTMLInputElement>) => setSide(e.target.checked ? e.target.value : '')
	
	const showPrice = () => {
		return(
			<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5, minHeight: 50 }}>
				<FormLabel>{details.Symbol}</FormLabel>
				<Typography component='div' textAlign={'right'}>{CurrencyDetails && showCurrencyValues(CurrencyDetails)}</Typography>
			</FormGroup>
		)
	}

	const ShowQuantityError = () => {
		if (Quantity) {
			if (title == 'Execute Order' && Quantity > (details.Quantity - details.TradedQuantity))
				return true
			return false
		}
		return true
	}

	console.log(Quantity + title)
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			 <Box
				component="form"
				sx={style}
				noValidate
				autoComplete="off"
			>
				<Typography variant="h6" sx={{mb:2, fontWeight: 1000}}>{title}</Typography>
				<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5 }}>
					<FormLabel>Order ID</FormLabel>
					<Typography variant="subtitle1">{details.OrderID}</Typography>
				</FormGroup>
				{title != 'Cancel Order' &&
					<>
						{showPrice()}
						<FormGroup row sx={{justifyContent: 'center', mt: 1}}>
							<FormControlLabel 
								control={
									<Checkbox
										value='BUY'
										checked={Side == 'BUY' ? true : false}
										onChange={(e) => handleSide(e)}
										required={Side ? false : true}
										disabled={title == 'Execute Order' ? true : false}
									/>
								}
								label="Buy"
								labelPlacement="start"
							/>
							<FormControlLabel
								control={
									<Checkbox
										value='SELL'
										checked={Side == 'SELL' ? true : false}
										onChange={(e) => handleSide(e)}
										required={Side ? false : true}
										disabled={title == 'Execute Order' ? true : false}
									/>
								}
								label="Sell"
								sx={{ml:2}}
							/>
						</FormGroup>
						{title == 'Add Order' && <TextField 
							error={Price ? false : true}
							value={Price}
							onChange={(e) => setPrice(parseFloat(e.target.value))}
							type="number"
							label="Price"
							size="small"
							variant="outlined"
							sx={{mt:2.5}}
							InputProps={{ inputProps: { min: 0 } }}
						/>}
						{title == 'Execute Order' && <TextField 
							value={executePrice}
							type="number"
							label="Price"
							size="small"
							variant="outlined"
							sx={{mt:2.5}}
							disabled
						/>}
						<TextField
							error={ShowQuantityError()}
							value={Quantity}
							onChange={(e) => setQuantity(parseInt(e.target.value))}
							type="number"
							label="Quantity"
							size="small"
							variant="outlined"
							sx={{mt:2.5}}
							InputProps={{ inputProps: { min: 1 }}}
						/>
					</>
				}
				{title == 'Cancel Order' &&
					<>
						<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5 }}>
							<FormLabel>Symbol</FormLabel>
							<Typography variant="subtitle1">{details.Symbol}</Typography>
						</FormGroup>
						<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5 }}>
							<FormLabel>Price</FormLabel>
							<Typography variant="subtitle1">{details.Price}</Typography>
						</FormGroup>
						<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5 }}>
							<FormLabel>Side</FormLabel>
							<Typography variant="subtitle1">{details.Side}</Typography>
						</FormGroup>
						<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5 }}>
							<FormLabel>Filled Quantity</FormLabel>
							<Typography variant="subtitle1">{details.TradedQuantity}</Typography>
						</FormGroup>
						<FormGroup row sx={{justifyContent: 'space-between', mt: 1.5 }}>
							<FormLabel>Quantity</FormLabel>
							<Typography variant="subtitle1">{details.Quantity}</Typography>
						</FormGroup>
					</>
				}
				<Stack spacing={2} direction="row" sx={{mt: 2}}>
					{title == 'Add Order' && 
						<Button
							variant="contained"
							onClick={() => handleSubmit(details.OrderID, details.Symbol, Price, Quantity, Side)}
							disabled={(Price && Price > 0 && !ShowQuantityError() && Side) ? false : true}
						>
							Add
						</Button>}
					{title == 'Execute Order' &&
						<Button
							variant="contained"
							onClick={() => handleSubmit(details.ParentOrderID, details.OrderID, details.Symbol, executePrice, Quantity, Side)}
							disabled={(executePrice && executePrice > 0 && !ShowQuantityError()) ? false : true}
						>
							Submit
						</Button>}
					{title == 'Cancel Order' && <Button variant="contained" onClick={() => handleSubmit(details.OrderID)}>Confirm</Button>}
					<Button onClick={handleClose} variant="outlined">Cancel</Button>
				</Stack>
			</Box>
		</Modal>
	)
}

export default LocalModal