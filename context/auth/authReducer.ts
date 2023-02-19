import { AuthState } from './AuthProvider';
import { IUser } from '../../interfaces/users';

type CartActionType = 
    | { type: '[AUTH] - login', payload: IUser }
    | { type: '[AUTH] - logout' }

export const authReducer = (state: AuthState, action: CartActionType): AuthState => {
    
    switch (action.type) {
        case '[AUTH] - login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        case '[AUTH] - logout':
            return {
                ...state,
                isLoggedIn: false,
                user: undefined,
            }
        default:
            return state;
    }
}