import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteCheckins.Data>>('/api-admin/site/checkins', { params });
}

export async function doInformation(id?: number) {
  return request<APIResponse.Response<APISite.CheckinInformation>>(`/api-admin/site/checkins/${id}`);
}
