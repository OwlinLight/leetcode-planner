import { ApolloClient, InMemoryCache } from '@apollo/client';
// import { RestLink } from 'apollo-link-rest';

const client = new ApolloClient({
    // next.config.js rewrite proxy
    uri: '/graphql',
    cache: new InMemoryCache(),
});

// const restLink = new RestLink({ uri: "https://khrpvatgqjhqqnuykpol.supabase.co/functions/v1/geminiLeetCodeQuestions" });
//
// export const chatClient = new ApolloClient({
//     cache: new InMemoryCache(),
//     link: restLink
// });

export default client;