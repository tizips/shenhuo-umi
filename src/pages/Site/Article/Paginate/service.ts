import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteArticles.Data>>('/api-admin/site/articles', {
    params,
  });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/articles/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable<number>) {
  return request<APIResponse.Response<any>>('/api-admin/site/article/enable', {
    method: 'PUT',
    data,
  });
}
