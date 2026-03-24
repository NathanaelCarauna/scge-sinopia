#!/bin/bash
# Script de diagnóstico para VPN ATI-PE
# Uso: ./vpn-diagnose.sh

echo "═══════════════════════════════════════════════════════"
echo "🔍 DIAGNÓSTICO VPN ATI-PE"
echo "═══════════════════════════════════════════════════════"
echo

echo "📊 Status da Conexão VPN:"
echo "----------------------------------------"
nmcli connection show --active | grep vpn || echo "❌ VPN não está conectada"
echo

echo "🌐 Interface tun0:"
echo "----------------------------------------"
ip addr show tun0 2>/dev/null || echo "❌ Interface tun0 não existe (VPN desconectada)"
echo

echo "📡 Roteamento:"
echo "----------------------------------------"
ip route | grep tun || echo "❌ Nenhuma rota via VPN"
echo

echo "🔐 Últimos 30 logs da VPN:"
echo "----------------------------------------"
journalctl -u NetworkManager -n 30 --no-pager | grep -E "(vpn|openvpn|tun0)" || echo "⚠️ Nenhum log recente"
echo

echo "⏰ Procurando por timeouts/erros:"
echo "----------------------------------------"
journalctl -u NetworkManager --since "10 minutes ago" --no-pager | grep -iE "(timeout|inactivity|failed|error|auth_failed)" | tail -10 || echo "✅ Nenhum erro recente"
echo

echo "═══════════════════════════════════════════════════════"
echo "💡 Comandos úteis:"
echo "  - Conectar:    nmcli connection up vpn-ati-pe"
echo "  - Desconectar: nmcli connection down vpn-ati-pe"
echo "  - Logs live:   journalctl -u NetworkManager -f | grep vpn"
echo "═══════════════════════════════════════════════════════"
