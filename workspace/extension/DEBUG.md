# Debug da Extensão SINOPIA

## 🐛 Problema Reportado

Todas as funcionalidades estão vindo ativadas, e habilitar/desabilitar não está alterando nada.

## 🔍 Logs Adicionados

Todos os arquivos agora têm logs detalhados:

### Popup (popup.js)
- `[POPUP] Estado carregado:` - Mostra o que foi carregado do storage
- `[POPUP] Features ativas:` - Mostra quais features estão ativas
- `[POPUP] Salvando feature X:` - Quando uma feature é alterada
- `[POPUP] Features salvas:` - Confirmação de salvamento

### Content Script (content-script.js)
- `[SINOPIA] Estado inicial carregado:` - Estado ao inicializar
- `[SINOPIA] Features ativas:` - Features após carregar
- `[SINOPIA] injectAnalysisBadges - sentiment: X duplicates: Y` - Estado ao injetar badges
- `[SINOPIA] Mensagem recebida:` - Mensagens do popup
- `[SINOPIA] Features ANTES/DEPOIS da mudança:` - Comparação ao alterar

## 📋 Passo a Passo para Debug

### 1. Limpar Storage Completamente

Abra o Console do DevTools (`F12`) na **página do mockup** e execute:

```javascript
chrome.storage.local.clear(() => {
    console.log('Storage limpo!');
    location.reload();
});
```

OU execute na **página da extensão** (popup.html):

```javascript
chrome.storage.local.clear(() => {
    console.log('Storage limpo!');
    alert('Storage limpo! Feche e reabra o popup.');
});
```

### 2. Verificar Estado Padrão

Após limpar, recarregue a página e abra o Console:

```javascript
chrome.storage.local.get(['sinopiaEnabled', 'features'], (result) => {
    console.log('Estado atual:', result);
});
```

**Resultado esperado:**
```javascript
{
  sinopiaEnabled: true,
  features: {
    sentiment: false,
    duplicates: true,
    classification: false,
    forwarding: false,
    response: false
  }
}
```

### 3. Verificar Popup

Abra o popup da extensão e verifique no Console do Popup:

1. Clique com botão direito no ícone da extensão
2. Clique em "Inspecionar popup"
3. Veja os logs `[POPUP]`

**Logs esperados:**
```
[POPUP] Estado carregado: {...}
[POPUP] Features ativas: {sentiment: false, duplicates: true, ...}
```

### 4. Verificar Content Script

Na página do mockup (`http://localhost:5500/detalhes.html`):

1. Abra Console (`F12`)
2. Procure por logs `[SINOPIA]`

**Logs esperados:**
```
[SINOPIA] Extensão carregada - Iniciando injeção de IA
[SINOPIA] Estado inicial carregado: {...}
[SINOPIA] Features ativas: {sentiment: false, duplicates: true, ...}
[SINOPIA] Injetando componentes de IA...
[SINOPIA] Tentando injetar badges de análise...
[SINOPIA] injectAnalysisBadges - sentiment: false duplicates: true
[SINOPIA] Injetando badge de duplicatas
[SINOPIA] Total de badges a injetar: 1
[SINOPIA] Sugestões de classificação desabilitadas, pulando
[SINOPIA] Painel de encaminhamento desabilitado, pulando
[SINOPIA] Sugestões de resposta desabilitadas, pulando interceptação do modal
```

### 5. Testar Toggle de Feature

No popup, ative "Análise de Sentimento" e observe os logs:

**No Console do Popup:**
```
[POPUP] Salvando feature sentiment: true
[POPUP] Features salvas: {sentiment: true, duplicates: true, ...}
```

**No Console da Página:**
```
[SINOPIA] ========================================
[SINOPIA] Mensagem recebida: {type: "FEATURE_TOGGLE", feature: "sentiment", enabled: true}
[SINOPIA] Features ANTES da mudança: {sentiment: false, duplicates: true, ...}
[SINOPIA] Alterando feature: sentiment para true
[SINOPIA] Features DEPOIS da mudança: {sentiment: true, duplicates: true, ...}
[SINOPIA] Removendo todos os componentes...
[SINOPIA] Removendo X componentes de IA
[SINOPIA] Reinjetando componentes com novas configurações...
[SINOPIA] ========================================
```

## 🧹 Script de Reset Completo

Cole no Console da **página do mockup** ou do **popup**:

```javascript
// Reset completo da extensão
chrome.storage.local.set({
    sinopiaEnabled: true,
    features: {
        sentiment: false,
        duplicates: true,
        classification: false,
        forwarding: false,
        response: false
    },
    stats: {
        accepted: 0,
        rejected: 0,
        explained: 0
    }
}, () => {
    console.log('✅ Estado resetado para padrão!');
    console.log('Recarregue a página para aplicar.');
    location.reload();
});
```

## ❓ Perguntas para Diagnóstico

1. **Ao abrir o popup, quais toggles estão marcados?**
   - Esperado: ✅ IA Ativa, ✅ Duplicatas, ⬜ Outros

2. **Ao carregar a página, quais componentes aparecem?**
   - Esperado: APENAS badge "2 Similares"

3. **No Console, qual é o estado carregado?**
   - Execute: `chrome.storage.local.get(null, console.log)`

4. **Ao clicar em um toggle, ele muda de estado visualmente?**
   - Se não muda: problema no popup.js
   - Se muda mas não aplica: problema na comunicação

5. **As mensagens estão chegando no content script?**
   - Procure por `[SINOPIA] Mensagem recebida:` no Console

## 🔧 Possíveis Causas

### A. Storage não está persistindo
- Teste: `chrome.storage.local.get(null, console.log)` após mudar toggle

### B. Content script não está recebendo mensagens
- Teste: Veja se aparecem logs `[SINOPIA] Mensagem recebida:`

### C. removeAIComponents() não está removendo tudo
- Teste: Veja quantos elementos são removidos nos logs

### D. Features estão sendo lidas erradas
- Teste: Verifique `enabledFeatures` nos logs de injeção

## 📤 O que Reportar

Se o problema persistir, forneça:

1. **Console do Popup** (após abrir popup)
2. **Console da Página** (após carregar detalhes.html)
3. **Estado do Storage:**
   ```javascript
   chrome.storage.local.get(null, console.log)
   ```
4. **Screenshot dos toggles no popup**
5. **Screenshot dos componentes na página**

