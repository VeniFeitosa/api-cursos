import { randomUUID } from "node:crypto";
import { sql } from "./db.js";

export class DatabasePostgres {

    /**
     * Busca todos os cursos cadastrados, ordenando-os pelo ID.
     */
    async getAll(){
        const cursos = await sql`SELECT * FROM cursos ORDER BY id`;
        return cursos;
    }

    /**
     * Busca um curso específico pelo ID.
     * @param {string} id - ID do curso.
     */
    async getById(id){
        const curso = await sql`SELECT * FROM cursos WHERE id = ${id}`;
        return curso;
    }

    /**
     * Cria um novo curso.
     * Gera um UUID para o curso e insere os dados na tabela "cursos".
     * @param {Object} curso - Objeto contendo os dados do curso: nome, descricao, duracao, modalidade.
     */
    async create(curso){
        const newCurso = await sql`
            INSERT INTO cursos (nome, descricao, duracao, modalidade)
            VALUES (
                ${curso.nome},
                ${curso.descricao},
                ${curso.duracao},
                ${curso.modalidade}
            )
            RETURNING *
        `;
        return newCurso;
    }

    /**
     * Atualiza os dados de um curso existente.
     * @param {string} id - ID do curso a ser atualizado.
     */
    async update(id, curso){
        const cursoAtualizado = await sql`
            UPDATE cursos
            SET
                nome = ${curso.nome},
                descricao = ${curso.descricao},
                duracao = ${curso.duracao},
                modalidade = ${curso.modalidade}
            WHERE id = ${id}
        `;
        return cursoAtualizado;
    }

    /**
     * Remove um curso do banco de dados.
     * @param {string} id - ID do curso a ser removido.
     */
    async delete(id){
        await sql`DELETE FROM cursos WHERE id = ${id}`;
    }
}
