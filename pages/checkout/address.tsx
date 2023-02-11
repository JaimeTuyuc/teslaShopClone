import { ShopLayout } from '@/components/layouts'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {

}

const Address:FC<Props> = () => {

    return (
        <>
            <ShopLayout
                title='Address page'
                pageDescription='Confirm your billing address'
            >
                <Typography variant='h1' component='h1'>Address</Typography>

                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>
                        <TextField label='Name' variant='filled' fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label='Last name' variant='filled' fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField label='Address' variant='filled' fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label='Address 2 (*optional)' variant='filled' fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField label='Postal Code' variant='filled' fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label='City' variant='filled' fullWidth />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl
                            fullWidth
                        >
                            <Select
                                variant='filled'
                                label='Country'
                                value={1}
                            >
                                <MenuItem value={1}>Canada</MenuItem>
                                <MenuItem value={2}>United States</MenuItem>
                                <MenuItem value={3}>Mexico</MenuItem>
                                <MenuItem value={4}>Guatemala</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label='Phone number' variant='filled' fullWidth />
                    </Grid>
                </Grid>

                <Box
                    display='flex'
                    mt={3}
                    justifyContent='end'
                >
                    <Link
                        href={'/checkout/summary'}
                    >
                        <Button
                            color='secondary'
                            className='circular-btn'
                            size='large'
                        >Check order</Button>
                    </Link>
                </Box>
            </ShopLayout>
        </>
    )
}

export default Address