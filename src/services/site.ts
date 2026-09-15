import { request } from 'umi';

export async function doSitePermissions() {
  return request<APIResponse.Response<APISite.doSitePermissions[]>>('/api-admin/site/permissions');
}

export async function doSiteRoleByOpening() {
  return request<APIResponse.Response<APISite.doSiteRoleByOpening[]>>(
    '/api-admin/site/role/opening',
  );
}

export async function doSiteRoleOfInformation(id?: number) {
  return request<APIResponse.Response<APISite.doSiteRoleOfInformation>>(
    `/api-admin/site/roles/${id}`,
  );
}

export async function doSiteSceneOfOpening() {
  return request<APIResponse.Response<APISite.Opening[]>>('/api-admin/site/scene/opening');
}

export async function doSitePageOfOpening() {
  return request<APIResponse.Response<APISite.Opening[]>>('/api-admin/site/page/opening');
}

export async function doSitePersonOfOpening() {
  return request<APIResponse.Response<APISite.Opening<string>[]>>('/api-admin/site/person/opening');
}

export async function doSiteDrawCategoryOfOpening() {
  return request<APIResponse.Response<APISite.Opening[]>>('/api-admin/site/draw-category/opening');
}

export async function doSiteScheduleCategoryOfOpening() {
  return request<APIResponse.Response<APISite.Opening[]>>(
    '/api-admin/site/schedule-category/opening',
  );
}

export async function doSiteArticleOfInformation(id?: number) {
  return request<APIResponse.Response<APISite.ArticleInformation>>(
    `/api-admin/site/articles/${id}`,
  );
}

export async function doSitePageOfInformation(id?: number) {
  return request<APIResponse.Response<APISite.PageInformation>>(`/api-admin/site/pages/${id}`);
}

export async function doSitePersonOfInformation(id?: string) {
  return request<APIResponse.Response<APISite.PersonInformation>>(`/api-admin/site/persons/${id}`);
}

export async function doSiteScoreOfInformation(id?: number) {
  return request<APIResponse.Response<APISite.ScoreInformation>>(`/api-admin/site/scores/${id}`);
}
