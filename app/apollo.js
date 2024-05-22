import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    // next.config.js rewrite proxy
    uri: '/graphql',
    cache: new InMemoryCache(),
});

export default client;