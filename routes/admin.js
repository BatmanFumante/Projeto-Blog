const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

// Rota inicial
router.get('/', (req, res)=>{
    res.render('admin/index')
})

// Rota para posts
router.get('/posts',(req, res)=>{
    res.send('Pagina de posts')
})

// Rota para listagem de categorias
router.get('/categorias',(req, res)=>{
    Categoria.find().lean().sort({date: 'desc'}).then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        creq.flash("error_msg", "houve um erro ao listar as categorias")
        res.redirect('/admin')
    })
})

// Rota para o formulário de adição de categorias
router.get('/categorias/add', (req,res)=>{
    res.render('admin/addcategorias')
})

// Rota para criação de nova categoria
router.post("/categorias/nova", (req, res)=>{
    var erros = []

    // Verificação se o nome é inválido
    if(!req.body.nome || typeof req.body.nome === 'undefined' || req.body.nome === null){
        erros.push({texto: "Nome inválido"})
    }

    // Verificação do tamanho do nome
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito pequeno"})
    }

    // Verificação se o slug é inválido
    if(!req.body.slug || typeof req.body.slug === 'undefined' || req.body.slug === null){
        erros.push({texto: "Slug inválido"})
    }

    // Se houver erros, renderizar novamente o formulário com os erros
    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    } else {
        // Caso não haja erros, criar a nova categoria
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        // Salvando a nova categoria no banco de dados
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg', 'Categoria salva com sucesso!!')
            console.log("Categoria salva com sucesso")
            res.redirect('/admin/categorias') // Redireciona após salvar com sucesso
        }).catch((err) =>{
            req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente!!')
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', (req, res) =>{
    Categoria.findOne({_id:req.params.id}).then((categoria =>{
        res.render("admin/editcategoria", {categoria: categoria})
    })).catch((err) =>{
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})

router.post('/categorias/edit', (req, res) =>{
    Categoria.findOne({_id: req.body.id}).then((categoria) =>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro interno ao salvar a categoria!")
            res.redirect("/admin/categorias")
        })

    }).catch((err) =>{
        req.flash("error_msg", 'Houve um erro ao editar  a categoria')
        res.redirect('/admin/categorias')
    })
})

module.exports = router
