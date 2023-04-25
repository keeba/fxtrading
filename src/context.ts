import { createContext } from 'react'
import { IOrdersCountContext } from './model/interfaces'

export const OrdersCountContext = createContext<IOrdersCountContext | null>(null)
