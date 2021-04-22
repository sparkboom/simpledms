import { Router } from "oak/mod.ts";
import { applyGraphQL } from "oak_graphql/mod.ts";
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
