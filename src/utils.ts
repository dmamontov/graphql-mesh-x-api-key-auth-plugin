import { stringInterpolator } from '@graphql-mesh/string-interpolation';
import { type RootType, type XApiKeyAuthPluginTypes } from './types';

export const parseMethodsArray = (methods: string[]): XApiKeyAuthPluginTypes => {
    const parsedTypes: XApiKeyAuthPluginTypes = {} as XApiKeyAuthPluginTypes;

    for (const method of methods) {
        const [typeName, methodNameOrGlob] = method.split('.');

        if (!methodNameOrGlob) {
            continue;
        }

        parsedTypes[typeName as RootType] = {
            methods: {},
        };

        const clearedMethods = methodNameOrGlob
            .replace('!', '')
            .replace('{', '')
            .replace('}', '')
            .trim()
            .split(',')
            .map(glob => glob.trim());

        for (const methodName of clearedMethods) {
            parsedTypes[typeName as RootType].methods[methodName] = {
                typeName,
                methodName,
            };
        }
    }

    return parsedTypes;
};

export const evaluate = (value?: any): any => {
    if (typeof value === 'string') {
        const result = stringInterpolator.parse(value, { env: process.env });

        if (result === '') {
            return undefined;
        } else if (result === 'null') {
            return null;
        } else if (result === 'true' || result === 'false') {
            return result === 'true';
        } else if (!isNaN(Number(result))) {
            return Number(result);
        }

        return result;
    }

    return value;
};
