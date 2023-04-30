import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

const OrderTabs: React.FC<{tab: string}> = ({tab}) => {

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
    )
}

export default OrderTabs