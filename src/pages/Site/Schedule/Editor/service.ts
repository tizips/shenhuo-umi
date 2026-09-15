import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api-admin/site/schedule', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: any) {
  return request<APIResponse.Response<any>>(`/api-admin/site/schedules/${id}`, {
    method: 'PUT',
    data: params,
  });
}
