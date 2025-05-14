import { useState, useEffect } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Tooltip,
  alpha,
  Fade,
  Slide,
  ListItemButton
} from '@mui/material'
import { 
  ShoppingCart, 
  Person, 
  Menu as MenuIcon,
  Psychology,
  Home,
  RestaurantMenu,
  Login,
  Logout,
  ReceiptLong,
  Tune,
  Settings,
  FavoriteBorder
} from '@mui/icons-material'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()
  
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  
  // Detectar rolagem da página para efeitos visuais
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])
  
  // Carregar a contagem de itens do carrinho do localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = localStorage.getItem('cart')
      if (cartItems) {
        const items = JSON.parse(cartItems)
        const count = items.reduce((acc: number, item: any) => acc + item.quantity, 0)
        setCartItemCount(count)
      } else {
        setCartItemCount(0)
      }
    }
    
    // Atualizar a contagem ao montar o componente
    updateCartCount()
    
    // Configurar o ouvinte de eventos para atualizar quando o carrinho for modificado
    window.addEventListener('cartUpdated', updateCartCount)
    
    // Remover o ouvinte ao desmontar
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }
    setDrawerOpen(open)
  }
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }
  
  const menuItems = [
    { text: 'Início', icon: <Home />, path: '/' },
    { text: 'Cardápio', icon: <RestaurantMenu />, path: '/menu' },
    { text: 'Recomendação IA', icon: <Psychology />, path: '/ai-recommend' },
    { text: 'Favoritos', icon: <FavoriteBorder />, path: '/favorites' },
    { text: 'Carrinho', icon: <ShoppingCart />, path: '/cart' }
  ]
  
  const drawer = (
    <Box
      sx={{ 
        width: 280,
        height: '100%',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        py: 3, 
        px: 3, 
        display: 'flex', 
        alignItems: 'center',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: 'white',
        borderRadius: '0 0 24px 0'
      }}>
        <Avatar 
          sx={{ 
            bgcolor: 'white', 
            color: theme.palette.primary.main,
            width: 40,
            height: 40,
            mr: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          <RestaurantMenu fontSize="small" />
        </Avatar>
        <Typography variant="h6" fontWeight="bold">DeliverIA</Typography>
      </Box>
      
      <List sx={{ mt: 2, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem 
            disablePadding
            key={item.text} 
            sx={{ mb: 1 }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                py: 1.2,
                backgroundColor: isActiveRoute(item.path) 
                  ? alpha(theme.palette.primary.main, 0.12)
                  : 'transparent',
                color: isActiveRoute(item.path)
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                }
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: isActiveRoute(item.path)
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.path) ? 600 : 400
                }}
              />
              {item.text === 'Recomendação IA' && (
                <Box
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    px: 1,
                    py: 0.3,
                    borderRadius: 10,
                    ml: 1
                  }}
                >
                  IA
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2, mx: 2 }} />
      
      <List sx={{ px: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => { navigate('/profile'); setDrawerOpen(false); }}
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Minha Conta" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => { navigate('/profile/orders'); setDrawerOpen(false); }}
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ReceiptLong />
            </ListItemIcon>
            <ListItemText primary="Meus Pedidos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ 
              borderRadius: 2, 
              py: 1.2,
              color: theme.palette.error.main
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )
  
  return (
    <Slide appear={false} direction="down" in={!scrolled}>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={scrolled ? 2 : 1}
        sx={{
          bgcolor: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, scrolled ? 0.2 : 0.1)}`,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters
            sx={{ 
              height: scrolled ? (isMobile ? 64 : 70) : (isMobile ? 70 : 80),
              transition: 'height 0.3s ease-in-out',
              px: 2
            }}
          >
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ 
                    mr: 1.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.1)
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={drawerOpen}
                  onClose={toggleDrawer(false)}
                >
                  {drawer}
                </Drawer>
              </>
            ) : null}
            
            <Box 
              component={RouterLink} 
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: 4
              }}
            >
              <Box
                sx={{
                  bgcolor: theme.palette.primary.main,
                  borderRadius: '50%',
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  boxShadow: '0 2px 6px rgba(244, 67, 54, 0.3)'
                }}
              >
                <RestaurantMenu sx={{ color: 'white', fontSize: isMobile ? '1.2rem' : '1.4rem' }} />
              </Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{ 
                  flexGrow: isMobile ? 1 : 0, 
                  color: 'white',
                  fontWeight: 700,
                  letterSpacing: '-0.02em'
                }}
              >
                DeliverIA
              </Typography>
            </Box>
            
            {!isMobile && (
              <Fade in={true}>
                <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/"
                    sx={{ 
                      mr: 2, 
                      borderRadius: 0,
                      px: 2,
                      py: 2.5,
                      color: isActiveRoute('/') ? theme.palette.primary.light : 'rgba(255,255,255,0.8)',
                      fontWeight: 500,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'white'
                      },
                      ...(isActiveRoute('/') && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor: theme.palette.primary.main
                        }
                      })
                    }}
                  >
                    Início
                  </Button>
                  
                  <Button
                    component={RouterLink}
                    to="/menu"
                    sx={{ 
                      mr: 2, 
                      borderRadius: 0,
                      px: 2,
                      py: 2.5,
                      color: isActiveRoute('/menu') ? theme.palette.primary.light : 'rgba(255,255,255,0.8)',
                      fontWeight: 500,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'white'
                      },
                      ...(isActiveRoute('/menu') && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor: theme.palette.primary.main
                        }
                      })
                    }}
                  >
                    Cardápio
                  </Button>
                  
                  <Button
                    component={RouterLink}
                    to="/ai-recommend"
                    startIcon={<Psychology sx={{ color: isActiveRoute('/ai-recommend') ? theme.palette.primary.light : 'inherit' }} />}
                    sx={{ 
                      mr: 2, 
                      borderRadius: 0,
                      px: 2,
                      py: 2.5,
                      color: isActiveRoute('/ai-recommend') ? theme.palette.primary.light : 'rgba(255,255,255,0.8)',
                      fontWeight: 500,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'white'
                      },
                      ...(isActiveRoute('/ai-recommend') && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '3px',
                          backgroundColor: theme.palette.primary.main
                        }
                      })
                    }}
                  >
                    Recomendação IA
                  </Button>
                </Box>
              </Fade>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Carrinho">
                <IconButton
                  color="primary"
                  component={RouterLink}
                  to="/cart"
                  sx={{ 
                    position: 'relative',
                    mr: { xs: 1, sm: 2 },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Badge 
                    badgeContent={cartItemCount} 
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    <ShoppingCart sx={{ color: 'white' }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Perfil">
                <IconButton
                  edge="end"
                  aria-label="conta do usuário"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ 
                    ml: { xs: 0, sm: 1 },
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: theme.palette.primary.dark,
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Person fontSize="medium" />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 1,
                    minWidth: 200,
                    mt: 1,
                    bgcolor: '#1e1e1e',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.2,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="white">João Silva</Typography>
                  <Typography variant="body2" color="text.secondary">joao@email.com</Typography>
                </Box>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile') }}>
                  <ListItemIcon>
                    <Person fontSize="small" sx={{ color: theme.palette.primary.light }} />
                  </ListItemIcon>
                  <Typography color="white">Minha Conta</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile/orders') }}>
                  <ListItemIcon>
                    <ReceiptLong fontSize="small" sx={{ color: theme.palette.primary.light }} />
                  </ListItemIcon>
                  <Typography color="white">Meus Pedidos</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile/preferences') }}>
                  <ListItemIcon>
                    <Tune fontSize="small" sx={{ color: theme.palette.primary.light }} />
                  </ListItemIcon>
                  <Typography color="white">Preferências</Typography>
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                <MenuItem onClick={handleMenuClose} sx={{ color: theme.palette.error.main }}>
                  <ListItemIcon sx={{ color: theme.palette.error.main }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  )
}

export default Navbar 