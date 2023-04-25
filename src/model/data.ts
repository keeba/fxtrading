export const CurrencyPairs = [
	{
		name: 'USDINR',
		basePrice: 82.5500,
		tickSize: 0.025,
		increment: true,
		noOfTicks: 0 
	},
	{
		name: 'USDCNH',
		basePrice: 6.88650,
		tickSize: 0.0001,
		increment: true,
		noOfTicks: 0
	},
	{
		name: 'EURUSD',
		basePrice: 1.06641,
		tickSize: 0.00001,
		increment: true,
		noOfTicks: 0
	},
	{
		name: 'USDJPY',
		basePrice: 131.830,
		tickSize: 0.01,
		increment: true,
		noOfTicks: 0
	},
	{
		name: 'USDGBP',
		basePrice: 0.82122,
		tickSize: 0.00001,
		increment: true,
		noOfTicks: 0
	}
]

export const ParentOrders = [
	{
		OrderID : 'PO10001',
		Symbol: 'USDINR',
		Price: 83.40,
		Quantity: 100,
		TradedQuantity: 0,
		Side: 'BUY',
		OrderStatus: 'Open',
		SpreadCost: 0,
		AvgPrice: 0
	},
	{
		OrderID : 'PO10002',
		Symbol: 'USDINR',
		Price: 83.40,
		Quantity: 200,
		TradedQuantity: 50,
		Side: 'SELL',
		OrderStatus: 'Partial',
		SpreadCost: 0.70,
		AvgPrice: 84.10
	},
]

export const ChildOrders = [
	{
		OrderID: 'CO10001',
		ParentOrderID: 'PO10002',
		Symbol: 'USDINR',
		Price: 84.10,
		Quantity: 50,
		Side: 'SELL',
		OrderStatus: 'Complete',
	},
]

export const Positions = [
	{
		Symbol: 'USDINR',
		NetQuantity: '50',
		AvgPrice: '84.10',
	}
]
