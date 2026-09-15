import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteScenes.Data>>('/api-admin/site/scenes', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/scenes/${id}`, { method: 'DELETE' });
}
