import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserPreferences {
  cuisine_type: string;
  meal_type: string;
  spice_level: number;
  preferred_protein: string[];
}

export interface MealRecommendationRequest {
  preferences: UserPreferences;
  dietary_restrictions: string[];
  calories_range: number[];
  goals?: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: number;
  name: string;
  description: string;
  tags: string[];
  nutrition: NutritionData;
  image?: string;
  price?: number;
  ai_explanation?: string;
}

export interface DeliveryPoint {
  address: string;
  lat: number;
  lng: number;
  order_id: number;
  customer_name: string;
  estimated_arrival?: string;
  travel_time_minutes?: number;
}

export interface RouteOptimizationRequest {
  starting_point: { lat: number; lng: number };
  delivery_points: DeliveryPoint[];
}

export interface PagamentoPixRequest {
  order_id: number;
  amount: number;
  description: string;
}

export interface PagamentoPixResponse {
  order_id: number;
  amount: number;
  pix_key: string;
  qr_code_url: string;
  expiration: number;
  status: string;
}

export interface CashbackRequest {
  user_id: number;
  order_id: number;
  amount: number;
}

export interface CashbackResponse {
  user_id: number;
  order_id: number;
  original_amount: number;
  cashback_amount: number;
  status: string;
}

export interface GroqTestRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
}

export interface GroqTestResponse {
  response: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CustomMenuRequest {
  preferences: string;
  item_count?: number;
}

// Serviço de API
const apiService = {
  // Recomendações de IA
  getRecommendations: async (request: MealRecommendationRequest): Promise<Meal[]> => {
    try {
      const response = await api.post('/recommendations', request);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      throw error;
    }
  },

  // Análise nutricional
  analyzeNutrition: async (ingredients: string[]): Promise<NutritionData> => {
    try {
      const response = await api.post('/nutrition/analyze', ingredients);
      return response.data;
    } catch (error) {
      console.error('Erro ao analisar dados nutricionais:', error);
      throw error;
    }
  },

  // Otimização de rota
  optimizeDeliveryRoute: async (request: RouteOptimizationRequest) => {
    try {
      const response = await api.post('/delivery/optimize-route', request);
      return response.data;
    } catch (error) {
      console.error('Erro ao otimizar rota de entrega:', error);
      throw error;
    }
  },

  // Obter refeições
  getMeals: async (): Promise<Meal[]> => {
    try {
      const response = await api.get('/meals');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter refeições:', error);
      throw error;
    }
  },

  // Obter detalhes de uma refeição
  getMealById: async (id: number): Promise<Meal> => {
    try {
      const response = await api.get(`/meals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao obter refeição ${id}:`, error);
      throw error;
    }
  },

  // Pagamento PIX
  createPixPayment: async (request: PagamentoPixRequest): Promise<PagamentoPixResponse> => {
    try {
      const response = await api.post('/payment/pix', request);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw error;
    }
  },

  // Aplicar cashback
  applyCashback: async (request: CashbackRequest): Promise<CashbackResponse> => {
    try {
      const response = await api.post('/loyalty/cashback', request);
      return response.data;
    } catch (error) {
      console.error('Erro ao aplicar cashback:', error);
      throw error;
    }
  },

  // Teste da API do Groq
  testGroqApi: async (prompt: string, model = "llama3-8b-8192", max_tokens = 1000): Promise<GroqTestResponse> => {
    try {
      const response = await api.post('/groq/test', {
        prompt,
        model,
        max_tokens
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao testar API do Groq:', error);
      throw error;
    }
  },

  // Gerar cardápio personalizado
  generateCustomMenu: async (preferences: string, itemCount = 4): Promise<MenuItem[]> => {
    try {
      const response = await api.post('/menu/custom', {
        preferences,
        item_count: itemCount
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar cardápio personalizado:', error);
      throw error;
    }
  },
};

export default apiService; 