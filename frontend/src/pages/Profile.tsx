import { Box, Typography, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Avatar } from '@mui/material'
import { Person, ReceiptLong, Tune, Favorite, ExitToApp, AccountCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const navigate = useNavigate()

  const menuItems = [
    { text: 'Dados Pessoais', icon: <Person color="primary" />, path: '/profile/personal' },
    { text: 'Meus Pedidos', icon: <ReceiptLong color="primary" />, path: '/profile/orders' },
    { text: 'Preferências', icon: <Tune color="primary" />, path: '/profile/preferences' },
    { text: 'Favoritos', icon: <Favorite color="primary" />, path: '/profile/favorites' },
  ]

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Minha Conta
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
              >
                <AccountCircle sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h6">João Silva</Typography>
              <Typography variant="body2" color="text.secondary">joao@email.com</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List sx={{ py: 0 }}>
              {menuItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem 
                button 
                sx={{ 
                  borderRadius: 1,
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <ListItemIcon>
                  <ExitToApp color="error" />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Bem-vindo ao seu perfil!
            </Typography>
            <Typography variant="body1" paragraph>
              Selecione uma opção no menu ao lado para gerenciar suas informações.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/profile/orders')}
              sx={{ mr: 2 }}
            >
              Ver Meus Pedidos
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate('/menu')}
            >
              Fazer Novo Pedido
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile 