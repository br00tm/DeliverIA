import uvicorn
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

if __name__ == "__main__":
    # Verificar se a API do Groq está configurada
    if not os.getenv("GROQ_API_KEY"):
        print("\033[93mAtenção: Chave de API do Groq não configurada! Usando chave padrão.\033[0m")
    else:
        print("\033[92mAPI do Groq configurada com sucesso!\033[0m")
    
    # Iniciar o servidor
    print("Iniciando servidor da DeliverIA API...")
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000,
        reload=True
    ) 