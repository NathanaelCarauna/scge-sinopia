# Instruções para Testar a Extensão - v1.0

## ✅ Problemas Resolvidos

### 1. Event Delegation
O erro `window.SINOPIA_* is not a function` foi resolvido com Event Delegation.

### 2. Controle Granular de Funcionalidades
Agora é possível habilitar/desabilitar cada funcionalidade individualmente através do popup.

## 🔄 Como Recarregar a Extensão

1. Vá em `chrome://extensions/`
2. Encontre a extensão **SINOPIA OE2 - Assistente IA**
3. Clique no botão de **reload** ⟳
4. Recarregue a página do mockup (`http://localhost:5500/detalhes.html`)

## 🧪 Como Testar

### Teste 1: Controle de Funcionalidades no Popup

1. **Abra a página de detalhes:**
   ```
   http://localhost:5500/detalhes.html?protocol=20230&stage=3
   ```

2. **Clique no ícone da extensão SINOPIA** (barra de ferramentas)

3. **Verifique a configuração padrão:**
   - Toggle "Ativar Assistente IA": ✅ Ativado
   - Análise de Sentimento: ⬜ Desabilitado
   - **Detecção de Duplicatas**: ✅ **Habilitado** (padrão)
   - Sugestões de Classificação: ⬜ Desabilitado
   - Sugestão de Encaminhamento: ⬜ Desabilitado
   - Sugestões de Resposta: ⬜ Desabilitado

4. **Verifique na página:**
   - Deve aparecer APENAS o badge "2 Similares"
   - NÃO deve aparecer badges de sentimento/urgência/veracidade
   - NÃO deve aparecer sugestões de classificação
   - NÃO deve aparecer painel de encaminhamento

### Teste 2: Ativar Funcionalidade de Sentimento

1. **No popup, ative "Análise de Sentimento"**
2. **Aguarde a página recarregar** (ou recarregue manualmente)
3. **Verifique na página:**
   - Badges de sentimento, urgência, veracidade e linguagem devem aparecer
   - Badge de duplicatas continua visível

### Teste 3: Ativar Sugestões de Classificação

1. **No popup, ative "Sugestões de Classificação"**
2. **Verifique na página:**
   - Caixas de sugestão aparecem nos campos (modalidade, tipo, assunto, etc.)
   - Clique no botão ✓ (aceitar) em uma sugestão
   - Clique no botão ✗ (rejeitar) em uma sugestão
   - Clique no botão ? (explicar) em uma sugestão

### Teste 4: Ativar Sugestão de Encaminhamento

1. **No popup, ative "Sugestão de Encaminhamento"**
2. **Verifique na página:**
   - Painel "Análise Inteligente" aparece na coluna direita
   - Teste o botão "Aplicar Sugestão"

### Teste 5: Ativar Sugestões de Resposta

1. **No popup, ative "Sugestões de Resposta"**
2. **Clique no botão "RESPONDER"** (bottom actions)
3. **No modal de resposta:**
   - Sugestões de IA devem aparecer para tipo, modelo e texto
   - Teste aceitar/rejeitar as sugestões

### Teste 6: Desativar Tudo

1. **No popup, desative o toggle "Ativar Assistente IA"**
2. **Verifique na página:**
   - Todos os componentes de IA devem sumir
   - Badge "SINOPIA Ativo" deve desaparecer

### Teste 7: Duplicatas (Principal)

1. **No popup, certifique-se de que APENAS "Detecção de Duplicatas" está ativa**
2. **Na página, clique no badge "2 Similares"**
3. **No modal:**
   - Deve listar as manifestações similares
   - Teste "Marcar como Duplicata"
   - Teste "Vincular Casos"
   - Teste "Fechar"

## 🐛 Debug

Se houver erros, abra o Console do DevTools (`F12`) e verifique:

```javascript
// Deve mostrar ao carregar:
[SINOPIA] Extensão carregada - Iniciando injeção de IA
[SINOPIA] Injetando componentes de IA...
[SINOPIA] INFO: IA processando manifestação...
[SINOPIA] SUCCESS: Análise IA concluída! Sugestões disponíveis.

// Ao ativar/desativar funcionalidades:
[SINOPIA] Mensagem recebida: {type: "FEATURE_TOGGLE", feature: "duplicates", enabled: true}
```

## 📋 Comportamento Esperado

### Estado Padrão (Primeira Instalação)
- ✅ IA Ativa
- ✅ Detecção de Duplicatas APENAS
- ⬜ Todas as outras funcionalidades desabilitadas

### Ao Habilitar Funcionalidades
- A página é automaticamente atualizada
- Componentes correspondentes são injetados
- Notificação aparece confirmando a ação

### Ao Desabilitar Funcionalidades
- Componentes correspondentes são removidos
- Notificação aparece confirmando a ação

## 🔧 Mudanças Técnicas (v1.0)

### 1. Event Delegation
**Antes (❌):**
```html
<button onclick="window.SINOPIA_acceptSuggestion('modalidade', 'MANIFESTAÇÃO')">✓</button>
```

**Depois (✅):**
```html
<button data-sinopia-action="accept-suggestion"
        data-field-id="modalidade"
        data-value="MANIFESTAÇÃO">✓</button>
```

### 2. Controle Granular
```javascript
// Estado de funcionalidades (padrão)
enabledFeatures = {
    sentiment: false,
    duplicates: true,      // ✅ Única ativa por padrão
    classification: false,
    forwarding: false,
    response: false
}

// Verificação antes de injetar
if (enabledFeatures.duplicates) {
    injectDuplicatesBadge();
}
```

### 3. Comunicação Popup ↔ Content Script
```javascript
// Popup envia mensagem
chrome.tabs.sendMessage(tabId, {
    type: 'FEATURE_TOGGLE',
    feature: 'duplicates',
    enabled: true
});

// Content script recebe e atualiza
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'FEATURE_TOGGLE') {
        enabledFeatures[message.feature] = message.enabled;
        removeAIComponents();
        injectAIComponents();
    }
});
```

## 📁 Arquivos Modificados

- `workspace/extension/popup/popup.html` - Adicionado seção de funcionalidades
- `workspace/extension/popup/popup.css` - Estilos para toggles individuais
- `workspace/extension/popup/popup.js` - Gerenciamento de funcionalidades
- `workspace/extension/content/content-script.js` - Event delegation + controle condicional
- `workspace/extension/manifest.json` - Suporte para porta 5500
- `workspace/extension/README.md` - Documentação atualizada

