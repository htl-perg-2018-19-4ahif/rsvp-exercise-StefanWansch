import * as loki from 'lokijs';
import { CREATED, BAD_REQUEST, UNAUTHORIZED } from 'http-status-codes';


import * as express from 'express';
import * as basic from 'express-basic-auth';


let titleP = "Birthday Party";
let locationP = "At school";
let dateP = new Date(2018, 6, 25);
let port = 8000;
let app = express();
app.use(express.json());

app.get('/party', (request, response, next) => {
    response.send({
        title: titleP,
        location: locationP,
        date: dateP
    });
});

const db = new loki(__dirname + '/db.dat', {autosave: true, autoload: true});
let guests = db.getCollection('guests');
if (!guests) {
  guests = db.addCollection('guests');
}

app.get('/guests',(request, response, next)=>{
    /*for(let i=0;i<guests.count();i++){

    }*/
    response.send(guests.find());
});

app.post('/register', function(request,response){
    if(request.body.firstName==false || request.body.lastName==false){
        response.status(BAD_REQUEST).send("Falsche Informationen wurden übergeben!");
    }else{
        if(guests.count()>10){
            response.status(UNAUTHORIZED).send("Die maximale Anzahl an Besuchern ist bereits erreicht!");
        }else{
            let guest= {
                firstName: request.body.firstName,
                lastName: request.body.lastName
            }
            let inserted=false;
            inserted=guests.insert(guest);
            if(inserted){
                response.status(CREATED).send("Erfolgreich hinzugefügt!");
            }else{
                response.send("Etwas ist schief gelaufen!");
            }
        }
    }
});
app.listen(port, () => console.log('API is listening on '+port));

