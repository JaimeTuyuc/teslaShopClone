
import { FC, ReactNode, useEffect, useReducer } from 'react'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';
import Cookie from 'js-cookie'

export interface CartState {
    cart: ICartProduct[],
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
}

interface Props {
    children: ReactNode
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    useEffect(() => {
        try {
            const productsCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            dispatch({ type: '[CART] - loadCart from cookies | storage', payload: productsCookie })
        } catch (error) {
            dispatch({ type: '[CART] - loadCart from cookies | storage', payload: [] })
        }
    }, [])

    useEffect(() => {
        Cookie.set('cart', JSON.stringify(state.cart))
    }, [state.cart])
    
    useEffect(() => {

        const nuberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev ,0 )
        const subTotal = state.cart.reduce((pre, current) => (current.price * current.quantity) + pre, 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0
        const orderSummary = {
            numberOfItems: nuberOfItems,
            subtotal: subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }
        dispatch({ type: '[CART] - Update order summary', payload: orderSummary })
    },[state.cart])

    const addProduct = (product: ICartProduct) => {
        //! First Option
        // dispatch({ type: '[CART] - add product', payload: product })

        // Second option
        // const productsInCart = state.cart.filter((p) => p._id !== product._id && p.size !== product.size)

        // Final and 3rd option
        const productInCart = state.cart.some((p) => p._id === product._id)
        if (!productInCart) return dispatch({ type: '[CART] - add product', payload: [...state.cart, product] })
        
        const productInCartWithDifferentSize = state.cart.some(P => P._id === product._id && P.size === product.size)
        
        if (!productInCartWithDifferentSize) return dispatch({ type: '[CART] - add product', payload: [...state.cart, product] })

        const updatedProuduct = state.cart.map((p) => {
            if (p._id !== product._id) return p
            if (p.size !== product.size) return p
            
            p.quantity += product.quantity

            return p
        })

        dispatch({ type: '[CART] - add product', payload: updatedProuduct })
    }

    const updateCartQuantity = (product:ICartProduct) => {
        dispatch({ type: '[CART] - change cart quantity', payload: product })
    }

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: '[CART] - remove product in cart', payload: product })
    }

    const values = {
        ...state,

        // Methods
        addProduct,
        updateCartQuantity,
        removeCartProduct
    }

    return (
        <CartContext.Provider
            value={values}
        >
            {children}
        </CartContext.Provider>
    )
}
