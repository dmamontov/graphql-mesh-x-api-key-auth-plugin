export interface XApiKeyAuthConfig {
    enabled: boolean | string;
    permissions?: XApiKeyAuthConfigPermission[];
}

export interface XApiKeyAuthConfigPermission {
    apiKey: string;
    email: string;
    name: string;
    roles: string[];
}
