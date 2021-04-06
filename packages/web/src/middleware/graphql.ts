import { Router, applyGraphQL } from '../../deps.ts';
import schema from '../graphql/schema.ts';
import resolvers from "../graphql/resolvers.ts";

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: schema,
  resolvers: resolvers,
  // context: (ctx: RouterContext) => {
  //   console.log(ctx);
  //   return { user: "Me" };
  // },
});

export default GraphQLService;
