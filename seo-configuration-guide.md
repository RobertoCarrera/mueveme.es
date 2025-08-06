# Guía de Configuración SEO para Mueveme.es
# ====================================================

## Google Search Console
1. Verificar propiedad del sitio en: https://search.google.com/search-console/
2. Método recomendado: Verificación por meta tag HTML
3. Añadir en <head> de todas las páginas:
   <meta name="google-site-verification" content="[CÓDIGO_GOOGLE]" />

## Google Analytics 4
1. Crear propiedad en: https://analytics.google.com/
2. Instalar código de seguimiento en todas las páginas:
   <!-- Google tag (gtag.js) -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>

## Google My Business
1. Crear perfil en: https://business.google.com/
2. Verificar ubicación de la empresa
3. Configurar:
   - Nombre: Mueveme - Mudanzas y Servicios Tarragona
   - Categoría: Empresa de mudanzas
   - Dirección: Tarragona, España
   - Teléfono: +34 624 027 936
   - Horarios: Lunes-Viernes 8:00-20:00, Sábados 9:00-18:00
   - Descripción: Empresa líder en mudanzas, vaciado de pisos y limpieza en Tarragona

## Bing Webmaster Tools
1. Registrar sitio en: https://www.bing.com/webmasters/
2. Verificar con meta tag:
   <meta name="msvalidate.01" content="[CÓDIGO_BING]" />

## Yandex Webmaster
1. Para mercado internacional: https://webmaster.yandex.com/
2. Meta tag de verificación:
   <meta name="yandex-verification" content="[CÓDIGO_YANDEX]" />

## Schema.org Testing
- Probar datos estructurados: https://validator.schema.org/
- Rich Results Test: https://search.google.com/test/rich-results

## PageSpeed Insights
- Analizar velocidad: https://pagespeed.web.dev/
- Objetivos: LCP < 2.5s, FID < 100ms, CLS < 0.1

## URLs importantes para indexar:
- https://mueveme.es/
- https://mueveme.es/sitemap.xml
- https://mueveme.es/servicios.html
- https://mueveme.es/servicios/mudanzas-tarragona.html
- https://mueveme.es/servicios/vaciado-pisos-tarragona.html
- https://mueveme.es/contacto.html
- https://mueveme.es/blog.html

## Palabras clave objetivo:
### Principales:
- mudanzas Tarragona
- vaciado pisos Tarragona
- limpieza sofás Tarragona
- empresa mudanzas Tarragona

### Long tail:
- mudanzas baratas Tarragona
- vaciado de pisos profesional Tarragona
- limpieza de sofás a domicilio Tarragona
- empresa de mudanzas en Tarragona
- presupuesto mudanza Tarragona

## Monitorización SEO:
- Google Search Console: Rendimiento y errores
- Google Analytics: Tráfico orgánico y conversiones
- Ahrefs/SEMrush: Posicionamiento de keywords
- PageSpeed Insights: Core Web Vitals mensuales
