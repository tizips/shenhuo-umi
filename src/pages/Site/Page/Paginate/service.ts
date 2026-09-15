import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISitePages.Data>>('/api-admin/site/pages', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/pages/${id}`, { method: 'DELETE' });
}
