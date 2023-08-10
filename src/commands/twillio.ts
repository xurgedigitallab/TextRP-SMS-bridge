
import { LogService, MatrixClient, MessageEvent, MessageEventContent, MentionPill } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";

export async function runSendSMSCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], matrixclient: MatrixClient) {
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = require('twilio')(accountSid, authToken);

// The first argument is always going to be us, so get the second argument instead.
const message =  args.slice(2).join(' ');
LogService.info("args[1]  " + args[1] + "  message " + message)
client.messages
    .create({
        body: message,
        from: fromNumber,
        to: args[1]
    })
    .then(message => console.log(message.sid))
    .done();



   let sayHelloTo = event.sender;

//    let text = `Hello ${sayHelloTo}! We sent this message to ${args[1]} - ${message}`;
//    let html = `Hello ${htmlEscape(sayHelloTo)}! We sent this message to ${args[1]} - ${message}`;

//    if (sayHelloTo.startsWith("@")) 
   //{
       // Awesome! The user supplied an ID so we can create a proper mention instead
       const mention = await MentionPill.forUser(sayHelloTo, roomId, client);
       let text = `Hello ${mention.text}! We sent this message to ${args[1]} - ${message}`;
       let html = `Hello ${mention.text}! We sent this message to ${args[1]} - ${message}`;
   //}

   // Now send that message as a notice
   return matrixclient.sendMessage(roomId, {
       body: text,
       msgtype: "m.notice",
       format: "org.matrix.custom.html",
       formatted_body: html,
   });
}