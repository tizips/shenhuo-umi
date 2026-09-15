import { request } from 'umi';

export async function doPaginate(params?: APISiteScores.Search) {
  return request<APIResponse.Paginate<APISiteScores.Data>>('/api-admin/site/scores', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/scores/${id}`, { method: 'DELETE' });
}
