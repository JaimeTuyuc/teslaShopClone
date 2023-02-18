import React, { FC } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'

interface Props {
    currentValue: number
    maxValue: number

    // Methods
    updateQuantity: (newVal: number) => void
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, updateQuantity }) => {
    
    const addRemove = (val: number) => {
        if (val === -1) {
            if (currentValue === 1) return
            
            return updateQuantity(currentValue - 1)
        }

        if (currentValue >= maxValue) return

        updateQuantity(currentValue + 1)
    }

    return (
        <>
            <Box display='flex' alignItems='center'>
                <IconButton
                    onClick={() => addRemove(-1)}
                >
                    <RemoveCircleOutline />
                </IconButton>

                <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
                <IconButton
                    onClick={() => addRemove(+1)}
                >
                    <AddCircleOutline />
                </IconButton>
            </Box>
        </>
    )
}