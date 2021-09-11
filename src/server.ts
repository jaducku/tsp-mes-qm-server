import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

import { Query, Resolver } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';

@Resolver()
export class TestResolver {
    @Query(() => String)
    ping() {
        return 'pong';
    }
}

const schema = buildSchemaSync({
    resolvers: [TestResolver],
});

const apolloServer = new ApolloServer({ schema });

dotenv.config();

const app = express();

const prod: boolean = process.env.NODE_ENV === 'production';
const port = prod ? process.env.PORT : 8000;

app.use(morgan('dev'));
app.use(compression());
apolloServer.applyMiddleware({ app, cors: false });
app.listen(port, (): void =>
    console.log(
        `\n🚀      GraphQL is now running on http://localhost:${port}/graphql`,
    ),
);