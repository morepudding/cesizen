# Tests de Securite CESIZen - PowerShell
# Script pour tester manuellement les defenses de securite

param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$TestType = "all"
)

Write-Host "Tests de Securite CESIZen" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Endpoint: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

function Test-SecurityHeaders {
    Write-Host "Test Headers de Securite..." -ForegroundColor Blue
    
    $requiredHeaders = @(
        "X-Frame-Options",
        "X-Content-Type-Options", 
        "X-XSS-Protection"
    )
    
    try {
        $response = Invoke-WebRequest -Uri $BaseUrl -Method GET -UseBasicParsing
        
        foreach ($header in $requiredHeaders) {
            if ($response.Headers[$header]) {
                Write-Host "  OK Header present: $header" -ForegroundColor Green
            } else {
                Write-Host "  KO Header manquant: $header" -ForegroundColor Red
            }
        }
    }
    catch {
        Write-Host "  ERREUR lors du test des headers: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-APIEndpoint {
    Write-Host "Test API Endpoint..." -ForegroundColor Blue
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/test?req=1" -Method GET
        Write-Host "  OK API accessible" -ForegroundColor Green
        Write-Host "  Response: $($response.message)" -ForegroundColor Yellow
    }
    catch {
        Write-Host "  KO API non accessible: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-SQLInjection {
    Write-Host "Test Protection SQL Injection..." -ForegroundColor Blue
    
    $sqlPayload = "' OR '1'='1"
    
    try {
        $encodedPayload = [System.Web.HttpUtility]::UrlEncode($sqlPayload)
        $null = Invoke-RestMethod -Uri "$BaseUrl/api/test?search=$encodedPayload" -Method GET -ErrorAction Stop
        Write-Host "  KO SQL Injection non bloque: $sqlPayload" -ForegroundColor Red
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 400) {
            Write-Host "  OK SQL Injection bloque: $sqlPayload" -ForegroundColor Green
        } else {
            Write-Host "  ERREUR inattendue: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}

# Execution des tests
switch ($TestType.ToLower()) {
    "headers" { Test-SecurityHeaders }
    "api" { Test-APIEndpoint }
    "sql" { Test-SQLInjection }
    "all" {
        Test-APIEndpoint
        Write-Host ""
        Test-SecurityHeaders
        Write-Host ""
        Test-SQLInjection
    }
    default {
        Write-Host "Types de tests disponibles: all, headers, api, sql" -ForegroundColor Yellow
        Write-Host "Exemple: .\security-test-simple.ps1 -TestType headers" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Tests termines!" -ForegroundColor Cyan
