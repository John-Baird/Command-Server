const net = require('net');
const fs = require('fs');

let nextId = 0;

const server = net.createServer((socket) => {
  

  // Assign an ID to the new client
  let id = nextId++;
  let originalId = nextId;
  console.log('Client '+id+' connected');
  // Add the new client socket to the array of client sockets
  clients[id] = socket;
  // Add the new client ID to the array of client IDs
  clientIds.push(id);



  // Send a message to all the clients to inform them that a new client has joined
    
  Object.values(clients).forEach((client) => {
    if(client == socket){
        client.write("Your id is "+id)
    }
    else{
        client.write(`[${id}] joined the chat`);
        
    }
    
  });


  // Log the fact that the client has joined
  fs.appendFile('chat.log', `[${id}] joined the chat\n`, (err) => {
    if (err) throw err;
  });

  socket.on('data', (data) => {
    console.log(`ID:${id} ${data}`);
    going = true
    trim = data.toString().trim()
    if(trim == '/clientlist'){
      Object.values(clients).forEach((client) => {
        if(client == socket){
            fs.appendFile('chat.log', `${clientIds}\n`, (err) => {
              if (err) throw err;
          });
            client.write("Connected clients: "+clientIds);
            going = false
        }
      
    });
    }
    else if (trim.startsWith('/username')) {
      // Extract the new ID from the command
      const newId = trim.split(' ')[1];
      console.log(`${newId}\n`)
      // Check if the new ID is already taken
      if (clientIds.includes(newId)) {
        socket.write(`ID "${newId}" is already taken`);
      } else {
        //console.log("ok")
        // Update the ID of the client
        Object.values(clients).forEach((client) => {
          client.write(`[${id}] Has changed their name to [${newId}]`)
        });

        // Update the client ID in the array of client IDs
        clientIds[clientIds.indexOf(id)] = newId;
        id = newId;
        //console.log(clientIds)
        
      }
      going = false
    }
    else if (trim.startsWith('/w')) {
      let [, recipient, ...message] = trim.split(' ')
      //console.log(recipient+message)
      //console.log(clientIds)
      dummyclient = clientIds
      counter = 0
      exist = 0
      dummyclient.forEach(() => {
        dummyclient[counter] = dummyclient[counter].toString()
        if(dummyclient[counter] == recipient){
          exist++
        }
        counter++
        
      })
      //console.log(exist)
      if(exist == 1){
        index = dummyclient.indexOf(recipient)
        clients[index].write(`[${id}] whispers to you: ${message}`)
      }
      else{
        socket.write("Hey that person doesn't exist, its just your imagination")
      }
      going = false
    }
    else if (trim.startsWith('/kick')) {
      let [, recipient, message] = trim.split(' ')
      //console.log(recipient+message)
      //console.log(clientIds)
      dummyclient = clientIds
      counter = 0
      exist = 0
      dummyclient.forEach(() => {
        dummyclient[counter] = dummyclient[counter].toString()
        if(dummyclient[counter] == recipient){
          exist++
        }
        counter++
        
      })
      //console.log(exist)
      if(exist == 1){
        index = dummyclient.indexOf(recipient)
        if(message = "BanHammer"){
          clients[index].write(`YOU'VE BEEN SMACK!!!!!`)
          clients[index].destroy()
          
        }
        
      }
      else{
        socket.write("Hey that person doesn't exist, its just your imagination")
      }
      going = false
    }


    fs.appendFile('chat.log', `[${id}] ${data}`, (err) => {
        if (err) throw err;
    });
    if(going){
// Iterate through the array of client sockets and write the received message to all the others
Object.values(clients).forEach((client) => {
  if(client !== socket){
      client.write(`[${id}] ${data}`);
  }

});
    }
    
  });

  socket.on('close', () => {
    console.log('Client '+id+' disconnected');

    // Remove the disconnected client socket from the array of client sockets
    delete clients[id];
    // Remove the disconnected client ID from the array of client IDs
    clientIds = clientIds.filter((clientId) => clientId !== id);

        // Log the fact that the client has left
        fs.appendFile('chat.log', `[${id}] left the chat\n`, (err) => {
            if (err) throw err;
          });

    // Send a message to all the clients to inform them that the client has left
    Object.values(clients).forEach((client) => {
      client.write(`[${id}] left the chat`);

    });
  });
});

// Initialize the array of client sockets
const clients = {};
let clientIds = [];

server.listen(8000, () => {
  console.log('Server listening on port 8000');
});