const express= require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors=require("cors")

const {ApolloServer,gql}=require("apollo-server-express")

// const {graphiqlExpress,graphqlExpress}=require ("graphql-server-express")
// const {makeExecutableSchema}=require("graphql-tools")

const {merge} =require("lodash")

const Usuario=require("./models/usuario")
const Producto=require("./models/producto")
const Compra = require("./models/compra")

mongoose.connect("mongodb+srv://admin:admin@bd-www.wvtvgbv.mongodb.net/",{useNewUrlParser:true,useUnifiedTopology:true})

const typeDefs= gql `
    type Usuario{
        id: ID!
        rut: String,
        nombre: String,
        direccion: String,
        comuna: String,
        provincia: String,
        region: String,
        sexo: String,
        telefono: String,
        email: String,
        pass: String,
        rol: String
    }
		
    type Producto{
        id: ID!
        nombre: String,
        precio: String
    }

    input UsuarioInput{
        rut: String,
        nombre: String,
        direccion: String,
        comuna: String,
        provincia: String,
        region: String,
        sexo: String,
        telefono: String,
        email: String,
        pass: String,
        rol: String
    }
		
    input ProductoInput{
        nombre: String,
        precio: String
    }

    type Compra{
        id: ID!
        pedido: [{
            id_producto: ID
            cantidad: Number
        }]
        estado: String
    }

    input CompraInput{
        pedido: [{
            id_producto: ID
            cantidad: Number
        }]
        estado: String
    }

    type Alert{
        message: String
    }

    type Query{
        getUsuarios: [Usuario]
        getUsuario(id:ID!): Usuario
        getProducto: [Producto]
        getProductos(id:ID!): Producto
        getCompras: [Compra]
        getCompra(id:ID!): Compra
    }

    type Mutation {
        addUsuario(input:UsuarioInput): Usuario
        updateUsuario(id: ID!, input:UsuarioInput): Usuario
        deleteUsuario(id: ID!): Alert
        addProducto(input: ProductoInput): Producto
        updateProducto(id: ID!, input:ProductoInput): Producto
        deleteProducto(id: ID!): Alert
        addCompra(input:CompraInput): Compra
        updateCompra(id: ID!, input: CompraInput): Compra
        deleteCompra(id: ID!): Alert
    }
`

const resolvers = {
    Query:{
        async getUsuarios(obj){
            const usuarios=await Usuario.find()
            return usuarios
        },

        async getUsuario(obj,{id}){
            const usuario=await Usuario.findById(id)
            return usuario
        },

        async getProductos(obj){
            const productos=await Producto.find()
            return productos
        },
				
        async getProducto(obj,{id}){
            const producto=await Producto.findById()
            return producto
        },

        async getCompras(obj){
            return await Compra.find()
        },

        async getCompra(obj, {id}){
            return await Compra.findById(id)
        }
    },
    Mutation:{
        async addUsuario(obj,{input}){
            const usuario=new Usuario(input)
            await usuario.save()
            return usuario
        },

        async updateUsuario(obj,{id, input}){
            const usuario=await  Usuario.findByIdAndUpdate(id,input)
            return usuario
        },

        async deleteUsuario(obj,{id}){
            await Usuario.deleteOne({_id:id})
            return{
                message:"Usuario eliminado"
            }
        },
				
        async addProducto(obj,{input}){
            const producto=new Producto(input)
            await producto.save()
            return producto
        },

        async updateProducto(obj,{id, input}){
            const producto=await Producto.findByIdAndUpdate(id,input)
            return producto
        },
				
        async deleteProducto(obj,{id}){
            await Producto.deleteOne({_id:id})
            return{
                message:"Producto eliminado"
            }
        },

        async addCompra(obj, {input}){
            const compra = new Compra(input)
            await compra.save()
            return compra
        },

        async updateCompra(obj, {id, input}){
            return await Compra.findByIdAndUpdate(id, input)
        },

        async deleteCompra(obj, {id}){
            await Compra.deleteOne({_id: id})
            return {
                message: "Compra eliminada"
            }
        }
    }
}

let apolloServer=null
const corsOptions={
    origin:"http://localhost:8888",
    credentials:false
}

async function startServer(){
    const apolloServer=new ApolloServer({typeDefs,resolvers,corsOptions})
    await apolloServer.start()

    apolloServer.applyMiddleware({app,cors:false})
}

startServer();

const app=express();

app.use(cors());
app.listen(8888,function(){
    console.log("Servidor Iniciado");
})
