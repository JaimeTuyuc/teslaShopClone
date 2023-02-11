
import { FC, ReactNode, useReducer } from 'react'
import { UiContext, uiReducer } from './'

export interface UIState {
    isMenuOpen: boolean
}

interface Props {
    children: ReactNode
}

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false
}

export const UIProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

    // Open and Close the side menu
    const handleSidebar = (value: boolean) => {
        dispatch({ type: '[UI] - toggle-menu', payload: value })
    }

    const values = {
        ...state,
        handleSidebar
    }
    return (
        <UiContext.Provider
            value={values}
        >
            {children}
        </UiContext.Provider>
    )
}