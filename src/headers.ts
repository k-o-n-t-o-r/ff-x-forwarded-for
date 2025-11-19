const headers: string[] = [
    // Standard X-Forwarded headers
    "X-Forwarded-For",
    "X-Forwarded-For-Original",
    "X-Forwarded",
    "X-Forwarded-By",
    "X-Forwarded-Server",
    "X-Forwarded-Host",
    "X-Forward-For",

    // X-Real/Original IP headers
    "X-Real-IP",
    "X-Original-IP",
    "X-Original-Remote-Addr",
    "X-Original-Host",
    "X-Original-Url",
    "X-Originating-IP",
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

    // True-Client/Client-IP headers
    "True-Client-IP",
    "Client-IP",

    // CDN headers
    "Ali-CDN-Real-IP",
    "Cdn-Src-IP",
    "Cdn-Real-IP",
    "CF-Connecting-IP",

    // Proxy headers
    "WL-Proxy-Client-IP",
    "Proxy-Client-IP",

    // Source/Via headers
    "Source-IP",
    "Via",
    "VIA",

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

    // Underscore variants (used by some proxies/load balancers)
    "X_CLUSTER_CLIENT_IP",
    "X_COMING_FROM",
    "X_DELEGATE_REMOTE_HOST",
    "X_FORWARDED_FOR_IP",
    "X_FORWARDED_FOR",
    "X_FORWARDED",
    "X_IMFORWARDS",
    "X_LOCKING",
    "X_LOOKING",
    "X_REAL_IP",

    // Upper-case variants
    "CACHE_INFO",
    "CF_CONNECTING_IP",
    "CLIENT_IP",
    "COMING_FROM",
    "CONNECT_VIA_IP",
    "FORWARD_FOR",
    "FORWARD-FOR",
    "FORWARDED_FOR_IP",
    "FORWARDED_FOR",
    "FORWARDED-FOR-IP",
    "FORWARDED-FOR",
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
export default headers;
