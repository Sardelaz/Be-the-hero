import connection from '../database/connection.js';

export default {
    async index(request, response) {
        const ong_id = request.headers.authorization; // Pega o ID da ONG nos cabeçalhos

        if (!ong_id) {
            return response.status(401).json({ error: 'Authorization header is missing or invalid' });
        }

        try {
            // Verifique se a ong_id está sendo recebida corretamente
            console.log('ONG ID:', ong_id);

            // Busca casos específicos da ONG logada
            const incidents = await connection('incidents')
                .where('ong_id', ong_id)
                .select('*');

            if (incidents.length === 0) {
                return response.status(404).json({ error: 'Nenhum caso encontrado para essa ONG' });
            }

            return response.json(incidents);
        } catch (err) {
            console.error('Erro ao buscar casos:', err);  // Log completo do erro
            return response.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
};
