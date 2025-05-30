import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Divider, 
  TextField, 
  Alert, 
  Chip
} from '@mui/material'
import { 
  Delete, 
  Add, 
  Remove, 
  ShoppingCart, 
  LocalOffer, 
  CreditCard
} from '@mui/icons-material'
import DeliveryDining from '@mui/icons-material/DeliveryDining'
import { useNavigate } from 'react-router-dom'

// Simulação de itens no carrinho
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  tags?: string[]
}

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Carregar itens do carrinho do localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart)
          setCartItems(parsedCart)
        } catch (error) {
          console.error('Erro ao carregar o carrinho:', error)
          setCartItems([])
        }
      }
    }
    
    loadCartItems()
    
    // Ouvir por atualizações no carrinho
    const handleCartUpdate = () => loadCartItems()
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])
  
  // Cálculos
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const deliveryFee = 5.90
  const discount = promoApplied ? subtotal * 0.1 : 0 // 10% de desconto se promo aplicado
  const total = subtotal + deliveryFee - discount
  
  // Manipulação de quantidade
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return // Não permitir quantidade menor que 1
    
    const updatedCartItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    
    setCartItems(updatedCartItems)
    localStorage.setItem('cart', JSON.stringify(updatedCartItems))
    
    // Disparar evento de atualização do carrinho
    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: { cartItems: updatedCartItems }
    })
    window.dispatchEvent(cartUpdateEvent)
  }
  
  // Remover item
  const removeItem = (id: number) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id)
    
    setCartItems(updatedCartItems)
    localStorage.setItem('cart', JSON.stringify(updatedCartItems))
    
    // Disparar evento de atualização do carrinho
    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: { cartItems: updatedCartItems }
    })
    window.dispatchEvent(cartUpdateEvent)
  }
  
  // Aplicar código promocional
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'deliveria10') {
      setPromoApplied(true)
      setError(null)
    } else {
      setError('Código promocional inválido')
      setPromoApplied(false)
    }
  }
  
  // Finalizar pedido e limpar carrinho
  const finalizarPedido = () => {
    if (isCartEmpty) return;
    
    // Gerar um ID único para o pedido
    const orderId = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Criar objeto de pedido
    const newOrder = {
      id: orderId,
      date: new Date(),
      status: 'pending',
      statusText: 'Em Preparo',
      items: [...cartItems],
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      total: total,
      deliveryAddress: 'Rua Exemplo, 123 - Bairro, Cidade - Estado',
      paymentMethod: 'PIX'
    };
    
    // Obter pedidos existentes do localStorage
    const existingOrdersJSON = localStorage.getItem('orders');
    const existingOrders = existingOrdersJSON ? JSON.parse(existingOrdersJSON) : [];
    
    // Adicionar novo pedido à lista
    existingOrders.unshift(newOrder);
    
    // Salvar pedidos atualizados no localStorage
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    // Limpar o carrinho
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Disparar evento de atualização do carrinho para refletir carrinho vazio
    const cartUpdateEvent = new CustomEvent('cartUpdated', {
      detail: { cartItems: [] }
    });
    window.dispatchEvent(cartUpdateEvent);
    
    // Redirecionar para checkout com o ID do pedido
    navigate(`/payment-pix/${orderId}`);
  };
  
  // Verificar se o carrinho está vazio
  const isCartEmpty = cartItems.length === 0
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Seu Carrinho
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: { xs: 3, md: 0 } }}>
            {isCartEmpty ? (
              <Box sx={{ 
                textAlign: 'center', 
                py: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Seu carrinho está vazio
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Adicione itens do nosso cardápio ou obtenha recomendações personalizadas
                </Typography>
                <Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/menu')}
                    sx={{ mr: 2 }}
                  >
                    Ver Cardápio
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => navigate('/ai-recommend')}
                  >
                    Recomendação IA
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Itens do Pedido ({cartItems.length})
                </Typography>
                
                <List disablePadding>
                  {cartItems.map((item) => (
                    <Box key={item.id}>
                      <ListItem sx={{ py: 2, px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="rounded"
                            sx={{ width: 80, height: 80, mr: 2 }}
                          />
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight={500}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              {item.tags && item.tags.map(tag => (
                                <Chip 
                                  key={tag} 
                                  label={tag} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ mr: 0.5, mb: 0.5 }} 
                                />
                              ))}
                            </Box>
                          }
                          sx={{ mr: 2 }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            size="small"
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            size="small"
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, minWidth: 80, textAlign: 'right' }}>
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </Typography>
                        
                        <IconButton 
                          onClick={() => removeItem(item.id)}
                          sx={{ ml: 1 }}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                </List>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    startIcon={<ShoppingCart />}
                    onClick={() => navigate('/menu')}
                  >
                    Continuar Comprando
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">R$ {subtotal.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Taxa de Entrega</Typography>
                <Typography variant="body1">R$ {deliveryFee.toFixed(2)}</Typography>
              </Box>
              
              {promoApplied && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" color="secondary">Desconto (10%)</Typography>
                  <Typography variant="body1" color="secondary">-R$ {discount.toFixed(2)}</Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">R$ {total.toFixed(2)}</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Código Promocional
              </Typography>
              
              <Box sx={{ display: 'flex' }}>
                <TextField
                  size="small"
                  placeholder="DELIVERIA10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <LocalOffer fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  error={Boolean(error)}
                  helperText={error}
                />
                <Button 
                  variant="outlined" 
                  sx={{ ml: 1 }}
                  onClick={applyPromoCode}
                >
                  Aplicar
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Alert severity="info" icon={<DeliveryDining />}>
                <Typography variant="body2">
                  Tempo estimado de entrega: 30-45 minutos
                </Typography>
              </Alert>
            </Box>
            
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              startIcon={<CreditCard />}
              onClick={finalizarPedido}
              disabled={isCartEmpty}
            >
              Finalizar Pedido
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Cart 