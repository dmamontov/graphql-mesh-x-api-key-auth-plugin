# X Api Key Auth Plugin for GraphQL Mesh

The X Api Key Auth Plugin for GraphQL Mesh, based on [@envelop/generic-auth](https://www.npmjs.com/package/@envelop/generic-auth), is a plugin designed to enhance the authentication process in GraphQL Mesh. It provides secure usage of API keys for authenticating requests, simplifying access management and enhancing the security of operations with GraphQL queries and mutations.

## Installation

Before you can use the X Api Key Auth Plugin, you need to install it along with GraphQL Mesh if you haven't already done so. You can install these using npm or yarn.

```bash
npm install @dmamontov/graphql-mesh-x-api-key-auth-plugin
```

or

```bash
yarn add @dmamontov/graphql-mesh-x-api-key-auth-plugin
```

## Configuration

### Modifying tsconfig.json

To make TypeScript recognize the X Api Key Auth Plugin, you need to add an alias in your tsconfig.json.

Add the following paths configuration under the compilerOptions in your tsconfig.json file:

```json
{
  "compilerOptions": {
    "paths": {
       "x-api-key-auth": ["node_modules/@dmamontov/graphql-mesh-x-api-key-auth-plugin"]
    }
  }
}
```

### Adding the Plugin to GraphQL Mesh

You need to include the X Api Key Auth Plugin in your GraphQL Mesh configuration file (usually .meshrc.yaml). Below is an example configuration that demonstrates how to use this plugin:

```yaml
plugins:
  - xApiKeyAuth:
      enabled: true
      permissions:
        - apiKey: 6dd7840a-7ccf-4b6b-813e-98d48874df3c
          name: admin
          allow:
            - '*'
        - apiKey: 2dc0bcd2-955f-48e8-a735-4c03cd9c3735
          name: user
          allow:
            - Query.{order}
            - Mutation.updateOrder
```

- **enabled**: This parameter determines whether the plugin is active. Set this to true to enable API key authentication;
- **permissions**: This is a list of permission objects, each defining access controls for a different API key;
    - **apiKey**: The unique identifier for the API key. This is used to authenticate a request made to the API;
    - **name**: A human-readable name associated with the API key, typically used to identify the role or the user to whom the API key belongs;
    - **allow**: A list of permissions specifying what actions the holder of the API key is allowed to perform. This can include broad access (using '*' to denote all actions are allowed) or specific actions on particular queries or mutations;

## Conclusion

Remember, always test your configurations in a development environment before applying them in production to ensure that everything works as expected.