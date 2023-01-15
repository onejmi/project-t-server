//import http from 'http';
import { Server } from "socket.io";
import { QGen } from "./qgen.js";
//import express from 'express'
// import { QGen } from './qgen.js';

async function main() {

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
      
        // receive a message from the client
        socket.on("transcript_message", async (transcript) => {
          console.log('Transcript received: ', transcript);
          const response = await questionGen.generateQuestions(transcript);
          console.log(response);
          const rObject = JSON.parse(response);

          for(const question of rObject) {
            // @ts-ignore
            console.log('Question: ' , question.question);
            // @ts-ignore
            console.log('Answer: ', question.answer);
          }
        });
      });

  // console.log('Testing Question Generator...')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})