
import { createContext } from 'react'
import { IRole, IUser } from '../../interfaces/users';


interface ContextProps {
    isLoggedIn: boolean
    user?: IUser
    role?: IRole
    loginUser: (email: string, password: string) => Promise<boolean>
    registerUser: (email: string, password: string, name: string) => Promise<{ hasError: boolean; message?: string; }>
    logoutHandler: () => void
}


export const AuthContext = createContext({} as ContextProps)