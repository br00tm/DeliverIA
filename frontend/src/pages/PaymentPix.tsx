import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Divider, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  IconButton,
  Snackbar,
  Link,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import { 
  Pix, 
  ContentCopy, 
  AccessTime, 
  CheckCircle,
  Download,
  Info,
  Home,
  Person,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const MOCK_PIX_CODE = 'U0JJN0tFUlRXMi00STdLRVJUVzItU0JJN0tFUlRXMi00STdLRVJUVzItU0JJN0tFUlRXMi00STdLRVJUVzItU0JJN0tFUlRX'

// Interface para dados pessoais
interface PersonalData {
  nome: string
  email: string
  telefone: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

const PaymentPix = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)
  const [countdown, setCountdown] = useState(15 * 60) // 15 minutos em segundos
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  
  // Estados para dados pessoais
  const [personalData, setPersonalData] = useState<PersonalData>({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })
  
  // Estados para validação de formulário
  const [errors, setErrors] = useState<Partial<PersonalData>>({})
  
  // Simular carregamento da página
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }, [])
  
  // Temporizador regressivo para o pagamento
  useEffect(() => {
    if (loading || paid || activeStep !== 1) return
    
    const timer = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevCountdown - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [loading, paid, activeStep])
  
  // Formatação do tempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Simulação de cópia do código
  const handleCopyCode = () => {
    navigator.clipboard.writeText(MOCK_PIX_CODE)
    setSnackbarOpen(true)
  }
  
  // Simular pagamento
  const handleSimulatePay = () => {
    setLoading(true)
    setTimeout(() => {
      // Atualizar o status do pedido para 'delivered' no localStorage
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders && orderId) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          const updatedOrders = parsedOrders.map((order: any) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: 'delivered',
                statusText: 'Entregue',
                paymentConfirmed: true,
                paymentDate: new Date(),
                personalData: personalData
              };
            }
            return order;
          });
          
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
        } catch (error) {
          console.error('Erro ao atualizar o status do pedido:', error);
        }
      }
      
      setPaid(true)
      setLoading(false)
    }, 2000)
  }
  
  // Manipular alterações nos campos de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData({
      ...personalData,
      [name]: value
    });
    
    // Limpar erro quando o campo é alterado
    if (errors[name as keyof PersonalData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // Manipular alterações no select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setPersonalData({
      ...personalData,
      [name]: value
    });
    
    // Limpar erro quando o campo é alterado
    if (errors[name as keyof PersonalData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // Validar formulário
  const validateForm = () => {
    const newErrors: Partial<PersonalData> = {};
    
    if (!personalData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!personalData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(personalData.email)) newErrors.email = 'Email inválido';
    if (!personalData.telefone) newErrors.telefone = 'Telefone é obrigatório';
    if (!personalData.cep) newErrors.cep = 'CEP é obrigatório';
    if (!personalData.endereco) newErrors.endereco = 'Endereço é obrigatório';
    if (!personalData.numero) newErrors.numero = 'Número é obrigatório';
    if (!personalData.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!personalData.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!personalData.estado) newErrors.estado = 'Estado é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Avançar para próxima etapa
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateForm()) {
        setActiveStep(1);
      }
    }
  };
  
  // Voltar para etapa anterior
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Etapas do pagamento
  const steps = ['Dados Pessoais', 'Pagamento PIX', 'Confirmação'];
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {paid ? 'Processando pagamento...' : 'Carregando dados de pagamento...'}
        </Typography>
      </Box>
    )
  }
  
  if (paid) {
    return (
      <Box>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          
          <Typography variant="h4" gutterBottom>
            Pagamento Confirmado!
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4 }}>
            O pagamento do seu pedido #{orderId || '123456'} foi aprovado com sucesso!
          </Typography>
          
          <Alert severity="success" sx={{ mb: 4 }}>
            Você receberá o comprovante de pagamento no seu e-mail.
          </Alert>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={() => navigate(`/order-tracking/${orderId || '123456'}`)}
              >
                Acompanhar Pedido
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/')}
              >
                Voltar ao Início
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    )
  }
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Finalização de Pedido
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Pedido #{orderId || '123456'}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {activeStep === 0 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Dados Pessoais
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Por favor, preencha seus dados para entrega
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    name="nome"
                    value={personalData.nome}
                    onChange={handleTextChange}
                    error={!!errors.nome}
                    helperText={errors.nome}
                    InputProps={{
                      startAdornment: <Person color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={personalData.email}
                    onChange={handleTextChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: <Email color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    name="telefone"
                    value={personalData.telefone}
                    onChange={handleTextChange}
                    error={!!errors.telefone}
                    helperText={errors.telefone}
                    InputProps={{
                      startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="CEP"
                    name="cep"
                    value={personalData.cep}
                    onChange={handleTextChange}
                    error={!!errors.cep}
                    helperText={errors.cep}
                    InputProps={{
                      startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    name="endereco"
                    value={personalData.endereco}
                    onChange={handleTextChange}
                    error={!!errors.endereco}
                    helperText={errors.endereco}
                    InputProps={{
                      startAdornment: <Home color="action" sx={{ mr: 1 }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Número"
                    name="numero"
                    value={personalData.numero}
                    onChange={handleTextChange}
                    error={!!errors.numero}
                    helperText={errors.numero}
                  />
                </Grid>
                
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    name="complemento"
                    value={personalData.complemento}
                    onChange={handleTextChange}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    name="bairro"
                    value={personalData.bairro}
                    onChange={handleTextChange}
                    error={!!errors.bairro}
                    helperText={errors.bairro}
                  />
                </Grid>
                
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    name="cidade"
                    value={personalData.cidade}
                    onChange={handleTextChange}
                    error={!!errors.cidade}
                    helperText={errors.cidade}
                  />
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth error={!!errors.estado}>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      name="estado"
                      value={personalData.estado}
                      label="Estado"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="AC">AC</MenuItem>
                      <MenuItem value="AL">AL</MenuItem>
                      <MenuItem value="AP">AP</MenuItem>
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="BA">BA</MenuItem>
                      <MenuItem value="CE">CE</MenuItem>
                      <MenuItem value="DF">DF</MenuItem>
                      <MenuItem value="ES">ES</MenuItem>
                      <MenuItem value="GO">GO</MenuItem>
                      <MenuItem value="MA">MA</MenuItem>
                      <MenuItem value="MT">MT</MenuItem>
                      <MenuItem value="MS">MS</MenuItem>
                      <MenuItem value="MG">MG</MenuItem>
                      <MenuItem value="PA">PA</MenuItem>
                      <MenuItem value="PB">PB</MenuItem>
                      <MenuItem value="PR">PR</MenuItem>
                      <MenuItem value="PE">PE</MenuItem>
                      <MenuItem value="PI">PI</MenuItem>
                      <MenuItem value="RJ">RJ</MenuItem>
                      <MenuItem value="RN">RN</MenuItem>
                      <MenuItem value="RS">RS</MenuItem>
                      <MenuItem value="RO">RO</MenuItem>
                      <MenuItem value="RR">RR</MenuItem>
                      <MenuItem value="SC">SC</MenuItem>
                      <MenuItem value="SP">SP</MenuItem>
                      <MenuItem value="SE">SE</MenuItem>
                      <MenuItem value="TO">TO</MenuItem>
                    </Select>
                    {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Próximo: Pagamento
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Resumo do Pedido
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">R$ 67.80</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Taxa de Entrega</Typography>
                    <Typography variant="body2">R$ 5.90</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Desconto</Typography>
                    <Typography variant="body2" color="primary">-R$ 6.78</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">R$ 66.92</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {activeStep === 1 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Escaneie o QR Code abaixo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Use o aplicativo do seu banco para escanear o código e efetuar o pagamento
                </Typography>
                
                <Box 
                  sx={{ 
                    bgcolor: 'background.paper', 
                    p: 2, 
                    borderRadius: 2, 
                    display: 'inline-block', 
                    border: '1px solid', 
                    borderColor: 'divider' 
                  }}
                >
                  <QRCodeSVG 
                    value={`${MOCK_PIX_CODE}`} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Download />}
                    size="small"
                    onClick={() => alert('QR Code salvo')}
                    sx={{ mr: 1 }}
                  >
                    Salvar QR Code
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OU
                </Typography>
              </Divider>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Copie o código Pix
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Cole o código no app do seu banco para fazer o pagamento
                </Typography>
                
                <TextField
                  fullWidth
                  variant="outlined"
                  value={MOCK_PIX_CODE}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Tooltip title="Copiar código">
                        <IconButton onClick={handleCopyCode} edge="end">
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Box>
              
              <Alert 
                severity="warning" 
                icon={<AccessTime />}
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle2">
                  Este QR Code expira em {formatTime(countdown)}
                </Typography>
                <Typography variant="body2">
                  Por favor, realize o pagamento dentro deste prazo.
                </Typography>
              </Alert>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Após o pagamento, aguarde a confirmação automática do sistema.
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Em caso de dúvidas, entre em contato com nosso <Link href="#">suporte</Link>.
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={handleBack}
                >
                  Voltar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSimulatePay}
                >
                  Já Fiz o Pagamento
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Resumo do Pedido
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">R$ 67.80</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Taxa de Entrega</Typography>
                    <Typography variant="body2">R$ 5.90</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Desconto</Typography>
                    <Typography variant="body2" color="primary">-R$ 6.78</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">R$ 66.92</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Forma de Pagamento
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Pix color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">PIX</Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Destinatário do PIX
                </Typography>
                <Typography variant="body2" gutterBottom>
                  DeliverIA Restaurantes LTDA
                </Typography>
                <Typography variant="body2" gutterBottom>
                  CNPJ: 12.345.678/0001-90
                </Typography>
              </CardContent>
            </Card>
            
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Endereço de Entrega
              </Typography>
              <Typography variant="body2" gutterBottom>
                {personalData.endereco}, {personalData.numero}
                {personalData.complemento && ` - ${personalData.complemento}`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {personalData.bairro}, {personalData.cidade} - {personalData.estado}
              </Typography>
              <Typography variant="body2" gutterBottom>
                CEP: {personalData.cep}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Código PIX copiado para a área de transferência"
      />
    </Box>
  )
}

export default PaymentPix 