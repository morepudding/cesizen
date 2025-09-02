#!/bin/bash
# Tests de sécurité manuels pour CESIZen

BASE_URL="http://localhost:3000"
echo "🧪 Tests de sécurité CESIZen - $(date)"
echo "URL: $BASE_URL"
echo "================================================"

# Test 1: Protection Brute Force
echo "🔒 Test 1: Protection Brute Force"
for i in {1..7}; do
    echo "Tentative $i..."
    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/auth/signin/credentials" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com","password":"wrong"}' \
        -o /dev/null)
    
    if [ "$response" = "429" ]; then
        echo "✅ Bloqué à la tentative $i (Code: $response)"
        break
    else
        echo "⚠️ Tentative $i autorisée (Code: $response)"
    fi
done

echo ""

# Test 2: Rate Limiting
echo "⏱️ Test 2: Rate Limiting (100 requêtes rapides)"
blocked=0
for i in {1..105}; do
    response=$(curl -s -w "%{http_code}" "$BASE_URL/api/test?req=$i" -o /dev/null)
    if [ "$response" = "429" ]; then
        ((blocked++))
    fi
done
echo "✅ $blocked requêtes bloquées sur 105"

echo ""

# Test 3: SQL Injection
echo "💉 Test 3: Protection SQL Injection"
sql_payloads=(
    "' OR '1'='1"
    "1' UNION SELECT * FROM users--"
    "'; DROP TABLE users; --"
    "admin'--"
)

for payload in "${sql_payloads[@]}"; do
    response=$(curl -s -w "%{http_code}" "$BASE_URL/api/test?id=$(echo "$payload" | sed 's/ /%20/g')" -o /dev/null)
    if [ "$response" = "400" ]; then
        echo "✅ SQL Injection bloqué: ${payload:0:20}..."
    else
        echo "❌ SQL Injection non bloqué: ${payload:0:20}... (Code: $response)"
    fi
done

echo ""

# Test 4: XSS Protection
echo "🚨 Test 4: Protection XSS"
xss_payloads=(
    "<script>alert('XSS')</script>"
    "<img src=x onerror=alert('XSS')>"
    "javascript:alert('XSS')"
    "<iframe src='javascript:alert(\"XSS\")'></iframe>"
)

for payload in "${xss_payloads[@]}"; do
    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/test" \
        -H "Content-Type: application/json" \
        -d "{\"content\":\"$payload\"}" \
        -o /dev/null)
    
    if [ "$response" = "400" ]; then
        echo "✅ XSS bloqué: ${payload:0:20}..."
    else
        echo "❌ XSS non bloqué: ${payload:0:20}... (Code: $response)"
    fi
done

echo ""

# Test 5: Headers de sécurité
echo "🛡️ Test 5: Headers de sécurité"
headers=$(curl -s -I "$BASE_URL/dashboard")

security_headers=(
    "X-Content-Type-Options"
    "X-Frame-Options"
    "X-XSS-Protection"
    "Strict-Transport-Security"
    "Content-Security-Policy"
)

for header in "${security_headers[@]}"; do
    if echo "$headers" | grep -i "$header" > /dev/null; then
        echo "✅ Header $header présent"
    else
        echo "❌ Header $header manquant"
    fi
done

echo ""

# Test 6: CSRF Protection
echo "🔐 Test 6: Protection CSRF"
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/test" \
    -H "Content-Type: application/json" \
    -d '{"test":"csrf"}' \
    -o /dev/null)

if [ "$response" = "403" ]; then
    echo "✅ CSRF Protection active (Code: $response)"
else
    echo "❌ CSRF Protection inactive (Code: $response)"
fi

echo ""

# Test 7: DoS Simulation
echo "💥 Test 7: Simulation DoS (50 requêtes concurrentes)"
start_time=$(date +%s.%N)

for i in {1..50}; do
    curl -s "$BASE_URL/api/test?dos=$i" > /dev/null &
done

wait
end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc)

echo "✅ Test DoS terminé en ${duration}s"

echo ""
echo "================================================"
echo "🎯 Tests terminés - $(date)"
echo "Vérifiez les logs de sécurité dans /logs/security/"
