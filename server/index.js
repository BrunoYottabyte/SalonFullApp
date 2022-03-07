const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const busboy = require('connect-busboy');
const bbBodyParser = require('busboy-body-parser');
const app = express();
require('./database');
//Middlewares
app.use(morgan('dev'));
app.use(express.json())
app.use(busboy());
app.use(bbBodyParser())

app.use(cors());
require('./src/routes/index')(app);
//Variables
app.set('port', 8000);



app.listen(app.get('port'), () => {
    console.log('Server on na porta ' + app.get('port'));
})
