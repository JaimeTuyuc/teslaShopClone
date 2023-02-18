import { Typography, Grid, CardActionArea, CardMedia, Box, Button } from '@mui/material';
import Link from 'next/link';
import React, { FC, useContext } from 'react'
import { ItemCounter } from '../ui';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct } from '@/interfaces';

interface Props {
    editable: boolean
}

export const CartList: FC<Props> = ({ editable }) => {
    
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext)

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {

        product.quantity = newQuantityValue
        updateCartQuantity(product)
    }

    const removeProductFromCart = (product:ICartProduct) => {
        removeCartProduct(product)
    }

    return (
        <>
            {
                cart.map((product) => {
                    return (
                        <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1}}>
                            <Grid item xs={3}>
                                {/**llevar a la pagina de cada producto */}
                                <Link href={`/product/${product.slug}`}>
                                    <CardActionArea>
                                        <CardMedia
                                            image={`/products/${product.image}`}
                                            component='img'
                                            sx={{ borderRadius: '5px'}}
                                        />
                                    </CardActionArea>
                                </Link>
                            </Grid>
                            <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1'>{ product.title}</Typography>
                                    <Typography variant='body1'>Size: <strong>{product.size}</strong> </Typography>

                                    {/**Show the counter to add or remove the items */}
                                    {
                                        editable 
                                            ? (
                                                <ItemCounter
                                                    currentValue={product.quantity}
                                                    maxValue={10}
                                                    updateQuantity={(val) => onNewCartQuantityValue(product, val)}
                                                />
                                            )
                                            : (
                                                <Typography variant='h5'>{product.quantity} Product {product.quantity > 1 ? 's' : ''}</Typography>
                                            )
                                    }
                                </Box>
                            </Grid>
                            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                                <Typography variant='subtitle1'>{product.price}</Typography>

                                {
                                    editable && (
                                        <Button
                                            variant='text'
                                            color='secondary'
                                            onClick={ () => removeProductFromCart(product)}
                                        >Remove</Button>
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

