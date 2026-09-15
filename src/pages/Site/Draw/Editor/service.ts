import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<APISite.DrawResult[]>>('/api-admin/site/draw', {
    method: 'POST',
    data: params,
  });
}
