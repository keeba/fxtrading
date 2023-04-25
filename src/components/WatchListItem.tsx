import * as React from 'react'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography/Typography'
import { styled } from '@mui/material/styles'
import {ICurrencyPair} from '../model/interfaces'

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	color: 'theme.palette.text.secondary',
	border: '1px solid black'
}))

export const showCurrencyValues = ({basePrice, increment, noOfTicks, tickSize}:ICurrencyPair) => {
	const newPrice = basePrice + (noOfTicks * tickSize * (increment ? 1 : -1))
	const diff = newPrice - basePrice
	const percent = diff/basePrice*100
	return (
		<>
			<Grid item xs={12}><Typography variant='subtitle1'>{newPrice.toFixed(5)}</Typography></Grid>
			<Grid item xs={12}><Typography variant='subtitle2'>{diff.toFixed(3)} ({percent.toFixed(3)})</Typography></Grid>
		</>
	)
}

const WatchListItem: React.FC<{CurrencyPair:ICurrencyPair, handleOpen: Function}> = ({CurrencyPair, handleOpen}) => {
	const [showButton, setShowButton] = React.useState(false)

	return (
	<Item sx={{mt: 0.1, p: 2, minHeight: 50}} onMouseOver={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)}>
		<Grid container alignItems="center" direction="row">
			<Grid item xs={4}><Typography variant='subtitle1'>{CurrencyPair.name}</Typography></Grid>
			<Grid item xs={8}>
				<Grid container direction="column" alignItems="end" justifyContent="center">
					{showButton ? <Button sx={{mt: 1, mb: 1}} onClick={() => handleOpen(CurrencyPair)} variant="contained" color="primary">Add Order</Button> : showCurrencyValues({...CurrencyPair})}
				</Grid>
			</Grid>
		</Grid>
	</Item>)
}

export default WatchListItem