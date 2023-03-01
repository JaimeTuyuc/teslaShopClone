
import { CartState } from './'
import { ICartProduct } from '../../interfaces/cart';
import { ShippingAddress } from '@/interfaces/order';

type CartActionType =
    | { type: '[CART] - loadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[CART] - add product', payload: ICartProduct[] }
    | { type: '[CART] - change cart quantity', payload: ICartProduct }
    | { type: '[CART] - remove product in cart', payload: ICartProduct }
    | { type: '[CART] - load address from cookies', payload: ShippingAddress }
    | { type: '[CART] - update address', payload: ShippingAddress }
    | {
        type: '[CART] - Update order summary', payload: {
        numberOfItems: number;
        subtotal: number;
        tax: number;
        total: number;
        }
    }
    | { type: '[CART] - Order complete' }
    
export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    
    switch (action.type) {
        case '[CART] - loadCart from cookies | storage':
            return { 
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case '[CART] - add product':
            //localStorage.setItem('cartStorage', JSON.stringify(action.payload))
            return {
                ...state,
                cart: [...action.payload]
            }
        case '[CART] - change cart quantity':
            return {
                ...state,
                cart: state.cart.map((product) => {
                    if (product._id !== action.payload._id) return product
                    if (product.size !== action.payload.size) return product
                    return action.payload
                })
            }
        case '[CART] - remove product in cart':
            return {
                ...state,
                cart: state.cart.filter((product) => {
                    return !(product._id === action.payload._id && product.size === action.payload.size)
                })
            }
        case '[CART] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        case '[CART] - load address from cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }
        case '[CART] - update address':
        case '[CART] - update address':
            return {
                ...state,
                shippingAddress: action.payload
            }
        case '[CART] - Order complete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subtotal: 0,
                tax: 0,
                total: 0
            }
        default:
            return state
    }
}