import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api-admin/site/score', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api-admin/site/scores/${id}`, {
    method: 'PUT',
    data: params,
  });
}
