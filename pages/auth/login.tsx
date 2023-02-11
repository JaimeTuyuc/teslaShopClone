import { AuthLayout } from '@/components/layouts'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const LoginPage = () => {

    return (
        <AuthLayout
            title='Login Page'
        >
            <Box sx={{ width: 250, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>

                        <Typography
                            variant='h1'
                            component='h1'
                            textAlign='center'
                        >Login Page</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Email' variant='filled' fullWidth size='small'/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Password' type='password' variant='filled' fullWidth size='small' />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
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
        </AuthLayout>
    )
}

export default LoginPage