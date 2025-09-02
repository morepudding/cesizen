# 🧪 Tests de Sécurité CESIZen - PowerShell
# Script pour tester manuellement les défenses de sécurité

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$TestType = "all"
)

Write-Host "🧪 Tests de Sécurité CESIZen" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Endpoint: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

function Test-BruteForce {
    Write-Host "🥊 Test Protection Brute Force..." -ForegroundColor Blue
    
    $loginData = @{
        email = "test@example.com"
        password = "wrongpassword"
    } | ConvertTo-Json
    
    for ($i = 1; $i -le 6; $i++) {
        try {
            $response = Invoke-RestMethod -Uri "$BaseUrl/api/auth/signin" -Method POST -Body $loginData -ContentType "application/json" -ErrorAction SilentlyContinue
            Write-Host "  Tentative $i : OK" -ForegroundColor Green
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                Write-Host "  ✅ Tentative $i : BLOQUÉE (429)" -ForegroundColor Green
                return
            }
            Write-Host "  Tentative $i : Erreur $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
        Start-Sleep -Milliseconds 200
    }
    Write-Host "  ❌ Brute Force non bloqué après 6 tentatives" -ForegroundColor Red
}

function Test-RateLimit {
    Write-Host "🚦 Test Rate Limiting..." -ForegroundColor Blue
    
    $jobs = @()
    $blocked = 0
    $success = 0
    
    Write-Host "  Envoi de 50 requêtes rapides..." -ForegroundColor Yellow
    
    for ($i = 1; $i -le 50; $i++) {
        $jobs += Start-Job -ScriptBlock {
            param($url, $num)
            try {
                $response = Invoke-RestMethod -Uri "$url/api/test?req=$num" -Method GET -TimeoutSec 5
                return "200"
            }
            catch {
                if ($_.Exception.Response.StatusCode -eq 429) {
                    return "429"
                }
                return "error"
            }
        } -ArgumentList $BaseUrl, $i
    }
    
    $results = $jobs | Wait-Job | Receive-Job
    $jobs | Remove-Job
    
    $blocked = ($results | Where-Object { $_ -eq "429" }).Count
    $success = ($results | Where-Object { $_ -eq "200" }).Count
    
    if ($blocked -gt 0) {
        Write-Host "  ✅ Rate Limiting fonctionne : $blocked bloquées, $success autorisées" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Rate Limiting non détecté : $success requêtes autorisées" -ForegroundColor Red
    }
}

function Test-SQLInjection {
    Write-Host "💉 Test Protection SQL Injection..." -ForegroundColor Blue
    
    $sqlPayloads = @(
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--"
    )
    
    $blocked = 0
    
    foreach ($payload in $sqlPayloads) {
        try {
            $encodedPayload = [System.Web.HttpUtility]::UrlEncode($payload)
            $response = Invoke-RestMethod -Uri "$BaseUrl/api/test?search=$encodedPayload" -Method GET -ErrorAction SilentlyContinue
            Write-Host "  ❌ SQL Injection non bloqué: $payload" -ForegroundColor Red
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 400) {
                Write-Host "  ✅ SQL Injection bloqué: $payload" -ForegroundColor Green
                $blocked++
            } else {
                Write-Host "  ⚠️ Erreur inattendue: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
            }
        }
    }
    
    if ($blocked -eq 0) {
        Write-Host "  ❌ Aucune protection SQL Injection détectée" -ForegroundColor Red
    }
}

function Test-XSSProtection {
    Write-Host "🛡️ Test Protection XSS..." -ForegroundColor Blue
    
    $xssPayloads = @(
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "javascript:alert('XSS')"
    )
    
    $blocked = 0
    
    foreach ($payload in $xssPayloads) {
        try {
            $body = @{ comment = $payload } | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "$BaseUrl/api/test" -Method POST -Body $body -ContentType "application/json" -ErrorAction SilentlyContinue
            Write-Host "  ❌ XSS non bloqué: $($payload.Substring(0, 30))..." -ForegroundColor Red
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 400) {
                Write-Host "  ✅ XSS bloqué: $($payload.Substring(0, 30))..." -ForegroundColor Green
                $blocked++
            } else {
                Write-Host "  ⚠️ Erreur: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
            }
        }
    }
    
    if ($blocked -eq 0) {
        Write-Host "  ❌ Aucune protection XSS détectée" -ForegroundColor Red
    }
}

function Test-SecurityHeaders {
    Write-Host "🔒 Test Headers de Sécurité..." -ForegroundColor Blue
    
    $requiredHeaders = @(
        "X-Frame-Options",
        "X-Content-Type-Options", 
        "X-XSS-Protection",
        "Strict-Transport-Security"
    )
    
    try {
        $response = Invoke-WebRequest -Uri $BaseUrl -Method GET -UseBasicParsing
        
        foreach ($header in $requiredHeaders) {
            if ($response.Headers[$header]) {
                Write-Host "  ✅ Header présent: $header" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Header manquant: $header" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "  ❌ Erreur lors du test des headers: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Exécution des tests
switch ($TestType.ToLower()) {
    "brute" { Test-BruteForce }
    "rate" { Test-RateLimit }
    "sql" { Test-SQLInjection }
    "xss" { Test-XSSProtection }
    "headers" { Test-SecurityHeaders }
    "all" {
        Test-BruteForce
        Write-Host ""
        Test-RateLimit
        Write-Host ""
        Test-SQLInjection
        Write-Host ""
        Test-XSSProtection
        Write-Host ""
        Test-SecurityHeaders
    }
    default {
        Write-Host "Types de tests disponibles: all, brute, rate, sql, xss, headers" -ForegroundColor Yellow
        Write-Host "Exemple: .\security-test.ps1 -TestType sql" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎯 Tests terminés!" -ForegroundColor Cyan
