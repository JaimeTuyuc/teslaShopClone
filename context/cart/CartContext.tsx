import { ICartProduct } from '@/interfaces'
import { createContext } from 'react'
import { ShippingAddress } from './';


interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[]
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress
    addProduct: (product: ICartProduct) => void
    updateCartQuantity: (product: ICartProduct) => void
    removeCartProduct: (product: ICartProduct) => void
    updateAddresCookies: (address: ShippingAddress) => void
}


export const CartContext = createContext({} as ContextProps)