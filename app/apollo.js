import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    // https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql
    // next.config.js rewrite proxy
    uri: '/graphql',
    cache: new InMemoryCache(),
});

export default client;