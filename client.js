
process.stdin.setEncoding('utf8');
let userInput = process.stdin;

const net = require('net');        // Client Code  .
const client = net.createConnection({ port: 8000 }, () => { // once connected .
console.log('connected to server!');

userInput.on('data', function (data) {
    
        // Check for the "quit" command
        if (data.toString().trim() === 'quit') {
            // Close the socket and exit the process
            client.end();
            
          } else {
            // Send the user input to the server
            client.write(data);
          }
        
}); 

client.on('data', (data) => {
console.log(data.toString());
//console.log(data)

});
client.on('end', () => {
console.log('Left chat room');
process.exit();
});
client.on('error', () => {
    console.log("An Error has occured Server Side")
    client.end()
    userInput.removeAllListeners()
    process.exit()
})

});