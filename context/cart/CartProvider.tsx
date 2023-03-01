
import { FC, ReactNode, useEffect, useReducer } from 'react'
import { CartContext, cartReducer } from './'
import { ICartProduct } from '../../interfaces/cart';
import Cookie from 'js-cookie'
import { IOrder, ShippingAddress } from '@/interfaces/order';
import { tesloApi } from '@/api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[],
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress
}

interface Props {
    children: ReactNode
}



const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
}

export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

    useEffect(() => {
        try {
            const productsCookie = JSON.parse(Cookie.get('cart')!)
            //const dataFromLocalStorage = JSON.parse(localStorage.getItem('cartStorage'))
            //console.log(dataFromLocalStorage, 'from localstorage?')
            console.log(productsCookie, 'cart de cookies*-*-*-*ß')
            dispatch({ type: '[CART] - loadCart from cookies | storage', payload: productsCookie })
        } catch (error) {
            dispatch({ type: '[CART] - loadCart from cookies | storage', payload: [] })
        }
    }, [])

    useEffect(() => {

        if (Cookie.get('firstName') !== undefined) {
            const shippingAddress = {
                firstName: Cookie.get('firstName') || '',
                lastName: Cookie.get('lastName') || '',
                address: Cookie.get('address') || '',
                address2: Cookie.get('address2') || '',
                zip: Cookie.get('zip') || '',
                city: Cookie.get('city') || '',
                country: Cookie.get('country') || '', 
                phone: Cookie.get('phone') || '',
            }
            dispatch({ type: '[CART] - load address from cookies', payload: shippingAddress})
        }
    },[])

    useEffect(() => {
        //console.log(state.cart, 'cart actualizado')
        // Save to cookies and Localstorage
        Cookie.set('cart', JSON.stringify(state.cart))

        //localStorage.setItem('cartStorage', JSON.stringify(state.cart))
        //localStorage.setItem('test', 'Hola desde local storage')
        //console.log('Just a test to see if this is working')
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

    const updateAddresCookies = (address: ShippingAddress) => {
        Cookie.set('firstName', address.firstName)
        Cookie.set('lastName', address.lastName)
        Cookie.set('address', address.address)
        Cookie.set('address2', address.address2 || '')
        Cookie.set('zip', address.zip)
        Cookie.set('city', address.city)
        Cookie.set('country', address.country)
        Cookie.set('phone', address.phone)
        dispatch({ type: '[CART] - update address', payload: address})
    }

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {

        if (!state.shippingAddress) {
            throw new Error('No address provided')
        }

        const body: IOrder = {
            orderItems: state.cart.map((p) => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subtotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
        }

        try {
            
            const { data } = await tesloApi.post<IOrder>(`/orders`, body)
            dispatch({ type: '[CART] - Order complete'})
            return {
                hasError: false,
                message: data._id!
            }

        } catch (error) {
            console.log(error, 'unable to create the order')
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'Unable to complete the request, please contant your administrator'
            }
        }
    }

    const values = {
        ...state,

        // Methods
        addProduct,
        updateCartQuantity,
        removeCartProduct,
        updateAddresCookies,
        createOrder
    }

    return (
        <CartContext.Provider
            value={values}
        >
            {children}
        </CartContext.Provider>
    )
}
