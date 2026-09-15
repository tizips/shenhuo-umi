import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISitePersons.Data>>('/api-admin/site/persons', { params });
}

export async function doDelete(id?: string) {
  return request<APIResponse.Response<any>>(`/api-admin/site/persons/${id}`, { method: 'DELETE' });
}
