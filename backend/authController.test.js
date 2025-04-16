const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn((pw, salt) => Promise.resolve(`hashed_${pw}`))
}));

// Prepare a mock for mysql2
const mockQuery = jest.fn();
const mockPool = { promise: () => ({ query: mockQuery }) };
const mockConnection = { connect: jest.fn(cb => cb(null)) };

jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => mockConnection),
    createPool: jest.fn(() => mockPool)
}));

// Load the router after mocks
const authRouter = require('./authController');

// Set up Express app
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('POST /auth/register', () => {
    beforeEach(() => {
        mockQuery.mockReset();
    });

    it('should return 201 and create account when data is valid', async () => {
        // Simulate no email / phone duplicates
        // Code destructures nested rows: return [[ ]] for first query
        mockQuery
            .mockResolvedValueOnce([[], []])   // no existing email
            .mockResolvedValueOnce([[], []])   // no existing tel
            .mockResolvedValueOnce([ { insertId: 42 } ]);

        const newUser = {
            email: 'test@example.com',
            password: 'Password1',
            nom: 'Doe',
            prenom: 'John',
            tel: '0123456789'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(newUser);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Compte créé avec succès' });
        // Third query is the INSERT
        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO Epicerie.tbclients'),
            ['Doe', 'John', 'hashed_Password1', newUser.email, newUser.tel]
        );
    });

    it('should reject invalid phone format', async () => {
        const invalidUser = {
            email: 'user@domain.com',
            password: 'Password1',
            nom: 'Smith',
            prenom: 'Anna',
            tel: '12345' // too short
        };

        const res = await request(app)
            .post('/auth/register')
            .send(invalidUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Le téléphone doit avoir 10 chiffres' });
        // No DB calls should be made
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject duplicate email', async () => {
        // Simulate existing email found
        mockQuery
            .mockResolvedValueOnce([ [ [{ id: 1 }] ], [] ]);

        const dupUser = {
            email: 'dup@example.com',
            password: 'Password1',
            nom: 'Dup',
            prenom: 'User',
            tel: '0987654321'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(dupUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Email déjà utilisé' });
    });

    it('should reject duplicate telephone', async () => {
        // No email dup, but telephone dup
        mockQuery
            .mockResolvedValueOnce([[], []])           // no existing email
            .mockResolvedValueOnce([ [ [{ id: 2 }] ], [] ]);

        const dupPhone = {
            email: 'unique@example.com',
            password: 'Password1',
            nom: 'Unique',
            prenom: 'Phone',
            tel: '0987654321'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(dupPhone);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Numéro de téléphone déjà utilisé' });
    });
});