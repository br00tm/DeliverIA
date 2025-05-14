import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Divider, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  LinearProgress
} from '@mui/material'
import { 
  CheckCircle, 
  ReceiptLong, 
  Restaurant, 
  DeliveryDining, 
  LocalDining,
  Schedule, 
  AccessTime,
  ExpandMore
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'

// Status de rastreamento
enum OrderStatus {
  CONFIRMED = 'Pedido Confirmado',
  PREPARING = 'Em Preparo',
  ON_THE_WAY = 'A Caminho',
  DELIVERED = 'Entregue'
}

// Dados simulados do pedido
interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface OrderData {
  id: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  address: string
  paymentMethod: string
  estimatedDelivery: Date
  currentTime: Date
  preparationTime: number // em minutos
  driverName?: string
  driverPhone?: string
  driverLicense?: string
  deliveryNotes?: string
}

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<OrderData | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [deliveryTime, setDeliveryTime] = useState('')
  const [feedbackDialog, setFeedbackDialog] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [timer, setTimer] = useState<number>(0)
  
  // Simular obtenção dos dados do pedido
  useEffect(() => {
    // Em um caso real, aqui faríamos uma chamada à API para buscar os dados do pedido
    const simulateOrderFetch = () => {
      setLoading(true)
      setTimeout(() => {
        // Buscar pedidos do localStorage
        const storedOrders = localStorage.getItem('orders');
        
        if (storedOrders && orderId) {
          try {
            const parsedOrders = JSON.parse(storedOrders);
            const selectedOrder = parsedOrders.find((order: any) => order.id === orderId);
            
            if (selectedOrder) {
              // Processar datas pois localStorage armazena como string
              const orderData: OrderData = {
                ...selectedOrder,
                estimatedDelivery: new Date(new Date().getTime() + 45 * 60000), // 45 minutos a partir de agora
                currentTime: new Date(),
                preparationTime: 25,
                status: selectedOrder.status === 'pending' ? OrderStatus.CONFIRMED : 
                       selectedOrder.status === 'delivered' ? OrderStatus.DELIVERED : 
                       OrderStatus.PREPARING,
                driverName: selectedOrder.status === 'pending' ? 'João Silva' : undefined,
                driverPhone: selectedOrder.status === 'pending' ? '(11) 98765-4321' : undefined,
                driverLicense: selectedOrder.status === 'pending' ? 'ABC-1234' : undefined,
                deliveryNotes: 'Apartamento 42. Interfone quebrado, ligar no celular.'
              }
              
              setOrder(orderData);
              
              // Definir o passo ativo baseado no status
              if (orderData.status === OrderStatus.CONFIRMED) setActiveStep(0);
              else if (orderData.status === OrderStatus.PREPARING) setActiveStep(1);
              else if (orderData.status === OrderStatus.ON_THE_WAY) setActiveStep(2);
              else if (orderData.status === OrderStatus.DELIVERED) setActiveStep(3);
            } else {
              // Pedido não encontrado
              setOrder(null);
            }
          } catch (error) {
            console.error('Erro ao processar o pedido:', error);
            setOrder(null);
          }
        } else {
          // Dados mockados caso não encontre o pedido
          const now = new Date();
          const estimatedDelivery = new Date(now.getTime() + 45 * 60000); // 45 minutos
          
          const statusMap: { [key: string]: OrderStatus } = {
            '123456': OrderStatus.CONFIRMED,
            '234567': OrderStatus.PREPARING,
            '345678': OrderStatus.ON_THE_WAY,
            '456789': OrderStatus.DELIVERED
          }
          
          setOrder({
            id: orderId || '123456',
            status: statusMap[orderId || '123456'] || OrderStatus.CONFIRMED,
            items: [
              { id: 1, name: 'Bowl Proteico de Frango', price: 35.90, quantity: 1 },
              { id: 2, name: 'Bowl Vegano Tropical', price: 31.90, quantity: 1 }
            ],
            subtotal: 67.80,
            deliveryFee: 5.90,
            discount: 6.78,
            total: 66.92,
            address: 'Rua Exemplo, 123 - Bairro, Cidade - Estado',
            paymentMethod: 'PIX',
            estimatedDelivery: estimatedDelivery,
            currentTime: now,
            preparationTime: 25,
            driverName: statusMap[orderId || '123456'] === OrderStatus.ON_THE_WAY ? 'João Silva' : undefined,
            driverPhone: statusMap[orderId || '123456'] === OrderStatus.ON_THE_WAY ? '(11) 98765-4321' : undefined,
            driverLicense: statusMap[orderId || '123456'] === OrderStatus.ON_THE_WAY ? 'ABC-1234' : undefined,
            deliveryNotes: 'Apartamento 42. Interfone quebrado, ligar no celular.'
          });
          
          // Definir o passo ativo baseado no status
          if (statusMap[orderId || '123456'] === OrderStatus.CONFIRMED) setActiveStep(0);
          else if (statusMap[orderId || '123456'] === OrderStatus.PREPARING) setActiveStep(1);
          else if (statusMap[orderId || '123456'] === OrderStatus.ON_THE_WAY) setActiveStep(2);
          else if (statusMap[orderId || '123456'] === OrderStatus.DELIVERED) setActiveStep(3);
        }
        
        setLoading(false);
      }, 1500);
    }
    
    simulateOrderFetch();
  }, [orderId]);
  
  // Atualizar o tempo restante a cada segundo
  useEffect(() => {
    if (!order) return
    
    const updateTime = () => {
      setTimer(prev => prev + 1)
      
      const now = new Date()
      const diff = order.estimatedDelivery.getTime() - now.getTime()
      
      if (diff <= 0) {
        setDeliveryTime('Chegando a qualquer momento')
        return
      }
      
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      
      setDeliveryTime(`${minutes}min ${seconds}s`)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [order, timer])
  
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED:
        return 'primary'
      case OrderStatus.PREPARING:
        return 'secondary'
      case OrderStatus.ON_THE_WAY:
        return 'info'
      case OrderStatus.DELIVERED:
        return 'success'
      default:
        return 'default'
    }
  }
  
  const getStepIcon = (step: number) => {
    switch (step) {
      case 0:
        return <ReceiptLong />
      case 1:
        return <Restaurant />
      case 2:
        return <DeliveryDining />
      case 3:
        return <LocalDining />
      default:
        return <CheckCircle />
    }
  }
  
  const getProgressPercentage = () => {
    if (!order) return 0
    
    switch (order.status) {
      case OrderStatus.CONFIRMED:
        return 25
      case OrderStatus.PREPARING:
        return 50
      case OrderStatus.ON_THE_WAY:
        return 75
      case OrderStatus.DELIVERED:
        return 100
      default:
        return 0
    }
  }
  
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Carregando informações do pedido...
        </Typography>
        <LinearProgress color="secondary" sx={{ mt: 2 }} />
      </Box>
    )
  }
  
  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Pedido não encontrado. Verifique o número do pedido e tente novamente.
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/profile/orders')}
        >
          Voltar para Meus Pedidos
        </Button>
      </Box>
    )
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rastreamento do Pedido #{order.id}
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Status do Pedido
              </Typography>
              <Chip 
                label={order.status} 
                color={getStatusColor(order.status)} 
                variant="filled" 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={getProgressPercentage()} 
              color="secondary"
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                mb: 3,
                bgcolor: 'background.paper'
              }}
            />
            
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel StepIconComponent={() => getStepIcon(0)}>
                  Pedido Confirmado
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Seu pedido foi recebido e confirmado!
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {order.currentTime.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel StepIconComponent={() => getStepIcon(1)}>
                  Em Preparo
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    O restaurante está preparando seu pedido com todo cuidado.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tempo estimado de preparo: {order.preparationTime} minutos
                  </Typography>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel StepIconComponent={() => getStepIcon(2)}>
                  A Caminho
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Seu pedido está a caminho! O entregador está se dirigindo ao seu endereço.
                  </Typography>
                  
                  {order.driverName && (
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="subtitle2">
                          Entregador: {order.driverName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Veículo: Moto • Placa: {order.driverLicense}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Telefone: {order.driverPhone}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body2" color="secondary.main" fontWeight="bold">
                      Previsão de entrega: {deliveryTime}
                    </Typography>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel StepIconComponent={() => getStepIcon(3)}>
                  Entregue
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Seu pedido foi entregue! Aproveite sua refeição.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setFeedbackDialog(true)}
                    sx={{ mt: 1 }}
                  >
                    Avaliar Pedido
                  </Button>
                </StepContent>
              </Step>
            </Stepper>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Detalhes da Entrega
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Endereço de Entrega</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.address}
                </Typography>
              </Grid>
              
              {order.deliveryNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Observações</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.deliveryNotes}
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Método de Pagamento</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.paymentMethod}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Previsão de Entrega</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.estimatedDelivery.toLocaleTimeString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido
            </Typography>
            
            {order.items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  {item.quantity}x {item.name}
                </Typography>
                <Typography variant="body2">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Subtotal</Typography>
              <Typography variant="body2">R$ {order.subtotal.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Taxa de Entrega</Typography>
              <Typography variant="body2">R$ {order.deliveryFee.toFixed(2)}</Typography>
            </Box>
            
            {order.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Desconto</Typography>
                <Typography variant="body2" color="secondary">
                  -R$ {order.discount.toFixed(2)}
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                R$ {order.total.toFixed(2)}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => navigate('/menu')}
            >
              Fazer Novo Pedido
            </Button>
            
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/profile/orders')}
            >
              Ver Meus Pedidos
            </Button>
          </Paper>
          
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Algum problema com seu pedido?
            </Typography>
            <Button 
              color="inherit" 
              size="small" 
              sx={{ mt: 1 }}
              onClick={() => alert('Suporte será contatado')}
            >
              Contatar Suporte
            </Button>
          </Alert>
        </Grid>
      </Grid>
      
      {/* Dialog de avaliação */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)}>
        <DialogTitle>Avaliar Pedido</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Como foi sua experiência com este pedido? Sua opinião é muito importante para melhorarmos nosso serviço.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Comentário (opcional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancelar</Button>
          <Button 
            onClick={() => {
              alert('Avaliação enviada com sucesso! Obrigado pelo feedback.')
              setFeedbackDialog(false)
            }} 
            variant="contained" 
            color="primary"
          >
            Enviar Avaliação
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderTracking 