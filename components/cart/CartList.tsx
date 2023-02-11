import { Typography, Grid, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import Link from 'next/link';
import React, { FC } from 'react'
import { initialData } from '../../database/products';
import { ItemCounter } from '../ui';

interface Props {

}

const productInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2]
]

interface Props {
    editable: boolean
}

export const CartList:FC<Props> = ({ editable }) => {
    return (
        <>
            {
                productInCart.map((product) => {
                    return (
                        <Grid container spacing={2} key={product.slug} sx={{ mb: 1}}>
                            <Grid item xs={3}>
                                {/**llevar a la pagina de cada producto */}
                                <Link href={'/product/slug'}>
                                    <CardActionArea>
                                        <CardMedia
                                            image={`/products/${product.images[0]}`}
                                            component='img'
                                            sx={{ borderRadius: '5px'}}
                                        />
                                    </CardActionArea>
                                </Link>
                            </Grid>
                            <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1'>{ product.title}</Typography>
                                    <Typography variant='body1'>Size: <strong>M</strong> </Typography>

                                    {/**Show the counter to add or remove the items */}
                                    {
                                        editable 
                                            ? <ItemCounter />
                                            : <Typography>3</Typography>
                                    }
                                </Box>
                            </Grid>
                            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                                <Typography variant='subtitle1'>{product.price}</Typography>

                                {
                                    editable && (
                                        <Button variant='text' color='secondary'>Remove</Button>
                                    )
                                }
                            </Grid>
                        </Grid>
                    )
                })
            }
        </>
    )
}

