import React, { useContext, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { validation } from '@/utils';
import { ErrorOutline } from '@mui/icons-material'
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router'
import { getSession, signIn } from 'next-auth/react'

type FormData = {
    name: string
    email: string
    password: string
}

const RegisterPage = () => {
    const router = useRouter()
    const { registerUser } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const [showError, setShowError] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const onRegisterform = async ( {  name, email, password}: FormData) => {
        setShowError(false)
        const response = await registerUser(name, email, password)
        if (response.hasError === true) {
            setShowError(true)
            setErrorMsg(response.message!)
            setTimeout(() => {
                setShowError(false)
            }, 2500)
        }

        // router.replace('/')
        //const destination = router.query.p?.toString() || '/'
        //router.replace(`/${destination}`)
        await signIn('credentials',{ email: email, password: password });
    }

    return (
        <AuthLayout
            title='Register Page'
        >
            <form onSubmit={handleSubmit(onRegisterform)}>
                <Box sx={{ width: 250, padding: '10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>

                            <Typography
                                variant='h1'
                                component='h1'
                                textAlign='center'
                            >Register Page</Typography>

                            {
                                showError && (
                                    <Chip
                                        label={errorMsg}
                                        color='error'
                                        icon={<ErrorOutline />}
                                        className='fadeIn'
                                    />
                                )
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Name'
                                variant='filled'
                                fullWidth
                                size='small'
                                {
                                ...register('name', {
                                    required: 'Nmae is required',
                                    minLength: { value: 3, message: 'Name needs to be 3 characters long'}
                                })
                                }
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Email' 
                                variant='filled' 
                                type='email'
                                fullWidth 
                                size='small'
                                {...register('email', { required: 'Email is required', validate: validation.isEmail })}
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
                                {...register('password', { required: 'Password is required', minLength: {value: 6, message: 'Password needs to be 6 characters length'}})}
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
                            >Register</Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Link
                                href={ router.query.p ? `/auth/login?=${router.query.p}` : `/auth/login`}
                            >
                                Already a member? Log in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const session = await getSession({ req })
    const { p = '/' } = query
    
    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {

        }
    }
}

export default RegisterPage