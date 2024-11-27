import connection from '../database/connection.js';
import crypto from 'crypto';

export default {
    async index(request, response) {
        const { page = 1, q } = request.query; // Pega o número da página e a query 'q' da URL

        let query = connection('ongs');

        // Verifica se a query de busca foi passada e aplica o filtro de nome
        if (q) {
            query = query.where('name', 'like', `%${q}%`);
        }

        try {
            // Aplica a paginação
            const ongs = await query
                .limit(5) // Limita os resultados a 5 por página
                .offset((page - 1) * 5) // Define o "offset" para a paginação
                .select('*'); // Seleciona todos os campos da tabela 'ongs'

            return response.json(ongs); // Retorna as ONGs encontradas
        } catch (error) {
            console.error('Erro ao buscar ONGs:', error);
            return response.status(500).json({ error: 'Erro interno ao buscar ONGs' });
        }
    },
    
    async create(request, response) {
        try {
            const { name, email, whatsapp, city, uf } = request.body;

            if (!name || !email || !whatsapp || !city || !uf) {
                return response.status(400).json({ error: "Todos os campos são obrigatórios." });
            }

            const id = crypto.randomBytes(4).toString('HEX');

            await connection('ongs').insert({
                id,
                name,
                email,
                whatsapp,
                city,
                uf,
            });

            return response.status(201).json({ id });
        } catch (error) {
            console.error("Erro ao criar ONG:", error.message);
            return response.status(500).json({ error: "Erro interno ao criar ONG." });
        }
    },
};
