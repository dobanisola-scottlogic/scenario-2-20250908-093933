import { http } from 'msw';
import { baseUrl } from '~/api/api';
import { getMilestonesResponse } from '~/mocks/test-data/milestone';
import { jsonOkResponse } from './utils';

const milestoneEndpoint = baseUrl + '/milestone';

export const handlers = [
  http.get(milestoneEndpoint, () => {
    return jsonOkResponse(getMilestonesResponse);
  }),
];
