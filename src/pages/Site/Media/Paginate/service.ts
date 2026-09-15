import { request } from 'umi';

export async function doPaginate(params?: APISiteMedias.Search) {
  return request<APIResponse.Paginate<APISiteMedias.Data>>('/api-admin/site/medias', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/medias/${id}`, { method: 'DELETE' });
}
