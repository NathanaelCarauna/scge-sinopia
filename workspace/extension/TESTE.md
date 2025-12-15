# Instruções para Testar a Extensão Corrigida

## Problema Resolvido

O erro `window.SINOPIA_* is not a function` foi causado porque as funções estavam sendo chamadas via `onclick` inline no HTML, mas estavam definidas dentro de um escopo isolado (IIFE) do content script.

**Solução:** Refatorei o código para usar **Event Delegation** ao invés de `onclick` inline.

## Como Recarregar a Extensão

1. Vá em `chrome://extensions/`
2. Encontre a extensão **SINOPIA**
3. Clique no botão de **reload** ⟳
4. Recarregue a página do mockup (`http://localhost:5500/detalhes.html`)

## Como Testar

1. **Acesse a página de detalhes:**
   - `http://localhost:5500/detalhes.html?protocol=20230&stage=3`

2. **Verifique se a IA está ativa:**
   - Badge "SINOPIA Ativo" no canto inferior direito ✅
   - Badges de análise aparecem no campo "Relato" ✅

3. **Teste as sugestões de classificação:**
   - Clique no botão ✓ (aceitar) em uma sugestão
   - Clique no botão ✗ (rejeitar) em uma sugestão  
   - Clique no botão ? (explicar) em uma sugestão

4. **Teste os casos similares:**
   - Clique no badge "2 Similares"
   - Modal deve abrir mostrando os casos
   - Teste os botões "Marcar como Duplicata" e "Vincular Casos"

5. **Teste o painel de encaminhamento:**
   - Clique em "Aplicar Sugestão" no painel de análise

6. **Teste o modal de resposta:**
   - Clique no botão "RESPONDER" (bottom actions)
   - Modal deve abrir com sugestões de IA
   - Teste aceitar/rejeitar as sugestões

## Debug

Se ainda houver erros, abra o Console do DevTools (`F12`) e verifique:

```javascript
// Deve mostrar:
[SINOPIA] Extensão carregada - Iniciando injeção de IA
[SINOPIA] Injetando componentes de IA...
[SINOPIA] INFO: IA processando manifestação...
[SINOPIA] SUCCESS: Análise IA concluída! Sugestões disponíveis.
```

## Mudanças Técnicas

### Antes (❌ Não funcionava):
```html
<button onclick="window.SINOPIA_acceptSuggestion('modalidade', 'MANIFESTAÇÃO')">
  ✓
</button>
```

### Depois (✅ Funciona):
```html
<button data-sinopia-action="accept-suggestion"
        data-field-id="modalidade"
        data-value="MANIFESTAÇÃO">
  ✓
</button>
```

E um único event listener no document captura todos os cliques:
```javascript
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-sinopia-action]');
  if (!target) return;
  
  const action = target.dataset.sinopiaAction;
  // Executa a ação correspondente
});
```

## Arquivos Modificados

- `workspace/extension/content/content-script.js` - Event delegation implementado
- `workspace/extension/manifest.json` - Suporte para porta 5500

