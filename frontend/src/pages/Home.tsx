import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container, Paper, Stack, Divider, Avatar, Rating } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Psychology, Fastfood, LocalShipping, Payments, RocketLaunch, RestaurantMenu, HealthAndSafety, FitnessCenter } from '@mui/icons-material'

const Home = () => {
  const navigate = useNavigate()

  // Features principais do aplicativo
  const features = [
    {
      title: 'Refeições Personalizadas por IA',
      description: 'Nossa IA analisa suas preferências, restrições e objetivos para criar refeições perfeitas para você',
      image: 'https://source.unsplash.com/random/400x300/?ai-cooking',
      icon: <Psychology fontSize="large" color="secondary" />
    },
    {
      title: 'Entrega em Tempo Real',
      description: 'Acompanhe sua entrega em tempo real com rotas otimizadas para a máxima rapidez',
      image: 'https://source.unsplash.com/random/400x300/?food-delivery',
      icon: <LocalShipping fontSize="large" color="secondary" />
    },
    {
      title: 'Programa de Fidelidade',
      description: 'Acumule pontos e ganhe cashback para usar em suas próximas compras',
      image: 'https://source.unsplash.com/random/400x300/?rewards',
      icon: <Payments fontSize="large" color="secondary" />
    }
  ]

  // Categorias populares
  const popularCategories = [
    {
      name: 'Low Carb',
      image: 'https://source.unsplash.com/random/300x300/?lowcarb-food',
      link: '/menu?category=low-carb'
    },
    {
      name: 'Proteico',
      image: 'https://source.unsplash.com/random/300x300/?protein-food',
      link: '/menu?category=protein'
    },
    {
      name: 'Vegano',
      image: 'https://source.unsplash.com/random/300x300/?vegan-food',
      link: '/menu?category=vegan'
    },
    {
      name: 'Fitness',
      image: 'https://source.unsplash.com/random/300x300/?fitness-food',
      link: '/menu?category=fitness'
    }
  ]

  // Depoimentos de clientes
  const testimonials = [
    {
      name: 'Ana Silva',
      photo: 'https://source.unsplash.com/random/100x100/?woman-portrait-1',
      rating: 5,
      text: 'As recomendações da IA são incríveis! Recebo refeições perfeitamente adaptadas para minha dieta low-carb.'
    },
    {
      name: 'João Medeiros',
      photo: 'https://source.unsplash.com/random/100x100/?man-portrait-1',
      rating: 5,
      text: 'Perdi 5kg em um mês seguindo as recomendações nutricionais do app. Comida deliciosa e saudável!'
    },
    {
      name: 'Mariana Costa',
      photo: 'https://source.unsplash.com/random/100x100/?woman-portrait-2',
      rating: 4,
      text: 'O sistema de entrega é super eficiente e consigo acompanhar em tempo real. Comida sempre chega quente!'
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: 500, md: 600 },
          overflow: 'hidden',
          borderRadius: 4,
          mb: 6,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(https://source.unsplash.com/random/1600x900/?healthy-food)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1
          }}
        />
        <Container
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'white',
            zIndex: 1,
            position: 'relative'
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              maxWidth: { md: '60%' }
            }}
          >
            Refeições personalizadas pela <Box component="span" sx={{ color: 'secondary.main' }}>Inteligência Artificial</Box>
          </Typography>
          
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: 4,
              textShadow: '0 1px 5px rgba(0,0,0,0.3)',
              maxWidth: { md: '50%' }
            }}
          >
            Alimentação saudável e deliciosa, adaptada às suas necessidades e entregue na sua porta
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/ai-recommend')}
              startIcon={<Psychology />}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Recomendação IA
            </Button>
            
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/menu')}
              startIcon={<RestaurantMenu />}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Ver Cardápio
            </Button>
          </Stack>
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 20, 
              left: 0, 
              right: 0, 
              display: 'flex', 
              justifyContent: 'center' 
            }}
          >
            <Box 
              sx={{ 
                backgroundColor: 'rgba(133, 129, 129, 0.9)', 
                color: 'text.primary',
                px: 4,
                py: 2,
                borderRadius: 50,
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
              }}
            >
              <Stack direction="row" spacing={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>1000+</Typography>
                  <Typography variant="body2">Clientes</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>4.9</Typography>
                  <Typography variant="body2">Avaliação</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>30min</Typography>
                  <Typography variant="body2">Entrega</Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Como Funciona */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Como Funciona
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Descubra como nossa inteligência artificial cria refeições personalizadas para você
          </Typography>
        </Box>
        
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img 
              src="https://source.unsplash.com/random/600x400/?ai-personalization" 
              alt="IA personalizando refeições"
              style={{ width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 50, 
                    height: 50,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  1
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Informe suas preferências e restrições
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Você nos diz suas preferências de sabor, alergias, intolerâncias e qualquer outra restrição alimentar.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 50, 
                    height: 50,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  2
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Nossa IA analisa e recomenda refeições
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    O algoritmo avançado analisa seus dados e cria refeições personalizadas que atendem exatamente às suas necessidades.
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 50, 
                    height: 50,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  3
                </Avatar>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Receba na sua porta com entrega otimizada
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Suas refeições são preparadas por chefs e entregues rapidamente usando rotas otimizadas por IA.
                  </Typography>
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                startIcon={<RocketLaunch />}
                onClick={() => navigate('/ai-recommend')}
                sx={{ mt: 2, alignSelf: 'flex-start' }}
              >
                Começar Agora
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
      
      {/* Características do Serviço */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 8 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Por que escolher a DeliverIA?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Conheça os diferenciais do nosso serviço de refeições personalizadas
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Categorias Populares */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Categorias Populares
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Encontre refeições que se adequam ao seu estilo de vida
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {popularCategories.map((category, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box 
                onClick={() => navigate(category.link)}
                sx={{ 
                  position: 'relative',
                  height: 200,
                  borderRadius: 4,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Box
                  component="img"
                  src={category.image}
                  alt={category.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    p: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h6">{category.name}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Benefícios para Saúde */}
      <Box sx={{ bgcolor: 'background.paper', py: 8, mb: 8 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Benefícios para sua Saúde
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Descubra como nossa alimentação personalizada pode melhorar sua qualidade de vida
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <FitnessCenter />
                  </Avatar>
                  <Typography variant="h5">Mais energia</Typography>
                </Box>
                <Typography variant="body1">
                  Alimentos balanceados que fornecem a energia necessária para o seu dia a dia, melhorando seu desempenho físico e mental.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <HealthAndSafety />
                  </Avatar>
                  <Typography variant="h5">Saúde otimizada</Typography>
                </Box>
                <Typography variant="body1">
                  Refeições personalizadas que consideram suas necessidades nutricionais específicas, ajudando a prevenir doenças e melhorar sua saúde.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Fastfood />
                  </Avatar>
                  <Typography variant="h5">Sabor incrível</Typography>
                </Box>
                <Typography variant="body1">
                  Não comprometemos o sabor. Nossas refeições são deliciosas e preparadas com ingredientes frescos e de alta qualidade.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Depoimentos */}
      <Container sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            O que nossos clientes dizem
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Histórias reais de pessoas que tiveram suas vidas transformadas pela DeliverIA
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    src={testimonial.photo} 
                    alt={testimonial.name}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">{testimonial.name}</Typography>
                    <Rating value={testimonial.rating} readOnly size="small" />
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mb: 2, flexGrow: 1 }}>
                  "{testimonial.text}"
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="caption" color="text.secondary">
                    Cliente desde 2023
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 4,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          mb: 6
        }}
      >
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Pronto para revolucionar sua alimentação?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
            Comece agora a receber refeições personalizadas pela inteligência artificial e transforme seu estilo de vida!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/ai-recommend')}
            sx={{ 
              px: 5, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Começar Agora
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default Home 