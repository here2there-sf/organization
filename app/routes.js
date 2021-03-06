import { Router } from 'express';

import OrganizationController from './controllers/organizations.controller';
import authenticate from './middleware/authenticate';
import AccessControlOwner from './middleware/access-control-owner';
import errorHandler from './middleware/error-handler';

const routes = new Router();

// Organizations
routes.post('/organization', authenticate, OrganizationController.create);
routes.put('/organization', AccessControlOwner.organization(), OrganizationController.update);
routes.get('/organizations', authenticate, OrganizationController.fetch);
routes.get('/organization/:id', authenticate, OrganizationController.fetchOne);
routes.delete('/organization', AccessControlOwner.organization(), OrganizationController.delete);

routes.use(errorHandler);

export default routes;
