import { request } from 'umi';

export async function doPaginate(params?: APISiteDraws.Search) {
  return request<APIResponse.Response<APISiteDraws.Data[]>>('/api-admin/site/draws', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/draws/${id}`, { method: 'DELETE' });
}

export async function doExport() {
  try {
    const blob = await request<Blob>('/api-admin/site/draws/export', {
      method: 'GET',
      responseType: 'blob',
      skipErrorHandler: true,
    });
    if (blob instanceof Blob && blob.type.includes('application/json')) {
      const response = JSON.parse(await blob.text()) as APIResponse.Response<any>;
      return Promise.reject(new Error(response.message || '导出失败'));
    }
    return blob;
  } catch (error: any) {
    if (error?.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        return Promise.reject(new Error(json.message || '导出失败'));
      } catch {
        // ignore
      }
    }
    return Promise.reject(error instanceof Error ? error : new Error(error?.message || '导出失败'));
  }
}
