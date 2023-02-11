

import { createContext } from 'react'


interface ContextProps {
    isMenuOpen: boolean
    handleSidebar: (value: boolean) => void
}


export const UiContext = createContext({} as ContextProps)