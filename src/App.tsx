import {useState} from 'react'
import {Route, Routes} from 'react-router-dom'
import FXAppBar from "./components/FXAppBar"
import WatchList from "./components/WatchList"
import Orders from "./components/Orders"
import Grid from '@mui/material/Grid'
import { OrdersCountContext } from './context'
import { ThemeProvider, createTheme } from '@mui/material/styles'

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
								<Route path='/parentorders' element={<Orders />} />
								<Route path='/childorders/:id' element={<Orders />} />
								<Route path='/positions' element={<Orders />} />
								<Route path="*" element={<Orders />} />
							</Routes>
						</Grid>
					</Grid>
			</OrdersCountContext.Provider>
		</ThemeProvider>
	)
}

export default Home