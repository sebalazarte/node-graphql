const { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString, GraphQLSchema } = require("graphql");
const books = require('../data/books.json');
const authors = require('../data/authors.json')

const AuthorType = new GraphQLObjectType ({
    name: 'Author',
    description: 'Representa un autor de libro',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(i => i.authorId === author.id);
            }
        }
    })
});

const BookType = new GraphQLObjectType ({
    name: 'Book',
    description: 'Representa un libro',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        title: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(i => book.authorId === i.id)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root query',
    fields: () => ({
        books: {
            type: GraphQLList(BookType),
            description: 'Lista de libros',
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'Lista de autores',
            resolve: () => authors
        }
        
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType
})

module.exports = {schema, RootQueryType}