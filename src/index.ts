import { AuthenticationError } from 'apollo-server-errors';
import { useGenericAuth, type ResolveUserFn, type ValidateUserFn } from '@envelop/generic-auth';
import { type MeshPlugin, type MeshPluginOptions } from '@graphql-mesh/types';
import { type XApiKeyAuthConfig, type XApiKeyAuthConfigPermission } from './types';
import { evaluate } from './utils';

export default function useXApiKeyAuth(
    options: MeshPluginOptions<XApiKeyAuthConfig>,
): MeshPlugin<any> {
    return {
        onPluginInit({ addPlugin }) {
            addPlugin(
                useGenericAuth({
                    resolveUserFn: resolveUserFn(options),
                    validateUser: validateUser(options),
                    mode: 'protect-all',
                }),
            );
        },
    };
}

const resolveUserFn = (
    options: MeshPluginOptions<XApiKeyAuthConfig>,
): ResolveUserFn<XApiKeyAuthConfigPermission | undefined> => {
    // @ts-expect-error
    return (context): XApiKeyAuthConfigPermission | undefined => {
        // @ts-expect-error
        if (context?.request?.headers?.get('x-api-key')) {
            const permission = options.permissions.find(
                perm =>
                    evaluate(perm.apiKey).toString() ===
                    // @ts-expect-error
                    context.request.headers.get('x-api-key').toString(),
            );

            if (permission) {
                return {
                    apiKey: evaluate(permission.apiKey).toString(),
                    email: evaluate(permission.email).toString(),
                    name: evaluate(permission.name).toString(),
                    roles: permission.roles,
                } as XApiKeyAuthConfigPermission;
            }

            return undefined;
        }
    };
};

const validateUser = (
    options: MeshPluginOptions<XApiKeyAuthConfig>,
): ValidateUserFn<XApiKeyAuthConfigPermission> => {
    return params => {
        if (!evaluate(options.enabled)) {
            return;
        }

        if (!params?.user) {
            throw new AuthenticationError('Unauthenticated.');
        }
    };
};
