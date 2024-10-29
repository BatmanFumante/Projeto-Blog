// Carregando Módulos
const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()  
const admin = require('./routes/admin')  
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")

// Configurações
    // Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    // Middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })
    // Body Parser
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    // Handlebars
    app.engine('handlebars', engine({
        defaultLayout: 'main',
        runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
        }
      }));
    app.set('view engine', 'handlebars');

    // Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blogapp").then(() => {
        console.log("Conectado ao MongoDB")
    }).catch((err) => {
        console.log("Erro na conexão com o MongoDB: " + err)
    })

    // Public
    app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    app.get('/', (req, res) => {
        res.send('Rota principal')
    })
    
    app.get('/posts', (req, res) => {
        res.send('Lista de Posts')
    })

    app.use('/admin', admin)

// Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})
