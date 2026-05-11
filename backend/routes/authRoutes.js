const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { userContainer } = require('../database/cosmosClient');

router.post('/register', async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {

            id: Date.now().toString(),

            name,

            email,

            password: hashedPassword,

            role

        };

        await userContainer.items.create(newUser);

        res.status(201).json({

            message: 'User Registered Successfully'

        });

    } catch (error) {

        res.status(500).json({

            message: 'Registration Failed',

            error: error.message

        });

    }

});

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const querySpec = {

            query: "SELECT * FROM c WHERE c.email = @email",

            parameters: [

                {

                    name: "@email",

                    value: email

                }

            ]

        };

        const { resources } = await userContainer.items

            .query(querySpec)

            .fetchAll();

        const user = resources[0];

        if (!user) {

            return res.status(404).json({

                message: 'User Not Found'

            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({

                message: 'Invalid Password'

            });

        }

        const token = jwt.sign(

            {

                id: user.id,

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: '1d'

            }

        );

        res.json({

            message: 'Login Successful',

            token,

            user

        });

    } catch (error) {

        res.status(500).json({

            message: 'Login Failed',

            error: error.message

        });

    }

});

module.exports = router;