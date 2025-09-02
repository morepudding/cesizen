#!/bin/bash

echo "🔥 TESTS DE SÉCURITÉ MANUELS - CESIZEN"
echo "=============================================="

BASE_URL="http://localhost:3000"

echo ""
echo "🔧 Test de connectivité..."
if curl -s "$BASE_URL/api/test" > /dev/null; then
    echo "✅ Application accessible"
else
    echo "❌ Application non accessible"
    exit 1
fi

echo ""
echo "💉 Test Protection SQL Injection..."
echo "  Testing: ' OR '1'='1"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/test?search=%27%20OR%20%271%27%3D%271")
if [ "$response" = "400" ]; then
    echo "  ✅ SQL Injection bloqué (400)"
else
    echo "  ❌ SQL Injection non bloqué ($response)"
fi

echo "  Testing: '; DROP TABLE users; --"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/test?search=%27%3B%20DROP%20TABLE%20users%3B%20--")
if [ "$response" = "400" ]; then
    echo "  ✅ SQL Injection bloqué (400)"
else
    echo "  ❌ SQL Injection non bloqué ($response)"
fi

echo ""
echo "🛡️ Test Protection XSS..."
echo "  Testing: <script>alert('XSS')</script>"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/test" \
    -H "Content-Type: application/json" \
    -d '{"comment":"<script>alert('\''XSS'\'')</script>"}')
if [ "$response" = "400" ]; then
    echo "  ✅ XSS bloqué (400)"
else
    echo "  ❌ XSS non bloqué ($response)"
fi

echo ""
echo "🔒 Test Security Headers..."
headers=$(curl -s -I "$BASE_URL/api/test")
if echo "$headers" | grep -qi "x-frame-options"; then
    echo "  ✅ X-Frame-Options présent"
else
    echo "  ❌ X-Frame-Options manquant"
fi

if echo "$headers" | grep -qi "x-content-type-options"; then
    echo "  ✅ X-Content-Type-Options présent"
else
    echo "  ❌ X-Content-Type-Options manquant"
fi

if echo "$headers" | grep -qi "x-xss-protection"; then
    echo "  ✅ X-XSS-Protection présent"
else
    echo "  ❌ X-XSS-Protection manquant"
fi

echo ""
echo "🚦 Test Rate Limiting (test simple)..."
echo "  Envoi de 3 requêtes rapides..."
count=0
for i in {1..3}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/test?req=$i")
    if [ "$response" = "200" ]; then
        count=$((count + 1))
    fi
done
echo "  Résultat: $count/3 requêtes autorisées"

echo ""
echo "✅ TESTS MANUELS TERMINÉS"
echo "=============================================="
