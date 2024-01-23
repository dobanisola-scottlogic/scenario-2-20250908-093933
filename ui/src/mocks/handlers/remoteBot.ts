import { http } from 'msw';
import { baseUrl } from '~/api/api';
import {
  badRequestResponse,
  errorResponse,
  gatewayTimeoutResponse,
  jsonOkResponse,
  plainTextOkResponse,
  unauthorizedResponse,
} from './utils';

const endpoint = `${baseUrl}/remotebot`;
const connectEndpoint = `${endpoint}/connect`;
const connectedStateEndpoint = `${endpoint}/connectedState`;
const disconnectEndpoint = `${endpoint}/disconnect`;

export const handlers = [
  http.get(connectedStateEndpoint, () => {
    return plainTextOkResponse('DISCONNECTED');
  }),
  http.post(connectEndpoint, () => {
    return jsonOkResponse(null);
  }),
];

export const postConnectedBotGatewayTimeoutResponseHandler = http.post(
  connectEndpoint,
  () => {
    return gatewayTimeoutResponse();
  }
);

export const postConnectedBotErrorResponseHandler = http.post(
  connectEndpoint,
  () => {
    return errorResponse();
  }
);

export const postDisconnectedBotGatewayTimeoutResponseHandler = http.post(
  disconnectEndpoint,
  () => {
    return gatewayTimeoutResponse();
  }
);

export const postDisconnectedBotErrorResponseHandler = http.post(
  disconnectEndpoint,
  () => {
    return errorResponse();
  }
);

export const getConnectedStateConnectedResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return plainTextOkResponse('CONNECTED');
  }
);

export const getConnectedStateWaitingResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return plainTextOkResponse('WAITING');
  }
);

export const getConnectedStateErrorResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return errorResponse();
  }
);

export const getConnectedStateBadRequestResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return badRequestResponse({
      message: 'Bad request error message',
    });
  }
);

export const getConnectedStateUnauthorizedResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return unauthorizedResponse();
  }
);
