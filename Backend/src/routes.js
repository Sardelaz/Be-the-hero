import express from 'express';

import OngController from './controllers/OngController.js';
import IncidentController from './controllers/IncidentController.js';
import ProfileController from './controllers/ProfileController.js';
import SessionController from './controllers/SessionController.js';

const routes = express.Router();

// Criar uma sessão
routes.post('/sessions', SessionController.create );

// Listar ongs
routes.get('/ongs', OngController.index);

// Cadastrar ongs
routes.post('/ongs', OngController.create);

// Retorna casos de uma ong especifica
routes.get('/profile', ProfileController.index);

// Criar incidente
routes.post('/incidents', IncidentController.create);

// Listar incidente
routes.get('/incidents', IncidentController.index);

// Deletar incidente
routes.delete('/incidents/:id', IncidentController.delete);

export default routes;
