const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyparser = require('body-parser')

mongoose.connect('mongodb://localhost/todo')
.then(()=>console.log('connecting to mongodb'))
.catch(err=>console.error('could not connect',err))

const projectSchema = mongoose.Schema({
    title:String,
    status:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Project =mongoose.model('project',projectSchema)

const app = express();
app.engine('handlebars',exphbs.engine({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.use(express.static('public'))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.get('/projects',(req,res)=>{
    res.render('projects')
});
app.get('/api/projects',(req,res)=>{
    Project.find({},(err,results)=>{
        res.send(results)
    })
    
});
app.post('/api/projects/add',(req,res)=>{
    let title = req.body.title
    let status = req.body.status
    const project = new Project({
        title:title,
        status:status,
    })
    project.save().then((result)=>res.send(result))
    
});

app.post('/api/projects/update',(req,res)=>{
    Project.findOne({_id:req.body.id}).then((project)=>{
        project.title = req.body.title
        project.status = req.body.status
        project.save().then((result)=>res.send(result))
    })    
    console.log('Whatever')
});

app.get('/api/projects/delete:id',(req,res)=>{
    let id = req.params.id
    Project.deleteOne({_id:id},(err,results)=>{
        res.send(results)
    })
    
});

app.listen(3030,console.log('listening to port 3030'))