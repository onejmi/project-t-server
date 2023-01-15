//import http from 'http';
import { Server } from "socket.io";
import { QGen } from "./qgen.js";
//import express from 'express'
// import { QGen } from './qgen.js';

async function main() {

    let userMap = new Map();

    const port = 4000;
    // const app = express();
    // app.listen(port, () => {
    //     console.log('starting rest ting');
    // })
    
    // const server = http.createServer(app);

    const questionGen = QGen.getInstance();
    await questionGen.start('oelnagmi@gmail.com');

    const io = new Server(port, {
      cors: {
        origin: '*',
      }
    });

    console.log('dfgdgdfgdfg sdfdsfsd');
    io.on("connection", (socket) => {
        console.log('does this even work lol')
        // send a message to the client
        socket.emit("hello from server", "dddd");

        socket.on('user_points', (userId, points) => {
          if (userMap.has(userId)) {
            userMap.set(userId, userMap.get(userId) + points);
            console.log(`User ${userId} now has ${points} points!!!`);
          } else {
            userMap.set(userId, points);
          }
        })
      
        // receive a message from the client
        socket.on("transcript_message", async (transcript) => {
          console.log('Transcript received: ', transcript);
          const response = await questionGen.generateQuestions(transcript);
          console.log(response);
          io.sockets.emit('questions_message', response);
        });
      });

  // console.log('Testing Question Generator...')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})