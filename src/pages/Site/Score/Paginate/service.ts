import { request } from 'umi';

export async function doPaginate(params?: APISiteScores.Search) {
  return request<APIResponse.Paginate<APISiteScores.Data>>('/api-admin/site/scores', { params });
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/site/scores/${id}`, { method: 'DELETE' });
}

/** 推送成绩通知；data.category_id 为抽签分组（draw-category）ID */
export async function doNotify(data: APISiteScores.Notify) {
  return request<APIResponse.Response<APISiteScores.NotifyResult>>('/api-admin/site/score/notify', {
    method: 'POST',
    data,
  });
}
