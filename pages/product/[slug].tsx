import React, { useContext, useState } from 'react'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import { ShopLayout } from '../../components/layouts';
import { ProductSlide, SizeSelector } from '../../components/products'
import { ItemCounter } from '@/components/ui';
import { IProduct, ICartProduct, ISize } from '../../interfaces';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { dbProduct } from '@/database';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';

interface Props {
    product: IProduct
}

const ProductPage:NextPage<Props> = ({ product }) => {
    const { addProduct } = useContext(CartContext)
    const router = useRouter()
    const [tempCardProduct, setTempCardProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    })

    const selectedSize = (size: ISize) => {
        setTempCardProduct({
            ...tempCardProduct,
            size: size
        })
    }

    const onAddProduct = () => {
        if(!tempCardProduct.size) return
        console.log(tempCardProduct, 'producto agregado')
        addProduct(tempCardProduct)
        router.push(`/cart`)
    }

    const onUpdateQuantity = (val: number) => {
        setTempCardProduct((prevVal) => ({
            ...prevVal,
            quantity: val
        }))
    }

    return (
        <>
            <ShopLayout
                title={product.title}
                pageDescription={product.description}
            >

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={7}>
                        <ProductSlide images={product.images} />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                        <Box display='flex' flexDirection='column'>
                            {/**Titulos */}
                            <Typography variant='h1' component='h1'>{product.title}</Typography>
                            <Typography variant='subtitle1' >${product.price}</Typography>

                            {/**Cantidad */ }
                            <Box sx={{ my: 2 }}>
                                <Typography variant='subtitle1'>Quantity</Typography>
                                {/**Item Quantity */}
                                <ItemCounter
                                    currentValue={tempCardProduct.quantity}
                                    updateQuantity={onUpdateQuantity}
                                    maxValue={ product.inStock > 10 ? 10 : product.inStock }
                                />
                                <SizeSelector
                                    sizes={product.sizes}
                                    selectedSize={tempCardProduct.size}
                                    onSelectedSize={ (size) => selectedSize(size)}
                                />
                            </Box>

                            {/**Add to cart */}
                            {
                                product.inStock
                                    ? (
                                    <Button
                                        color='secondary'
                                        className='circular-btn'
                                        onClick={onAddProduct}
                                    >
                                        {
                                                tempCardProduct.size
                                                    ? 'Add to cart'
                                                    : 'Choose a size'
                                        }
                                    </Button>
                                        
                                    ) : (
                                        <Chip label='No units available' color='error' variant='outlined' />
                                )
                            }

                            {/**Description */}
                            <Box>
                                <Typography variant='subtitle2'>Description</Typography>
                                <Typography variant='body2'>{product.description}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </ShopLayout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const proudctSlugs = await dbProduct.getAllproductSlugs()

    return {
        paths: proudctSlugs.map((obj) => {
            return {
                params: {
                    slug: obj.slug
                }
            }
        }),
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    
    const { slug } = params as { slug: string }
    const product = await dbProduct.getProductBySlug(slug)
    
    if (!product) {
        return { 
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product: product
        },
        revalidate: 60 * 60 * 24
    }
}


/*
export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const { slug } = params as { slug: string }
    const product = await dbProduct.getProductBySlug(slug)

    // Redirigir al usuario a la pagina pricipal si no hay productos
    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props :{ 
            product: product
        }
    }
}
*/

export default ProductPage