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
  { id: 'desserts', name: 'Sobremesas' },
  { id: 'ia-recommend', name: 'Sugestões IA' }
]

// Mock de dados para produtos (refeições)
const mockMeals = [
  {
    id: 1,
    name: 'Bowl Proteico de Frango',
    description: 'Bowl de frango grelhado com quinoa, legumes, abacate e molho especial',
    image: 'https://static.wixstatic.com/media/611573_d4dbb2d55ab64755994f26e8891c04a7~mv2.jpg/v1/fit/w_700,h_700,al_c,q_80/file.png',
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
    image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
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
    image: 'https://www.saboresajinomoto.com.br/uploads/images/recipes/wrap-de-salmao.jpg',
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
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
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
    image: 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/11/Omelete-low-carb-768x410.jpg',
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
    image: 'https://www.apitadadopai.com/wp-content/webp-express/webp-images/uploads/2021/05/p1311253-1000x1000.jpg.webp',
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
    image: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg',
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
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg',
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
  const [meals, setMeals] = useState<any[]>([])
  
  // Função auxiliar para garantir que imagens existam
  const ensureValidImage = (item: any) => {
    if (item.image && item.image.startsWith('http')) {
      return item.image;
    } else {
      // Usar imagens dos pratos do menu baseado no nome
      const dishName = item.name.toLowerCase();
      if (dishName.includes('frango') || dishName.includes('proteico')) {
        return 'https://static.wixstatic.com/media/611573_d4dbb2d55ab64755994f26e8891c04a7~mv2.jpg/v1/fit/w_700,h_700,al_c,q_80/file.png';
      } else if (dishName.includes('salada') || dishName.includes('mediterr')) {
        return 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg';
      } else if (dishName.includes('salmão') || dishName.includes('peixe') || dishName.includes('wrap')) {
        return 'https://www.saboresajinomoto.com.br/uploads/images/recipes/wrap-de-salmao.jpg';
      } else if (dishName.includes('vegano') || dishName.includes('vegetariano')) {
        return 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
      } else if (dishName.includes('low-carb') || dishName.includes('omelete')) {
        return 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/11/Omelete-low-carb-768x410.jpg';
      } else if (dishName.includes('pudim') || dishName.includes('sobremesa')) {
        return 'https://www.apitadadopai.com/wp-content/webp-express/webp-images/uploads/2021/05/p1311253-1000x1000.jpg.webp';
      } else if (dishName.includes('buddha') || dishName.includes('bowl')) {
        return 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg';
      } else if (dishName.includes('açaí') || dishName.includes('acai')) {
        return 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
      } else {
        return 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'; // Imagem padrão
      }
    }
  };

  // Carregar dados iniciais, incluindo pratos do localStorage
  useEffect(() => {
    const loadInitialData = () => {
      // Obter pratos do menu salvos no localStorage (vindos da recomendação IA)
      const savedMenu = localStorage.getItem('menu')
      const savedMenuItems = savedMenu ? JSON.parse(savedMenu) : []
      
      // Combinar com os dados mock
      const allMeals = [...mockMeals]
      
      // Adicionar pratos do localStorage que não estejam no mockMeals
      savedMenuItems.forEach((savedItem: any) => {
        if (!allMeals.find(meal => meal.id === savedItem.id)) {
          // Garantir que a imagem existe e é válida
          savedItem.image = ensureValidImage(savedItem);
          allMeals.push(savedItem)
        }
      })
      
      // Aplicar o filtro inicial baseado na categoria ativa
      if (activeCategory === 'all') {
        setMeals(allMeals)
      } else if (activeCategory === 'ia-recommend') {
        // Para a categoria IA, exibir apenas os pratos salvos do localStorage
        setMeals(savedMenuItems)
      } else {
        const filteredMeals = allMeals.filter(meal => meal.category === activeCategory)
        setMeals(filteredMeals)
      }
    }
    
    loadInitialData()
  }, [])
  
  // Simula carregar os dados quando a categoria muda
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      // Obter pratos do menu salvos no localStorage
      const savedMenu = localStorage.getItem('menu')
      const savedMenuItems = savedMenu ? JSON.parse(savedMenu) : []
      
      // Combinar com os dados mock para ter todos os pratos disponíveis
      const allMeals = [...mockMeals]
      
      // Adicionar pratos do localStorage que não estejam no mockMeals
      savedMenuItems.forEach((savedItem: any) => {
        if (!allMeals.find(meal => meal.id === savedItem.id)) {
          // Garantir que a imagem existe e é válida
          savedItem.image = ensureValidImage(savedItem);
          allMeals.push(savedItem)
        }
      })
      
      if (activeCategory === 'all') {
        setMeals(allMeals)
      } else if (activeCategory === 'ia-recommend') {
        // Para a categoria IA, exibir apenas os pratos salvos do localStorage
        setMeals(savedMenuItems)
      } else {
        const filteredMeals = allMeals.filter(meal => meal.category === activeCategory)
        setMeals(filteredMeals)
      }
      setLoading(false)
    }, 500)
  }, [activeCategory])
  
  // Filtra os produtos com base na pesquisa
  useEffect(() => {
    // Obter pratos do menu salvos no localStorage
    const savedMenu = localStorage.getItem('menu')
    const savedMenuItems = savedMenu ? JSON.parse(savedMenu) : []
    
    // Combinar com os dados mock para ter todos os pratos disponíveis
    const allMeals = [...mockMeals]
    
    // Adicionar pratos do localStorage que não estejam no mockMeals
    savedMenuItems.forEach((savedItem: any) => {
      if (!allMeals.find(meal => meal.id === savedItem.id)) {
        // Garantir que a imagem existe e é válida
        savedItem.image = ensureValidImage(savedItem);
        allMeals.push(savedItem)
      }
    })
    
    if (searchTerm.trim() === '') {
      if (activeCategory === 'all') {
        setMeals(allMeals)
      } else if (activeCategory === 'ia-recommend') {
        // Para a categoria IA, exibir apenas os pratos salvos do localStorage
        setMeals(savedMenuItems)
      } else {
        const filteredMeals = allMeals.filter(meal => meal.category === activeCategory)
        setMeals(filteredMeals)
      }
    } else {
      const searchResults = allMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        meal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (meal.tags && meal.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
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
    // Obter o carrinho atual do localStorage
    const currentCart = localStorage.getItem('cart')
    let cartItems = currentCart ? JSON.parse(currentCart) : []
    
    // Verificar se o item já existe no carrinho
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === meal.id)
    
    if (existingItemIndex >= 0) {
      // Se o item já existe, incrementa a quantidade
      cartItems[existingItemIndex].quantity += 1
    } else {
      // Garantir que a imagem é válida
      const imageUrl = ensureValidImage(meal);
      
      // Se não existe, adiciona novo item com quantidade 1
      cartItems.push({
        ...meal,
        image: imageUrl,
        quantity: 1
      })
    }
    
    // Salvar o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))
    
    // Dispara um evento personalizado para notificar outros componentes
    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: {
        cartItems: cartItems
      }
    })
    window.dispatchEvent(cartUpdateEvent)
    
    // Feedback para o usuário
    alert(`${meal.name} foi adicionado ao carrinho!`)
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
          backgroundImage: 'linear-gradient(rgba(34, 87, 122, 0.8), rgba(34, 87, 122, 1)), url(https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg)',
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