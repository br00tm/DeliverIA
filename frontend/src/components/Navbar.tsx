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
        elevation={scrolled ? 4 : 0}
        sx={{
          bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'background.default',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: `1px solid ${alpha(theme.palette.divider, scrolled ? 0.08 : 0)}`,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters
            sx={{ 
              height: scrolled ? (isMobile ? 64 : 70) : (isMobile ? 70 : 80),
              transition: 'height 0.3s ease-in-out'
            }}
          >
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ 
                    mr: 1.5,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
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
              <Avatar 
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  width: isMobile ? 36 : 40,
                  height: isMobile ? 36 : 40,
                  mr: 1.5,
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`
                }}
              >
                <RestaurantMenu fontSize={isMobile ? "small" : "medium"} />
              </Avatar>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{ 
                  flexGrow: isMobile ? 1 : 0, 
                  color: 'primary.main',
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
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
                    color="inherit"
                    component={RouterLink}
                    to="/"
                    sx={{ 
                      mr: 1.5, 
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      color: isActiveRoute('/') ? theme.palette.primary.main : 'text.primary',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      },
                      ...(isActiveRoute('/') && {
                        fontWeight: 500,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      })
                    }}
                  >
                    Início
                  </Button>
                  
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/menu"
                    sx={{ 
                      mr: 1.5, 
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      color: isActiveRoute('/menu') ? theme.palette.primary.main : 'text.primary',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      },
                      ...(isActiveRoute('/menu') && {
                        fontWeight: 500,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      })
                    }}
                  >
                    Cardápio
                  </Button>
                  
                  <Button
                    color="secondary"
                    variant="contained"
                    component={RouterLink}
                    to="/ai-recommend"
                    startIcon={<Psychology />}
                    sx={{ 
                      mr: 1.5,
                      boxShadow: '0 4px 12px rgba(87, 204, 153, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(87, 204, 153, 0.4)'
                      }
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
                  color="inherit"
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
                    badgeContent={2} 
                    color="secondary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Perfil">
                <IconButton
                  edge="end"
                  aria-label="conta do usuário"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{ 
                    ml: { xs: 0, sm: 1 },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.light, 0.1),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main
                    }}
                  >
                    <Person fontSize="small" />
                  </Box>
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
                    borderRadius: 2,
                    minWidth: 200,
                    mt: 1.5,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      }
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>João Silva</Typography>
                  <Typography variant="body2" color="text.secondary">joao@email.com</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile') }}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Minha Conta
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile/orders') }}>
                  <ListItemIcon>
                    <ReceiptLong fontSize="small" />
                  </ListItemIcon>
                  Meus Pedidos
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile/preferences') }}>
                  <ListItemIcon>
                    <Tune fontSize="small" />
                  </ListItemIcon>
                  Preferências
                </MenuItem>
                <Divider />
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