import { request } from 'umi';

export async function doCreate(params?: APISiteBanner.Create) {
  return request<APIResponse.Response<any>>('/api-admin/site/banner', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: APISiteBanner.Update) {
  return request<APIResponse.Response<any>>(`/api-admin/site/banners/${id}`, {
    method: 'PUT',
    data: params,
  });
}
