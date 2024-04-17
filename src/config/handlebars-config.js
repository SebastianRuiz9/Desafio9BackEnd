import exphbs from 'express-handlebars'


function configHandlebars(app){

    //Configuracion handlebars
    app.engine("handlebars", exphbs.engine())
    app.set("view engine", "handlebars")
    app.set("views","./src/views")

    
}

export {configHandlebars}