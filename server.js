let express = require('express');
let bodyParser = require('body-parser'); 
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');
//const  port = 5000;
 
 const pool = new pg.Pool({ 
  host: 'localhost',
  database: 'testdb',
  user: 'postgres',
  password: 'root',
  port: 5432,
  //max: 20, 
 });

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.use(morgan('dev'));
app.use(cors());

 var server = app.listen(process.env.PORT || 5000, listen);
 // WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);
io.set('origins', 'http://localhost:3000');



app.use(function (request, response, next) {
  //response.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  //response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Origin", "http://localhost:3000");
  response.header('Access-Control-Allow-Credentials', true);
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.static('routes')); 

/*app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {
  
    console.log("We have a new client: " + socket.id);
  
    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('receive',
      function(data) {
        // Data comes in as whatever was sent, including objects
        console.log("Received: 'receive' " + data.name + " " + data.msg);
      
        // Send it to all other clients
        socket.broadcast.emit('receive', data);
        
      }
    );
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

app.get('/api/msgs', function (request, response){
  pool.connect((err, db, done) => { 
  
  if(err) {
    return console.log(err);
    //return response.status(400).send(err);
  }
  else {
    db.query('select * from messages', (err,result) => {
      done();
      if(err) {
        //return console.log(err);
        return response.status(400).send(err);
      }
      else {
        //console.log(res.rows[0].name);
        response.status(200).send(result.rows);
      }
    })
  }
 })
})


app.post('/api/sendmsg', function (request, response) {

  
   //console.log("Got a POST request for the homepage");
   //res.send('Hello POST');
   console.log(request.body);
  
  var name = request.body.name;
  var msg = request.body.msg;
  
  let values = [name,msg];
  
  console.log(values);

  pool.connect((err, db, done) => { 
  
  if(err) {
    return console.log(err);
    //return response.status(400).send(err);
  }
  else {
    //console.log(insert into messages (name, msg) values($1, $2), [...values]);
    db.query('insert into messages (name, msg) values($1, $2)', [...values], (err,result) => {
      done();
      if(err) {
        return console.log(err);
        //return response.status(400).send(err);
      }
      else {
        //console.log(res.rows[0].name);
        console.log('Message Send');
        //db.end();
        response.status(201).send({message: 'Send'});
      }
    })
  }
 })
});
 
//app.listen(port,() => console.log('Listening to port ' + port));
