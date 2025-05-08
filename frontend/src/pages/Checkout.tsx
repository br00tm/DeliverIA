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
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  TextField, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { 
  ShoppingCart, 
  Check, 
  Pix, 
  CreditCard, 
  AccountBalance, 
  LocalOffer 
} from '@mui/icons-material'
import DeliveryDining from '@mui/icons-material/DeliveryDining'
import { useNavigate } from 'react-router-dom'

// Passos do checkout
const steps = ['Carrinho', 'Endereço de Entrega', 'Método de Pagamento', 'Confirmação']

// Mock de itens no carrinho
const cartItems = [
  {
    id: 1,
    name: 'Bowl Proteico de Frango',
    price: 35.90,
    quantity: 1,
    image: 'https://source.unsplash.com/random/80x80/?chicken-bowl'
  },
  {
    id: 4,
    name: 'Bowl Vegano Tropical',
    price: 31.90,
    quantity: 1,
    image: 'https://source.unsplash.com/random/80x80/?vegan-bowl'
  }
]

const Checkout = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  
  // Informações do pedido
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [cashbackApplied, setCashbackApplied] = useState(false)
  
  // Cálculos do pedido
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const deliveryFee = 5.90
  const discount = cashbackApplied ? subtotal * 0.1 : 0 // 10% de desconto para cashback
  const total = subtotal + deliveryFee - discount
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Processar pagamento/finalizar pedido
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setOrderComplete(true)
      }, 2000)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }
  
  const handleShippingAddressChange = (field: string, value: string) => {
    setShippingAddress({
      ...shippingAddress,
      [field]: value
    })
  }
  
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value)
  }
  
  const handleCashbackToggle = () => {
    setCashbackApplied(!cashbackApplied)
  }
  
  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Carrinho
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Itens no Carrinho
            </Typography>
            
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ py: 2, px: 0 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantidade: ${item.quantity}`}
                  />
                  <Typography variant="body1">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">
                  R$ {subtotal.toFixed(2)}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Taxa de Entrega" />
                <Typography variant="body1">
                  R$ {deliveryFee.toFixed(2)}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" sx={{ fontWeight: 700 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  R$ {total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Box>
        )
      
      case 1: // Endereço
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Endereço de Entrega
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  id="street"
                  name="street"
                  label="Rua"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.street}
                  onChange={(e) => handleShippingAddressChange('street', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  id="number"
                  name="number"
                  label="Número"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.number}
                  onChange={(e) => handleShippingAddressChange('number', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="complement"
                  name="complement"
                  label="Complemento"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.complement}
                  onChange={(e) => handleShippingAddressChange('complement', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="neighborhood"
                  name="neighborhood"
                  label="Bairro"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.neighborhood}
                  onChange={(e) => handleShippingAddressChange('neighborhood', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="zipCode"
                  name="zipCode"
                  label="CEP"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.zipCode}
                  onChange={(e) => handleShippingAddressChange('zipCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="Cidade"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.city}
                  onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="state"
                  name="state"
                  label="Estado"
                  fullWidth
                  variant="outlined"
                  value={shippingAddress.state}
                  onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        )
      
      case 2: // Pagamento
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Método de Pagamento
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <Paper elevation={paymentMethod === 'pix' ? 3 : 1} sx={{ mb: 2, p: 2, border: paymentMethod === 'pix' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'pix' ? 'secondary.main' : 'divider', borderRadius: 2 }}>
                  <FormControlLabel 
                    value="pix" 
                    control={<Radio color="secondary" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Pix color="action" sx={{ mr: 1 }} />
                        <Typography>Pix (pagamento instantâneo)</Typography>
                        <Chip 
                          size="small" 
                          label="Recomendado" 
                          color="secondary" 
                          sx={{ ml: 2 }} 
                        />
                      </Box>
                    } 
                  />
                </Paper>
                
                <Paper elevation={paymentMethod === 'credit' ? 3 : 1} sx={{ mb: 2, p: 2, border: paymentMethod === 'credit' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'credit' ? 'secondary.main' : 'divider', borderRadius: 2 }}>
                  <FormControlLabel 
                    value="credit" 
                    control={<Radio color="secondary" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCard color="action" sx={{ mr: 1 }} />
                        <Typography>Cartão de Crédito</Typography>
                      </Box>
                    } 
                  />
                </Paper>
                
                <Paper elevation={paymentMethod === 'bank' ? 3 : 1} sx={{ mb: 2, p: 2, border: paymentMethod === 'bank' ? '2px solid' : '1px solid', borderColor: paymentMethod === 'bank' ? 'secondary.main' : 'divider', borderRadius: 2 }}>
                  <FormControlLabel 
                    value="bank" 
                    control={<Radio color="secondary" />} 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountBalance color="action" sx={{ mr: 1 }} />
                        <Typography>Transferência Bancária</Typography>
                      </Box>
                    } 
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
            
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 3, 
                bgcolor: 'rgba(87, 204, 153, 0.1)', 
                border: '1px dashed',
                borderColor: 'secondary.main',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOffer color="secondary" sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  Usar 10% de Cashback do Programa de Fidelidade
                </Typography>
                <FormControlLabel
                  control={
                    <Radio
                      checked={cashbackApplied}
                      onChange={handleCashbackToggle}
                      color="secondary"
                    />
                  }
                  label=""
                />
              </Box>
              
              {cashbackApplied && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Você economizará R$ {discount.toFixed(2)} nesse pedido.
                  </Typography>
                </Box>
              )}
            </Paper>
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>
              
              <List disablePadding>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Subtotal" />
                  <Typography variant="body1">
                    R$ {subtotal.toFixed(2)}
                  </Typography>
                </ListItem>
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Taxa de Entrega" />
                  <Typography variant="body1">
                    R$ {deliveryFee.toFixed(2)}
                  </Typography>
                </ListItem>
                
                {cashbackApplied && (
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Desconto (Cashback 10%)" />
                    <Typography variant="body1" color="secondary">
                      -R$ {discount.toFixed(2)}
                    </Typography>
                  </ListItem>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary="Total a Pagar" sx={{ fontWeight: 700 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    R$ {total.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </Box>
        )
      
      case 3: // Confirmação
        return (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress size={60} color="secondary" />
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Processando seu pedido...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Aguarde enquanto confirmamos seu pagamento.
                </Typography>
              </Box>
            ) : orderComplete ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'secondary.main', 
                  color: 'white', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3
                }}>
                  <Check sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" gutterBottom>
                  Pedido Confirmado!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Seu pedido #{Math.floor(Math.random() * 90000) + 10000} foi confirmado e está sendo preparado.
                </Typography>
                
                <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <DeliveryDining color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Informações de Entrega
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Tempo estimado: 30-45 minutos
                    </Typography>
                    <Typography variant="body2">
                      Endereço: {shippingAddress.street}, {shippingAddress.number} - {shippingAddress.neighborhood}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => navigate('/')}
                  sx={{ mr: 2 }}
                >
                  Voltar para o Início
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => navigate('/profile/orders')}
                >
                  Ver Meus Pedidos
                </Button>
              </Box>
            ) : (
              <Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Verifique os detalhes do seu pedido antes de confirmar.
                </Alert>
                
                <Typography variant="h6" gutterBottom>
                  Resumo do Pedido
                </Typography>
                
                <List disablePadding>
                  {cartItems.map((item) => (
                    <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantidade: ${item.quantity}`}
                      />
                      <Typography variant="body1">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">
                      R$ {subtotal.toFixed(2)}
                    </Typography>
                  </ListItem>
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Taxa de Entrega" />
                    <Typography variant="body1">
                      R$ {deliveryFee.toFixed(2)}
                    </Typography>
                  </ListItem>
                  
                  {cashbackApplied && (
                    <ListItem sx={{ py: 1, px: 0 }}>
                      <ListItemText primary="Desconto (Cashback 10%)" />
                      <Typography variant="body1" color="secondary">
                        -R$ {discount.toFixed(2)}
                      </Typography>
                    </ListItem>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Total a Pagar" sx={{ fontWeight: 700 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      R$ {total.toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
                
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Endereço de Entrega
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.street}, {shippingAddress.number} {shippingAddress.complement && `- ${shippingAddress.complement}`}
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.neighborhood}, {shippingAddress.city} - {shippingAddress.state}
                    </Typography>
                    <Typography variant="body2">
                      CEP: {shippingAddress.zipCode}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Método de Pagamento
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      {paymentMethod === 'pix' && <Pix fontSize="small" sx={{ mr: 1 }} />}
                      {paymentMethod === 'credit' && <CreditCard fontSize="small" sx={{ mr: 1 }} />}
                      {paymentMethod === 'bank' && <AccountBalance fontSize="small" sx={{ mr: 1 }} />}
                      
                      {paymentMethod === 'pix' && 'Pagamento via PIX'}
                      {paymentMethod === 'credit' && 'Cartão de Crédito'}
                      {paymentMethod === 'bank' && 'Transferência Bancária'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )
      
      default:
        return 'Passo desconhecido'
    }
  }
  
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Finalizar Pedido
        </Typography>
      </Paper>
      
      <Paper elevation={2} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>
          {getStepContent(activeStep)}
          
          {!orderComplete && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              {activeStep !== 0 && (
                <Button 
                  variant="outlined" 
                  onClick={handleBack} 
                  sx={{ mr: 1 }}
                >
                  Voltar
                </Button>
              )}
              <Button 
                variant="contained"
                color="secondary"
                onClick={handleNext}
                disabled={loading}
              >
                {activeStep === steps.length - 1 ? 'Confirmar Pedido' : 'Próximo'}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Checkout 