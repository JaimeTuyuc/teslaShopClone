import React, { FC, useContext } from 'react'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { countries } from '@/utils'
import { useForm } from 'react-hook-form'
import Cookie from 'js-cookie';
import { useRouter } from 'next/router'
import { CartContext } from '../../context/cart/CartContext';

interface Props {

}

type FormData = {
    firstName: string
    lastName: string
    address: string
    address2?: string
    zip: string
    city: string
    country: string
    phone: string
}

// Get address from cookies
const getAddressFromCookies = ():FormData => {
    return {
        firstName :Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
    }
}

const Address:FC<Props> = () => {
    const router = useRouter()
    const { updateAddresCookies } = useContext(CartContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    })

    const handleAddressSubmit = (data: FormData) => {
        updateAddresCookies(data)
        router.push('/checkout/summary')
    }

    return (
        <>
            <ShopLayout
                title='Address page'
                pageDescription='Confirm your billing address'
            >
                <form onSubmit={handleSubmit(handleAddressSubmit)}>
                    <Typography variant='h1' component='h1'>Address</Typography>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Name'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('firstName', {
                                        required: 'Name is required'
                                    })
                                }
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Last name'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('lastName', {
                                        required: 'Last name is required'
                                    })
                                }
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Address'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('address', {
                                        required: 'Address is required'
                                    })
                                }
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Address 2 (*optional)'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('address2')
                                }
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Postal Code'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('zip', {
                                        required: 'Zip code is required'
                                    })
                                }
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='City'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('city', {
                                        required: 'City is required'
                                    })
                                }
                                error={!!errors.city}
                                helperText={errors.city?.message}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl
                                fullWidth
                            >
                                <TextField
                                    select
                                    variant='filled'
                                    label='Country'
                                    defaultValue={ Cookie.get('country') || countries.countries[0].code}
                                    {
                                    ...register('country', {
                                        required: 'Name is required'
                                    })
                                }
                                    error={!!errors.country}
                                    helperText={errors.country?.message}
                                >
                                    {
                                        countries.countries.map((country) => {
                                            return (
                                                <MenuItem
                                                    value={country.code}
                                                    key={country.code}
                                                >{country.name}</MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label='Phone number'
                                variant='filled'
                                fullWidth
                                {
                                    ...register('phone', {
                                        required: 'Name is required'
                                    })
                                }
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        display='flex'
                        mt={3}
                        justifyContent='end'
                    >
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                size='large'
                                // href={'/checkout/summary'}
                            >Check order</Button>
                    </Box>
                </form>
            </ShopLayout>
        </>
    )
}

/*
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { token = '' } = req.cookies
    let isValidtoken = false

    try {
        await JWT.isValidToken(token)
        isValidtoken = true
    } catch (error) {
        isValidtoken = false
    }

    if (!isValidtoken) {
        return {
            redirect: {
                destination: `/auth/login?p=/checkout/address`,
                permanent: false
            }
        }
    }
    return {
        props: {
            
        }
    }
}
*/
export default Address