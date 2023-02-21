import { useContext, useState } from "react"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { UiContext, AuthContext } from "@/context"
import Link from "next/link"
import { useRouter } from "next/router"

export const SideMenu = () => {
    const router = useRouter()
    const { isMenuOpen, handleSidebar } = useContext(UiContext)
    const { user, isLoggedIn, logoutHandler } = useContext(AuthContext)

    const [searchTerm, setSearchTerm] = useState<string>('')
    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return
        router.push(`/search/${searchTerm}`)
        handleMenuOpen()
        setSearchTerm('')
    }
    const handleMenuOpen = () => {
        handleSidebar(!isMenuOpen)
    }

    const onLogout = () => {
        logoutHandler()
        router.replace(`/auth/login`)
    }

    const navigateTo = (url: string) => {
        router.push(url)
    }

    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={handleMenuOpen}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>

                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={ (e) => e.key === 'Enter' && onSearchTerm()}
                            type='text'
                            placeholder="Find..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    {
                        isLoggedIn && (
                            <>
                                <ListItem button>
                                    <ListItemIcon>
                                        <AccountCircleOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Profile'} />
                                </ListItem>

                                <ListItem button>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'My Orders'} />
                                </ListItem>
                            </>
                        )
                    }


                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <Link
                            href={`/category/men`}
                            style={{ textDecoration: 'none' }}
                            onClick={handleMenuOpen}
                        >
                        
                            <ListItemText primary={'Hombres'} />
                        </Link>
                    </ListItem>

                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <Link
                            href={`/category/women`}
                            style={{ textDecoration: 'none' }}
                            onClick={handleMenuOpen}
                        >
                        
                            <ListItemText primary={'Women'} />
                        </Link>
                    </ListItem>

                    <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <Link
                            href={`/category/kid`}
                            style={{ textDecoration: 'none' }}
                            onClick={handleMenuOpen}
                        >
                            <ListItemText primary={'Kids'} />
                        </Link>
                    </ListItem>


                    {
                        !isLoggedIn 
                            ? (
                                <ListItem
                                    button
                                    onClick={ () => navigateTo(`/auth/login?p=${router.asPath}`)}
                                >
                                    <ListItemIcon>
                                        <VpnKeyOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Login'} />
                                </ListItem>
                                
                            ) : (
                                <ListItem
                                    button
                                    onClick={onLogout}
                                >
                                    <ListItemIcon>
                                        <LoginOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Logout'} />
                                </ListItem>   
                        )
                    }



                    {/* Admin */}
                    {
                        user?.role === 'admin' && (
                            <>
                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItem button>
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Products'} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Orders'} />
                                </ListItem>

                                <ListItem button>
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Users'} />
                                </ListItem>
                            </>
                        )
                    }
                </List>
            </Box>
        </Drawer>
    )
}