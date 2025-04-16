const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('bcrypt', () => ({
    hash: jest.fn((pw, salt) => Promise.resolve(`hashed_${pw}`))
}));

const mockQuery = jest.fn();
const mockPool = { promise: () => ({ query: mockQuery }) };
const mockConnection = { connect: jest.fn(cb => cb(null)) };

jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => mockConnection),
    createPool: jest.fn(() => mockPool)
}));

const authRouter = require('./authController');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('POST /auth/register', () => {
    beforeEach(() => {
        mockQuery.mockReset();
    });

    it('should return 201 and create account when data is valid', async () => {
        mockQuery
            .mockResolvedValueOnce([[], []])
            .mockResolvedValueOnce([[], []])
            .mockResolvedValueOnce([{ insertId: 42 }]);

        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password1',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'Compte créé avec succès' });
    });

    it('should reject invalid phone format', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'user@domain.com',
                password: 'Password1',
                nom: 'Smith',
                prenom: 'Anna',
                tel: '12345'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Le téléphone doit avoir 10 chiffres' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject duplicate email', async () => {
        mockQuery.mockResolvedValueOnce([[{ id: 1 }], []]);

        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'dup@example.com',
                password: 'Password1',
                nom: 'Dup',
                prenom: 'User',
                tel: '0987654321'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Email déjà utilisé' });
    });

    it('should reject duplicate telephone', async () => {
        mockQuery
            .mockResolvedValueOnce([[], []])
            .mockResolvedValueOnce([[{ id: 2 }], []]);

        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'unique@example.com',
                password: 'Password1',
                nom: 'Unique',
                prenom: 'Phone',
                tel: '0987654321'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Numéro de téléphone déjà utilisé' });
    });

    it('should reject invalid email format', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'invalid-email',
                password: 'Password1',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Email invalide' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject password without uppercase letter', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password1',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject password without number', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject if any required field is missing', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password1',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Format de données invalide' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should reject non-string fields', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password1',
                nom: 12345,
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Format de données invalide' });
        expect(mockQuery).not.toHaveBeenCalled();
    });

    it('should handle database errors during registration', async () => {
        mockQuery.mockRejectedValueOnce(new Error('Database error'));

        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password1',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Erreur de creation de compte' });
    });

    it('should handle bcrypt hashing errors', async () => {
        const bcrypt = require('bcrypt');
        bcrypt.hash.mockImplementationOnce(() =>
            Promise.reject(new Error('Hashing failed'))
        );

        mockQuery
            .mockResolvedValueOnce([[], []])
            .mockResolvedValueOnce([[], []]);

        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password1',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123456789'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Erreur de creation de compte' });
    });

    it('should reject telephone with non-numeric characters', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'Password1',
                nom: 'Doe',
                prenom: 'John',
                tel: '0123abc678'
            });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Le téléphone doit avoir 10 chiffres' });
        expect(mockQuery).not.toHaveBeenCalled();
    });
});
