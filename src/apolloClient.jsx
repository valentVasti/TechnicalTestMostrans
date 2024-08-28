import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql', // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
});

export const ApolloWrapper = ({ children }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
);