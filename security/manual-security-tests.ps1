# Tests de sécurité PowerShell pour CESIZen
param(
    [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "🧪 Tests de sécurité CESIZen - $(Get-Date)" -ForegroundColor Cyan
Write-Host "URL: $BaseUrl" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor White

# Test 1: Protection Brute Force
Write-Host "🔒 Test 1: Protection Brute Force" -ForegroundColor Green
$loginData = @{
    email = "test@test.com"
    password = "wrong"
} | ConvertTo-Json

for ($i = 1; $i -le 7; $i++) {
    Write-Host "Tentative $i..." -ForegroundColor Gray
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/signin/credentials" `
            -Method POST `
            -ContentType "application/json" `
            -Body $loginData `
            -ErrorAction SilentlyContinue
        
        $statusCode = $response.StatusCode
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
    }
    
    if ($statusCode -eq 429) {
        Write-Host "✅ Bloqué à la tentative $i (Code: $statusCode)" -ForegroundColor Green
        break
    }
    else {
        Write-Host "⚠️ Tentative $i autorisée (Code: $statusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 2: Rate Limiting
Write-Host "⏱️ Test 2: Rate Limiting (100 requêtes rapides)" -ForegroundColor Green
$blocked = 0
$jobs = @()

for ($i = 1; $i -le 100; $i++) {
    $jobs += Start-Job -ScriptBlock {
        param($url, $reqNum)
        try {
            $response = Invoke-WebRequest -Uri "$url/api/test?req=$reqNum" -ErrorAction SilentlyContinue
            return $response.StatusCode
        }
        catch {
            return $_.Exception.Response.StatusCode.Value__
        }
    } -ArgumentList $BaseUrl, $i
}

$results = $jobs | Wait-Job | Receive-Job
$jobs | Remove-Job

$blocked = ($results | Where-Object { $_ -eq 429 }).Count
Write-Host "✅ $blocked requêtes bloquées sur 100" -ForegroundColor Green

Write-Host ""

# Test 3: SQL Injection
Write-Host "💉 Test 3: Protection SQL Injection" -ForegroundColor Green
$sqlPayloads = @(
    "' OR '1'='1",
    "1' UNION SELECT * FROM users--",
    "'; DROP TABLE users; --",
    "admin'--"
)

foreach ($payload in $sqlPayloads) {
    try {
        $encodedPayload = [System.Web.HttpUtility]::UrlEncode($payload)
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/test?id=$encodedPayload" -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
    }
    
    if ($statusCode -eq 400) {
        Write-Host "✅ SQL Injection bloqué: $($payload.Substring(0, [Math]::Min(20, $payload.Length)))..." -ForegroundColor Green
    }
    else {
        Write-Host "❌ SQL Injection non bloqué: $($payload.Substring(0, [Math]::Min(20, $payload.Length)))... (Code: $statusCode)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 4: XSS Protection
Write-Host "🚨 Test 4: Protection XSS" -ForegroundColor Green
$xssPayloads = @(
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert('XSS')>",
    "javascript:alert('XSS')",
    "<iframe src='javascript:alert(`"XSS`")'></iframe>"
)

foreach ($payload in $xssPayloads) {
    $body = @{ content = $payload } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/test" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.Value__
    }
    
    if ($statusCode -eq 400) {
        Write-Host "✅ XSS bloqué: $($payload.Substring(0, [Math]::Min(20, $payload.Length)))..." -ForegroundColor Green
    }
    else {
        Write-Host "❌ XSS non bloqué: $($payload.Substring(0, [Math]::Min(20, $payload.Length)))... (Code: $statusCode)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 5: Headers de sécurité
Write-Host "🛡️ Test 5: Headers de sécurité" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/dashboard" -ErrorAction SilentlyContinue
    $headers = $response.Headers
    
    $securityHeaders = @(
        "X-Content-Type-Options",
        "X-Frame-Options", 
        "X-XSS-Protection",
        "Strict-Transport-Security",
        "Content-Security-Policy"
    )
    
    foreach ($header in $securityHeaders) {
        if ($headers.ContainsKey($header)) {
            Write-Host "✅ Header $header présent" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Header $header manquant" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "❌ Erreur lors du test des headers: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 6: CSRF Protection
Write-Host "🔐 Test 6: Protection CSRF" -ForegroundColor Green
$csrfBody = @{ test = "csrf" } | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/test" `
        -Method POST `
        -ContentType "application/json" `
        -Body $csrfBody `
        -ErrorAction SilentlyContinue
    $statusCode = $response.StatusCode
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.Value__
}

if ($statusCode -eq 403) {
    Write-Host "✅ CSRF Protection active (Code: $statusCode)" -ForegroundColor Green
}
else {
    Write-Host "❌ CSRF Protection inactive (Code: $statusCode)" -ForegroundColor Red
}

Write-Host ""

# Test 7: Performance DoS
Write-Host "💥 Test 7: Test Performance (50 requêtes concurrentes)" -ForegroundColor Green
$startTime = Get-Date
$dosJobs = @()

for ($i = 1; $i -le 50; $i++) {
    $dosJobs += Start-Job -ScriptBlock {
        param($url, $reqNum)
        try {
            Invoke-WebRequest -Uri "$url/api/test?dos=$reqNum" -ErrorAction SilentlyContinue | Out-Null
        }
        catch { }
    } -ArgumentList $BaseUrl, $i
}

$dosJobs | Wait-Job | Out-Null
$dosJobs | Remove-Job
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "✅ Test performance terminé en $([Math]::Round($duration, 2))s" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor White
Write-Host "🎯 Tests terminés - $(Get-Date)" -ForegroundColor Cyan
Write-Host "Vérifiez les logs de sécurité dans /logs/security/" -ForegroundColor Yellow

# Génération du rapport
$report = @{
    timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
    baseUrl = $BaseUrl
    tests_completed = $true
}

$reportFile = "security-test-report-$(Get-Date -Format 'yyyy-MM-dd').json"
$report | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportFile -Encoding UTF8
Write-Host "📄 Rapport sauvegardé: $reportFile" -ForegroundColor Cyan
