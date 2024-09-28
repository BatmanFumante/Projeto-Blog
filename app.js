//Carregando Modulos
const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()  
const admin = require('./routes/admin')  
const path = require('path')
const mongoose = require('mongoose')

//Configuraçoes
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
       app.engine('handlebars', engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
        
    //Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log("Conectado ao Servidor")
        }).catch((err) =>{
            console.log("Erro ao na conexao com o servidor: " + err)
        })
    //Public
        app.use(express.static(path.join(__dirname, 'public')))
//Rotas

    app.get('/', (req, res)=>{
        res.send('Rota principal')
    })
    
    app.get('/posts', (req, res)=>{
        res.send('Lista de Posts')
    })

    app.use('/admin', admin)


//Outros
const PORT= 8081
app.listen(PORT, () =>{
    console.log("Servidor Rodando")
})