// Safe headers - commonly used, unlikely to break functionality
const safeHeaders: string[] = [
    "X-Forwarded-For",
    "X-Real-IP",
    "X-Originating-IP",
    "CF-Connecting-IP",
    "True-Client-IP",
    "X-Client-IP",
];

// Advanced headers - may break functionality on some sites
const advancedHeaders: string[] = [
    // X-Forwarded variants
    "X-Forwarded-For-Original",
    "X-Forwarded",
    "X-Forwarded-By",
    "X-Forwarded-Server",
    "X-Forwarded-Host",
    "X-Forward-For",

    // X-Real/Original IP headers
    "X-Original-IP",
    "X-Original-Remote-Addr",
    "X-Original-Host",
    "X-Original-Url",
    "X-Originally-Forwarded-For",

    // X-Remote headers
    "X-Remote-IP",
    "X-Remote-Addr",

    // X-Client/Cluster headers
    "X-Cluster-Client-IP",

    // X-Proxy headers
    "X-ProxyMesh-IP",
    "X-ProxyUser-IP",

    // X-From headers
    "X-From-IP",
    "X-From",

    // X-True-Client headers
    "X-True-Client-IP",

    // Other X- headers
    "X-Backend-Host",
    "X-BlueCoat-Via",
    "X-Cache-Info",
    "X-Gateway-Host",
    "X-Host",
    "X-Ip",

    // Standard Forwarded headers
    "Forwarded",
    "Forwarded-For",

    // Client-IP headers
    "Client-IP",

    // CDN headers
    "Ali-CDN-Real-IP",
    "Cdn-Src-IP",
    "Cdn-Real-IP",

    // Proxy headers
    "WL-Proxy-Client-IP",
    "Proxy-Client-IP",

    // Source/Via headers
    "Source-IP",
    "Via",

    // Z-Forwarded headers
    "Z-Forwarded-For",

    // HTTP-prefixed headers (common in some proxy configurations)
    "HTTP-CLIENT-IP",
    "HTTP-FORWARDED-FOR-IP",
    "HTTP-PC-REMOTE-ADDR",
    "HTTP-PROXY-CONNECTION",
    "HTTP-VIA",
    "HTTP-X-FORWARDED-FOR-IP",
    "HTTP-X-IMFORWARDS",
    "HTTP-XROXY-CONNECTION",

    // CGI-style variants (underscores - note: these are converted to hyphens in HTTP)
    "COMING_FROM",
    "CONNECT_VIA_IP",
    "FORWARD_FOR",
    "PC_REMOTE_ADDR",
    "PRAGMA",
    "PROXY_AUTHORIZATION",
    "PROXY_CONNECTION",
    "PROXY",
    "REMOTE_ADDR",

    // Other variants
    "XONNECTION",
    "XPROXY",
    "XROXY_CONNECTION",
    "ZCACHE_CONTROL",
];

const headers: string[] = [...safeHeaders, ...advancedHeaders];

export default headers;
export { safeHeaders, advancedHeaders };
