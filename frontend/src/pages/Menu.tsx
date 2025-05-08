import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Paper, 
  InputBase, 
  IconButton, 
  Tabs, 
  Tab, 
  Divider,
  Rating,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material'
import { 
  Search, 
  ShoppingCart, 
  Favorite, 
  FavoriteBorder,
  Star
} from '@mui/icons-material'

// Mock de dados para categorias
const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'bowls', name: 'Bowls' },
  { id: 'salads', name: 'Saladas' },
  { id: 'protein', name: 'Proteicos' },
  { id: 'vegan', name: 'Veganos' },
  { id: 'low-carb', name: 'Low Carb' },
  { id: 'desserts', name: 'Sobremesas' }
]

// Mock de dados para produtos (refeições)
const mockMeals = [
  {
    id: 1,
    name: 'Bowl Proteico de Frango',
    description: 'Bowl de frango grelhado com quinoa, legumes, abacate e molho especial',
    image: 'https://source.unsplash.com/random/800x600/?chicken-bowl',
    price: 35.90,
    rating: 4.8,
    reviewCount: 124,
    category: 'bowls',
    tags: ['Proteico', 'Low-carb', 'Sem Glúten'],
    calories: 450,
    protein: 32,
    carbs: 42,
    fat: 16,
    bestSeller: true
  },
  {
    id: 2,
    name: 'Salada Mediterrânea',
    description: 'Mix de folhas, grão-de-bico, azeitonas, tomate cereja, pepino e queijo feta com molho de limão',
    image: 'https://source.unsplash.com/random/800x600/?mediterranean-salad',
    price: 29.90,
    rating: 4.5,
    reviewCount: 87,
    category: 'salads',
    tags: ['Vegetariano', 'Rico em Fibras', 'Mediterrâneo'],
    calories: 380,
    protein: 18,
    carbs: 35,
    fat: 20
  },
  {
    id: 3,
    name: 'Wrap de Salmão',
    description: 'Wrap integral recheado com salmão defumado, cream cheese, rúcula e pepino',
    image: 'https://source.unsplash.com/random/800x600/?salmon-wrap',
    price: 32.90,
    rating: 4.7,
    reviewCount: 65,
    category: 'protein',
    tags: ['Omega-3', 'Proteico', 'Sem Lactose'],
    calories: 420,
    protein: 28,
    carbs: 38,
    fat: 18
  },
  {
    id: 4,
    name: 'Bowl Vegano Tropical',
    description: 'Mix de vegetais, frutas tropicais, tofu grelhado e castanhas com molho de coco',
    image: 'https://source.unsplash.com/random/800x600/?vegan-bowl',
    price: 31.90,
    rating: 4.6,
    reviewCount: 53,
    category: 'vegan',
    tags: ['Vegano', 'Rico em Fibras', 'Sem Glúten'],
    calories: 410,
    protein: 15,
    carbs: 48,
    fat: 19,
    bestSeller: true
  },
  {
    id: 5,
    name: 'Omelete Low Carb',
    description: 'Omelete recheado com espinafre, queijo, tomate e champignon',
    image: 'https://source.unsplash.com/random/800x600/?omelette',
    price: 26.90,
    rating: 4.4,
    reviewCount: 47,
    category: 'low-carb',
    tags: ['Low-carb', 'Keto', 'Proteico'],
    calories: 350,
    protein: 24,
    carbs: 8,
    fat: 24
  },
  {
    id: 6,
    name: 'Pudim Proteico',
    description: 'Pudim cremoso com proteína isolada, baixo açúcar e calda de frutas vermelhas',
    image: 'https://source.unsplash.com/random/800x600/?protein-pudding',
    price: 18.90,
    rating: 4.3,
    reviewCount: 32,
    category: 'desserts',
    tags: ['Proteico', 'Baixo Açúcar', 'Sobremesa'],
    calories: 220,
    protein: 20,
    carbs: 12,
    fat: 8
  },
  {
    id: 7,
    name: 'Buddha Bowl',
    description: 'Arroz integral, legumes assados, feijão preto, abacate e molho tahine',
    image: 'https://source.unsplash.com/random/800x600/?buddha-bowl',
    price: 33.90,
    rating: 4.9,
    reviewCount: 112,
    category: 'bowls',
    tags: ['Vegano', 'Integral', 'Rico em Fibras'],
    calories: 490,
    protein: 18,
    carbs: 62,
    fat: 16,
    bestSeller: true
  },
  {
    id: 8,
    name: 'Bowl de Açaí',
    description: 'Açaí batido com banana, coberto com granola, frutas frescas e mel',
    image: 'https://source.unsplash.com/random/800x600/?acai-bowl',
    price: 24.90,
    rating: 4.7,
    reviewCount: 89,
    category: 'desserts',
    tags: ['Energético', 'Antioxidantes', 'Frutas'],
    calories: 390,
    protein: 8,
    carbs: 68,
    fat: 12
  }
]

const Menu = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [meals, setMeals] = useState(mockMeals)
  
  // Simula carregar os dados quando a categoria muda
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      if (activeCategory === 'all') {
        setMeals(mockMeals)
      } else {
        const filteredMeals = mockMeals.filter(meal => meal.category === activeCategory)
        setMeals(filteredMeals)
      }
      setLoading(false)
    }, 500)
  }, [activeCategory])
  
  // Filtra os produtos com base na pesquisa
  useEffect(() => {
    if (searchTerm.trim() === '') {
      if (activeCategory === 'all') {
        setMeals(mockMeals)
      } else {
        const filteredMeals = mockMeals.filter(meal => meal.category === activeCategory)
        setMeals(filteredMeals)
      }
    } else {
      const searchResults = mockMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        meal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setMeals(searchResults)
    }
  }, [searchTerm, activeCategory])
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }
  
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }
  
  const addToCart = (meal: any) => {
    // Implementar lógica de adicionar ao carrinho
    console.log('Adicionado ao carrinho:', meal)
  }
  
  return (
    <Box>
      {/* Banner do cardápio */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: 3,
          backgroundImage: 'linear-gradient(rgba(34, 87, 122, 0.8), rgba(34, 87, 122, 1)), url(https://source.unsplash.com/random/1200x300/?healthy-food)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Cardápio DeliverIA
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Refeições saudáveis e deliciosas personalizadas para você
        </Typography>
        
        {/* Barra de pesquisa */}
        <Paper
          component="form"
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            width: { xs: '100%', md: '70%' },
            borderRadius: 30,
            bgcolor: 'white',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, color: 'text.primary' }}
            placeholder="Pesquisar refeições, ingredientes ou categorias..."
            inputProps={{ 'aria-label': 'search meals' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton
            type="button"
            sx={{
              p: '10px',
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              ml: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
            aria-label="search"
          >
            <Search />
          </IconButton>
        </Paper>
      </Paper>
      
      {/* Tabs de categorias */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={activeCategory} 
          onChange={(_, value) => handleCategoryChange(value)}
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="meal categories"
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={category.name}
              value={category.id}
              sx={{
                fontWeight: 500,
                borderRadius: '12px',
                mx: 1,
                px: 2,
                py: 1,
                backgroundColor: 'transparent',
                '&.Mui-selected': {
                  color: 'white',
                  backgroundColor: theme.palette.secondary.main,
                  fontWeight: 600
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.secondary.main, 0.2)
                }
              }}
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Lista de refeições */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : meals.length > 0 ? (
        <Grid container spacing={3}>
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={meal.image}
                    alt={meal.name}
                  />
                  <IconButton
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                    onClick={() => toggleFavorite(meal.id)}
                  >
                    {favorites.includes(meal.id) ? 
                      <Favorite color="error" /> : 
                      <FavoriteBorder />
                    }
                  </IconButton>
                  
                  {meal.bestSeller && (
                    <Chip 
                      icon={<Star fontSize="small" />}
                      label="Mais Vendido" 
                      size="small"
                      color="secondary"
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
                
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {meal.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={meal.rating} 
                      precision={0.1} 
                      size="small"
                      readOnly 
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({meal.reviewCount})
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {meal.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {meal.tags.map((tag: string) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      <strong>Calorias:</strong> {meal.calories} kcal
                    </Typography>
                    <Typography variant="body2">
                      <strong>Proteína:</strong> {meal.protein}g
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      R$ {meal.price.toFixed(2)}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      size="small"
                      onClick={() => addToCart(meal)}
                      startIcon={<ShoppingCart />}
                    >
                      Adicionar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma refeição encontrada para sua pesquisa.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tente outros termos ou categorias.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Menu 