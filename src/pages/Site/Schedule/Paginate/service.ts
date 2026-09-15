import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteSchedules.Data>>('/api-admin/site/schedules', {
    params,
  });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/schedules/${id}`, {
    method: 'DELETE',
  });
}
