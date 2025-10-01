import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import EmailModule from "../db/db.js"

const client = new ImapFlow({
    host: 'imap.ethereal.email',
    port: 993,
    secure: true,
    auth: {
        user: 'arvel31@ethereal.email',
        pass: 'mbvDqAZadCbnuC2GqK'
    },
        logger:false
});

const main = async () => {
    // Wait until client connects and authorizes
    await client.connect();

    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock('INBOX');
    try {
        // fetch latest message source
        // client.mailbox includes information about currently selected mailbox
        // "exists" value is also the largest sequence number available in the mailbox
        if (!client.mailbox) {
            throw new Error('No mailbox selected');
        }
        let message = await client.fetchOne(client.mailbox.exists, {bodyStructure:true,flags:true, envelope:true, source: true });
        if(message && message.source){
            console.log(client.mailbox.exists);
            const parsed = await simpleParser(message.source)
            
            let data =new EmailModule({
            subject:message.envelope?.subject,
            date:message.envelope?.date,
            messageId:message.envelope?.messageId,
            replyTo:message.envelope?.replyTo,
                    to:message.envelope?.to,
            from:message.envelope?.from,
            sender:message.envelope?.sender,
            body: parsed.text,
            attachment:parsed.attachments.length

            });
            data.save();
        console.log(data);
        // console.log(message.source.toString());
        }

        


        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        for await (let message of client.fetch('1:*', { envelope: true })) {
            // console.log(`${message.uid}: ${message.envelope?.subject}`);
        }
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
        
    }

    // log out and close connection
    await client.logout();
};

main().catch();