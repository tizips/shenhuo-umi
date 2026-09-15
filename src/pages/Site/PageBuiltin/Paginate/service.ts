import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APISitePageBuiltins.Data>>(
    '/api-admin/site/page-builtins',
    { params },
  );
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/page-builtins/${id}`, {
    method: 'DELETE',
  });
}
