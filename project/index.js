const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');


//middlewear app
const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended : true}))



app.get('/', (req, res) => {
  res.send(`<h1>this is project</h1>`)
})

app.listen(3000)


app.use('/user', studentRoutes );
app.use('/user', staffRoutes  );