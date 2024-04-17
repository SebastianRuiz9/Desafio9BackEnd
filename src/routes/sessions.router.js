import express from 'express'
import { CartsManager } from '../controllers/carts-manager-db.js'
import { UserModel } from '../models/user.models.js'
import passport from 'passport'
import { createHash, isValidPassword } from '../utils/hashbcryp.js'
import jwt from 'jsonwebtoken'

export const router = express.Router()
const cartsManager = new CartsManager()

router.get('/api/sessions/registrarse',async(req,res)=>{
    res.render('register')
})

router.get('/api/sessions/login',(req,res)=>{
    res.render('login')
})


router.post('/api/sessions/registrarse',async(req,res)=>{
    const {first_name, last_name, email, password,age, role} = req.body;
    console.log(req.body)
    try {
        //Verificamos si ya existe un registro con ese mail
        let user = await UserModel.findOne({email:email});
        
        if(user) return res.status(401).render('errorpage',{state:'401',message:`El usuario ${email} se encuentra registrado...`})
        //Si no existe, voy a crear un registro nuevo: 
        let newUserData = {first_name,last_name, email, age, password: createHash(password),
            role:role
         }
         //Creo un carro para el user...
        const newCart = await cartsManager.createCart()
        await UserModel.create({...newUserData, cart: newCart });
         
        res.status(200).redirect('/api/sessions/login')
    } catch (error) {
        res.status(500).send('Error del servidor...')
    }
})


router.post('/api/sessions/login',async(req,res)=>{
   //Voy a corroborar que los datos ingresados pertenescan a un user logueado
   const {email,password} = req.body
   try{
        const searchedUser = await UserModel.findOne({email:email})
        if (!searchedUser) return res.status(401).render('errorpage',{state:'401',message:`El usuario ${email} no se encuentra registrado...`})
        else{   console.log('Llegooo', email, password, searchedUser.password)
            //AHora si el use existe compruebo la contraseña

            if (isValidPassword(password,searchedUser.password)){
                //Envio un jsonwebtoken en una cookie
                 const token = jwt.sign({user: searchedUser, role: searchedUser.role, cart: searchedUser.cart},'coderhouse',{expiresIn:"1h"})
                res.cookie("sessiontoken", token, {maxAge: 3600000,  httpOnly: true  })
               res.redirect('/products') //Envio a la raiz y va a aparecer logueado y la barra de sesion con su info gracias a la lectura del token y el middleware

            } 
            else{
                return res.status(401).render('errorpage',{state:'401',message:`El usuario y/o contraseña no coinciden...`})
            }          
        }
   }catch(error){
    res.status(500).send("Error interno del servidor"); 
   }


})


router.post("/logout", (req, res) => {
    res.clearCookie("sessiontoken");
    res.redirect("/api/sessions/login");
    //Limpiamos la cookie y lo mandamos al login. 
})

//----------------------------------------------------------------------------------------------------------------



router.get("/github", passport.authenticate("github", {scope: ["user:email"]}) ,async (req, res)=> {
    console.log('ghfdgfgfdrfffffffffffffffffffffffff')
})


router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/failedlogin"}) ,async (req, res)=> {
    //si todo salio o inicio los datos de la cesion y redirijo a profile
    
    console.log('Requiressss:',req)
    //Los datos del user logueado ahora van a venir en req.
    //Los trae req xq en la estrategia hice return(done,user)
 /*   req.session.login = true
    req.session.user = req.user//usuario//Incluye rol en los datos de user
    req.session.admin = req.user.role == 'admin' ? true : false //Para saber si se trata de un admin

    */
    res.redirect('/products')

})




router.get('/api/sessions/logout',(req,res)=>{
    res.clearCookie("sessiontoken");
    res.redirect("/api/sessions/login");
})


