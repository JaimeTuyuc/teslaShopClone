import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { IProduct, ISize, IType, IUser } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProduct } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import { tesloApi } from '@/api';
import { Product } from '@/models';
import { useRouter } from 'next/router';

const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData {
    _id?: string
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    gender: string
}

interface Props {
    product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
    const router = useRouter()
    const [newTagValue, setNewTagValue] = useState<string>('')
    const fileIputRef = useRef<HTMLInputElement>(null)
    const [isSaving, setIsSaving ] = useState<boolean>(false)
    const { register, handleSubmit, formState: {errors}, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    })

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            // console.log(value, name, type, 'value-name-type')
            if (name === 'title') {
                const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll("'", '').toLowerCase() || ''
                setValue('slug', newSlug)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [watch, setValue])
    
    const onNewTag = () => {
        const newTag = newTagValue.trim().toLowerCase()
        setNewTagValue('')
        const currentTags = getValues('tags')
        if (currentTags.includes(newTag)) return
        
        currentTags.push(newTag)
    }

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter((t) => t !== tag)
        setValue('tags', updatedTags, { shouldValidate: true })
    }

    const onSubmit = async ( formData: FormData ) => {
        // console.log(formData, 'datos actualizados?')
        if (formData.images.length < 2) return
        
        setIsSaving(true)

        try {
            const { data } = await tesloApi({
                url: `/admin/products`,
                method: formData._id ? 'PUT' : 'POST',
                data: formData
            })

            // console.log(data, 'datos actualizados?*-*-*-*')

            if (!formData._id) {
                // TODO: REVISA??????
                router.replace(`/admin/products/${formData.slug}`)
            } else {
                setIsSaving(false)
            }
        } catch (error) {
            console.log(error, 'See console logs')
            if (isAxiosError(error)) {
                console.log('Unable to update the product')
            }
            setIsSaving(false)
        }
    }

    const onChangeSize = (size: ISize) => {
        const currentSizes = getValues('sizes')

        if (currentSizes.includes(size)) {
            return setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true })
        }

        setValue('sizes', [...currentSizes, size ], { shouldValidate: true })
    }

    const onFilesSelected = async ({target}: ChangeEvent<HTMLInputElement>) => {
        if (!target.files || target.files.length === 0) return
        
        console.log(target.files, 'las imagenes*-*-*-')

        
        try {
            for (const file of target.files) {
                const formData = new FormData()
                //console.log(file,  'cada archivo')
                formData.append('file', file)
                
                const { data } = await tesloApi.post(`/admin/upload`, formData)
                //console.log(data, 'datos')

                setValue('images', [...getValues('images'), data.message ], { shouldValidate: true })
            }
        } catch (error) {
            console.log(error, 'Images could not be uploaded')
        }
    }

    const onDeleteImage = (image: string) => {
        setValue('images', getValues('images').filter( img => img !== image), { shouldValidate: true })
    }

    return (
        <AdminLayout 
            title={'Product'} 
            subtitle={`Editing: ${product.title}`}
            // subTitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form
                onSubmit={ handleSubmit(onSubmit)}
            >
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}
                    >
                        Save
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Title"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Field required',
                                minLength: { value: 2, message: 'At least 2 characters' }
                            })}
                            error={ !!errors.title }
                            helperText= { errors.title?.message }
                        />

                        <TextField
                            label="Description"
                            variant="filled"
                            fullWidth 
                            multiline
                            rows={8}
                            sx={{ mb: 1 }}
                            {...register('description', {
                                required: 'Field required',
                                //minLength: { value: 2, message: 'At least 2 characters' }
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Inventory"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            {...register('inStock', {
                                required: 'Field required',
                                //minLength: { value: 2, message: 'At least 2 characters' }
                                min: { value: 0, message: 'At least 1 item needs to be added'}
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />
                        
                        <TextField
                            label="Price"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            {...register('price', {
                                required: 'Field required',
                                // minLength: { value: 2, message: 'At least 2 characters' }
                                min: { value: 0, message: 'Price needs to be greater than 0' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Type</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={ (e) => setValue('type', e.target.value as IType, { shouldValidate: true }) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')}
                                onChange={(e) => setValue('gender', e.target.value, { shouldValidate: true })}
                                // value={ status }
                                // onChange={ onStatusChanged }
                                //</FormControl>{...register('gender', {
                                    // required: 'Field required',
                                    // minLength: { value: 2, message: 'At least 2 characters' }
                                    // validate: (val) => val.trim().includes(' ') ? 'Should not include spaces' : undefined
                                //})}
                                // error={!!errors.slug}
                                // helperText={errors.slug?.message}
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Sizes</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={ getValues('sizes').includes(size as ISize)} />} 
                                        label={size} 
                                        onChange={() => onChangeSize(size as ISize)}
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'Field required',
                                // minLength: { value: 2, message: 'At least 2 characters' }
                                validate: (val) => val.trim().includes(' ') ? 'Should not include spaces' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Groups"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onChange={(e) => setNewTagValue(e.target.value)}
                            onKeyUp={ ({code}) => code === 'Space' ? onNewTag() : undefined}
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Images</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                onClick={ () => fileIputRef.current?.click()}
                            >
                                Upload Image
                            </Button>

                            <input
                                ref={ fileIputRef }
                                type='file'
                                multiple
                                accept='image/png, image/gif, image/jpeg'
                                style={{ display: 'none' }}
                                onChange={ onFilesSelected }
                            />

                            <Chip 
                                label="Must be at least 2 images"
                                color='error'
                                variant='outlined'
                                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none'}}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={img}
                                                    
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={ () => onDeleteImage(img)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = '' } = query;
    
    let product: IProduct | null

    if (slug === 'new') { 
        // add new product
        const tempProduct = JSON.parse(JSON.stringify(new Product()))
        delete tempProduct._id 
        tempProduct.images = ['img.jpg', 'img1.jpj']
        product = tempProduct
    } else {
        product = await dbProduct.getProductBySlug(slug.toString());
    }
    

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage