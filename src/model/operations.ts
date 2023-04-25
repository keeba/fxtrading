import { IChildOrder, ICurrencyPair, IParentOrder, IPosition } from "./interfaces"

export const refreshCurrencyPairs = (CurrencyPairs: ICurrencyPair[]) => {
	const newCurrencyPairs = CurrencyPairs.map(CP => ({...CP, noOfTicks: Math.random() * 100, increment: Math.random() * 1 ? true : false }))
	localStorage.setItem('CurrencyPairs', JSON.stringify(newCurrencyPairs))
	return newCurrencyPairs
}

export const getNewOrderID = (type: string) => {
	let newID = '';   
	if (type == 'Parent') {
		let POCount = localStorage.getItem('ParentOrdersCount')
		newID = 'PO' + (10000 + (POCount ? parseInt(POCount) : 0) + 1)
	}
	else if (type == 'Child') {
		let COCount = localStorage.getItem('ChildOrdersCount')
		newID = 'CO' + (10000 + (COCount ? parseInt(COCount) : 0) + 1)
	}
	return newID
}

export const addParentOrder = async (basePrice: number, OrderID: string, Symbol: string, Price: number, Quantity: number, Side: string) => {
	const diff = Price > basePrice ? (Price - basePrice) : (basePrice - Price)
	const newParentOrder: IParentOrder = {
		OrderID, Symbol, Price, Quantity, Side, TradedQuantity: 0, OrderStatus: ((diff/basePrice*100) > 5) ? 'Rejected' : 'Open', SpreadCost: 0, AvgPrice: Price
	}
	let ParentOrdersString = localStorage.getItem('ParentOrders')
	const ParentOrders: IParentOrder[] = ParentOrdersString ? JSON.parse(ParentOrdersString): []
	ParentOrders.push(newParentOrder)
	localStorage.setItem('ParentOrders', JSON.stringify(ParentOrders))
	let POCount = localStorage.getItem('ParentOrdersCount')
	localStorage.setItem('ParentOrdersCount', ((POCount ? parseInt(POCount) : 0) + 1).toString())
	return ParentOrders
}

export const addChildOrder = async (ParentOrderID: string, OrderID: string, Symbol: string, Price: number, Quantity: number, Side: string) => {
	const newChildOrder: IChildOrder = {
		OrderID, ParentOrderID, Symbol, Price, Quantity, Side, OrderStatus: 'Complete'
	}
	let ChildOrdersString = localStorage.getItem('ChildOrders')
	const ChildOrders: IChildOrder[] = ChildOrdersString ? JSON.parse(ChildOrdersString): []
	ChildOrders.push(newChildOrder)
	localStorage.setItem('ChildOrders', JSON.stringify(ChildOrders))
	let COCount = localStorage.getItem('ChildOrdersCount')
	localStorage.setItem('ChildOrdersCount', ((COCount ? parseInt(COCount) : 0) + 1).toString())
	const ParentOrders = updateParentOrders(ParentOrderID, ChildOrders.filter((CO) => CO.ParentOrderID == ParentOrderID))
	const Positions = updatePositions(Symbol, ParentOrders.filter((PO) => PO.Symbol == Symbol))
	return {ChildOrders, ParentOrders, Positions}
}

export const updateParentOrders = (ParentOrderID: string, ChildOrders: IChildOrder[]) => {
	let ParentOrdersString = localStorage.getItem('ParentOrders')
	const ParentOrders: IParentOrder[] = ParentOrdersString ? JSON.parse(ParentOrdersString): []
	const ParentOrder: IParentOrder = ParentOrders.filter((PO) => PO.OrderID == ParentOrderID)[0]
	let TradedQuantity = 0
	let Cummulative = 0
	ChildOrders.forEach((CO) => {
		TradedQuantity += CO.Quantity
		Cummulative += (CO.Quantity * CO.Price)
	})
	ParentOrder.TradedQuantity = TradedQuantity
	ParentOrder.SpreadCost = Cummulative - (TradedQuantity * ParentOrder.Price)
	ParentOrder.AvgPrice = TradedQuantity > 0 ? Cummulative / TradedQuantity : 0
	ParentOrder.OrderStatus = ParentOrder.Quantity == TradedQuantity ? 'Complete' : 'Partial'
	localStorage.setItem('ParentOrders', JSON.stringify(ParentOrders))
	return ParentOrders
}

export const updatePositions = (Symbol: string, ParentOrders: IParentOrder[]) => {
	let PositionsString = localStorage.getItem('Positions')
	const Positions: IPosition[] = PositionsString ? JSON.parse(PositionsString): []
	const filteredPositions: any[] = Positions.filter((P) => P.Symbol == Symbol)
	let Position: IPosition = {Symbol, NetQuantity: 0, AvgPrice: 0}
	if (filteredPositions && filteredPositions.length > 0) {
		Position =  filteredPositions[0]
	}
	else {
		Positions.push(Position)
	}
	let NetQuantity = 0
	let Cummulative = 0
	ParentOrders.forEach((PO) => {
		let Sign = PO.Side == 'SELL' ? -1 : 1
		NetQuantity += (Sign * PO.TradedQuantity)
		Cummulative += (Sign * PO.TradedQuantity * PO.AvgPrice)
	})
	Position.NetQuantity = NetQuantity
	Position.AvgPrice = parseFloat((NetQuantity != 0 ? Cummulative/NetQuantity : Cummulative).toFixed(5))
	localStorage.setItem('Positions', JSON.stringify(Positions))
	return Positions
}

export const cancelOrder = async (OrderID: string) => {
	let ParentOrdersString = localStorage.getItem('ParentOrders')
	let ParentOrders: IParentOrder[] = ParentOrdersString ? JSON.parse(ParentOrdersString): []
	ParentOrders = ParentOrders.filter((PO) => PO.OrderID != OrderID)
	localStorage.setItem('ParentOrders', JSON.stringify(ParentOrders))
	return ParentOrders
}
