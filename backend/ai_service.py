import os
import json
import random
import requests
from typing import Dict, List, Any, Optional
from datetime import datetime

# Classe para integração com a API do Groq
class GroqClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def generate_text(self, prompt, model="llama3-8b-8192", temperature=0.7, max_tokens=1000):
        """Gera texto usando a API do Groq"""
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            response_data = response.json()
            return response_data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Erro ao chamar a API do Groq: {str(e)}")
            return None

# Simulamos a integração com uma API de IA
# Em um ambiente real, isso seria uma chamada a uma API como OpenAI, Azure ou outra solução

class AIService:
    def __init__(self):
        # Carregar configurações de um arquivo .env
        self.api_key = os.getenv("GROQ_API_KEY", "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")
        self.model = os.getenv("GROQ_MODEL", "llama3-8b-8192")
        self.temperature = float(os.getenv("AI_TEMPERATURE", "0.7"))
        
        # Inicializar cliente Groq
        self.groq_client = GroqClient(self.api_key)
        
        # Dados mock para demonstração
        self._load_mock_data()
    
    def _load_mock_data(self):
        """Carrega dados mock para simulação"""
        # Base de dados de ingredientes e suas propriedades nutricionais
        self.ingredients_db = {
            "frango": {"protein": 31, "fat": 3.6, "carbs": 0, "calories": 165},
            "quinoa": {"protein": 4.4, "fat": 1.9, "carbs": 21.3, "calories": 120},
            "abacate": {"protein": 2, "fat": 15, "carbs": 9, "calories": 160},
            "espinafre": {"protein": 2.9, "fat": 0.4, "carbs": 3.6, "calories": 23},
            "batata_doce": {"protein": 1.6, "fat": 0.1, "carbs": 20.1, "calories": 86},
            "salmao": {"protein": 25, "fat": 13, "carbs": 0, "calories": 208},
            "tofu": {"protein": 8, "fat": 4.8, "carbs": 1.9, "calories": 76},
            "grao_de_bico": {"protein": 9, "fat": 2.6, "carbs": 27, "calories": 164},
            "arroz_integral": {"protein": 2.6, "fat": 0.9, "carbs": 23, "calories": 112},
            "lentilha": {"protein": 9, "fat": 0.4, "carbs": 20, "calories": 116},
        }
        
        # Base de refeições pré-definidas
        self.meals_db = [
            {
                "id": 1,
                "name": "Bowl Proteico de Frango",
                "description": "Bowl de frango grelhado com quinoa, legumes, abacate e molho especial",
                "ingredients": ["frango", "quinoa", "abacate", "espinafre"],
                "tags": ["Proteico", "Low-carb", "Sem Glúten"],
                "nutrition": {
                    "calories": 450,
                    "protein": 32,
                    "carbs": 42,
                    "fat": 16
                }
            },
            {
                "id": 2,
                "name": "Salada Mediterrânea",
                "description": "Mix de folhas, grão-de-bico, azeitonas, tomate cereja, pepino e queijo feta",
                "ingredients": ["grao_de_bico", "espinafre", "tofu"],
                "tags": ["Vegetariano", "Rico em Fibras", "Mediterrâneo"],
                "nutrition": {
                    "calories": 380,
                    "protein": 18,
                    "carbs": 35,
                    "fat": 20
                }
            },
            {
                "id": 3,
                "name": "Wrap de Salmão",
                "description": "Wrap integral recheado com salmão defumado, cream cheese, rúcula e pepino",
                "ingredients": ["salmao", "espinafre"],
                "tags": ["Omega-3", "Proteico", "Sem Lactose"],
                "nutrition": {
                    "calories": 420,
                    "protein": 28,
                    "carbs": 38,
                    "fat": 18
                }
            },
            {
                "id": 4,
                "name": "Bowl Vegano",
                "description": "Mix de vegetais, tofu grelhado e castanhas com molho de coco",
                "ingredients": ["tofu", "espinafre", "batata_doce"],
                "tags": ["Vegano", "Rico em Fibras", "Sem Glúten"],
                "nutrition": {
                    "calories": 410,
                    "protein": 15,
                    "carbs": 48,
                    "fat": 19
                }
            },
            {
                "id": 5,
                "name": "Prato Fitness",
                "description": "Frango grelhado com batata doce e legumes no vapor",
                "ingredients": ["frango", "batata_doce", "espinafre"],
                "tags": ["Alto em Proteína", "Baixo em Gordura", "Fitness"],
                "nutrition": {
                    "calories": 380,
                    "protein": 35,
                    "carbs": 30,
                    "fat": 8
                }
            },
        ]
        
        # Restrições alimentares
        self.dietary_restrictions = {
            "vegetariano": ["frango", "salmao"],
            "vegano": ["frango", "salmao"],
            "sem_gluten": ["quinoa"],
            "sem_lactose": [],
            "sem_nozes": [],
            "low_carb": ["batata_doce", "quinoa", "grao_de_bico", "arroz_integral"]
        }
    
    def analyze_nutritional_data(self, ingredients: List[str]) -> Dict[str, Any]:
        """
        Analisa os dados nutricionais de um conjunto de ingredientes
        
        Args:
            ingredients: Lista de ingredientes para análise
            
        Returns:
            Dados nutricionais calculados
        """
        # Primeiro tenta usar a API do Groq para análise
        if self.groq_client:
            prompt = f"""
            Analise os seguintes ingredientes e forneça informações nutricionais detalhadas:
            Ingredientes: {', '.join(ingredients)}
            
            Forneça o resultado no seguinte formato JSON:
            {{
              "calories": número total de calorias,
              "protein": gramas totais de proteína,
              "carbs": gramas totais de carboidratos,
              "fat": gramas totais de gordura
            }}
            
            Retorne apenas o JSON, sem explicações adicionais.
            """
            
            try:
                result = self.groq_client.generate_text(prompt)
                if result:
                    # Extrair apenas o JSON da resposta
                    json_start = result.find('{')
                    json_end = result.rfind('}') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_str = result[json_start:json_end]
                        return json.loads(json_str)
            except Exception as e:
                print(f"Erro ao analisar dados nutricionais com Groq: {str(e)}")
                
        # Fallback para os dados mock
        nutrition = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
        
        for ingredient in ingredients:
            if ingredient in self.ingredients_db:
                data = self.ingredients_db[ingredient]
                nutrition["calories"] += data["calories"]
                nutrition["protein"] += data["protein"]
                nutrition["carbs"] += data["carbs"]
                nutrition["fat"] += data["fat"]
        
        return nutrition
    
    def get_meal_recommendations(self, 
                               preferences: Dict[str, Any], 
                               restrictions: List[str],
                               calories_range: List[int],
                               limit: int = 3) -> List[Dict[str, Any]]:
        """
        Gera recomendações de refeições com base nas preferências e restrições do usuário
        
        Args:
            preferences: Preferências do usuário (proteínas preferidas, tipo de cozinha, etc)
            restrictions: Lista de restrições alimentares (sem glúten, vegetariano, etc)
            calories_range: Faixa de calorias desejada [min, max]
            limit: Número máximo de recomendações a retornar
            
        Returns:
            Lista de refeições recomendadas
        """
        # Tentar usar a API do Groq para recomendações personalizadas
        if self.groq_client:
            prompt = f"""
            Crie {limit} recomendações de refeições personalizadas com as seguintes especificações:
            
            Preferências do usuário:
            - Tipo de cozinha: {preferences.get('cuisine_type', 'qualquer')}
            - Tipo de refeição: {preferences.get('meal_type', 'qualquer')}
            - Nível de tempero (0-5): {preferences.get('spice_level', 3)}
            - Proteínas preferidas: {', '.join(preferences.get('preferred_protein', ['qualquer']))}
            
            Restrições alimentares: {', '.join(restrictions) if restrictions else 'nenhuma'}
            
            Faixa de calorias: {calories_range[0]} - {calories_range[1]} kcal
            
            Forneça as refeições no seguinte formato JSON:
            [
              {{
                "id": número único,
                "name": "nome da refeição",
                "description": "descrição detalhada",
                "ingredients": ["ingrediente1", "ingrediente2", "..."],
                "tags": ["tag1", "tag2", "..."],
                "nutrition": {{
                  "calories": número de calorias,
                  "protein": gramas de proteína,
                  "carbs": gramas de carboidratos,
                  "fat": gramas de gordura
                }},
                "ai_explanation": "explicação de por que esta refeição é recomendada para o usuário"
              }}
            ]
            
            Retorne apenas o JSON, sem explicações adicionais.
            """
            
            try:
                result = self.groq_client.generate_text(prompt)
                if result:
                    # Extrair apenas o JSON da resposta
                    json_start = result.find('[')
                    json_end = result.rfind(']') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_str = result[json_start:json_end]
                        recommendations = json.loads(json_str)
                        # Adicionar imagens de fallback (pois a API não gera imagens)
                        for meal in recommendations:
                            if "name" in meal and not meal.get("image"):
                                meal_name = meal["name"].lower().replace(" ", "-")
                                meal["image"] = f"https://source.unsplash.com/random/800x600/?{meal_name}"
                            if not meal.get("price"):
                                meal["price"] = 25 + random.random() * 20
                        return recommendations
            except Exception as e:
                print(f"Erro ao obter recomendações com Groq: {str(e)}")
        
        # Fallback para os dados mock
        recommendations = []
        
        # Filtrar refeições que respeitam as restrições alimentares
        filtered_meals = self.meals_db.copy()
        
        # Filtrar por restrições
        for restriction in restrictions:
            if restriction in self.dietary_restrictions:
                forbidden_ingredients = self.dietary_restrictions[restriction]
                filtered_meals = [
                    meal for meal in filtered_meals 
                    if not any(ingredient in forbidden_ingredients for ingredient in meal["ingredients"])
                ]
        
        # Filtrar por faixa de calorias
        min_cal, max_cal = calories_range
        filtered_meals = [
            meal for meal in filtered_meals 
            if min_cal <= meal["nutrition"]["calories"] <= max_cal
        ]
        
        # Ordenar por relevância (simulação)
        # Em um cenário real, usaríamos um modelo de ML para ranquear
        
        # Se temos preferências de proteína
        if "preferred_protein" in preferences and preferences["preferred_protein"]:
            preferred = preferences["preferred_protein"]
            
            # Para cada refeição, calculamos um score baseado nas preferências
            for meal in filtered_meals:
                score = 0
                for ingredient in meal["ingredients"]:
                    if ingredient in preferred:
                        score += 1
                meal["relevance_score"] = score
            
            # Ordenamos por score
            filtered_meals.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
        
        # Selecionamos as top N refeições
        recommendations = filtered_meals[:limit]
        
        # Adicionamos uma explicação de IA para cada recomendação
        for meal in recommendations:
            meal["ai_explanation"] = self._generate_explanation(meal, preferences, restrictions)
        
        return recommendations
    
    def _generate_explanation(self, meal: Dict[str, Any], preferences: Dict[str, Any], restrictions: List[str]) -> str:
        """Gera uma explicação de IA para a recomendação usando Groq"""
        if self.groq_client:
            prompt = f"""
            Crie uma explicação curta e personalizada de por que esta refeição é recomendada para o usuário.
            
            Refeição: {meal["name"]}
            Descrição: {meal["description"]}
            Tags: {', '.join(meal.get("tags", []))}
            Nutrição: {meal["nutrition"]} calorias
            
            Preferências do usuário:
            - Tipo de cozinha: {preferences.get('cuisine_type', 'qualquer')}
            - Tipo de refeição: {preferences.get('meal_type', 'qualquer')}
            - Nível de tempero (0-5): {preferences.get('spice_level', 3)}
            - Proteínas preferidas: {', '.join(preferences.get('preferred_protein', ['qualquer']))}
            
            Restrições alimentares: {', '.join(restrictions) if restrictions else 'nenhuma'}
            
            Forneça uma explicação concisa (máximo 150 caracteres) e personalizada sobre por que esta refeição é ideal para o usuário.
            """
            
            try:
                explanation = self.groq_client.generate_text(prompt, max_tokens=100)
                if explanation:
                    return explanation.strip()
            except:
                pass
        
        # Fallback para explicações genéricas
        explanations = [
            f"Esta refeição é ideal para você porque contém {meal['nutrition']['protein']}g de proteína e apenas {meal['nutrition']['fat']}g de gordura.",
            f"Recomendamos esta opção porque se alinha com suas preferências alimentares e oferece um bom equilíbrio nutricional.",
            f"Com base na sua dieta, esta é uma excelente escolha que fornece nutrientes essenciais dentro da faixa calórica desejada.",
            f"Selecionamos esta refeição porque combina seus ingredientes preferidos em uma combinação saborosa e nutritiva.",
            f"Esta opção é perfeita para seus objetivos pois fornece energia sustentada e alta qualidade proteica."
        ]
        
        return random.choice(explanations)
    
    def optimize_delivery_route(self, delivery_points: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Otimiza rotas para entrega usando a API Groq quando disponível
        
        Args:
            delivery_points: Lista de pontos de entrega com coordenadas e informações
            
        Returns:
            Lista ordenada de pontos de entrega com estimativas de tempo
        """
        # Em um sistema real, usaríamos algoritmos como:
        # - Problema do Caixeiro Viajante (TSP)
        # - Algoritmos de otimização com restrições de tempo
        # - Integração com APIs como Google Maps ou similares
        
        if self.groq_client and len(delivery_points) > 0:
            # Preparar dados dos pontos para o prompt
            points_data = []
            for i, point in enumerate(delivery_points):
                points_data.append(f"Ponto {i+1}: {point['address']} (Lat: {point['lat']}, Lng: {point['lng']})")
            
            prompt = f"""
            Otimize a rota de entrega para os seguintes pontos, começando do restaurante:
            
            {', '.join(points_data)}
            
            Considere a distância entre os pontos e forneça:
            1. A ordem ideal dos pontos para minimizar a distância total
            2. Um tempo estimado de viagem entre cada ponto (em minutos)
            
            Retorne apenas o resultado no seguinte formato JSON:
            [
              {{
                "address": "endereço do ponto",
                "lat": latitude,
                "lng": longitude,
                "order_id": id do pedido,
                "customer_name": nome do cliente,
                "estimated_arrival": "HH:MM" (horário estimado de chegada),
                "travel_time_minutes": tempo estimado de viagem em minutos
              }}
            ]
            
            Organize os pontos na ordem ótima para a entrega.
            """
            
            try:
                result = self.groq_client.generate_text(prompt)
                if result:
                    # Extrair apenas o JSON da resposta
                    json_start = result.find('[')
                    json_end = result.rfind(']') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_str = result[json_start:json_end]
                        return json.loads(json_str)
            except Exception as e:
                print(f"Erro ao otimizar rota com Groq: {str(e)}")
        
        # Para esta simulação, apenas adicionamos tempos estimados aleatórios (fallback)
        optimized_route = delivery_points.copy()
        
        now = datetime.now()
        current_time = now
        
        for point in optimized_route:
            # Tempo de viagem entre 5 e 15 minutos
            travel_time = random.randint(5, 15)
            current_time = current_time.replace(minute=current_time.minute + travel_time)
            
            point["estimated_arrival"] = current_time.strftime("%H:%M")
            point["travel_time_minutes"] = travel_time
            
        return optimized_route
    
    def generate_custom_menu(self, user_preferences: str, item_count: int = 4) -> List[Dict[str, Any]]:
        """
        Gera um cardápio personalizado com base nas preferências do usuário
        
        Args:
            user_preferences: Descrição das preferências do usuário
            item_count: Número de itens a serem gerados
            
        Returns:
            Lista de refeições personalizadas
        """
        if self.groq_client:
            prompt = f"""
            Baseado nas seguintes preferências do usuário: "{user_preferences}", 
            gere {item_count} opções de refeições personalizadas.
            
            Para cada refeição, forneça o seguinte formato JSON:
            [
              {{
                "id": número único,
                "name": "nome da refeição",
                "description": "descrição detalhada e apetitosa",
                "price": preço em reais (número),
                "tags": ["tag1", "tag2", "..."],
                "nutrition": {{
                  "calories": número de calorias,
                  "protein": gramas de proteína,
                  "carbs": gramas de carboidratos,
                  "fat": gramas de gordura
                }}
              }}
            ]
            
            Baseie-se nas preferências do usuário para escolher refeições que atendam às suas necessidades.
            Garanta que as refeições sejam variadas e adequadas ao perfil descrito.
            Retorne apenas o JSON, sem explicações adicionais.
            """
            
            try:
                result = self.groq_client.generate_text(prompt, max_tokens=2000)
                if result:
                    # Extrair apenas o JSON da resposta
                    json_start = result.find('[')
                    json_end = result.rfind(']') + 1
                    if json_start >= 0 and json_end > json_start:
                        json_str = result[json_start:json_end]
                        menu_items = json.loads(json_str)
                        
                        # Adicionar imagens de placeholder para os itens
                        for item in menu_items:
                            if "name" in item and not item.get("image"):
                                item_name = item["name"].lower().replace(" ", "-")
                                item["image"] = f"https://source.unsplash.com/random/800x600/?{item_name}-food"
                        
                        return menu_items
            except Exception as e:
                print(f"Erro ao gerar cardápio personalizado: {str(e)}")
        
        # Fallback para itens estáticos se a API falhar
        return self._generate_static_menu_items(user_preferences, item_count)
    
    def _generate_static_menu_items(self, preferences: str, count: int) -> List[Dict[str, Any]]:
        """Gera itens estáticos de cardápio se a API falhar"""
        base_items = [
            {
                "id": 1,
                "name": "Bowl Proteico de Frango",
                "description": "Bowl de frango grelhado com quinoa, legumes, abacate e molho especial",
                "price": 35.90,
                "image": "https://source.unsplash.com/random/800x600/?chicken-protein-bowl",
                "tags": ["Proteico", "Low-carb", "Saudável"],
                "nutrition": {
                    "calories": 450,
                    "protein": 32,
                    "carbs": 42,
                    "fat": 16
                }
            },
            {
                "id": 2,
                "name": "Salada Mediterrânea Vegana",
                "description": "Mix de folhas, grão-de-bico, azeitonas, tomate cereja, pepino e molho de limão",
                "price": 29.90,
                "image": "https://source.unsplash.com/random/800x600/?vegan-salad",
                "tags": ["Vegano", "Rico em Fibras", "Mediterrâneo"],
                "nutrition": {
                    "calories": 380,
                    "protein": 18,
                    "carbs": 35,
                    "fat": 20
                }
            },
            {
                "id": 3,
                "name": "Wrap de Salmão com Cream Cheese",
                "description": "Wrap integral recheado com salmão defumado, cream cheese, rúcula e pepino",
                "price": 32.90,
                "image": "https://source.unsplash.com/random/800x600/?salmon-wrap",
                "tags": ["Omega-3", "Proteico", "Sem Glúten"],
                "nutrition": {
                    "calories": 420,
                    "protein": 28,
                    "carbs": 38,
                    "fat": 18
                }
            },
            {
                "id": 4,
                "name": "Bowl Low Carb de Atum",
                "description": "Bowl com atum selado, mix de folhas, ovos cozidos, azeitonas e molho de ervas",
                "price": 39.90,
                "image": "https://source.unsplash.com/random/800x600/?tuna-bowl",
                "tags": ["Low-Carb", "Proteico", "Rico em Ômega-3"],
                "nutrition": {
                    "calories": 390,
                    "protein": 35,
                    "carbs": 12,
                    "fat": 22
                }
            },
            {
                "id": 5,
                "name": "Tigela de Açaí Energética",
                "description": "Açaí batido com banana, coberto com granola, frutas frescas e mel",
                "price": 26.90,
                "image": "https://source.unsplash.com/random/800x600/?acai-bowl",
                "tags": ["Energético", "Antioxidantes", "Vegetariano"],
                "nutrition": {
                    "calories": 410,
                    "protein": 8,
                    "carbs": 65,
                    "fat": 12
                }
            }
        ]
        
        # Filtrar ou modificar itens com base nas preferências do usuário
        preferences_lower = preferences.lower()
        
        # Verificar palavras-chave nas preferências
        is_vegetarian = "vegetarian" in preferences_lower or "vegetariano" in preferences_lower
        is_vegan = "vegan" in preferences_lower or "vegano" in preferences_lower
        is_low_carb = "low carb" in preferences_lower or "baixo carboidrato" in preferences_lower
        is_high_protein = "proteina" in preferences_lower or "protein" in preferences_lower
        
        # Filtrar itens com base nas preferências
        filtered_items = base_items.copy()
        if is_vegan:
            filtered_items = [item for item in filtered_items if "Vegano" in item["tags"]]
        elif is_vegetarian:
            filtered_items = [item for item in filtered_items if "Vegetariano" in item["tags"] or "Vegano" in item["tags"]]
        
        if is_low_carb:
            # Priorizar itens low carb, mas não filtrar completamente
            low_carb_items = [item for item in filtered_items if "Low-Carb" in item["tags"] or "Low-carb" in item["tags"]]
            if low_carb_items:
                filtered_items = low_carb_items
        
        if is_high_protein:
            # Priorizar itens proteicos, mas não filtrar completamente
            protein_items = [item for item in filtered_items if "Proteico" in item["tags"]]
            if protein_items:
                filtered_items = protein_items
        
        # Se não restaram itens após a filtragem, voltar aos itens base
        if not filtered_items:
            filtered_items = base_items
        
        # Garantir que temos itens suficientes, repetindo se necessário
        result_items = []
        for i in range(count):
            item_index = i % len(filtered_items)
            item = filtered_items[item_index].copy()
            item["id"] = i + 1  # Garantir IDs únicos
            result_items.append(item)
        
        return result_items

# Instância singleton para uso em toda a aplicação
ai_service = AIService() 