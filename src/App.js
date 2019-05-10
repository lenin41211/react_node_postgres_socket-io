import React, { Component } from 'react'; 
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

var socket;
class App extends Component {
  
  constructor(props) {
     
    super(props);
    this.state = {
      title: 'Simple Chatting Appliction',
      messages: []
    }
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    //this.setup = this.setup.bind(this);
  }

  forceUpdateHandler(){
    this.forceUpdate();
  };
  
 componentDidMount() {
 
   
   console.log('Component has mounted ') ;
    var that = this;
    fetch('http://localhost:5000/api/msgs')
     .then(function(response){
       
        response.json()
          .then(function(data){
            console.log(data)
        that.setState({
          messages: data
        })
      })
    })
   // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:5000');

  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('receive',
    // When we receive data
    function(data) {
      console.log("Got: " + data.name + " " + data.msg);
       let messages = that.state.messages;
            that.state.messages.push(data);
            that.setState({
              messages: messages
              //console.log(messages)
            })
    }
  );
}


/*const Style = {
  margin: '40px',
  border: '5px solid pink',
  width: '300px', 
  height: '250px'
};*/

   // We make a named event called 'mouse' and write an
    // anonymous callback function
   

  sendmsg(event) {  
    var that = this;
    event.preventDefault(); 

    let user_data = {
      name: this.refs.uname.value,
      msg: this.refs.msg.value
    };

     // Send that object to the socket
      socket.emit('receive',user_data);

    var request = new Request('http://localhost:5000/api/sendmsg', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(user_data)
    });

    fetch(request) 
      .then(function(response){

        response.json()
          .then(function(data){
            //console.log(stu_data)
            let messages = that.state.messages;
            that.state.messages.push(user_data);
            that.setState({
              messages: messages
              //console.log(messages)
            })
            //console
            console.log(messages);
          })
      })
      .catch(function(err) {
        console.log(err)
      })
    //username : 
}

render() {
  let title = this.state.title;
  return (
    <div className="App">
      <h1>{title}</h1>
      <form ref="chattingForm">
      <label>Username : </label>
      <input type="text" ref="uname" placeholder="example : Leninkumar " className="uname"/><button>Submit</button><br/><br/>
      <pre>
       { this.state.messages.map(msg => 
        <li> {msg.name} : {msg.msg}   </li>
       )}
      </pre>
      <br/><br/>
      <label>Message : </label>
      <input type="text" ref="msg" placeholder="example : Hello Everyone" className="msg_send" />
      <button onClick={this.sendmsg.bind(this)}>Send</button>
      </form>
    </div>
  );
 }
}

export default App;
