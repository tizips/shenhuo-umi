import { request } from 'umi';

export async function doCreateImages(params: APISiteMedia.CreateImage) {
  return request<APIResponse.Response<any>>('/api-admin/site/media/images', {
    method: 'POST',
    data: params,
  });
}

export async function doCreateVideo(params: APISiteMedia.CreateVideo) {
  return request<APIResponse.Response<any>>('/api-admin/site/media/video', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: number, params?: APISiteMedia.Update) {
  return request<APIResponse.Response<any>>(`/api-admin/site/medias/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function doInformation(id?: number) {
  return request<APIResponse.Response<APISite.MediaInformation>>(`/api-admin/site/medias/${id}`);
}
