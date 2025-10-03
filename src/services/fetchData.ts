import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import EmailModule from "../../db/db.js"

export function getAllMessage(accessToken,User){
    return new ImapService(accessToken,User);
}

class ImapService{
    client: ImapFlow;
     constructor(accessToken,User){
         this.client = new ImapFlow({
             host: 'imap.gmail.com',
             port: 993,
             secure: true,
             auth: {
                user:User,
                accessToken: accessToken,
             },
                 logger:false
         });

        }
        
private mapMessageToEmailData(message: any, parsed: any) {
    return {
        subject: message.envelope?.subject,
        date: message.envelope?.date,
        messageId: message.envelope?.messageId,
        replyTo: message.envelope?.replyTo,
        to: message.envelope?.to,
        from: message.envelope?.from,
        sender: message.envelope?.sender,
        body: parsed.text,
        attachment: parsed.attachments?.length ?? 0
    };
}

private async processMessage(message: any) {
    const parsed = await simpleParser(message.source);
    const emailData = this.mapMessageToEmailData(message, parsed);
    const data = new EmailModule(emailData);
    await data.save();
    console.log(data);
    return data;
}

async fetchIndex() {
    await this.client.connect();
    let messages: any[] = [];

    const lock = await this.client.getMailboxLock('INBOX');
    try {
        for await (let message of this.client.fetch('1:10', { envelope: true,source:true })) {
            const data = await this.processMessage(message);
            messages.push(data);
        }
    } finally {
        lock.release();
    }
    await this.client.logout();
    return messages;
}
}

// export const main = async () => {
//     // Wait until client connects and authorizes
//     await client.connect();

//     // Select and lock a mailbox. Throws if mailbox does not exist
//     let lock = await client.getMailboxLock('INBOX');
//     try {
//         // fetch latest message source
//         // client.mailbox includes information about currently selected mailbox
//         // "exists" value is also the largest sequence number available in the mailbox
//         if (!client.mailbox) {
//             throw new Error('No mailbox selected');
//         }
//         let message = await client.fetchOne(client.mailbox.exists, {bodyStructure:true,flags:true, envelope:true, source: true });
//         if(message && message.source){
//             console.log(client.mailbox.exists);
            
            
            
//         // console.log(message.source.toString());
//         }

// export function getImapService(accessToken) {
//   return new ImapService(accessToken);
// }       
//   async fetchInbox() {
//     await this.client.connect();
//     await this.client.mailboxOpen("INBOX");
//     const messages = [];
//     for await (let msg of this.client.fetch("1:*", { envelope: true })) {
//       messages.push(msg.envelope);
//     }
   
//     return messages;
//   }



//         // list subjects for all messages
//         // uid value is always included in FETCH response, envelope strings are in unicode.
//         for await (let message of client.fetch('1:*', { envelope: true })) {
//             // console.log(`${message.uid}: ${message.envelope?.subject}`);
//         }
//     } finally {
//         // Make sure lock is released, otherwise next `getMailboxLock()` never returns
//         lock.release();
        
//     }

//     // log out and close connection
//     await client.logout();
// };

// main().catch();