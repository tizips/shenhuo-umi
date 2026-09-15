import { request } from 'umi';

export async function doImport(file: File) {
  const data = new FormData();
  data.append('file', file);
  return request<APIResponse.Response<APISite.ImportResult>>('/api-admin/site/score/import', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}
