# Ícones da Extensão SINOPIA

## Como gerar os ícones

### Opção 1: Usar o gerador HTML (Recomendado)
1. Abra o arquivo `generate-icons.html` em um navegador
2. Clique em "Baixar Todos" ou baixe cada tamanho individualmente
3. Os arquivos serão salvos como `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

### Opção 2: Usar ferramenta online
1. Acesse [favicon.io](https://favicon.io/favicon-generator/) ou similar
2. Use as cores: Primária #3b82f6, Secundária #1d4ed8
3. Gere ícones nos tamanhos: 16x16, 32x32, 48x48, 128x128

### Opção 3: Usar ImageMagick (se instalado)
```bash
# Converter SVG para PNG
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 32x32 icon32.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

## Especificações
- **Formato:** PNG com transparência
- **Tamanhos:** 16x16, 32x32, 48x48, 128x128 pixels
- **Cor primária:** #3b82f6 (azul)
- **Cor secundária:** #1d4ed8 (azul escuro)
- **Ícone:** Robô/IA representando assistente inteligente

## Arquivos necessários
- `icon16.png` - Barra de ferramentas pequena
- `icon32.png` - Barra de ferramentas normal
- `icon48.png` - Página de extensões
- `icon128.png` - Chrome Web Store

