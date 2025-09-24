import mongoose, { Document } from 'mongoose';

// Define the interface for Email document
// interface IEmail extends Document {
//     subject?: string;
//     date?: Date;
//     messageId?: string;
//     body?: string;
//     replyTo: string[];
//     to: string[];
//     from: string[];
//     sender: string[];
//     attachments: any[];
// }

const EmailAddressSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String, required: true }
});

const EmailSchema = new mongoose.Schema({
    subject: { type: String },
    date: { type: Date },
    messageId: { type: String },
    body: { type: String },

    // Arrays of EmailAddress
    replyTo: [EmailAddressSchema],
  to: [EmailAddressSchema],
  from: [EmailAddressSchema],
  sender: [EmailAddressSchema],

    attachments: { type: Array, default: [] }
});


  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  const Email = mongoose.model('Email', EmailSchema);


export default Email;
// Create model with TypeScript interface

