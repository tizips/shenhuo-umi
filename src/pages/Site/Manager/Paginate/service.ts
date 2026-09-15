import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISiteManagers.Data>>('/api-admin/site/managers', {
    params,
  });
}

export async function doDelete(id?: string) {
  return request<APIResponse.Response<any>>(`/api-admin/site/managers/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable<string>) {
  return request<APIResponse.Response<any>>('/api-admin/site/manager/enable', {
    method: 'PUT',
    data,
  });
}
