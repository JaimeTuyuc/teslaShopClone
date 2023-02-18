import { ICartProduct } from '@/interfaces'
import { createContext } from 'react'


interface ContextProps {
    cart: ICartProduct[]
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
    addProduct: (product: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartProduct: (product:ICartProduct) => void
}


export const CartContext = createContext({} as ContextProps)