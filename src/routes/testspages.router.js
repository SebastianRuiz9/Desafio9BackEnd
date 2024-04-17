import path from 'path'
import express from 'express'

export const router = express.Router()


router.get('/test',(req,res)=>{
    const htmlPath = path.join(process.cwd(), 'test', 'mytest.html');
    //res.sendFile(htmlPath);
    res.render('test/test1')
})

router.get('/test2',(req,res)=>{
    const htmlPath = path.join(process.cwd(), 'test', 'mytest.html');
    res.sendFile(htmlPath);
 
})