var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const types = require('./types/types');

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: types.schema,
  root: types.RootQueryType,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');