import { type FieldNode, type OperationDefinitionNode } from 'graphql';
import { useGenericAuth, type ResolveUserFn, type ValidateUserFn } from '@envelop/generic-auth';
import { type MeshPlugin, type MeshPluginOptions } from '@graphql-mesh/types';
import { type RootType, type XApiKeyAuthConfig, type XApiKeyAuthConfigPermission } from './types';
import { evaluate, parseMethodsArray } from './utils';

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
        if (context?.headers['x-api-key']) {
            const permission = options.permissions.find(
                // @ts-expect-error
                perm => evaluate(perm.apiKey) === context.headers['x-api-key'],
            );

            if (permission) {
                return {
                    ...permission,
                    apiKey: evaluate(permission.apiKey),
                    name: evaluate(permission.name),
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
            throw new Error('Unauthenticated');
        }

        if (params.user.allow.length === 0) {
            throw new Error('Permission denied: all');
        }

        if (params.user.allow[0] === '*') {
            return;
        }

        const definition = params?.executionArgs?.document
            ?.definitions[0] as OperationDefinitionNode;
        if (!definition) {
            throw new Error('Definition not found');
        }

        if (
            !definition?.selectionSet?.selections ||
            definition.selectionSet.selections.length === 0
        ) {
            throw new Error('Selections not found');
        }

        const types = parseMethodsArray(params.user.allow);

        const operation =
            definition.operation.charAt(0).toUpperCase() + definition.operation.slice(1);

        if (!Object.keys(types).includes(operation)) {
            throw new Error(`Permission denied: ${operation}`);
        }

        for (const selection of definition.selectionSet.selections) {
            const fieldNode = selection as FieldNode;
            if (
                !fieldNode?.name?.value ||
                !Object.keys(types[operation as RootType]?.methods).includes(fieldNode.name.value)
            ) {
                throw new Error(`Permission denied: ${fieldNode.name.value}`);
            }
        }
    };
};
