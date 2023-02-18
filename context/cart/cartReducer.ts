
import { CartState } from './'
import { ICartProduct } from '../../interfaces/cart';

type CartActionType =
    | { type: '[CART] - loadCart from cookies | storage', payload: ICartProduct[] }
    | { type: '[CART] - add product', payload: ICartProduct[] }
    | { type: '[CART] - change cart quantity', payload: ICartProduct }
    | { type: '[CART] - remove product in cart', payload: ICartProduct }
    | {
        type: '[CART] - Update order summary', payload: {
        numberOfItems: number;
        subtotal: number;
        tax: number;
        total: number;
    }}
    
export const cartReducer = (state: CartState, action: CartActionType): CartState => {
    
    switch (action.type) {
        case '[CART] - loadCart from cookies | storage':
            return { 
                ...state,
                cart: [...action.payload]
            }
        case '[CART] - add product':
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
        default:
            return state
    }
}