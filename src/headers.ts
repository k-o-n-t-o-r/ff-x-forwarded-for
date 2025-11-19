// Safe headers - commonly used, unlikely to break functionality
const safeHeaders: string[] = [
    "X-Forwarded-For",
    "X-Real-IP",
    "X-Originating-IP",
    "True-Client-IP",
    "Client-IP",
];

// Vendor-specific headers - CDN and provider specific
const vendorHeaders: string[] = [
    "CF-Connecting-IP",              // Cloudflare
    "Ali-CDN-Real-IP",               // Alibaba CDN
    "Cdn-Src-IP",                    // Generic CDN
    "Cdn-Real-IP",                   // Generic CDN
    "WL-Proxy-Client-IP",            // WebLogic
    "Proxy-Client-IP",               // Generic proxy
    "X-ProxyMesh-IP",                // ProxyMesh service
    "X-ProxyUser-IP",                // Proxy user IP
    "X-BlueCoat-Via",                // Blue Coat proxy
];

// Advanced headers - may break functionality on some sites
const advancedHeaders: string[] = [
    "X-Forwarded-For-Original",
    "X-Forwarded",
    "X-Forwarded-By",
    "X-Forwarded-Server",
    "X-Forwarded-Host",
    "X-Forward-For",
    "X-Original-IP",
    "X-Original-Remote-Addr",
    "X-Original-Host",
    "X-Original-Url",
    "X-Originally-Forwarded-For",
    "X-Remote-IP",
    "X-Remote-Addr",
    "X-Cluster-Client-IP",
    "X-From-IP",
    "X-From",
    "X-True-Client-IP",
    "X-Backend-Host",
    "X-Gateway-Host",
    "X-Host",
    "X-Ip",
    "X-Cache-Info",
    "Forwarded",
    "Forwarded-For",
    "Source-IP",
    "Via",
    "Z-Forwarded-For",
];

// Esoteric headers - rare, unusual, or legacy
const esotericHeaders: string[] = [
    // HTTP-prefixed (CGI-style)
    "HTTP-CLIENT-IP",
    "HTTP-FORWARDED-FOR-IP",
    "HTTP-PC-REMOTE-ADDR",
    "HTTP-PROXY-CONNECTION",
    "HTTP-VIA",
    "HTTP-X-FORWARDED-FOR-IP",
    "HTTP-X-IMFORWARDS",
    "HTTP-XROXY-CONNECTION",

    // Uppercase variants
    "COMING_FROM",
    "CONNECT_VIA_IP",
    "FORWARD_FOR",
    "PC_REMOTE_ADDR",
    "REMOTE_ADDR",

    // Proxy-related
    "PRAGMA",
    "PROXY_AUTHORIZATION",
    "PROXY_CONNECTION",
    "PROXY",

    // Unusual variants
    "XONNECTION",
    "XPROXY",
    "XROXY_CONNECTION",
    "ZCACHE_CONTROL",
];

const headers: string[] = [...safeHeaders, ...vendorHeaders, ...advancedHeaders, ...esotericHeaders];

export default headers;
export { safeHeaders, vendorHeaders, advancedHeaders, esotericHeaders };
