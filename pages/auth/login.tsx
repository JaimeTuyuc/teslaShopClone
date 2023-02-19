import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material'
import { validation } from '@/utils'
import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material'
import { AuthContext } from '../../context';

type FormData = {
    email: string
    password: string
}

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const [ showError, setShowError] = useState<boolean>(false)
    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false)

        const isValidLogin = await loginUser(email, password)
        if (!isValidLogin) {
            setShowError(true)
            setTimeout(() => {
                setShowError(false)
            }, 2500)
            return
        }

        router.replace('/')
    }
    return (
        <AuthLayout
            title='Login Page'
        >
            <form onSubmit={handleSubmit(onLoginUser)}>
                <Box sx={{ width: 250, padding: '10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                            <Typography
                                variant='h1'
                                component='h1'
                                textAlign='center'
                            >Login Page</Typography>

                            {
                                showError && (
                                    <Chip
                                        label='No user found with the credentials provided'
                                        color='error'
                                        icon={<ErrorOutline />}
                                        className='fadeIn'
                                    />
                                )
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Email'
                                variant='filled'
                                fullWidth
                                size='small'
                                {
                                    ...register('email', {
                                        required: 'Email is required',
                                        validate: validation.isEmail
                                    })
                                }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Password'
                                type='password'
                                variant='filled'
                                fullWidth
                                size='small'
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Please enter a 6 digits password'}
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                className='circular-btn'
                                fullWidth
                                size='large'
                            >Log in</Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link href={'/auth/register'}>
                                Don't have an account?
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage