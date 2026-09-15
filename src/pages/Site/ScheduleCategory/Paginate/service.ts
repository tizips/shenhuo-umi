import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteScheduleCategories.Data>>(
    '/api-admin/site/schedule-categories',
    { params },
  );
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/schedule-categories/${id}`, {
    method: 'DELETE',
  });
}
