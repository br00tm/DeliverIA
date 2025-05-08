import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography,
  TextField, 
  Button, 
  Paper, 
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  Rating,
  Avatar,
  Tooltip,
  LinearProgress,
  alpha,
  IconButton
} from '@mui/material'
import { 
  Restaurant, 
  Add, 
  LocalDining, 
  WhatshotOutlined, 
  FavoriteBorder, 
  Favorite, 
  Schedule, 
  HealthAndSafety,
  Info
} from '@mui/icons-material'
import apiService from '../services/apiService'
import type { MenuItem } from '../services/apiService'

const GroqTest = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isMedium = useMediaQuery(theme.breakpoints.down('md'))
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'))
  
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [promptSuggestions] = useState([
    "Quero opções vegetarianas ricas em proteína",
    "Preciso de refeições low-carb para atletas",
    "Sugestões para uma dieta vegana equilibrada",
    "Refeições com baixa caloria e rico em fibras"
  ])
  
  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion)
  }

  // Helper para obter URL de imagem otimizada para diferentes dispositivos
  const getOptimizedImageUrl = (name: string, isMobile: boolean) => {
    const formattedName = name.toLowerCase().replace(/\s+/g, '-')
    const size = isMobile ? '400x300' : '800x600'
    return `https://source.unsplash.com/random/${size}/?food-${formattedName}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setError('Por favor, insira um prompt com suas preferências alimentares')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Usar o endpoint específico para gerar cardápio personalizado
      const items = await apiService.generateCustomMenu(prompt, 4)
      
      // Otimizar imagens para dispositivos móveis
      const optimizedItems = items.map(item => ({
        ...item,
        image: item.image ? item.image : getOptimizedImageUrl(item.name, isMobile)
      }))
      
      setMenuItems(optimizedItems)
    } catch (err) {
      console.error('Erro ao gerar cardápio personalizado:', err)
      setError('Não foi possível gerar o cardápio personalizado. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item: MenuItem) => {
    // Aqui você implementaria a lógica para adicionar ao carrinho
    console.log('Item adicionado ao carrinho:', item)
    // Exibir feedback para o usuário
    setError(`${item.name} adicionado ao carrinho!`)
  }
  
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(itemId => itemId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }
  
  // Helper para calcular uma cor com base nos valores nutricionais
  const getNutrientColor = (value: number, type: 'protein' | 'carbs' | 'fat') => {
    let baseColor = theme.palette.primary.main
    
    if (type === 'protein') {
      baseColor = theme.palette.success.main
    } else if (type === 'carbs') {
      baseColor = theme.palette.warning.main
    } else if (type === 'fat') {
      baseColor = theme.palette.error.main
    }
    
    return baseColor
  }
  
  // Calcular a porcentagem para a barra de progresso
  const getProgressValue = (value: number, type: 'protein' | 'carbs' | 'fat') => {
    const maxValues = {
      protein: 50, // 50g como max para proteína
      carbs: 100,  // 100g como max para carboidratos
      fat: 40      // 40g como max para gordura
    }
    
    return Math.min(100, (value / maxValues[type]) * 100)
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: { xs: 2, md: 4 }, 
        mb: 4,
        background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.light, 0.05)})`,
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Fade in={true} timeout={800}>
        <Box>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center', 
              gap: 2, 
              mb: 4 
            }}
          >
            <Avatar 
              sx={{ 
                width: isMobile ? 50 : 60, 
                height: isMobile ? 50 : 60, 
                bgcolor: theme.palette.secondary.main,
                boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.4)}`
              }}
            >
              <Restaurant fontSize={isMobile ? "medium" : "large"} />
            </Avatar>
            <Box>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Cardápio Personalizado por IA
              </Typography>
              <Typography variant={isMobile ? "body2" : "subtitle1"} color="text.secondary">
                Descreva suas preferências e deixe nossa IA criar o cardápio ideal para você
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Sugestões:
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                my: 1
              }}
            >
              {promptSuggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={isMobile && suggestion.length > 25 ? suggestion.substring(0, 22) + '...' : suggestion}
                  onClick={() => useSuggestion(suggestion)}
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    borderRadius: 4, 
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Descreva suas preferências alimentares, restrições ou desejos"
              placeholder={isMobile ? "Ex: Opções vegetarianas ricas em proteína" : "Ex: Quero opções vegetarianas ricas em proteína, com baixo teor de carboidratos"}
              multiline
              rows={isMobile ? 2 : 3}
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover, &.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                  }
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading || !prompt.trim()}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LocalDining />}
                size={isMobile ? "medium" : "large"}
                sx={{ 
                  minWidth: isMobile ? 180 : 220,
                  py: isMobile ? 1 : 1.5,
                  borderRadius: 3,
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: `0 12px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                  }
                }}
              >
                {loading ? 'Gerando...' : (isMobile ? 'Gerar Cardápio' : 'Gerar Cardápio Personalizado')}
              </Button>
            </Box>
          </form>
          
          {loading && (
            <Box sx={{ my: 6 }}>
              <LinearProgress 
                sx={{ 
                  height: isMobile ? 6 : 8, 
                  borderRadius: 4,
                  mb: 2,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress size={isMobile ? 40 : 60} thickness={4} sx={{ mb: 2 }} />
                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 500 }}>
                  Criando seu cardápio personalizado...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center', px: 2 }}>
                  Nossa IA está analisando suas preferências e criando refeições exclusivas para você
                </Typography>
              </Box>
            </Box>
          )}
          
          {menuItems.length > 0 && !loading && (
            <Fade in={true} timeout={1000}>
              <Box>
                <Box sx={{ mb: 4, mt: 2, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    sx={{ 
                      fontWeight: 600,
                      position: 'relative',
                      mb: isMobile ? 1 : 0,
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.secondary.main
                      }
                    }}
                  >
                    Seu Cardápio Personalizado
                  </Typography>
                  <Tooltip title="As refeições são baseadas nas suas preferências e otimizadas para oferecer equilíbrio nutricional">
                    <IconButton size="small">
                      <Info fontSize="small" color="primary" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" sx={{ mb: 4 }}>
                  Refeições personalizadas baseadas na sua descrição: "<i>{isMobile && prompt.length > 60 ? prompt.substring(0, 57) + '...' : prompt}</i>"
                </Typography>
                
                <Grid container spacing={isMobile ? 2 : 3}>
                  {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={12} md={isLarge ? 4 : 6} lg={4} key={item.id}>
                      <Grow in={true} timeout={(index + 1) * 300}>
                        <Card 
                          sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            borderRadius: isMobile ? 2 : 3,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: isMobile ? 'none' : 'translateY(-8px)',
                              boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.15)}`
                            }
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height={isMobile ? 160 : 200}
                              image={item.image}
                              alt={item.name}
                              sx={{ 
                                objectFit: 'cover',
                                backgroundPosition: 'center center'
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1))',
                                opacity: 0.85
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                right: 16,
                                color: 'white'
                              }}
                            >
                              <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                {item.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Rating value={4 + Math.random()} precision={0.5} size="small" readOnly />
                                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                                  <Schedule fontSize="small" sx={{ fontSize: 16, mr: 0.5, opacity: 0.8 }} />
                                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    20-30 min
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {item.tags.slice(0, 3).map((tag, i) => (
                                  <Chip 
                                    key={i} 
                                    label={tag} 
                                    size="small" 
                                    sx={{ 
                                      height: 22, 
                                      fontSize: '0.7rem',
                                      backgroundColor: alpha(theme.palette.primary.light, 0.2),
                                      backdropFilter: 'blur(4px)'
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Box>
                            <IconButton
                              sx={{ 
                                position: 'absolute', 
                                top: 12, 
                                right: 12, 
                                color: 'white',
                                backgroundColor: alpha('#000', 0.2),
                                '&:hover': {
                                  backgroundColor: alpha('#000', 0.4)
                                }
                              }}
                              onClick={() => toggleFavorite(item.id)}
                            >
                              {favorites.includes(item.id) ? 
                                <Favorite sx={{ color: theme.palette.error.main }} /> : 
                                <FavoriteBorder />
                              }
                            </IconButton>
                          </Box>
                          
                          <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              {item.description}
                            </Typography>
                            
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                              <HealthAndSafety fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                              Informações Nutricionais
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                              <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption" fontWeight={500}>
                                    Calorias
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.nutrition.calories} kcal
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={Math.min(100, (item.nutrition.calories / 1000) * 100)} 
                                  sx={{ 
                                    height: isMobile ? 4 : 6, 
                                    borderRadius: 3,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor: theme.palette.primary.main
                                    }
                                  }} 
                                />
                              </Box>
                              
                              <Box sx={{ mb: 1, mt: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption" fontWeight={500}>
                                    Proteínas
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {item.nutrition.protein}g
                                  </Typography>
                                </Box>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={getProgressValue(item.nutrition.protein, 'protein')} 
                                  sx={{ 
                                    height: isMobile ? 4 : 6, 
                                    borderRadius: 3,
                                    backgroundColor: alpha(getNutrientColor(item.nutrition.protein, 'protein'), 0.1),
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor: getNutrientColor(item.nutrition.protein, 'protein')
                                    }
                                  }} 
                                />
                              </Box>
                              
                              <Grid container spacing={isMobile ? 1 : 2} sx={{ mt: 0.5 }}>
                                <Grid item xs={6}>
                                  <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                      <Typography variant="caption" fontWeight={500}>
                                        {isMobile ? 'Carbs.' : 'Carboidratos'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {item.nutrition.carbs}g
                                      </Typography>
                                    </Box>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={getProgressValue(item.nutrition.carbs, 'carbs')} 
                                      sx={{ 
                                        height: isMobile ? 4 : 6, 
                                        borderRadius: 3,
                                        backgroundColor: alpha(getNutrientColor(item.nutrition.carbs, 'carbs'), 0.1),
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 3,
                                          backgroundColor: getNutrientColor(item.nutrition.carbs, 'carbs')
                                        }
                                      }} 
                                    />
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                      <Typography variant="caption" fontWeight={500}>
                                        Gorduras
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {item.nutrition.fat}g
                                      </Typography>
                                    </Box>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={getProgressValue(item.nutrition.fat, 'fat')} 
                                      sx={{ 
                                        height: isMobile ? 4 : 6, 
                                        borderRadius: 3,
                                        backgroundColor: alpha(getNutrientColor(item.nutrition.fat, 'fat'), 0.1),
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 3,
                                          backgroundColor: getNutrientColor(item.nutrition.fat, 'fat')
                                        }
                                      }} 
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </CardContent>
                          
                          <Box sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography 
                              variant={isMobile ? "body1" : "h6"} 
                              sx={{ 
                                fontWeight: 700, 
                                color: theme.palette.primary.main,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Box component="span" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: 'normal', mr: 0.5 }}>R$</Box>
                              {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                            </Typography>
                            
                            <Button 
                              variant="contained" 
                              color="secondary"
                              startIcon={<Add />}
                              size={isMobile ? "small" : "medium"}
                              onClick={() => addToCart(item)}
                              sx={{ 
                                borderRadius: 6,
                                px: isMobile ? 1.5 : 2.5,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.3)}`,
                                '&:hover': {
                                  boxShadow: `0 6px 16px ${alpha(theme.palette.secondary.main, 0.4)}`
                                }
                              }}
                            >
                              {isMobile ? 'Add' : 'Adicionar'}
                            </Button>
                          </Box>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
          
          <Snackbar
            open={error !== null}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
          >
            <Alert 
              onClose={() => setError(null)} 
              severity={error?.includes('adicionado') ? 'success' : 'error'}
              sx={{ 
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {error}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Paper>
  )
}

export default GroqTest 