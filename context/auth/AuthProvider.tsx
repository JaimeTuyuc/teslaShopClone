
import { FC, ReactNode, useEffect, useReducer } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { AuthContext, authReducer } from './'
import { IUser } from '../../interfaces/users';
import tesloApi from '../../api/tesloApi';
import Cookie from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';

export interface AuthState {
    isLoggedIn: boolean
    user?: IUser
}

interface Props {
    children: ReactNode
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

export const AuthProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
    const router = useRouter()
    const { data, status } = useSession()

    // Using next auth
    useEffect(() => {
        if (status === 'authenticated') {
            //console.log(data.user, 'user data')
            dispatch({ type: '[AUTH] - login', payload: data.user as IUser})
        }
    },[data, status])

    // This uses out custom auth
    // useEffect(() => {
    //     if(!Cookie.get('token')) return
    //     checkToken()
    // }, [])
    

    const checkToken = async () => {
        try {
            const { data } = await tesloApi.get(`user/validate-token`)
            const { token, user } = data
            Cookie.set('token', token)
            dispatch({ type: '[AUTH] - login', payload: user})
        } catch (error) {
            Cookie.remove('token')
        }
    }

    const loginUser = async (email: string, password: string):Promise<boolean> => {
        try {
            const { data } = await tesloApi.post(`/user/login`, { email, password })
            const { token, user } = data
            Cookie.set('token', token)
            dispatch({ type: '[AUTH] - login', payload: user })
            return true
        } catch (error) {
            console.log(error, 'unable to login the user')
            return false
        }
    }


    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean, message?: string }> => {
        try {
            const { data } = await tesloApi.post(`/user/register`, { name, email, password })
            const { token, user } = data
            Cookie.set('token', token)
            dispatch({ type: '[AUTH] - login', payload: user })
            return {
                hasError: false
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                    hasError: true,
                    message: 'Unable to create the user'
                }
        }
    }

    const logoutHandler = () => {
        // Cookie.remove('token')
        Cookie.remove('cart')
        Cookie.remove('firstName')
        Cookie.remove('lastName')
        Cookie.remove('address')
        Cookie.remove('address2')
        Cookie.remove('zip')
        Cookie.remove('city')
        Cookie.remove('country') 
        Cookie.remove('phone')
        
        signOut()
        
        //router.reload()
    }

    const values = {
        ...state,

        // Methods
        loginUser,
        registerUser,
        logoutHandler
    }
    return (
        <AuthContext.Provider
            value={values}
        >
            {children}
        </AuthContext.Provider>
    )
}