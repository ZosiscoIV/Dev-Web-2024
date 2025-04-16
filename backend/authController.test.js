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
    it('should reject invalid email format', async () => {
        const invalidEmailUser = {
            email: 'invalid-email',
            password: 'Password1',
            nom: 'Doe',
            prenom: 'John',
            tel: '0123456789'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(invalidEmailUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Email invalide' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject password without uppercase letter', async () => {
        const invalidPasswordUser = {
            email: 'test@example.com',
            password: 'password1', // lowercase
            nom: 'Doe',
            prenom: 'John',
            tel: '0123456789'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(invalidPasswordUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'Le mot de passe doit faire ≥ 8 caractères, inclure une majuscule et un chiffre'
        });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject password without number', async () => {
        const invalidPasswordUser = {
            email: 'test@example.com',
            password: 'Password', // no number
            nom: 'Doe',
            prenom: 'John',
            tel: '0123456789'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(invalidPasswordUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: 'Le mot de passe doit faire ≥ 8 caractères, inclure une majuscule et un chiffre'
        });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject if any required field is missing', async () => {
        const missingFieldUser = {
            email: 'test@example.com',
            password: 'Password1',
            prenom: 'John',
            tel: '0123456789'
            // nom is missing
        };

        const res = await request(app)
            .post('/auth/register')
            .send(missingFieldUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Format de données invalide' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject non-string fields', async () => {
        const nonStringUser = {
            email: 'test@example.com',
            password: 'Password1',
            nom: 12345, // number instead of string
            prenom: 'John',
            tel: '0123456789'
        };

        const res = await request(app)
            .post('/auth/register')
            .send(nonStringUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Format de données invalide' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should handle database errors during registration', async () => {
        // Simulate database failure during email check
        mockQuery.mockRejectedValueOnce(new Error('Database connection failed'));

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

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Erreur de creation de compte' });
    });

    it('should handle bcrypt hashing errors', async () => {
        const bcrypt = require('bcrypt');
        bcrypt.hash.mockImplementationOnce(() =>
            Promise.reject(new Error('Hashing failed'))
        );

        // Setup valid user data
        const validUser = {
            email: 'test@example.com',
            password: 'Password1',
            nom: 'Doe',
            prenom: 'John',
            tel: '0123456789'
        };

        // Mock database checks to pass
        mockQuery
            .mockResolvedValueOnce([[], []])
            .mockResolvedValueOnce([[], []]);

        const res = await request(app)
            .post('/auth/register')
            .send(validUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Erreur de creation de compte' });
    });

    it('should reject telephone with non-numeric characters', async () => {
        const invalidTelUser = {
            email: 'test@example.com',
            password: 'Password1',
            nom: 'Doe',
            prenom: 'John',
            tel: '0123abc678' // contains letters
        };

        const res = await request(app)
            .post('/auth/register')
            .send(invalidTelUser);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Le téléphone doit avoir 10 chiffres' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

});
