import connection from '../database/connection.js';

export default {

    // Listar Incidentes
    async index(request, response) {
        let { page = 1 } = request.query;

        // Validação da página
        if (isNaN(page) || page <= 0) {
            return response.status(400).json({ error: 'Page must be a positive number' });
        }

        const [count] = await connection('incidents').count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);
        
        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents);
    },

    // Criar Incidente
    async create(request, response) {
        console.log(request.body);  // Log dos dados recebidos
    
        const { title, description, value, ong_id } = request.body;
        
        // Validação de campos
        if (!title || !description || isNaN(value) || value <= 0 || !ong_id) {
            return response.status(400).json({ error: 'Dados inválidos' });
        }
    
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });
    
        return response.json({ id });
    },
      
    // Deletar incidentes
    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        if (!ong_id) {
            return response.status(401).json({ error: 'Authorization header is missing or invalid' });
        }

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        
        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation not permitted' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }

};
