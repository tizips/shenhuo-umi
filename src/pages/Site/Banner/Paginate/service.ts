import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteBanners.Data>>('/api-admin/site/banners', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/banners/${id}`, { method: 'DELETE' });
}
