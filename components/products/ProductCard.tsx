import React, { FC, useMemo, useState } from 'react';
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Typography } from '@mui/material';
import { IProduct } from '../../interfaces/products';
import NextLink from 'next/link';

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false)
    
    const productImage = useMemo(() => {
        return isHovered 
            ? `${product.images[1]}`
            : `${product.images[0]}`
    },[isHovered, product.images])
    return (
        <>
            <Grid
                item
                xs={6}
                sm={4}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Card>
                    <NextLink href={`/product/${product.slug}`} prefetch={false}>
                        <CardActionArea>
                            {
                                !product.inStock && (
                                    <Chip
                                        color='primary'
                                        label='No units available'
                                        sx={{ position: 'absolute', zIndex: 9, top: '10px', left: '10px' }}
                                    />
                                )
                            }
                            <CardMedia
                                className='fadeIn'
                                component='img'
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </CardActionArea>
                    </NextLink>
                </Card>

                <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }} className='fadeIn'>
                    <Typography fontWeight={700}>{product.title}</Typography>
                    <Typography fontWeight={400}>${ product.price }</Typography>
                    
                </Box>
            </Grid>
        </>
    )
}