import connection from '../database/connection.js';


export default {

    // Listar Incidentes
    async index(request, response) {
        const { page = 1 } = request.query;

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
        const { title, description, value, ong_id } = request.body;
      
        if (!ong_id) {
          return response.status(400).json({ error: 'Ong ID is required' });
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

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();
        
        if (incident.ong_id != ong_id){
            return response.status(401).json({ error: 'Operation not permitted '})
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }

}