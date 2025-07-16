# Mockup Ouve.PE - Sistema de Ouvidoria

Este é um mockup fiel da interface do sistema Ouve.PE, reproduzindo o design do dashboard principal.

## Estrutura dos Arquivos

- `index.html` - Dashboard principal com cards de métricas
- `atendimentos.html` - Página de atendimentos com filtros e tabela
- `detalhes.html` - Página de detalhes do atendimento com estágios
- `styles.css` - Estilos CSS base compartilhados
- `atendimentos.css` - Estilos específicos da página de atendimentos
- `detalhes.css` - Estilos específicos da página de detalhes
- `script.js` - JavaScript base com navegação
- `atendimentos.js` - JavaScript específico para filtros e tabela
- `detalhes.js` - JavaScript para gerenciar estágios e ações

## Características Implementadas

### ✅ Design Fiel ao Original
- Header com logo UPE e navegação
- Sidebar com menu lateral
- Dashboard com cards coloridos (3 por linha)
- Layout responsivo com grid organizado
- Cores e espaçamento otimizados

### ✅ Funcionalidades Interativas
- **Dashboard (index.html):**
  - Toggle de tema claro/escuro
  - Collapse/expand de seções
  - Hover effects nos cards com navegação
  - Animações de entrada
  - Clique nos cards navega para Atendimentos

- **Atendimentos (atendimentos.html):**
  - Formulário completo de filtros (3 colunas)
  - Campos de data com calendário
  - Validação de CPF/CNPJ em tempo real
  - Tabela interativa com seleção de linhas
  - Sistema de notificações
  - Funcionalidade de limpar filtros
  - Filtros funcionais com simulação de dados
  - Função de impressão
  - Duplo-clique na tabela navega para detalhes

- **Detalhes (detalhes.html):**
  - Sidebar com 4 estágios do processo
  - Indicadores visuais de progresso (ativo/concluído)
  - Ações laterais (DETALHES, HISTÓRICO, IMPRIMIR)
  - Abas de conteúdo (ATENDIMENTO, ANEXOS, etc.)
  - Editor de texto com formatação (B, I, U)
  - Checkboxes de publicação
  - Botões de ação dinâmicos por estágio
  - Panel lateral com informações do órgão
  - Estados diferentes conforme o estágio

- **Geral:**
  - Navegação entre páginas
  - Design responsivo
  - Breadcrumb navigation
  - Sistema de notificações unificado

### ✅ Seções do Dashboard
1. **MANIFESTAÇÃO** (6 cards em layout 3x2)
   - Recebidas (0) - Card laranja
   - Classificadas e não encaminhadas (15) - Card verde
   - Respondidas por Gestores (5) - Card roxo
   - Próxima do vencimento - Prorrogável (0) - Card azul
   - Próxima do vencimento - Prorrogada (0) - Card roxo escuro
   - Vencidas (2) - Card vermelho

2. **ACESSO À INFORMAÇÃO** (3 cards em uma linha)
   - Recebidas (3) - Card laranja
   - Classificadas e não encaminhadas (3) - Card verde
   - Respondidas por Autoridades (2) - Card roxo

### ✅ Página de Atendimentos
**Formulário de Filtros (Grid 3x7):**
- **Linha 1:** Protocolo, Modalidade, Solicitado
- **Linha 2:** No prazo atendimento, No prazo gestor, Situação
- **Linha 3:** Tipo, Assunto, Subassunto
- **Linha 4:** Classificação, Período (com calendário), Palavra-chave
- **Linha 5:** Priorização, Órgão (campo duplo)
- **Linha 6:** Setor (campo completo com textarea)
- **Linha 7:** CPF/CNPJ, Período de publicação (com calendário)

**Tabela de Resultados:**
- Colunas: Protocolo, Data Criação, Data recebimento órgão, Data encerramento do prazo atendimento, Data encerramento do prazo do gestor, Data prorrogação
- 3 registros de exemplo (20230, 20239, 202314)
- Paginação funcional
- Seleção de linhas interativa

### ✅ Estágios e Ações da Página de Detalhes

**4 Estágios do Processo:**
1. **Recebido** - Ações: VOLTAR, CLASSIFICAR
2. **Aguardando resposta** - Ações: VOLTAR, CLASSIFICAR, ENCAMINHAR  
3. **Aguardando retorno do cidadão** - Ações: VOLTAR, CLASSIFICAR, ENCAMINHAR, RESPONDER, CANCELAR
4. **Concluído** - Ações: VOLTAR, CLASSIFICAR, REABRIR + Editor de texto

**Funcionalidades por Estágio:**
- **Indicadores visuais** - Números coloridos (cinza/azul/verde)
- **Navegação entre estágios** - Clique nos números da sidebar
- **Ações dinâmicas** - Botões mudam conforme o estágio atual
- **Editor de texto** - Aparece no estágio 4 e aba Comunicação
- **Conteúdo adaptativo** - Títulos e dados mudam por estágio

**URL Parameters:**
- `?protocol=20230&stage=2` - Abre protocolo específico em estágio específico

## Como Visualizar

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Para desenvolvimento local, use um servidor HTTP simples:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (com http-server)
   npx http-server .
   ```

## Responsividade

O mockup é totalmente responsivo:
- **Desktop**: Layout completo com sidebar fixa
- **Tablet**: Grid adaptado para cards
- **Mobile**: Menu hambúrguer e layout vertical

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, gradientes e animações
- **JavaScript ES6**: Interatividade e funcionalidades
- **Font Awesome**: Ícones vetoriais

## Customização

### Cores dos Cards
```css
.card-orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
.card-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.card-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
.card-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
.card-purple-dark { background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); }
.card-red { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); }
```

### Dados Dinâmicos
Os números dos cards podem ser atualizados via JavaScript:
```javascript
document.querySelector('.card-number').textContent = novoValor;
```

## Modo de Classificação

### Funcionalidade de Edição
Quando o botão **CLASSIFICAR** é pressionado na página de detalhes:

1. **Ativação**: Todos os campos de classificação ficam editáveis
2. **Campos editáveis**:
   - Modalidade (dropdown)
   - Tipo (dropdown)
   - Origem de Atendimento (dropdown)
   - Assunto (dropdown)
   - Subassunto (dropdown)
   - Palavras-chave (input texto)
   - Tipo de Resposta (dropdown)
   - Motivo da Negativa de Acesso (dropdown)
   - Conformidade (dropdown)
   - Solicitada Ajustes pela OGE (dropdown)

3. **Visual**: Campos ganham destaque visual e fundo azul claro
4. **Ações**: Botões SALVAR e CANCELAR aparecem
5. **Salvamento**: Preserva os novos valores e volta ao modo visualização
6. **Cancelamento**: Restaura valores originais

## Modal de Resposta

### Funcionalidade do Modal
Quando o botão **RESPONDER** é pressionado na página de detalhes:

1. **Abertura**: Modal sobrepõe a tela com fundo escuro
2. **Campos do formulário**:
   - **Tipo de Resposta*** (obrigatório): Parcial, Final, Complementação do Cidadão
   - **Para Cidadão**: Sim/Não
   - **Modelo de Resposta**: Lista completa com todas as opções de manifestação e PAI
   - **Editor de texto**: Com toolbar de formatação (Negrito, Itálico, Sublinhado)
   - **Upload de arquivos**: Área de drag & drop para anexos

3. **Controles**:
   - **Fechar**: Botão X, tecla ESC, ou clique fora do modal
   - **Cancelar**: Limpa formulário e fecha modal
   - **Salvar**: Valida campos obrigatórios e salva resposta

4. **Validações**:
   - Tipo de Resposta é obrigatório
   - Texto da resposta é obrigatório
   - Notificações de erro/sucesso

5. **Pós-salvamento**:
   - Fecha o modal automaticamente
   - Atualiza estágio para "Aguardando retorno do cidadão"
   - Mostra notificação de sucesso

6. **Design**:
   - Layout responsivo (mobile/desktop)
   - Toolbar de formatação interativa
   - Upload com feedback visual
   - Estilo consistente com o sistema

## Modo de Encaminhamento

### Funcionalidade de Encaminhamento
Quando o botão **ENCAMINHAR** é pressionado na página de detalhes:

1. **Ativação**: Campos específicos ficam editáveis para configurar o encaminhamento
2. **Campos editáveis**:
   - **Gestor** (dropdown): Opções de gestores disponíveis
     - Gestor Administrativo
     - Gestor Técnico  
     - Gestor de Atendimento
     - Supervisor de Setor
   - **Para Cidadão** (dropdown): Sim/Não

3. **Interface**:
   - Campos ganham destaque visual com fundo azul claro
   - Borda azul lateral indica modo de edição ativo
   - Botões principais são substituídos por "CANCELAR" e "SALVAR ENCAMINHAMENTO"

4. **Validações**:
   - Gestor é obrigatório
   - Para Cidadão é obrigatório
   - Notificações de erro para campos não preenchidos

5. **Pós-salvamento**:
   - Atualiza informações de encaminhamento (data/hora atual)
   - Muda etapa para "Encaminhado para gestão"
   - Progride para estágio "Aguardando resposta"
   - Notificação de sucesso

6. **Cancelamento**:
   - Restaura valores originais dos campos
   - Volta ao modo de visualização normal
   - Preserva estado anterior do caso

## Integração com IA

### Funcionalidades de Inteligência Artificial
Implementação completa dos requisitos OE2 para suporte inteligente ao ouvidor:

#### 🤖 **Análise Automática de Manifestações**

1. **Badges de Análise no Relato**:
   - **Sentimento**: Neutro/Positivo/Negativo (75% confiança)
   - **Urgência**: Baixa/Média/Alta (80% confiança)  
   - **Veracidade**: Score de confiabilidade (85%)
   - **Linguagem**: Normal/Agressiva/Inadequada
   - **Duplicatas**: Link para 2 manifestações similares (78%, 65%)

2. **Sugestões Inteligentes de Classificação**:
   - **Modalidade**: MANIFESTAÇÃO (90% confiança)
   - **Tipo**: SUGESTÃO (85% confiança)
   - **Assunto**: ATENDIMENTO (82% confiança)
   - **Subassunto**: DESEMPENHO (88% confiança)
   - **Palavras-chave**: "atendimento, demora, serviço público, eficiência" (90% confiança)
   - **Botões de Ação**: Aceitar ✓, Rejeitar ✗, Explicar ?

#### 🎯 **Painel de Análise Inteligente**

1. **Encaminhamento Sugerido**:
   - Órgão: SECRETARIA DE DESENVOLVIMENTO SOCIAL (80%)
   - Setor: DIRETORIA DE ATENDIMENTO AO CIDADÃO (75%)
   - Botão "Aplicar Sugestão" para uso automático

2. **Scores de Análise**:
   - **Prioridade**: Baixa (30%) - barra visual
   - **Complexidade**: Média (60%) - barra visual  
   - **Confiabilidade**: Alta (85%) - barra visual

3. **Insights da IA**:
   - Similar a 2 casos dos últimos 30 dias
   - Tempo médio de resolução: 7 dias
   - Taxa de satisfação histórica: 89%

#### 🔍 **Sistema de Explicabilidade (XAI)**

1. **Modal de Explicação**:
   - Por que a IA sugere cada classificação
   - Fatores considerados na análise
   - Casos similares que influenciaram a decisão
   - Opção de fornecer feedback para melhoria

2. **Transparência**:
   - Percentual de confiança em cada sugestão
   - Histórico de decisões registrado
   - Aprendizado baseado no feedback do ouvidor

#### 📊 **Detecção de Duplicatas e Similaridade**

1. **Modal de Manifestações Similares**:
   - Lista de casos com percentual de similaridade
   - Metadados: protocolo, data, usuário, órgão
   - Ações: Marcar como duplicata, Vincular casos
   - Alerta para similaridade >95% (duplicatas)

2. **Análise Automática**:
   - Comparação semântica do texto
   - Identificação de padrões recorrentes
   - Agrupamento por problema/servidor

#### ⚡ **Recursos Avançados**

1. **Aprendizado Contínuo**:
   - Registro de todas as decisões do ouvidor
   - Feedback positivo/negativo para retreinamento
   - Melhoria da precisão baseada na experiência

2. **Processamento em Tempo Real**:
   - Análise automática ao carregar manifestação
   - Animações de carregamento da IA
   - Notificações de progresso e conclusão

3. **Integração com Workflow**:
   - Opção de aplicar todas as sugestões automaticamente
   - Integração com modo de classificação existente
   - Suporte para encaminhamento inteligente

#### 📝 **Modal de Resposta Inteligente**

1. **Sugestões Automáticas**:
   - **Tipo de Resposta**: Final/Parcial/Complementação (92% confiança)
   - **Modelo de Resposta**: Template adequado baseado na classificação (88% confiança)
   - **Texto da Resposta**: Rascunho gerado automaticamente (85% confiança)

2. **Geração de Texto Inteligente**:
   - Rascunho personalizado baseado na manifestação
   - Linguagem formal e respeitosa da ouvidoria
   - Estrutura adequada com agradecimento, análise e encerramento
   - Consideração do contexto e tipo de manifestação

3. **Adaptação ao Contexto**:
   - Análise da classificação da manifestação
   - Seleção do template mais apropriado
   - Geração de texto coerente com o tipo de resposta
   - Integração com histórico de respostas similares

4. **Controles do Usuario**:
   - Aceitar sugestões individualmente
   - Rejeitar sugestões específicas
   - Explicação detalhada de cada sugestão
   - Edição livre após aplicar rascunho

### 🛡️ **Conformidade e Auditoria**

- **Logs Completos**: Todas as decisões da IA são registradas
- **Rastreabilidade**: Histórico de sugestões aceitas/rejeitadas
- **Explicabilidade**: Justificativa para cada análise
- **Feedback Loop**: Sistema de melhoria contínua
- **Transparência**: Percentuais de confiança visíveis

### 📱 **Experiência do Usuário**

- **Interface Intuitiva**: Badges coloridos e botões claros
- **Feedback Visual**: Animações e confirmações
- **Controle Total**: Ouvidor sempre tem decisão final
- **Eficiência**: Reduz tempo de classificação manual
- **Aprendizado**: Sistema melhora com o uso

A implementação segue rigorosamente os requisitos RF005-RF012 do documento OE2, fornecendo um sistema completo de suporte inteligente ao ouvidor com transparência, explicabilidade e aprendizado contínuo. 