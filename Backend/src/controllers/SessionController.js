import connection from "../database/connection.js"


export default {
    // Criar uma sessão
    async create(request, response) {
        const { id } = request.body;

        const ong = await connection('ongs')
        .where('id', id)
        .select('name')
        .first();

        // Se der erro retornar a seguinte mensagem
        if(!ong){
            return response.status(400).json({error: 'Nenhuma ONG encontrada com esse Id'});
        }
        
        return response.json(ong)
    }
}