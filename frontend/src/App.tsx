import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Container, GlobalStyles } from '@mui/material'

// Páginas
import Home from './pages/Home'
import Menu from './pages/Menu'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import AIRecommend from './pages/AIRecommend'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderTracking from './pages/OrderTracking'
import PaymentPix from './pages/PaymentPix'

// Componentes
import Navbar from './components/Navbar'
import Footer from './components/Footer'

/**
 * DeliverIA - Sistema de delivery com IA
 * 
 * Melhorias de responsividade implementadas:
 * 1. Utilização de responsiveFontSizes para adaptar tipografia a diferentes tamanhos de tela
 * 2. Sistema de breakpoints personalizado para adaptação a diversos dispositivos
 * 3. Sistema de containers responsivos com padding adaptativo por breakpoint
 * 4. Componentes adaptados para mobile e desktop com useMediaQuery
 * 5. Transições e animações suaves para melhorar a experiência do usuário
 * 6. Implementação de tema escuro como padrão para melhor experiência visual
 * 7. Estilos globais para customização de scrollbars e comportamentos default
 * 8. Cards e elementos de UI com design adaptativo para diferentes tamanhos
 * 9. Navegação adaptativa (drawer em mobile, menu horizontal em desktop)
 * 10. Componentes com densidade ajustada para melhor uso em telas touchscreen
 * 11. Integração com Bootstrap para melhor responsividade e centralização
 * 12. Paleta de cores MinDark para uma experiência visual mais elegante
 * 13. Design mais arredondado e elementos com melhor encaixe
 */

let theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    secondary: {
      main: '#78909c',
      light: '#a7c0cd',
      dark: '#4b636e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ffa726',
    },
    success: {
      main: '#66bb6a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
    mode: 'dark',
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(244, 67, 54, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(120, 144, 156, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlinedPrimary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        outlinedSecondary: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
          borderRadius: 8,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-2px)',
          },
          backgroundColor: '#1e1e1e',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
        },
        elevation2: {
          boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
          padding: '4px 2px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: '#f44336',
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          backdropFilter: 'blur(8px)',
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.3)',
          color: '#ffffff',
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          backdropFilter: 'blur(10px)',
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 0',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          overflow: 'hidden',
        }
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// Aplicar fonte responsiva para todos os tamanhos de tela
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles 
        styles={(theme) => ({
          ':root': {
            '--swiper-theme-color': theme.palette.primary.main,
          },
          'html, body': {
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            overflowX: 'hidden',
          },
          a: {
            textDecoration: 'none',
            color: 'inherit',
            transition: 'color 0.3s ease',
          },
          'a:hover': {
            color: theme.palette.primary.main,
          },
          '::-webkit-scrollbar': {
            width: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: '#13121D',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#3F3D56',
            borderRadius: '3px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: '#5A5880',
          },
          '.fade-in': {
            animation: 'fadeIn 0.5s ease-in-out',
          },
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(10px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
          img: {
            maxWidth: '100%',
            height: 'auto'
          },
          '.responsive-grid': {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          },
          // Compatibilidade com Bootstrap no tema escuro
          '.bg-dark-custom': {
            backgroundColor: '#1A1A25 !important',
          },
          '.text-light-custom': {
            color: '#FFFFFE !important',
          },
          '.card-dark': {
            backgroundColor: '#1A1A25',
            borderColor: '#2D2B42',
          },
          '.border-dark-custom': {
            borderColor: '#2D2B42 !important',
          },
          // Sobrescrever alguns estilos do Bootstrap para o tema escuro
          '.btn-primary': {
            backgroundColor: '#64DFDF !important',
            borderColor: '#64DFDF !important',
            color: '#0F0E17 !important',
            borderRadius: '12px !important',
            padding: '12px 24px !important',
            boxShadow: '0px 4px 12px rgba(100, 223, 223, 0.2) !important',
            transition: 'all 0.3s ease !important',
            '&:hover': {
              backgroundColor: '#80FFDB !important',
              boxShadow: '0px 6px 15px rgba(100, 223, 223, 0.3) !important',
              transform: 'translateY(-2px) !important',
            }
          },
          '.btn-secondary': {
            backgroundColor: '#6C63FF !important',
            borderColor: '#6C63FF !important',
            color: '#FFFFFE !important',
            borderRadius: '12px !important',
            padding: '12px 24px !important',
            '&:hover': {
              backgroundColor: '#8A84FF !important',
              transform: 'translateY(-2px) !important',
              boxShadow: '0px 6px 15px rgba(108, 99, 255, 0.3) !important',
            }
          },
          // Estilos para o botão de perfil
          '.profile-button': {
            opacity: '0.7',
            transition: 'all 0.3s ease',
          },
          '.profile-button:hover': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
          // Melhorar o espaçamento e encaixe dos elementos
          '.container-custom': {
            padding: '2rem',
            borderRadius: '20px',
            backgroundColor: 'rgba(26, 26, 37, 0.6)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          },
          '.card-content': {
            padding: '1.5rem',
          },
          '.section-heading': {
            position: 'relative',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              width: '60px',
              backgroundColor: '#64DFDF',
              borderRadius: '2px',
            }
          },
          '.card-hover-effect': {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.18)',
            }
          },
          // Melhoria nos inputs
          '.form-control': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#FFFFFE',
            transition: 'all 0.3s ease',
            '&:focus': {
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              borderColor: '#64DFDF',
              boxShadow: '0 0 0 3px rgba(100, 223, 223, 0.15)',
              outline: 'none'
            }
          }
        })}
      />
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <Container 
            maxWidth="xl"
            className="container-fluid py-5"
            sx={{ 
              flex: 1, 
              transition: 'all 0.3s ease',
              mt: 2
            }}
          >
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/orders" element={<MyOrders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/ai-recommend" element={<AIRecommend />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                  <Route path="/payment-pix/:orderId" element={<PaymentPix />} />
                </Routes>
              </div>
            </div>
          </Container>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
