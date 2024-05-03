export interface XApiKeyAuthConfig {
    enabled: boolean | string;
    permissions?: XApiKeyAuthConfigPermission[];
}

export interface XApiKeyAuthConfigPermission {
    apiKey: string;
    name: string;
    allow: string[];
}

export type RootType = 'Query' | 'Mutation';

export type XApiKeyAuthPluginTypes = {
    [key in RootType]: XApiKeyAuthPluginType;
};

export interface XApiKeyAuthPluginType {
    methods: XApiKeyAuthPluginMethods;
}

export type XApiKeyAuthPluginMethods = Record<string, XApiKeyAuthPluginMethod>;

export interface XApiKeyAuthPluginMethod {
    typeName: string;
    methodName: string;
}
