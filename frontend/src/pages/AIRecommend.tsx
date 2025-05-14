import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  TextField, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material'
import { 
  Psychology, 
  CheckCircle, 
  RestaurantMenu,
  ShoppingCart 
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/apiService'
import type { 
  MealRecommendationRequest, 
  UserPreferences,
  Meal
} from '../services/apiService'
import GroqTest from '../components/GroqTest'

// Definição dos passos do processo de recomendação
const steps = ['Preferências', 'Restrições', 'Objetivos', 'Resultado']

// Mapeamento para converter valores front para back
const mapProteinValues: Record<string, string> = {
  'frango': 'frango',
  'carne': 'carne',
  'peixe': 'salmao',
  'vegetal': 'tofu'
}

const mapRestrictionValues: Record<string, string> = {
  'gluten': 'sem_gluten',
  'lactose': 'sem_lactose',
  'vegetariano': 'vegetariano',
  'vegano': 'vegano',
  'nozes': 'sem_nozes',
  'frutos-do-mar': 'sem_frutos_do_mar'
}

const AIRecommend = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Meal[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Estados para as preferências do usuário
  const [preferences, setPreferences] = useState({
    cuisineType: 'brasileira',
    mealType: 'almoco',
    spiceLevel: 2,
    preferredProtein: ['frango', 'peixe'],
    dietaryRestrictions: [] as string[],
    calories: [300, 800] as [number, number],
    goals: ''
  })
  
  const handleNext = async () => {
    if (activeStep === steps.length - 2) {
      // Chamar a API de IA
      await fetchRecommendations()
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }
  
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  
  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences({
      ...preferences,
      [field]: value
    })
  }
  
  const handleCheckboxChange = (field: string, value: string) => {
    const currentValues = preferences[field as keyof typeof preferences] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value]
    
    setPreferences({
      ...preferences,
      [field]: newValues
    })
  }
  
  const handleAddToCart = (meal: Meal) => {
    // Adicionar ao carrinho - na implementação real poderia usar o Context API ou Redux
    // Obter o carrinho atual do localStorage
    const currentCart = localStorage.getItem('cart')
    let cartItems = currentCart ? JSON.parse(currentCart) : []
    
    // Verificar se o item já existe no carrinho
    const existingItemIndex = cartItems.findIndex((item: any) => item.id === meal.id)
    
    if (existingItemIndex >= 0) {
      // Se o item já existe, incrementa a quantidade
      cartItems[existingItemIndex].quantity += 1
    } else {
      // Garantir que a imagem existe e é válida usando imagens dos pratos do menu
      let imageUrl;
      
      if (meal.image && meal.image.startsWith('http')) {
        imageUrl = meal.image;
      } else {
        // Usar imagens dos pratos do menu baseado no nome
        const dishName = meal.name.toLowerCase();
        if (dishName.includes('frango') || dishName.includes('proteico')) {
          imageUrl = 'https://static.wixstatic.com/media/611573_d4dbb2d55ab64755994f26e8891c04a7~mv2.jpg/v1/fit/w_700,h_700,al_c,q_80/file.png';
        } else if (dishName.includes('salada') || dishName.includes('mediterr')) {
          imageUrl = 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg';
        } else if (dishName.includes('salmão') || dishName.includes('peixe') || dishName.includes('wrap')) {
          imageUrl = 'https://www.saboresajinomoto.com.br/uploads/images/recipes/wrap-de-salmao.jpg';
        } else if (dishName.includes('vegano') || dishName.includes('vegetariano')) {
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
        } else if (dishName.includes('low-carb') || dishName.includes('omelete')) {
          imageUrl = 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/11/Omelete-low-carb-768x410.jpg';
        } else if (dishName.includes('pudim') || dishName.includes('sobremesa')) {
          imageUrl = 'https://www.apitadadopai.com/wp-content/webp-express/webp-images/uploads/2021/05/p1311253-1000x1000.jpg.webp';
        } else if (dishName.includes('buddha') || dishName.includes('bowl')) {
          imageUrl = 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg';
        } else if (dishName.includes('açaí') || dishName.includes('acai')) {
          imageUrl = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
        } else {
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'; // Imagem padrão
        }
      }
      
      // Se não existe, adiciona novo item com quantidade 1
      cartItems.push({
        ...meal,
        image: imageUrl,
        quantity: 1,
        tags: meal.tags || []
      })
    }
    
    // Salvar o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))
    
    // Disparar evento de atualização do carrinho
    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: { cartItems: cartItems }
    })
    window.dispatchEvent(cartUpdateEvent)
    
    // Feedback para o usuário
    alert(`${meal.name} foi adicionado ao carrinho!`)
    
    // Adicionar ao cardápio permanente também
    addToMenu(meal)
  }
  
  // Adicionar o prato ao menu
  const addToMenu = (meal: Meal) => {
    // Obter o cardápio atual do localStorage
    const currentMenu = localStorage.getItem('menu')
    let menuItems = currentMenu ? JSON.parse(currentMenu) : []
    
    // Verificar se o item já existe no cardápio
    const existingItemIndex = menuItems.findIndex((item: any) => item.id === meal.id)
    
    if (existingItemIndex < 0) {
      // Garantir que a imagem existe e é válida usando imagens dos pratos do menu
      let imageUrl;
      
      if (meal.image && meal.image.startsWith('http')) {
        imageUrl = meal.image;
      } else {
        // Usar imagens dos pratos do menu baseado no nome
        const dishName = meal.name.toLowerCase();
        if (dishName.includes('frango') || dishName.includes('proteico')) {
          imageUrl = 'https://static.wixstatic.com/media/611573_d4dbb2d55ab64755994f26e8891c04a7~mv2.jpg/v1/fit/w_700,h_700,al_c,q_80/file.png';
        } else if (dishName.includes('salada') || dishName.includes('mediterr')) {
          imageUrl = 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg';
        } else if (dishName.includes('salmão') || dishName.includes('peixe') || dishName.includes('wrap')) {
          imageUrl = 'https://www.saboresajinomoto.com.br/uploads/images/recipes/wrap-de-salmao.jpg';
        } else if (dishName.includes('vegano') || dishName.includes('vegetariano')) {
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
        } else if (dishName.includes('low-carb') || dishName.includes('omelete')) {
          imageUrl = 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/11/Omelete-low-carb-768x410.jpg';
        } else if (dishName.includes('pudim') || dishName.includes('sobremesa')) {
          imageUrl = 'https://www.apitadadopai.com/wp-content/webp-express/webp-images/uploads/2021/05/p1311253-1000x1000.jpg.webp';
        } else if (dishName.includes('buddha') || dishName.includes('bowl')) {
          imageUrl = 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg';
        } else if (dishName.includes('açaí') || dishName.includes('acai')) {
          imageUrl = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
        } else {
          imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'; // Imagem padrão
        }
      }
      
      // Se não existe, adiciona ao cardápio
      menuItems.push({
        ...meal,
        image: imageUrl,
        tags: meal.tags || [],
        category: 'ia-recommend'
      })
      
      // Salvar o cardápio atualizado no localStorage
      localStorage.setItem('menu', JSON.stringify(menuItems))
    }
  }
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mapear proteínas preferidas para valores da API
      const mappedProteins = preferences.preferredProtein.map(protein => 
        mapProteinValues[protein] || protein
      )
      
      // Mapear restrições para valores da API
      const mappedRestrictions = preferences.dietaryRestrictions.map(restriction =>
        mapRestrictionValues[restriction] || restriction
      )
      
      // Criar o payload para a API
      const requestPayload: MealRecommendationRequest = {
        preferences: {
          cuisine_type: preferences.cuisineType,
          meal_type: preferences.mealType,
          spice_level: preferences.spiceLevel,
          preferred_protein: mappedProteins
        },
        dietary_restrictions: mappedRestrictions,
        calories_range: preferences.calories,
        goals: preferences.goals || undefined
      }
      
      // Chamar a API
      const response = await apiService.getRecommendations(requestPayload)
      
      // Processar resposta - adicionando imagens para mock
      const processedRecommendations = response.map(meal => {
        // Usar URLs de imagem estáticas dos pratos do Menu
        let imageUrl;
        
        if (meal.image && meal.image.startsWith('http')) {
          imageUrl = meal.image;
        } else {
          // Usar imagens dos pratos do menu baseado no nome
          const dishName = meal.name.toLowerCase();
          if (dishName.includes('frango') || dishName.includes('proteico')) {
            imageUrl = 'https://static.wixstatic.com/media/611573_d4dbb2d55ab64755994f26e8891c04a7~mv2.jpg/v1/fit/w_700,h_700,al_c,q_80/file.png';
          } else if (dishName.includes('salada') || dishName.includes('mediterr')) {
            imageUrl = 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg';
          } else if (dishName.includes('salmão') || dishName.includes('peixe') || dishName.includes('wrap')) {
            imageUrl = 'https://www.saboresajinomoto.com.br/uploads/images/recipes/wrap-de-salmao.jpg';
          } else if (dishName.includes('vegano') || dishName.includes('vegetariano')) {
            imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
          } else if (dishName.includes('low-carb') || dishName.includes('omelete')) {
            imageUrl = 'https://www.mundoboaforma.com.br/wp-content/uploads/2021/11/Omelete-low-carb-768x410.jpg';
          } else if (dishName.includes('pudim') || dishName.includes('sobremesa')) {
            imageUrl = 'https://www.apitadadopai.com/wp-content/webp-express/webp-images/uploads/2021/05/p1311253-1000x1000.jpg.webp';
          } else if (dishName.includes('buddha') || dishName.includes('bowl')) {
            imageUrl = 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg';
          } else if (dishName.includes('açaí') || dishName.includes('acai')) {
            imageUrl = 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
          } else {
            imageUrl = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'; // Imagem padrão
          }
        }
        
        return {
          ...meal,
          image: imageUrl,
          price: meal.price || (25 + Math.random() * 20) // Mock de preço se não existir
        }
      })
      
      setRecommendations(processedRecommendations)
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    } catch (err) {
      console.error('Erro ao obter recomendações:', err)
      setError('Não foi possível obter recomendações. Tente novamente mais tarde.')
      
      // Em desenvolvimento, use dados mock para continuar o fluxo
      if (import.meta.env.DEV) {
        // Mock para desenvolvimento
        const mockRecommendations = [
          {
            id: 1,
            name: 'Bowl Proteico de Frango',
            description: 'Bowl de frango grelhado com quinoa, legumes, abacate e molho especial',
            image: 'https://static.wixstatic.com/media/611573_d4dbb2d55ab64755994f26e8891c04a7~mv2.jpg/v1/fit/w_700,h_700,al_c,q_80/file.png',
            price: 35.90,
            calories: 450,
            protein: 32,
            carbs: 42,
            fat: 16,
            tags: ['Proteico', 'Low-carb', 'Sem Glúten'],
            nutrition: {
              calories: 450,
              protein: 32,
              carbs: 42,
              fat: 16
            },
            ai_explanation: "Esta refeição é ideal para você porque contém 32g de proteína e apenas 16g de gordura."
          },
          {
            id: 2,
            name: 'Salada Mediterrânea',
            description: 'Mix de folhas, grão-de-bico, azeitonas, tomate cereja, pepino e queijo feta com molho de limão',
            image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
            price: 29.90,
            calories: 380,
            protein: 18,
            carbs: 35,
            fat: 20,
            tags: ['Vegetariano', 'Rico em Fibras', 'Mediterrâneo'],
            nutrition: {
              calories: 380,
              protein: 18,
              carbs: 35,
              fat: 20
            },
            ai_explanation: "Recomendamos esta opção porque se alinha com suas preferências alimentares e oferece um bom equilíbrio nutricional."
          },
          {
            id: 3,
            name: 'Wrap de Salmão',
            description: 'Wrap integral recheado com salmão defumado, cream cheese, rúcula e pepino',
            image: 'https://www.saboresajinomoto.com.br/uploads/images/recipes/wrap-de-salmao.jpg',
            price: 32.90,
            calories: 420,
            protein: 28,
            carbs: 38,
            fat: 18,
            tags: ['Omega-3', 'Proteico', 'Sem Lactose'],
            nutrition: {
              calories: 420,
              protein: 28,
              carbs: 38,
              fat: 18
            },
            ai_explanation: "Com base na sua dieta, esta é uma excelente escolha que fornece nutrientes essenciais dentro da faixa calórica desejada."
          }
        ]
        
        setRecommendations(mockRecommendations)
        setActiveStep(prevActiveStep => prevActiveStep + 1)
      }
    } finally {
      setLoading(false)
    }
  }
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Preferências
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preferências Culinárias
            </Typography>
            
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Tipo de Cozinha</FormLabel>
              <RadioGroup
                row
                value={preferences.cuisineType}
                onChange={(e) => handlePreferenceChange('cuisineType', e.target.value)}
              >
                <FormControlLabel value="brasileira" control={<Radio />} label="Brasileira" />
                <FormControlLabel value="italiana" control={<Radio />} label="Italiana" />
                <FormControlLabel value="japonesa" control={<Radio />} label="Japonesa" />
                <FormControlLabel value="mediterrânea" control={<Radio />} label="Mediterrânea" />
                <FormControlLabel value="mexicana" control={<Radio />} label="Mexicana" />
              </RadioGroup>
            </FormControl>
            
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Tipo de Refeição</FormLabel>
              <RadioGroup
                row
                value={preferences.mealType}
                onChange={(e) => handlePreferenceChange('mealType', e.target.value)}
              >
                <FormControlLabel value="café" control={<Radio />} label="Café da Manhã" />
                <FormControlLabel value="almoco" control={<Radio />} label="Almoço" />
                <FormControlLabel value="jantar" control={<Radio />} label="Jantar" />
                <FormControlLabel value="lanche" control={<Radio />} label="Lanche" />
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Nível de Tempero</Typography>
              <Slider
                value={preferences.spiceLevel}
                min={0}
                max={5}
                step={1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, value) => handlePreferenceChange('spiceLevel', value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">Suave</Typography>
                <Typography variant="caption">Médio</Typography>
                <Typography variant="caption">Picante</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Proteínas Preferidas</Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.preferredProtein.includes('frango')}
                    onChange={() => handleCheckboxChange('preferredProtein', 'frango')}
                  />
                }
                label="Frango"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.preferredProtein.includes('carne')}
                    onChange={() => handleCheckboxChange('preferredProtein', 'carne')}
                  />
                }
                label="Carne Vermelha"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.preferredProtein.includes('peixe')}
                    onChange={() => handleCheckboxChange('preferredProtein', 'peixe')}
                  />
                }
                label="Peixe"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.preferredProtein.includes('vegetal')}
                    onChange={() => handleCheckboxChange('preferredProtein', 'vegetal')}
                  />
                }
                label="Proteína Vegetal"
              />
            </Box>
          </Box>
        )
      
      case 1: // Restrições
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Restrições Alimentares
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Nos informe sobre suas restrições alimentares para recomendarmos refeições adequadas para você.
            </Alert>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.dietaryRestrictions.includes('gluten')}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', 'gluten')}
                  />
                }
                label="Sem Glúten"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.dietaryRestrictions.includes('lactose')}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', 'lactose')}
                  />
                }
                label="Sem Lactose"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.dietaryRestrictions.includes('vegetariano')}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', 'vegetariano')}
                  />
                }
                label="Vegetariano"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.dietaryRestrictions.includes('vegano')}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', 'vegano')}
                  />
                }
                label="Vegano"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.dietaryRestrictions.includes('nozes')}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', 'nozes')}
                  />
                }
                label="Alergia a Nozes"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={preferences.dietaryRestrictions.includes('frutos-do-mar')}
                    onChange={() => handleCheckboxChange('dietaryRestrictions', 'frutos-do-mar')}
                  />
                }
                label="Alergia a Frutos do Mar"
              />
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Typography gutterBottom>Faixa de Calorias (kcal)</Typography>
              <Slider
                value={preferences.calories}
                min={100}
                max={1500}
                step={50}
                valueLabelDisplay="auto"
                onChange={(_, value) => handlePreferenceChange('calories', value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption">{preferences.calories[0]} kcal</Typography>
                <Typography variant="caption">{preferences.calories[1]} kcal</Typography>
              </Box>
            </Box>
          </Box>
        )
      
      case 2: // Objetivos
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Seus Objetivos
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Conte-nos um pouco sobre seus objetivos para personalizarmos melhor suas recomendações.
            </Alert>
            
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Objetivo Principal</FormLabel>
              <RadioGroup
                value={preferences.goals}
                onChange={(e) => handlePreferenceChange('goals', e.target.value)}
              >
                <FormControlLabel value="emagrecimento" control={<Radio />} label="Emagrecimento" />
                <FormControlLabel value="manutencao" control={<Radio />} label="Manutenção do Peso" />
                <FormControlLabel value="ganho-muscular" control={<Radio />} label="Ganho de Massa Muscular" />
                <FormControlLabel value="saude" control={<Radio />} label="Saúde Geral" />
                <FormControlLabel value="energia" control={<Radio />} label="Mais Energia no Dia a Dia" />
              </RadioGroup>
            </FormControl>
            
            <TextField
              label="Alguma informação adicional que devemos saber?"
              multiline
              rows={4}
              fullWidth
              placeholder="Ex: Estou treinando para uma meia maratona, tenho diabetes tipo 2, etc."
              margin="normal"
            />
          </Box>
        )
      
      case 3: // Resultado
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Suas Refeições Personalizadas
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Nossa IA está preparando suas recomendações...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Analisando suas preferências e restrições para sugerir refeições perfeitas para você.
                </Typography>
              </Box>
            ) : (
              <>
                <Alert severity="success" sx={{ mb: 4 }}>
                  <Typography variant="body1">
                    Com base nas suas preferências, nossa IA recomenda as seguintes refeições:
                  </Typography>
                </Alert>
                
                <Grid container spacing={3}>
                  {recommendations.map((meal) => (
                    <Grid item xs={12} md={4} key={meal.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={meal.image}
                          alt={meal.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {meal.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {meal.description}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {meal.tags && meal.tags.map((tag: string) => (
                              <Chip key={tag} label={tag} size="small" color="secondary" variant="outlined" />
                            ))}
                          </Box>
                          
                          <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>IA diz:</strong> {meal.ai_explanation || "Esta refeição foi personalizada para você."}
                            </Typography>
                          </Alert>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2">
                              <strong>Calorias:</strong> {meal.nutrition.calories} kcal
                            </Typography>
                            <Typography variant="body2">
                              <strong>Proteína:</strong> {meal.nutrition.protein}g
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary">
                              R$ {meal.price?.toFixed(2)}
                            </Typography>
                            <Button 
                              variant="contained" 
                              color="secondary"
                              onClick={() => handleAddToCart(meal)}
                              endIcon={<ShoppingCart />}
                            >
                              Adicionar
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        )
      
      default:
        return 'Passo desconhecido'
    }
  }
  
  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 5, 
          mb: 4, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: 3
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              Recomendação Personalizada por IA
            </Typography>
            <Typography variant="body1">
              Nossa inteligência artificial analisa suas preferências, restrições e objetivos
              para recomendar refeições personalizadas que atendam às suas necessidades.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Psychology sx={{ fontSize: 120, opacity: 0.8 }} />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Componente de teste da API do Groq */}
      <GroqTest />
      
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            {activeStep !== 0 && (
              <Button 
                variant="outlined" 
                onClick={handleBack} 
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Voltar
              </Button>
            )}
            
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained"
                color="primary"
                onClick={() => navigate('/menu')}
                startIcon={<RestaurantMenu />}
              >
                Ver Cardápio Completo
              </Button>
            ) : (
              <Button 
                variant="contained"
                color="secondary"
                onClick={handleNext}
                disabled={loading}
                endIcon={activeStep === steps.length - 2 ? <Psychology /> : <CheckCircle />}
              >
                {activeStep === steps.length - 2 ? 'Obter Recomendações' : 'Próximo'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  )
}

export default AIRecommend 