import { request } from 'umi';

export async function doImport(file: File) {
  const data = new FormData();
  data.append('file', file);
  return request<APIResponse.Response<APISite.ImportResult>>('/api-admin/site/person/import', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function doTemplate() {
  const blob = await request<Blob>('/api-admin/site/person/template', {
    method: 'GET',
    responseType: 'blob',
    skipErrorHandler: true,
  });
  // 后端出错时返回 JSON，需要解析提示
  if (blob instanceof Blob && blob.type.includes('application/json')) {
    const response = JSON.parse(await blob.text()) as APIResponse.Response<any>;
    return Promise.reject(new Error(response.message || '下载失败'));
  }
  return blob;
}
