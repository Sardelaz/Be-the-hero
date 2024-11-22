import connection from '../database/connection.js';

export default {

    // Retorna casos especificos de uma unica ong
    async index(request, response) {
        const ong_id = request.headers.authorization; // Pegando o `ong_id` do cabeçalho

        if (!ong_id) {
            return response.status(400).json({ error: 'ONG ID is missing.' });
        }

        const incidents = await connection('incidents')
            .where('ong_id', ong_id) // Usando `ong_id` na consulta
            .select('*');

        return response.json(incidents);
    }
}