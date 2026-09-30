import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteAppeals.Data>>('/api-admin/site/appeals', { params });
}

export async function doInformation(id?: number) {
  return request<APIResponse.Response<APISite.AppealInformation>>(`/api-admin/site/appeals/${id}`);
}
