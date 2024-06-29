const { login } = require('./api/auth');
const { addUser, getLoggedInuser } = require('./api/user');
const { addContact, updateContact, deleteContact, getAllContacts } = require('./api/contact');
const { getWelcomeMessage } = require('./api/welcome');
const joi = require('joi');

const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');

const axios = require('axios');

const app = express();
app.use(json());
app.use(cors());

const PORT = process.env.PORT || 5555;

// const proxyApiList = [
//     {
//         method: 'GET',
//         route: 'github-api',
//         url: 'https://api.github.com'
//     }
// ];

// app.all('/proxy/:route*', async (req, res) => {
//     const route = req.params.route;
//     const method = req.method;

//     const service = proxyApiList.find((i) => i.route == route && i.method == method);

//     if (!service) {
//         return res.json({
//             error: 'invalid endpoint'
//         });
//     }

//     let pathParams = '';
//     let i = 0;
//     while (req.params[i]) {
//         pathParams += req.params[i];
//         i += 1;
//     }

//     console.log(method, route, req.params);
//     console.log(service.url + pathParams);

//     try {
//         const response = await axios({
//             method: service.method,
//             url: service.url + pathParams,
//             params: req.query
//         });
//         console.log('Response', response);
//         return res.json(response.data);
//     } catch (err) {
//         console.log(err.response.data);
//         return res.status(err.response.status).json(err.response.data);
//     }
// });

const METHOD = {
    GET: app.get.bind(app),
    POST: app.post.bind(app),
    PUT: app.put.bind(app),
    DELETE: app.delete.bind(app)
};

const handlers = [
    {
        route: '/',
        handler: getWelcomeMessage,
        method: METHOD.GET
    },
    {
        route: '/api/auth/login',
        handler: login,
        method: METHOD.POST,
        joiSchema: joi.object({
            email: joi.string().email().required(),
            password: joi.string().required()
        })
    },
    {
        route: '/api/users/addUser',
        handler: addUser,
        method: METHOD.POST,
        joiSchema: joi.object({
            userName: joi.string().alphanum().min(3).max(30).required(),
            email: joi
                .string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .required(),
            password: joi.string().min(8).max(15).required(),
            date: joi.date()
        })
    },
    {
        route: '/api/users/getLoggedInUser',
        handler: getLoggedInuser,
        method: METHOD.GET
    },
    {
        route: '/api/contacts/addContact',
        handler: addContact,
        method: METHOD.POST,
        joiSchema: joi.object({
            name: joi.string().alphanum().min(3).max(30).required(),
            email: joi
                .string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .allow(''),
            phoneNum: joi.when('email', {
                is: '',
                then: joi.string().required(),
                otherwise: joi.string().allow('')
            }),
            type: joi.string(),
            date: joi.date()
        })
    },
    {
        route: '/api/contacts/getAllContacts',
        handler: getAllContacts,
        method: METHOD.GET
    },
    {
        route: '/api/contacts/updateContact/:id',
        handler: updateContact,
        method: METHOD.PUT,
        joiSchema: joi.object({
            id: joi.string().required(),
            name: joi.string().alphanum().min(3).max(30).required(),
            email: joi
                .string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                .allow(''),
            phoneNum: joi.when('email', {
                is: '',
                then: joi.string().required(),
                otherwise: joi.string().allow('')
            }),
            type: joi.string(),
            date: joi.date()
        })
    },
    {
        route: '/api/contacts/deleteContact/:id',
        handler: deleteContact,
        method: METHOD.DELETE
    }
];

const callback = (err, data, res) => {
    if (err) {
        console.log(err.statusCode);
        res.statusCode = err.statusCode ?? 500;
        return res.json({ error: err?.error?.message ?? err });
    }

    console.log('ERR', err);
    console.log('BODY DATA', data);
    res.statusCode = data?.statusCode ? data.statusCode : 200;

    return res.json(data);
};

handlers.forEach((handler) => {
    handler.method(handler.route, async (req, res) => {
        const validatedResponse = handler.joiSchema ? handler.joiSchema.validate(req.body) : null;
        if (validatedResponse && validatedResponse.error) {
            return res.status(400).json(validatedResponse);
        } else {
            console.log('Request headers', JSON.stringify(req.headers));
            await handler.handler(req, (err, data) => {
                console.log(err, data);
                callback(err, data, res);
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}...`);
});
