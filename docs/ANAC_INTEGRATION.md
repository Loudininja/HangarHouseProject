# Integração ANAC - Estado Atual e Implementação Real

## Estado Atual (Simulação)

A integração com a ANAC implementada no sistema é uma **simulação** que usa dados mockados para demonstrar como funcionaria. Não há consultas reais aos sistemas da ANAC.

### O que está simulado:

1. **Consulta de Aeronaves**: Busca por matrícula retorna dados fictícios
2. **Status de Certificados**: Mostra status simulados (ativo, inativo, suspenso)
3. **Sincronização**: Simula o processo de sincronização com delay
4. **Links para ANAC**: Links reais para os sites oficiais da ANAC

### Dados Mockados:

```javascript
const mockANACData = [
  {
    registration: 'PT-ABC',
    status: 'active',
    certificateNumber: 'CA-2024-001',
    certificateType: 'Padrão',
    validUntil: '2025-03-15',
    lastUpdate: '2024-03-01',
    owner: 'João Silva',
    operator: 'Escola de Aviação Alpha',
    model: 'Cessna 172',
    manufacturer: 'Cessna',
    serialNumber: '17280001'
  }
];
```

## Implementação Real

Para uma integração real com a ANAC, seria necessário:

### 1. API Oficial da ANAC
- A ANAC não possui uma API pública oficial para consultas automatizadas
- Seria necessário solicitar acesso especial ou parceria

### 2. Web Scraping (Alternativa)
- Fazer scraping do site oficial: https://sistemas.anac.gov.br/aeronaves
- Implementar parsing dos dados HTML
- Lidar com CAPTCHAs e medidas anti-bot

### 3. Implementação com Edge Functions

```typescript
// supabase/functions/anac-scraper/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { registration } = await req.json()
    
    // Fazer scraping do site da ANAC
    const anacUrl = `https://sistemas.anac.gov.br/aeronaves/consulta_publica/aeronave_dados.asp?textMarca=${registration}`
    
    const response = await fetch(anacUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    const html = await response.text()
    
    // Parser HTML para extrair dados
    const aircraftData = parseANACData(html)
    
    return new Response(
      JSON.stringify(aircraftData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function parseANACData(html: string) {
  // Implementar parsing do HTML da ANAC
  // Extrair dados como:
  // - Status do certificado
  // - Dados do proprietário
  // - Informações técnicas
  // - Validade de documentos
  
  return {
    registration: '',
    status: '',
    owner: '',
    // ... outros dados
  }
}
```

### 4. Considerações Legais e Técnicas

#### Legais:
- Verificar termos de uso do site da ANAC
- Respeitar robots.txt
- Não sobrecarregar os servidores
- Considerar aspectos de LGPD

#### Técnicas:
- Rate limiting para evitar bloqueios
- Cache de dados para reduzir consultas
- Tratamento de erros e timeouts
- Validação de dados recebidos

### 5. Alternativas Recomendadas

1. **Integração Manual**: 
   - Usuários inserem dados manualmente
   - Sistema valida formato de matrícula
   - Links diretos para consulta manual

2. **Importação de Arquivos**:
   - Upload de relatórios da ANAC
   - Parsing de PDFs ou CSVs
   - Sincronização periódica

3. **Parceria com ANAC**:
   - Solicitar acesso oficial
   - Desenvolver em conjunto
   - API dedicada para empresas

## Próximos Passos

Para implementar uma integração real:

1. Pesquisar se a ANAC disponibilizou APIs recentemente
2. Testar viabilidade de web scraping
3. Implementar sistema de cache robusto
4. Adicionar logs e monitoramento
5. Criar fallbacks para quando a integração falhar

## Conclusão

A integração atual é uma demonstração do que seria possível. Para produção, recomendo:

1. Começar com integração manual
2. Avaliar necessidade real de automação
3. Considerar custos vs benefícios
4. Implementar gradualmente conforme demanda