# Configuração VPN ATI-PE

Conexão VPN para acessar o sistema de ouvidoria real do governo de Pernambuco.

## ✅ Status da Instalação

A VPN já foi configurada e está pronta para uso!

**Nome da Conexão:** `vpn-ati-pe`  
**Servidor:** `vpndc.ati.pe.gov.br:1194`  
**Certificado:** `lucas.teixeira`

---

## 🖥️ Como Conectar (Interface Gráfica)

### Método 1: Via Painel de Rede (Recomendado)

1. **Clique no ícone de rede** no canto superior direito da tela (barra do sistema)
2. **Procure por "VPN"** no menu
3. **Selecione "vpn-ati-pe"**
4. **Digite suas credenciais:**
   - Usuário: `lucas.teixeira` (ou seu usuário ATI)
   - Senha: sua senha da rede ATI

### Método 2: Via Configurações do Sistema

1. Abra **Configurações** do Zorin OS
2. Vá em **Rede** ou **Network**
3. Na seção **VPN**, clique em **vpn-ati-pe**
4. Clique no botão de **ligar/conectar**
5. Digite suas credenciais quando solicitado

---

## 💻 Como Conectar (Linha de Comando)

### Conectar

```bash
nmcli connection up vpn-ati-pe
```

Será solicitado usuário e senha. Você pode salvá-los permanentemente editando a conexão:

```bash
nmcli connection edit vpn-ati-pe
set vpn.user-name lucas.teixeira
set vpn.secrets password=SUA_SENHA_AQUI
save
quit
```

### Verificar Status

```bash
nmcli connection show --active | grep vpn
```

### Desconectar

```bash
nmcli connection down vpn-ati-pe
```

---

## 🔍 Testando a Conexão

Após conectar, teste se consegue acessar recursos internos:

```bash
# Testar conectividade
ping -c 4 vpndc.ati.pe.gov.br

# Verificar roteamento
ip route | grep tun

# Verificar interface VPN
ip addr show tun0
```

---

## 🔧 Troubleshooting

### Problema: "Connection failed"

1. Verifique suas credenciais
2. Confirme que o serviço NetworkManager está ativo:
   ```bash
   systemctl status NetworkManager
   ```

### Problema: "Certificate error"

Os certificados já estão embutidos no arquivo de configuração, mas se houver erro:

```bash
# Reimportar a conexão
nmcli connection delete vpn-ati-pe
nmcli connection import type openvpn file ~/Workspace/SINOPIA/vpn-ati-pe.ovpn
```

### Problema: VPN conecta mas não acessa recursos internos

```bash
# Verificar DNS
nmcli connection show vpn-ati-pe | grep DNS
resolvectl status tun0
```

---

## 📝 Próximos Passos

Após conectar à VPN:

1. **Identifique a URL do sistema real** de ouvidoria
2. **Ajuste a extensão** para reconhecer a URL real (além do mockup local)
3. **Teste a integração** com dados reais

### Ajustar a Extensão para URL Real

Edite `workspace/extension/manifest.json` e adicione o domínio real em:

```json
{
  "host_permissions": [
    "https://ouvidoria.ati.pe.gov.br/*",
    "http://localhost:*/*",
    ...
  ],
  "content_scripts": [
    {
      "matches": [
        "https://ouvidoria.ati.pe.gov.br/*/detalhes*",
        "http://localhost:*/*detalhes*",
        ...
      ],
      ...
    }
  ]
}
```

---

## 🔐 Segurança

**IMPORTANTE:** O arquivo `vpn-ati-pe.ovpn` contém certificados e chaves privadas. Por isso:

- ✅ Já foi adicionado ao `.gitignore`
- ❌ **NUNCA** compartilhe este arquivo publicamente
- ❌ **NUNCA** faça commit dele no Git
- ✅ Mantenha-o apenas localmente

---

## 📞 Suporte

Em caso de problemas de acesso, entre em contato com:
- **ATI-PE** (Agência de Tecnologia da Informação de Pernambuco)
- Setor responsável pela VPN institucional
