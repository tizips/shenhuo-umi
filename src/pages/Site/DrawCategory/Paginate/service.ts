import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteDrawCategories.Data>>(
    '/api-admin/site/draw-categories',
    { params },
  );
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/draw-categories/${id}`, {
    method: 'DELETE',
  });
}
