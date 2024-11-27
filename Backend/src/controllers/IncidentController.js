import connection from '../database/connection.js';

export default {
    // Listar Incidentes com Paginação
    async index(request, response) {
        try {
            let { page = 1, limit = 5 } = request.query;

            // Validar o valor da página e do limite
            if (isNaN(page) || page <= 0) {
                return response.status(400).json({ error: 'Page must be a positive number' });
            }

            limit = Math.min(limit, 50); // Limitar o máximo de registros por página a 50

            // Contar o total de incidentes
            const [count] = await connection('incidents').count();

            // Buscar incidentes com dados das ONGs
            const incidents = await connection('incidents')
                .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
                .limit(limit)
                .offset((page - 1) * limit)
                .select([
                    'incidents.*',
                    'ongs.name',
                    'ongs.email',
                    'ongs.whatsapp',
                    'ongs.city',
                    'ongs.uf',
                ]);

            // Adicionar o total de incidentes no cabeçalho da resposta
            response.header('X-Total-Count', count['count(*)']);

            return response.json(incidents);
        } catch (err) {
            console.error('Erro ao listar incidentes:', err);
            return response.status(500).json({ error: 'Erro interno no servidor' });
        }
    },

    // Criar Incidente
    async create(request, response) {
        try {
            const { title, description, value, ong_id } = request.body;

            // Validação de campos obrigatórios
            if (!title || !description || isNaN(value) || value <= 0 || !ong_id) {
                return response.status(400).json({ error: 'Dados inválidos' });
            }

            // Verificar se a ONG existe
            const ong = await connection('ongs').where('id', ong_id).select('id').first();
            if (!ong) {
                return response.status(404).json({ error: 'ONG não encontrada' });
            }

            // Criar o incidente
            const [id] = await connection('incidents').insert({
                title,
                description,
                value,
                ong_id,
            });

            return response.status(201).json({ id, title, description, value, ong_id });
        } catch (err) {
            console.error('Erro ao criar incidente:', err);
            return response.status(500).json({ error: 'Erro interno no servidor' });
        }
    },

    // Deletar Incidente
    async delete(request, response) {
        try {
            const { id } = request.params; // ID do incidente a ser deletado
            const ong_id = request.headers.authorization; // ONG que está tentando deletar

            // Verificar se o cabeçalho de autorização está presente
            if (!ong_id) {
                return response.status(401).json({ error: 'Authorization header is missing or invalid' });
            }

            // Buscar o incidente no banco
            const incident = await connection('incidents')
                .where('id', id)
                .select('ong_id')
                .first();

            // Verificar se o incidente existe
            if (!incident) {
                return response.status(404).json({ error: 'Incidente não encontrado' });
            }

            // Verificar se o incidente pertence à ONG que está tentando deletar
            if (incident.ong_id !== ong_id) {
                return response.status(401).json({ error: 'Operação não permitida' });
            }

            // Deletar o incidente
            await connection('incidents').where('id', id).delete();

            return response.status(204).send();
        } catch (err) {
            console.error('Erro ao deletar incidente:', err);
            return response.status(500).json({ error: 'Erro interno no servidor' });
        }
    },
};
