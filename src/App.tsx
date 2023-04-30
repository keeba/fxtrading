import {useState} from 'react'
import {Route, Routes} from 'react-router-dom'
import FXAppBar from "./components/FXAppBar"
import WatchList from "./components/WatchList"
import ParentOrders from "./components/Orders/ParentOrders"
import Grid from '@mui/material/Grid'
import { OrdersCountContext } from './context'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ChildOrders from './components/Orders/ChildOrders'
import Positions from './components/Orders/Positions'

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#000'
		},
		secondary: {
			main: '#111'
		}
	},
})

const Home = () => {
	const [OrdersCount, setOrdersCount] = useState(0)

	return (
		<ThemeProvider theme={lightTheme}>
			<FXAppBar />
			<OrdersCountContext.Provider value={{OrdersCount}}>
					<Grid container spacing={1} sx={{mt:0.1}}>
						<Grid item xs={3}>
							<WatchList setOrdersCount={setOrdersCount} />
						</Grid>
						<Grid item xs={8}>
							<Routes>
								<Route path='/parentorders' element={<ParentOrders />} />
								<Route path='/childorders/:id' element={<ChildOrders />} />
								<Route path='/positions' element={<Positions />} />
								<Route path="*" element={<ParentOrders />} />
							</Routes>
						</Grid>
					</Grid>
			</OrdersCountContext.Provider>
		</ThemeProvider>
	)
}

export default Home