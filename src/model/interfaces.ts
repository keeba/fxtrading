export interface ICurrencyPair {
	name: string,
	basePrice: number,
	tickSize: number,
	increment: boolean,
	noOfTicks: number
}

export interface IParentOrder {
	OrderID : string,
	Symbol: string,
	Price: number,
	Quantity: number,
	TradedQuantity: number,
	Side: string,
	OrderStatus: string,
	SpreadCost: number
	AvgPrice: number
}

export interface IChildOrder {
	OrderID: string,
	ParentOrderID: string,
	Symbol: string,
	Price: number,
	Quantity: number,
	Side: string,
	OrderStatus: string,
}

export interface IPosition {
	Symbol: string,
	NetQuantity: number,
	AvgPrice: number
}

export interface IOrdersCountContext {
	OrdersCount: number
}

export interface IOrderContext {
	ParentOrders: IParentOrder[],
	ChildOrders: IChildOrder[],
	Positions: IPosition[]
}