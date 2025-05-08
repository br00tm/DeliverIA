import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton, 
  Divider, 
  useTheme, 
  Stack,
  Button,
  TextField,
  alpha,
  useMediaQuery,
  Paper,
  Avatar
} from '@mui/material'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Restaurant, 
  Email, 
  Phone, 
  LocationOn, 
  Send, 
  KeyboardArrowUp
} from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'

const Footer = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isMedium = useMediaQuery(theme.breakpoints.down('md'))

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Box 
      sx={{ 
        mt: 'auto',
        position: 'relative',
        overflow: 'visible'
      }}
    >
      {/* Botão para voltar ao topo */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: -25, 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 10 
        }}
      >
        <IconButton 
          onClick={scrollToTop}
          sx={{ 
            backgroundColor: theme.palette.secondary.main,
            color: 'white',
            boxShadow: `0 4px 14px ${alpha(theme.palette.secondary.main, 0.4)}`,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
              transform: 'translateY(-4px)',
              boxShadow: `0 6px 20px ${alpha(theme.palette.secondary.main, 0.6)}`
            },
            transition: 'all 0.3s ease'
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Box>

      {/* Decoração de fundo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          backgroundImage: `
            radial-gradient(circle at 10% 10%, ${alpha(theme.palette.primary.light, 0.15)} 0%, transparent 20%),
            radial-gradient(circle at 90% 30%, ${alpha(theme.palette.secondary.light, 0.1)} 0%, transparent 20%),
            radial-gradient(circle at 30% 70%, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 25%)
          `,
          zIndex: -1
        }}
      />
    
      {/* Informações do rodapé */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.97),
          color: 'white',
          py: { xs: 6, md: 8 },
          borderRadius: 0,
          position: 'relative',
          backgroundImage: 'linear-gradient(160deg, rgba(34, 87, 122, 0.98) 0%, rgba(25, 55, 80, 0.98) 100%)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    mr: 1.5, 
                    bgcolor: '#fff',
                    color: theme.palette.primary.main,
                    width: 40,
                    height: 40
                  }}
                >
                  <Restaurant />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                  DeliverIA
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
                Refeições personalizadas com Inteligência Artificial, entregues na sua casa com rapidez e segurança.
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <IconButton 
                  color="inherit" 
                  aria-label="Facebook"
                  size="small"
                  sx={{ 
                    backgroundColor: alpha('#fff', 0.15),
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.25),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  aria-label="Twitter"
                  size="small"
                  sx={{ 
                    backgroundColor: alpha('#fff', 0.15),
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.25),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  aria-label="Instagram"
                  size="small"
                  sx={{ 
                    backgroundColor: alpha('#fff', 0.15),
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.25),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Instagram fontSize="small" />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  aria-label="LinkedIn"
                  size="small"
                  sx={{ 
                    backgroundColor: alpha('#fff', 0.15),
                    '&:hover': {
                      backgroundColor: alpha('#fff', 0.25),
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, pb: 1, position: 'relative', display: 'inline-block', '&:after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: theme.palette.secondary.main,
                bottom: 0,
                left: 0,
                borderRadius: '2px'
              }}}>
                Links Úteis
              </Typography>
              
              <Box component="nav">
                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Link 
                    component={RouterLink} 
                    to="/" 
                    color="inherit" 
                    underline="none"
                    sx={{ 
                      display: 'inline-block', 
                      opacity: 0.85,
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(5px)',
                        color: alpha(theme.palette.secondary.light, 0.9)
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Início
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/menu" 
                    color="inherit" 
                    underline="none"
                    sx={{ 
                      display: 'inline-block', 
                      opacity: 0.85,
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(5px)',
                        color: alpha(theme.palette.secondary.light, 0.9)
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Cardápio
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/ai-recommend" 
                    color="inherit" 
                    underline="none"
                    sx={{ 
                      display: 'inline-block', 
                      opacity: 0.85,
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(5px)',
                        color: alpha(theme.palette.secondary.light, 0.9)
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Recomendação IA
                  </Link>
                  <Link 
                    component={RouterLink} 
                    to="/profile" 
                    color="inherit" 
                    underline="none"
                    sx={{ 
                      display: 'inline-block', 
                      opacity: 0.85,
                      '&:hover': {
                        opacity: 1,
                        transform: 'translateX(5px)',
                        color: alpha(theme.palette.secondary.light, 0.9)
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Minha Conta
                  </Link>
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, pb: 1, position: 'relative', display: 'inline-block', '&:after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: theme.palette.secondary.main,
                bottom: 0,
                left: 0,
                borderRadius: '2px'
              }}}>
                Contato
              </Typography>
              
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ fontSize: 20, mr: 2, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    contato@deliveria.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ fontSize: 20, mr: 2, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    +55 (11) 91234-5678
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: 20, mr: 2, opacity: 0.7 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    São Paulo, SP - Brasil
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, pb: 1, position: 'relative', display: 'inline-block', '&:after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: theme.palette.secondary.main,
                bottom: 0,
                left: 0,
                borderRadius: '2px'
              }}}>
                Newsletter
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 3, opacity: 0.9, mb: 2 }}>
                Inscreva-se para receber dicas e promoções exclusivas:
              </Typography>
              
              <Box sx={{ display: 'flex' }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Seu e-mail"
                  fullWidth
                  sx={{
                    mr: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      backgroundColor: alpha('#fff', 0.08),
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: alpha('#fff', 0.2),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha('#fff', 0.3),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.secondary.main,
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: alpha('#fff', 0.5),
                      opacity: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ 
                    minWidth: 'auto',
                    borderRadius: 2,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                    '&:hover': {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`,
                    }
                  }}
                >
                  <Send fontSize="small" />
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ borderColor: alpha('#fff', 0.15), my: 4 }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © {new Date().getFullYear()} DeliverIA. Todos os direitos reservados.
            </Typography>
            
            {!isMobile && (
              <Box>
                <Link color="inherit" underline="hover" sx={{ fontSize: '0.875rem', opacity: 0.8, mr: 2 }}>
                  Termos de Uso
                </Link>
                <Link color="inherit" underline="hover" sx={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Política de Privacidade
                </Link>
              </Box>
            )}
          </Box>
        </Container>
      </Paper>
    </Box>
  )
}

export default Footer 