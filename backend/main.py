from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import os
import models
from database import get_db, engine
from ai_service import ai_service
import random

# Carregar variáveis de ambiente
load_dotenv()

# Verificar se a chave de API do Groq está configurada
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("Aviso: Chave de API do Groq não encontrada no .env. Usando chave padrão.")

# Criar as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DeliverIA API")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class UserPreferences(BaseModel):
    cuisine_type: str = Field(..., description="Tipo de cozinha preferida")
    meal_type: str = Field(..., description="Tipo de refeição (café, almoço, jantar, etc)")
    spice_level: int = Field(..., description="Nível de tempero (0-5)")
    preferred_protein: List[str] = Field(..., description="Proteínas preferidas")

class MealRecommendationRequest(BaseModel):
    preferences: UserPreferences
    dietary_restrictions: List[str] = Field(default=[], description="Restrições alimentares")
    calories_range: List[int] = Field(..., description="Faixa de calorias [min, max]")
    goals: Optional[str] = Field(None, description="Objetivo principal (emagrecimento, ganho muscular, etc)")

class DeliveryPoint(BaseModel):
    address: str
    lat: float
    lng: float
    order_id: int
    customer_name: str

class RouteOptimizationRequest(BaseModel):
    starting_point: Dict[str, float] = Field(..., description="Coordenadas do ponto de partida {lat, lng}")
    delivery_points: List[DeliveryPoint]

# Adicionar modelos para o teste da API do Groq
class GroqTestRequest(BaseModel):
    prompt: str = Field(..., description="Texto para enviar à API do Groq")
    model: str = Field("llama3-8b-8192", description="Modelo do Groq a ser usado")
    max_tokens: int = Field(1000, description="Número máximo de tokens na resposta")

class CustomMenuRequest(BaseModel):
    preferences: str = Field(..., description="Preferências alimentares do usuário")
    item_count: int = Field(4, description="Número de itens a serem gerados")

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do DeliverIA"}

# Endpoints de recomendação de IA
@app.post("/api/recommendations", response_model=List[Dict[str, Any]])
async def get_meal_recommendations(request: MealRecommendationRequest):
    """
    Gera recomendações de refeições personalizadas usando IA
    """
    try:
        # Converter modelo pydantic para dicionário
        preferences_dict = request.preferences.dict()
        
        # Chamar o serviço de IA
        recommendations = ai_service.get_meal_recommendations(
            preferences=preferences_dict,
            restrictions=request.dietary_restrictions,
            calories_range=request.calories_range
        )
        
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao gerar recomendações: {str(e)}"
        )

# Teste da API do Groq
@app.post("/api/groq/test")
async def test_groq_api(request: GroqTestRequest):
    """
    Testa a API do Groq com um prompt fornecido
    """
    try:
        if not ai_service.groq_client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cliente Groq não está configurado"
            )
        
        response = ai_service.groq_client.generate_text(
            prompt=request.prompt,
            model=request.model,
            max_tokens=request.max_tokens
        )
        
        if not response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Sem resposta da API do Groq"
            )
        
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao chamar a API do Groq: {str(e)}"
        )

# Endpoint para gerar cardápio personalizado
@app.post("/api/menu/custom")
async def generate_custom_menu(request: CustomMenuRequest):
    """
    Gera um cardápio personalizado com base nas preferências do usuário
    """
    try:
        menu_items = ai_service.generate_custom_menu(
            user_preferences=request.preferences,
            item_count=request.item_count
        )
        
        if not menu_items:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Não foi possível gerar cardápio personalizado"
            )
        
        # Enriquecer os itens com alguns metadados adicionais para melhorar a UI
        for item in menu_items:
            # Garantir que cada item tenha todos os campos necessários
            if "tags" not in item or not item["tags"]:
                item["tags"] = ["Personalizado"]
            
            # Garantir que cada refeição tenha um preço apropriado
            if not item.get("price"):
                item["price"] = round(25 + random.random() * 20, 2)
            
            # Garantir que cada refeição tenha informações nutricionais completas
            if "nutrition" not in item or not isinstance(item["nutrition"], dict):
                item["nutrition"] = {
                    "calories": random.randint(300, 600),
                    "protein": random.randint(15, 35),
                    "carbs": random.randint(20, 50),
                    "fat": random.randint(5, 20)
                }
            
            # Adicionar imagem de placeholder se necessário
            if not item.get("image"):
                img_query = item["name"].lower().replace(" ", "-")
                item["image"] = f"https://source.unsplash.com/random/800x600/?food-{img_query}"
        
        return menu_items
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao gerar cardápio personalizado: {str(e)}"
        )

@app.post("/api/nutrition/analyze")
async def analyze_nutritional_data(ingredients: List[str] = Body(...)):
    """
    Analisa os dados nutricionais de uma lista de ingredientes
    """
    try:
        nutrition_data = ai_service.analyze_nutritional_data(ingredients)
        return nutrition_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao analisar dados nutricionais: {str(e)}"
        )

@app.post("/api/delivery/optimize-route")
async def optimize_delivery_route(request: RouteOptimizationRequest):
    """
    Otimiza a rota de entrega para múltiplos pontos
    """
    try:
        optimized_route = ai_service.optimize_delivery_route(
            request.delivery_points
        )
        
        return {
            "starting_point": request.starting_point,
            "optimized_route": optimized_route
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao otimizar rota: {str(e)}"
        )

# Endpoints CRUD básicos
@app.get("/api/meals")
async def get_meals(db: Session = Depends(get_db)):
    """
    Retorna todas as refeições disponíveis
    """
    meals = db.query(models.Meal).filter(models.Meal.is_available == True).all()
    return meals

@app.get("/api/meals/{meal_id}")
async def get_meal(meal_id: int, db: Session = Depends(get_db)):
    """
    Retorna detalhes de uma refeição específica
    """
    meal = db.query(models.Meal).filter(models.Meal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Refeição não encontrada")
    return meal

# Pagamento com PIX (simulação)
@app.post("/api/payment/pix")
async def create_pix_payment(
    order_id: int = Body(...),
    amount: float = Body(...),
    description: str = Body(...)
):
    """
    Cria um pagamento PIX (simulação)
    """
    # Em um ambiente real, integraríamos com API de pagamento
    # Aqui simulamos a geração de um QR code e chave PIX
    
    # Código de exemplo para geração de chave PIX
    pix_key = f"deliveria{order_id}@pix.com.br"
    
    return {
        "order_id": order_id,
        "amount": amount,
        "pix_key": pix_key,
        "qr_code_url": f"https://placeholder.com/qrcode/pix/{order_id}",
        "expiration": 3600,  # 1 hora para pagamento
        "status": "pending"
    }

# Cashback (simulação)
@app.post("/api/loyalty/cashback")
async def apply_cashback(
    user_id: int = Body(...),
    order_id: int = Body(...),
    amount: float = Body(...)
):
    """
    Aplica cashback para um usuário (simulação)
    """
    cashback_rate = float(os.getenv("CASHBACK_RATE", "0.10"))
    cashback_amount = amount * cashback_rate
    
    return {
        "user_id": user_id,
        "order_id": order_id,
        "original_amount": amount,
        "cashback_amount": cashback_amount,
        "status": "applied"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 