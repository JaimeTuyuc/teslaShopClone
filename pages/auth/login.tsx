import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Divider, Grid, TextField, Typography } from '@mui/material'
import { validation } from '@/utils'
// import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material'
// import { AuthContext } from '../../context';
import { signIn, getSession, getProviders } from 'next-auth/react'
import { GetServerSideProps } from 'next'

type FormData = {
    email: string
    password: string
}

const LoginPage = () => {
    // const { loginUser } = useContext(AuthContext)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const [showError, setShowError] = useState<boolean>(false)  
    const [providers, setProvjders] = useState<any>({})
    
    useEffect(() => {
        getProviders().then((prov) => {
            setProvjders(prov)
        })
    }, [])

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false)

        // const isValidLogin = await loginUser(email, password)
        // if (!isValidLogin) {
        //     setShowError(true)
        //     setTimeout(() => {
        //         setShowError(false)
        //     }, 2500)
        //     return
        // }
        // const destination = router.query.p?.toString() || '/'
        // router.replace(`/${destination}`)
        //const isValidUser = await signIn('credentials', { email, password, redirect: false })
        await signIn('credentials',{ email: email, password: password });

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
                            <Link href={ router.query.p ? `/auth/register?=${router.query.p}` : `/auth/register`}>
                                Don't have an account?
                            </Link>
                        </Grid>

                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            
                            {
                                Object.values(providers).map((provider: any) => {
                                    
                                    if(provider.id === 'credentials') return <div key={'credentials'}></div>
                                    
                                    return (
                                        <Button
                                            key={provider.key}
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            onClick={ () => signIn(provider.id) }
                                        >{provider.name}</Button>
                                    )
                                })
                            }
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

export default LoginPage