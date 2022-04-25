import { createRequest } from '@openeagle/antd-vue';

export const request = createRequest({
  baseURL: '/mock-middleware',
  headers: { 'Content-Type': 'application/json' },
});
export default request
