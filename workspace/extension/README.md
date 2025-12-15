# SINOPIA - Extensão de Browser

Extensão Chrome que integra capacidades de Inteligência Artificial ao sistema OUVE.PE.

## 🚀 Instalação

### Desenvolvimento (Chrome)

1. Abra o Chrome e navegue para `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** (canto superior direito)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta `extension/`
5. A extensão será carregada e aparecerá na barra de ferramentas

### Gerar Ícones Finais

Os ícones atuais são placeholders. Para gerar os ícones finais:

1. Abra `icons/generate-icons.html` em um navegador
2. Clique em "Baixar Todos"
3. Substitua os arquivos na pasta `icons/`

## 📁 Estrutura

```
extension/
├── manifest.json          # Configuração da extensão (Chrome MV3)
├── background.js          # Service Worker
├── content/
│   ├── content-script.js  # Script injetado nas páginas
│   └── ai-styles.css      # Estilos dos componentes de IA
├── popup/
│   ├── popup.html         # Interface do popup
│   ├── popup.css          # Estilos do popup
│   └── popup.js           # Lógica do popup
├── lib/
│   └── ai-suggestions.js  # Dados e configurações de IA
└── icons/                 # Ícones da extensão
```

## 🎯 Funcionalidades

### Análise de Relato
- **Sentimento**: Análise do tom emocional da manifestação
- **Urgência**: Identificação de indicadores de urgência
- **Veracidade**: Score de consistência do relato
- **Linguagem**: Detecção de linguagem inadequada
- **Duplicatas**: Identificação de manifestações similares

### Sugestões de Classificação
- Modalidade
- Tipo
- Assunto
- Subassunto
- Palavras-chave

### Painel de Análise IA
- Encaminhamento sugerido
- Scores de análise
- Insights baseados em histórico

### Sugestões de Resposta
- Tipo de resposta
- Modelo de resposta
- Rascunho de texto

## 🔧 Uso

1. Navegue até a página de detalhes do atendimento (`detalhes.html`)
2. A extensão detecta automaticamente a página compatível
3. Componentes de IA são injetados na interface
4. Use os botões para aceitar, rejeitar ou entender as sugestões
5. Clique no ícone da extensão para ver estatísticas e configurações

## 🖥️ Compatibilidade

- **Chrome**: Versão 88+ (Manifest V3)
- **Edge**: Versão 88+ (baseado em Chromium)
- **Brave**: Versão 1.20+

### Futura Compatibilidade
- Firefox (requer adaptação para Manifest V2/V3)
- Safari (requer adaptação)

## 📊 Estatísticas

A extensão rastreia:
- Sugestões aceitas
- Sugestões rejeitadas
- Explicações solicitadas

Essas métricas ajudam a melhorar o sistema de IA.

## 🔒 Privacidade

- A extensão opera localmente
- Nenhum dado é enviado para servidores externos
- Feedback é armazenado apenas no storage local do browser

## 🛠️ Desenvolvimento

### Testar localmente

```bash
# Servir o mockup localmente
cd workspace/mockup
python -m http.server 8080

# Acessar
# http://localhost:8080/detalhes.html
```

### Debug

1. Abra `chrome://extensions/`
2. Clique em "Detalhes" da extensão SINOPIA
3. Clique em "Inspecionar visualizações" > "Service Worker"
4. Use o Console para ver logs

## 📝 Changelog

### v1.0.0
- Versão inicial
- Análise de manifestações
- Sugestões de classificação
- Painel de análise IA
- Sugestões de resposta
- Popup com estatísticas

## 📄 Licença

Projeto SINÓPIA - UPE (Universidade de Pernambuco)

