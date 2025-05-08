# DeliverIA - Sistema de Delivery de Refeições Personalizadas por IA

Sistema de delivery que utiliza inteligência artificial para criar refeições personalizadas baseadas nas restrições alimentares e preferências do cliente.

## Funcionalidades Principais

- Criação de refeições personalizadas por IA
- Sistema de pedidos e entregas em tempo real
- Integração com PIX para pagamentos
- Programa de fidelidade com cashback
- Interface moderna e responsiva

## Tecnologias Utilizadas

### Frontend
- React + TypeScript
- Vite
- Material-UI
- React Router
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- Python-dotenv

## Configuração do Ambiente

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL=sqlite:///./deliveria.db
SECRET_KEY=sua_chave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Estrutura do Projeto

```
DeliverIA/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── models.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
└── README.md
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 