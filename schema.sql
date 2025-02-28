CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,         -- Chave primária autoincrementada
  nome VARCHAR(100) NOT NULL,     -- Nome do curso (obrigatório)
  descricao TEXT,                 -- Descrição do curso
  duracao INTEGER,                -- Duração em semestres
  modalidade VARCHAR(50)          -- Modalidade: pode ser 'Presencial' ou 'EAD'
)