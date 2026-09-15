import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteNavs.Data>>('/api-admin/site/navs', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/navs/${id}`, { method: 'DELETE' });
}
