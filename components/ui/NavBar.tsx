import React, { FC, useContext, useState } from 'react'
import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography, Input, InputAdornment } from '@mui/material'
import NextLink from 'next/link'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { UiContext } from '@/context'

interface Props {

}

export const NavBar: FC<Props> = () => {
    const { asPath, push } = useRouter()
    const { isMenuOpen, handleSidebar } = useContext(UiContext)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [ isSearchVisible, setSearchVisible] = useState<boolean>(false)
    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        push(`/search/${searchTerm}`)
        // handleMenuOpen()
        setSearchTerm('')
    }
    const handleMenuOpen = () => {
        handleSidebar(!isMenuOpen)
    }
    const handleSideBarToggle = () => {
        handleSidebar(!isMenuOpen)
    }

    return (
        <>
            <AppBar >
                <Toolbar>
                    <NextLink
                        href={'/'}
                        style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                    >
                        <Typography variant='h6'>Tesla |</Typography>
                        <Typography marginLeft={0.5}>Shop</Typography>
                    </NextLink>
                    <Box flex={1} />
                    <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' }}}>
                        <NextLink
                            href={'/category/men'}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                color={ asPath === '/category/men' ? 'primary' : 'info'}
                            >Man</Button>
                                
                        </NextLink>
                        <NextLink
                            href={'/category/women'}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                color={ asPath === '/category/women' ? 'primary' : 'info'}
                            >Women</Button>
                        </NextLink>
                        <NextLink
                            href={'/category/kid'}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                color={ asPath === '/category/kid' ? 'primary' : 'info'}
                            >kids</Button>
                        </NextLink>
                    </Box>
                    <Box flex={1} />
                    {/** Button for big screens */}

                    {
                        isSearchVisible 
                            ? (
                                    <Input
                                        sx={{ display: { xs: 'none', md: 'flex'}}}
                                        autoFocus
                                        className='fadeIn'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={ (e) => e.key === 'Enter' && onSearchTerm()}
                                        type='text'
                                        placeholder="Buscar..."
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={ () => setSearchVisible(false)}
                                                >
                                                    <ClearOutlined />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />

                            ) : (
                                <IconButton
                                    onClick={() => setSearchVisible(true)}
                                    className='fadeIn'
                                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                                >
                                    <SearchOutlined />
                                </IconButton>
                            )
                    }


                    {/** Button for small screens */}
                    <IconButton
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                        onClick={handleSideBarToggle}
                    >
                        <SearchOutlined />
                    </IconButton>
                    <NextLink
                        href={'/cart'}
                    >
                        <IconButton>
                            <Badge badgeContent={2} variant='standard' color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </NextLink>
                    <Button
                        onClick={handleSideBarToggle}
                    >Menu</Button>
                </Toolbar>
            </AppBar>
        </>
    )
}