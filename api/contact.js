const AuthUtil = require('../utils/authUtil');
const DbUtil = require('../utils/dbUtil');
const Contacts = require('../models/Contacts');

class Contact {
    static async addContact(event, callback) {
        console.log('Enter Contact - add contact - event body', event.body, typeof event.body);
        try {
            const token = event.headers.authorization
                ? event.headers.authorization
                : event.headers.Authorization;
            const { name, email, phoneNum, type, date } = event.body;
            const decodedPayload = await AuthUtil.verifyAuthToken(token);
            await DbUtil.dbConnect();
            const contact = new Contacts({
                name,
                email,
                phoneNum,
                type,
                date,
                user: decodedPayload.user_id
            });
            const contactAdded = await contact.save();
            console.log('Exit Contact - add contact - contact Added', contactAdded);
            callback(null, contactAdded);
        } catch (error) {
            console.log('Error in Contacts - add contact: ', Object.keys(error));
            callback({ error });
        }
    }

    static async getAllContacts(event, callback) {
        console.log('Enter Contact - get all contact - event body', event.body, typeof event.body);
        try {
            const token = event.headers.authorization
                ? event.headers.authorization
                : event.headers.Authorization;
            const decodedPayload = await AuthUtil.verifyAuthToken(token);
            await DbUtil.dbConnect();
            const contacts = await Contacts.find({ user: decodedPayload.user_id }).sort({
                date: -1
            });
            console.log('Exit Contact - get all contact: ', contacts);
            callback(null, {
                contacts
            });
        } catch (error) {
            console.error('Error in Contact API - getAllContacts: ', error);
            callback({
                error
            });
        }
    }

    static async updateContact(event, callback) {
        console.log('Enter Contact - updateContact - event body', event.body, typeof event.body);
        try {
            const id = event.params.id;
            console.log('path param : id', id);
            if (!id) {
                throw 'Invalid contact ID';
            }
            const token = event.headers.authorization
                ? event.headers.authorization
                : event.headers.Authorization;
            const decodedPayload = await AuthUtil.verifyAuthToken(token);
            const updatedFields = {};
            const { name, email, phoneNum, type, date } = event.body;
            await DbUtil.dbConnect();
            var contactToBeUpdated = await Contacts.findById(id);
            if (!contactToBeUpdated) {
                throw 'No contact found';
            }
            if (contactToBeUpdated.user != decodedPayload.user_id) {
                throw 'You are not authorized to perform the action';
            }
            if (name) updatedFields['name'] = name;
            if (email) updatedFields['email'] = email;
            if (phoneNum) updatedFields['phoneNum'] = phoneNum;
            if (type) updatedFields['type'] = type;
            if (date) updatedFields['date'] = new Date();
            contactToBeUpdated = await Contacts.findByIdAndUpdate(id, { $set: updatedFields });
            console.log('Exit Contact - updateContact - updated contact', contactToBeUpdated);
            callback(null, contactToBeUpdated);
        } catch (error) {
            console.log('Error in Contacts API - updateContact: ', error);
            callback(error);
        }
    }

    static async deleteContact(event, callback) {
        console.log('Enter Contact - deleteContact - event body', event.body, typeof event.body);
        try {
            const id = event.params.id;
            console.log('path param : id', id);
            if (!id) {
                throw 'Invalid contact ID';
            }
            const token = event.headers.authorization
                ? event.headers.authorization
                : event.headers.Authorization;
            const decodedPayload = await AuthUtil.verifyAuthToken(token);
            await DbUtil.dbConnect();
            var contactToBeDeleted = await Contacts.findById(id);
            if (!contactToBeDeleted) {
                throw 'No contact found';
            }
            if (contactToBeDeleted.user != decodedPayload.user_id) {
                throw 'You are not authorized to perform the action';
            }

            contactToBeDeleted = await Contacts.findByIdAndDelete(id);
            console.log('Exit Contact - deleteContact - deleted contact', contactToBeDeleted);
            callback(null, contactToBeDeleted);
        } catch (error) {
            console.log('Error in Contacts API - deleteContact: ', error);
            callback(error);
        }
    }
}

module.exports.addContact = Contact.addContact;
module.exports.getAllContacts = Contact.getAllContacts;
module.exports.updateContact = Contact.updateContact;
module.exports.deleteContact = Contact.deleteContact;
