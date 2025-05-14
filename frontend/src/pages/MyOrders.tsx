import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Divider, 
  Chip,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Badge,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material'
import { 
  ReceiptLong, 
  LocalDining, 
  DeliveryDining, 
  ExpandMore, 
  ExpandLess,
  RestaurantMenu,
  ArrowForward
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

// Interface para a ordem
interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  date: Date
  status: 'pending' | 'delivered' | 'cancelled'
  statusText: string
  items: OrderItem[]
  total: number
  deliveryAddress: string
  paymentMethod: string
}

enum TabType {
  ALL = 0,
  PENDING = 1,
  DELIVERED = 2,
}

const MyOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  
  // Carregar pedidos do localStorage
  useEffect(() => {
    setLoading(true)
    
    // Simular um pequeno atraso de carregamento
    setTimeout(() => {
      const storedOrders = localStorage.getItem('orders')
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders)
          // Formatar as datas, que vêm como strings do localStorage
          const formattedOrders = parsedOrders.map((order: any) => ({
            ...order,
            date: new Date(order.date)
          }))
          setOrders(formattedOrders)
        } catch (error) {
          console.error('Erro ao carregar pedidos:', error)
          // Se houver erro, usar pedidos mockados
          setOrders([])
        }
      } else {
        // Se não houver pedidos, exibir lista vazia
        setOrders([])
      }
      setLoading(false)
    }, 800)
  }, [])
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  
  const handleExpandOrder = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'primary'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <DeliveryDining color="primary" />
      case 'delivered':
        return <LocalDining color="success" />
      case 'cancelled':
        return <ReceiptLong color="error" />
      default:
        return <ReceiptLong />
    }
  }
  
  const filteredOrders = orders.filter(order => {
    if (tabValue === TabType.ALL) return true
    if (tabValue === TabType.PENDING) return order.status === 'pending'
    if (tabValue === TabType.DELIVERED) return order.status === 'delivered'
    return true
  })
  
  const pendingCount = orders.filter(order => order.status === 'pending').length
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Carregando seus pedidos...
        </Typography>
      </Box>
    )
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Pedidos
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="order tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Todos" />
            <Tab 
              label={
                <Badge badgeContent={pendingCount} color="primary">
                  Em Andamento
                </Badge>
              } 
            />
            <Tab label="Entregues" />
          </Tabs>
        </Box>
        
        {filteredOrders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <RestaurantMenu sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Nenhum pedido encontrado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {tabValue === TabType.PENDING 
                ? 'Você não tem pedidos em andamento no momento.' 
                : 'Você ainda não realizou nenhum pedido.'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/menu')}
            >
              Fazer um Pedido
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredOrders.map(order => (
              <Grid item xs={12} key={order.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 2, 
                    position: 'relative',
                    borderColor: order.status === 'pending' ? 'primary.main' : 'divider'
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(order.status)}
                          <Box sx={{ ml: 2 }}>
                            <Typography variant="subtitle1" component="div">
                              Pedido #{order.id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.date.toLocaleDateString()} - {order.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={3}>
                        <Chip 
                          label={order.statusText} 
                          color={getStatusColor(order.status)} 
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={3} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                        <Typography variant="subtitle1" component="div">
                          R$ {order.total.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Collapse in={expandedOrder === order.id}>
                      <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Itens do Pedido
                        </Typography>
                        <List dense disablePadding>
                          {order.items.map(item => (
                            <ListItem key={item.id} disablePadding sx={{ py: 0.5 }}>
                              <ListItemText
                                primary={`${item.quantity}x ${item.name}`}
                                secondary={`R$ ${(item.price * item.quantity).toFixed(2)}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Detalhes da Entrega
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Endereço: {order.deliveryAddress}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            Pagamento: {order.paymentMethod}
                          </Typography>
                        </Box>
                      </Box>
                    </Collapse>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      onClick={() => handleExpandOrder(order.id)}
                      startIcon={expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                    >
                      {expandedOrder === order.id ? 'Ver Menos' : 'Ver Detalhes'}
                    </Button>
                    
                    {order.status === 'pending' ? (
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                        endIcon={<ArrowForward />}
                      >
                        Rastrear Pedido
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => navigate(`/order-tracking/${order.id}`)}
                      >
                        Ver Detalhes Completos
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      {filteredOrders.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => navigate('/menu')}
            sx={{ minWidth: 200 }}
          >
            Fazer Novo Pedido
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default MyOrders 