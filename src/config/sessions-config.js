
//En este modulo tengo todo lo necesario para la confoguracion del guardado de sesiones.
//Cada funcion tiene una configuracion distinta del middleware session que se encarga de confoguirar en el server la gestion de sesiones.
//Se puede usar una u otra cuando se configure el server desde aps  segun la necesidad, en particular en nuestro proyecto usaremos mongo.
import session from 'express-session'
import  FileStore  from 'session-file-store'
import MongoStore from 'connect-mongo'

//firma para las sesiones
const firmaSesiones = 'secretcoder'

//Configuracion basica
function configSession(app){
    app.use(session({
        secret:firmaSesiones,
        resave:true, 
        saveUninitialized: true,
    }))
}

//Configuracion para guardar las sesiones en fileStorage
function configSessionFileStorage(app){
    const fileStore = FileStore(session)
    app.use(session({
        store: new fileStore({path:'./src/sessions',ttl:10000,retries:1}),
        secret:firmaSesiones, //firma
        resave:false, 
        saveUninitialized: false,
       /*Propiedades agregadas a este objeto de configuracion para usar FileStore...
        store: LLeva por parametro un objeto con las sig configuraciones:
        * path: 'ruta donde se guarcha el archivo sessiones',
        * ttl: time to live ( O sea tiempo de vida del archivo...)
        * retries: Cantidad de veces que el server intentara leer el archivo
    */
    }))
}


//Configuracion para guardar en mongo.
function configSessionMongo(app){

    app.use(session({
        secret:firmaSesiones,
        resave:false, 
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://gui24xrdev:2485javiersolis@cluster0.a6zgcio.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0',
            //mongoOptions:{useNewUrlParser: true,useUnifiedTopoogy: true},
            ttl: 100 //Tiempo que la sesion vivira almacenada en mongo y se eliminara automaticamente al transcurrir el tiempo.
        }),
    }))
}

export {configSession,configSessionFileStorage,configSessionMongo}