const express= require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const cors=require("cors")

const {ApolloServer,gql}=require("apollo-server-express")

// const {graphiqlExpress,graphqlExpress}=require ("graphql-server-express")
// const {makeExecutableSchema}=require("graphql-tools")

const {merge} =require("lodash")

const Usuario=require("./models/usuario")
const Producto=require("./models/producto")
const Compra = require("./models/compra")
const Rol = require("./models/rol")
const Rol_Usuario = require("./models/rol_usuario");
const ProductoCompra = require("./models/productos_compra");


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
    }

    type UsuarioLogin{
        id: ID!,
        Rol: String
    }

    type Rol{
        id: ID!
        nombre: String
    }
		
    type Producto{
        id: ID!
        nombre: String,
        precio: Int
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
        pass: String
    }

    input UsuarioInputLogin{
        email: String,
        pass: String
    }
		
    input ProductoInput{
        nombre: String,
        precio: Int
    }

    input RolInput{
        nombre: String
    }

    input EstadoInput{
        estado: String
    }

    
    type ProductoEnCompra {
        nombre: String
        cantidad: Int
    }

    type direccionjson {
        direccion: String,
        comuna: String,
        provincia: String,
        region: String,
    }


    type Compra {
        id: ID!
        usuario: String
        estado: String
        direccion:direccionjson
        productos: [ProductoEnCompra]
        Monto: Int
    }
    
    
    
    input ProductoEnCompraInput {
        idproducto: String
        cantidad: Int
    }

    input CompraInput {
        productos: [ProductoEnCompraInput]
        Monto: Int
    }

    input CompraInputUpdate {
        estado: String
    }

    type Alert{
        message: String
    }

    type Query{
        getUsuarios: [Usuario]
        getUsuario(id:ID!): Usuario
        getRol(id:ID!): Rol
        getProductos: [Producto]
        getProducto(id:ID!): Producto
        getCompras: [Compra]
        getComprasEstado(input:EstadoInput): [Compra]
        getCompra(id:ID!): [Compra]
        login(input:UsuarioInputLogin):UsuarioLogin
    }

    type Mutation {
        addUsuario(input:UsuarioInput): Alert
        addRol(input:RolInput): Alert
        updateUsuario(id: ID!, input:UsuarioInput): Usuario
        cambiarContrasena(id: ID!, input:UsuarioInput): Alert
        updateRolUsuario(id: ID!, input:RolInput): Alert
        updateProductoOcultar(id: ID!): Alert
        updateProductoMostrar(id: ID!): Alert
        deleteUsuario(id: ID!): Alert
        deleteRol(id: ID!): Alert
        addProducto(input: ProductoInput): Producto
        updateProducto(id: ID!, input:ProductoInput): Producto
        deleteProducto(id: ID!): Alert
        addCompra(id: ID!,input:CompraInput): Compra
        updateCompra(id: ID!, input: CompraInputUpdate): Compra
        deleteCompra(id: ID!): Alert
        CambiarRol(id: ID!,input:RolInput): Alert

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
        async getRol(obj,{id}){
            console.log(id);
            const rol_user=await Rol_Usuario.findOne({usuario:id})
            const rol_=await Rol.findById(rol_user.rol)
            return rol_
        },

        async getProductos(obj){
            const productos=await Producto.find({visible:1})
            return productos
        },
				
        async getProducto(obj,{id}){
            const producto=await Producto.findById(id)
            return producto
        },

        async getCompras(obj){
            const lista=await Compra.find()
            const lista_return=[] 
            for (const element of lista) {
                const lista_productos= await ProductoCompra.find({compra:element._id})
                const lista_add=[]
                for (const element1 of lista_productos) {
                    const produc=await Producto.findById(element1.producto)
                    lista_add.push({nombre:produc.nombre,cantidad:element1.cantidad})
                }
                lista_return.push({...element._doc,productos:lista_add})
            }

            return lista_return
        },

        async getCompra(obj, {id}){
            const lista=await Compra.find({usuario:id})
            const lista_return=[] 
            for (const element of lista) {
                const lista_productos= await ProductoCompra.find({compra:element._id})
                const lista_add=[]
                for (const element1 of lista_productos) {
                    const produc=await Producto.findById(element1.producto)
                    lista_add.push({nombre:produc.nombre,cantidad:element1.cantidad})
                }
                lista_return.push({...element._doc,productos:lista_add})
            }

            return lista_return
        },
        async getComprasEstado(obj, {input}){
            const lista=await Compra.find(input)
            const lista_return=[] 
            for (const element of lista) {
                const lista_productos= await ProductoCompra.find({compra:element._id})
                const lista_add=[]
                for (const element1 of lista_productos) {
                    const produc=await Producto.findById(element1.producto)
                    lista_add.push({nombre:produc.nombre,cantidad:element1.cantidad})
                }
                lista_return.push({...element._doc,productos:lista_add})
            }
            return lista_return
        },
        async login(obj,{input}){
            const usuario = await Usuario.findOne({email:input.email});
            const validPassword = bcrypt.compareSync( input.pass, usuario.pass );
            if ( !validPassword ) {
                return {id:"Contraseña incorrecta",Rol:""}
            }
            const resp_rol= await Rol_Usuario.findOne({usuario:usuario._id})
            const name_rol=await Rol.findById(resp_rol.rol)
            return {id:usuario._id,Rol:name_rol.nombre}
        }
    },
    Mutation:{
        async addUsuario(obj,{input}){

            let usuario_re = await Usuario.findOne({ email:input.email });

            if ( usuario_re ) {
                return{
                    message:"Error el email ya esta registrado"
                }
            }


            const usuario=new Usuario(input)
            const salt = bcrypt.genSaltSync();
            usuario.pass = bcrypt.hashSync( input.pass, salt );    
            const usuario_resp=await usuario.save()
            const rol_user= new Rol_Usuario({usuario:usuario_resp._id,rol:"653ed6eea02a92da55c680dc"})
            await rol_user.save()
            return{
                message:"Usuario registrado"
            }
        },
        async addRol(obj,{input}){
            const RolAdd=new Rol (input)
            await RolAdd.save()
            
            return{
                message:"Rol registrado"
            }
        },

        async updateUsuario(obj,{id, input}){
            const usuario=await  Usuario.findByIdAndUpdate(id,input)
            return usuario
        },

        async updateProductoMostrar(obj,{id}){
            await  Producto.findByIdAndUpdate(id,{visible:1})
            return{
                message:"Producto Visible"
            }
        },

        async updateProductoOcultar(obj,{id}){
            await  Producto.findByIdAndUpdate(id,{visible:0})
            return{
                message:"Producto no Visible"
            }
        },

        async deleteUsuario(obj,{id}){
            await Usuario.deleteOne({_id:id})
            await Rol_Usuario.deleteOne({usuario:id})
            return{
                message:"Usuario eliminado"
            }
        },

        async deleteRol(obj,{id}){
            await Rol.deleteOne({_id:id})
            return{
                message:"Rol eliminado"
            }
        },

        async cambiarContrasena(obj,{id,input}){
            const salt = bcrypt.genSaltSync();
            const contra_nueva = bcrypt.hashSync( input.pass, salt );
            await Usuario.findByIdAndUpdate(id,{pass:contra_nueva})
            return{
                message:"Contraseña cambiada"
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

        async updateRolUsuario(obj,{id, input}){
            const rol_user=await Rol_Usuario.findOne({usuario:id})
            const rol_asignar=await Rol.findOne(input)
            await Rol_Usuario.findByIdAndUpdate(rol_user._id,{rol:rol_asignar._id})
            return{
                message:"Se cambio el rol del usuario"
            } 
        },
				
        async deleteProducto(obj,{id}){
            await Producto.deleteOne({_id:id})
            return{
                message:"Producto eliminado"
            }
        },

        async addCompra(obj, {id,input}){
            const user= await Usuario.findById(id)
            const compra = new Compra({usuario:id,direccion:{
                direccion:user.direccion,
                comuna:user.comuna,
                provincia:user.provincia,
                region:user.region
            },Monto:input.Monto})
            const re_compra=await compra.save()
        
            for (const element of input.productos) {
                const pro= new ProductoCompra({producto:element.idproducto,cantidad:element.cantidad,compra:re_compra._id})
                await pro.save()
            }

            return compra
        },

        async updateCompra(obj, {id, input}){
            return await Compra.findByIdAndUpdate(id, input)
        },

        async deleteCompra(obj, {id}){
            await Compra.deleteOne({_id: id})
            const lista= await ProductoCompra.find({compra:id})

            for (const element of lista) {
                await ProductoCompra.deleteOne({_id: element._id})
            }

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
