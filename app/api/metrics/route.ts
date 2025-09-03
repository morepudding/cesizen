import { NextResponse } from 'next/server';

// Forcer l'utilisation du Node.js Runtime
export const runtime = 'nodejs';

// ===== MÉTRIQUES SIMPLES CESIZEN (sans prom-client) =====

// Stockage en mémoire des métriques basiques
const metrics = {
  http_requests_total: new Map<string, number>(),
  http_request_duration_seconds: new Map<string, number[]>(),
  user_signups_total: 0,
  user_logins_total: { success: 0, failed: 0 },
  activities_created_total: 0,
  zen_garden_visits_total: 0,
  stress_tests_completed_total: 0,
  errors_total: new Map<string, number>(),
  uptime_seconds: Date.now() / 1000
};

// Helper pour formater les métriques au format Prometheus
function formatPrometheusMetrics(): string {
  const timestamp = Date.now();
  let output = '';

  // Headers
  output += '# HELP cesizen_info Information about CESIZen application\n';
  output += '# TYPE cesizen_info gauge\n';
  output += `cesizen_info{version="1.0.0",app="cesizen"} 1 ${timestamp}\n\n`;

  // Uptime
  const uptime = (Date.now() / 1000) - metrics.uptime_seconds;
  output += '# HELP cesizen_uptime_seconds Application uptime in seconds\n';
  output += '# TYPE cesizen_uptime_seconds counter\n';
  output += `cesizen_uptime_seconds ${uptime} ${timestamp}\n\n`;

  // HTTP Requests Total
  output += '# HELP cesizen_http_requests_total Total HTTP requests\n';
  output += '# TYPE cesizen_http_requests_total counter\n';
  for (const [key, value] of metrics.http_requests_total.entries()) {
    const [method, route, status] = key.split('|');
    output += `cesizen_http_requests_total{method="${method}",route="${route}",status_code="${status}"} ${value} ${timestamp}\n`;
  }
  output += '\n';

  // HTTP Request Duration
  output += '# HELP cesizen_http_request_duration_seconds HTTP request duration\n';
  output += '# TYPE cesizen_http_request_duration_seconds histogram\n';
  for (const [key, durations] of metrics.http_request_duration_seconds.entries()) {
    if (durations.length > 0) {
      const [method, route, status] = key.split('|');
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
      const max = Math.max(...durations);
      
      output += `cesizen_http_request_duration_seconds{method="${method}",route="${route}",status_code="${status}",quantile="0.5"} ${avg} ${timestamp}\n`;
      output += `cesizen_http_request_duration_seconds{method="${method}",route="${route}",status_code="${status}",quantile="0.95"} ${max} ${timestamp}\n`;
      output += `cesizen_http_request_duration_seconds{method="${method}",route="${route}",status_code="${status}",quantile="0.99"} ${max} ${timestamp}\n`;
    }
  }
  output += '\n';

  // User Metrics
  output += '# HELP cesizen_user_signups_total Total user signups\n';
  output += '# TYPE cesizen_user_signups_total counter\n';
  output += `cesizen_user_signups_total ${metrics.user_signups_total} ${timestamp}\n\n`;

  output += '# HELP cesizen_user_logins_total Total user login attempts\n';
  output += '# TYPE cesizen_user_logins_total counter\n';
  output += `cesizen_user_logins_total{status="success"} ${metrics.user_logins_total.success} ${timestamp}\n`;
  output += `cesizen_user_logins_total{status="failed"} ${metrics.user_logins_total.failed} ${timestamp}\n\n`;

  // Business Metrics
  output += '# HELP cesizen_activities_created_total Total activities created\n';
  output += '# TYPE cesizen_activities_created_total counter\n';
  output += `cesizen_activities_created_total ${metrics.activities_created_total} ${timestamp}\n\n`;

  output += '# HELP cesizen_zen_garden_visits_total Total zen garden visits\n';
  output += '# TYPE cesizen_zen_garden_visits_total counter\n';
  output += `cesizen_zen_garden_visits_total ${metrics.zen_garden_visits_total} ${timestamp}\n\n`;

  output += '# HELP cesizen_stress_tests_completed_total Total stress tests completed\n';
  output += '# TYPE cesizen_stress_tests_completed_total counter\n';
  output += `cesizen_stress_tests_completed_total ${metrics.stress_tests_completed_total} ${timestamp}\n\n`;

  // Error Metrics
  output += '# HELP cesizen_errors_total Total application errors\n';
  output += '# TYPE cesizen_errors_total counter\n';
  for (const [errorType, count] of metrics.errors_total.entries()) {
    output += `cesizen_errors_total{error_type="${errorType}"} ${count} ${timestamp}\n`;
  }

  return output;
}

// ===== FONCTIONS UTILITAIRES POUR INSTRUMENTER L'APP =====

export function incrementHttpRequests(method: string, route: string, statusCode: number) {
  const key = `${method}|${route}|${statusCode}`;
  metrics.http_requests_total.set(key, (metrics.http_requests_total.get(key) || 0) + 1);
}

export function recordHttpDuration(method: string, route: string, statusCode: number, duration: number) {
  const key = `${method}|${route}|${statusCode}`;
  if (!metrics.http_request_duration_seconds.has(key)) {
    metrics.http_request_duration_seconds.set(key, []);
  }
  metrics.http_request_duration_seconds.get(key)!.push(duration);
  
  // Garder seulement les 1000 dernières mesures pour éviter la fuite mémoire
  const durations = metrics.http_request_duration_seconds.get(key)!;
  if (durations.length > 1000) {
    durations.splice(0, durations.length - 1000);
  }
}

export function incrementUserSignups() {
  metrics.user_signups_total++;
}

export function incrementUserLogins(success: boolean) {
  if (success) {
    metrics.user_logins_total.success++;
  } else {
    metrics.user_logins_total.failed++;
  }
}

export function incrementActivitiesCreated() {
  metrics.activities_created_total++;
}

export function incrementZenGardenVisits() {
  metrics.zen_garden_visits_total++;
}

export function incrementStressTestsCompleted() {
  metrics.stress_tests_completed_total++;
}

export function incrementErrors(errorType: string) {
  metrics.errors_total.set(errorType, (metrics.errors_total.get(errorType) || 0) + 1);
}

// ===== ENDPOINT API =====

export async function GET() {
  try {
    // Vérification basique de sécurité (optionnel)
    // Désactivé pour le développement local - à activer en production
    // const authHeader = request.headers.get('authorization');
    // if (process.env.METRICS_AUTH_TOKEN && authHeader !== `Bearer ${process.env.METRICS_AUTH_TOKEN}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // Générer les métriques au format Prometheus
    const prometheusMetrics = formatPrometheusMetrics();
    
    return new NextResponse(prometheusMetrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    incrementErrors('metrics_generation_error');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
