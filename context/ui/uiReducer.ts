import { UIState } from './'

type uiActionType =
    | { type: '[UI] - toggle-menu', payload: boolean}

export const uiReducer = (state: UIState, action: uiActionType): UIState => {

    switch (action.type) {
        case '[UI] - toggle-menu':
            return {
                ...state,
                isMenuOpen: action.payload
            }
    
        default:
            return state
    }
}