import { rest } from 'msw';
import { UserRole } from '../enums/UserRole';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const handlers = [
  rest.post(baseUrl + '/login', (req, res, ctx) => {
    const authorizationHeader = req.headers.get('Authorization');

    if (authorizationHeader === 'Basic ' + btoa('testusername:testpassword')) {
      return res(
        ctx.status(200),
        ctx.json({
          role: UserRole.ADMIN,
          name: 'admin',
          admin: true,
          team: false,
        })
      );
    } else if (
      authorizationHeader ===
      'Basic ' + btoa('networkerror:networkerror')
    ) {
      return res.networkError('Network error occurred.');
    } else {
      return res(
        ctx.status(401),
        ctx.text('Credentials are required to access this resource.')
      );
    }
  }),
  rest.delete(baseUrl + '/hackathon/test-id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.delete(baseUrl + '/hackathon/400', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: 'An error occurred - bad request.',
      })
    );
  }),
  rest.delete(baseUrl + '/hackathon/500', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: 'An error occurred.',
      })
    );
  })
];
