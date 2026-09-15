import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteDraws.Data>>('/api-admin/site/draws', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/draws/${id}`, { method: 'DELETE' });
}
