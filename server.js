import { fastify } from "fastify";
import cors from '@fastify/cors'

import { DatabasePostgres } from "./database-postgres.js";
import 'dotenv/config'

const server = fastify();
await server.register(cors)
const database = new DatabasePostgres();

/**
 * GET /cursos
 * Lista todos os cursos cadastrados.
 */
server.get('/cursos', async (request, reply) => {
    try {
        const cursos = await database.getAll();
        return cursos;
    } catch (err) {
        reply.status(500).send({ error: 'Erro ao obter os cursos' });
    }
});

/**
 * GET /cursos/:curso_id
 * Retorna um curso específico com base no ID informado.
 */
server.get('/cursos/:curso_id', async (request, reply) => {
    const { curso_id } = request.params;
    try {
        const curso = await database.getById(curso_id);
        if (curso.length === 0) {
            return reply.status(404).send({ error: 'Curso não encontrado' });
        }
        return curso[0];
    } catch (err) {
        reply.status(500).send({ error: 'Erro ao obter o curso' });
    }
});

/**
 * POST /cursos
 * Cria um novo curso.
 * Espera receber no corpo da requisição os campos: nome, descricao, duracao e modalidade.
 */
server.post('/cursos', async (request, reply) => {
    const cursoData = request.body;
    try {
        const newCurso = await database.create(cursoData);
        reply.status(201);
        return newCurso;
    } catch (err) {
        reply.status(500).send({ error: `Erro ao criar o curso - ${err.message}` });
    }
});

/**
 * PUT /cursos/:curso_id
 * Atualiza os dados de um curso existente.
 * Recebe os novos dados no corpo da requisição.
 */
server.put('/cursos/:curso_id', async (request, reply) => {
    const { curso_id } = request.params;
    const cursoData = request.body;
    try {
        const cursoExistente = await database.getById(curso_id);
        if (cursoExistente.length === 0) {
            return reply.status(404).send({ error: 'Curso não encontrado' });
        }
        await database.update(curso_id, cursoData);
        const cursoAtualizado = await database.getById(curso_id);
        return cursoAtualizado[0];
    } catch (err) {
        reply.status(500).send({ error: 'Erro ao atualizar o curso' });
    }
});

/**
 * DELETE /cursos/:curso_id
 * Remove um curso com base no ID informado.
 */
server.delete('/cursos/:curso_id', async (request, reply) => {
    const { curso_id } = request.params;
    try {
        const cursoExistente = await database.getById(curso_id);
        if (cursoExistente.length === 0) {
            return reply.status(404).send({ error: 'Curso não encontrado' });
        }
        await database.delete(curso_id);
        return { message: 'Curso removido com sucesso' };
    } catch (err) {
        reply.status(500).send({ error: 'Erro ao remover o curso' });
    }
});

server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 8000
})