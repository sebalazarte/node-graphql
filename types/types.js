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
        book: {
            type: BookType,
            args: {
                id: {type: GraphQLInt}
            },
            description: 'un libro',
            resolve: (parent, args) => books.find(i => i.id === args.id)
        },
        books: {
            type: GraphQLList(BookType),
            description: 'Lista de libros',
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'Lista de autores',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'un autor',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(i => i.id === args.id)
        }
        
    })
});

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                title: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    title: args.title,
                    authorId: args.authorId
                }
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add a author',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name
                }
                authors.push(author);
                return author;
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutation
})

module.exports = {schema, RootQueryType}