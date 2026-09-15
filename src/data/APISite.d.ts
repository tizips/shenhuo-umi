declare namespace APISite {
  type doSiteRoleOfInformation = {
    id: number;
    name: string;
    permissions: string[];
    summary: string;
    created_at: string;
  };

  type doSitePermissions = {
    name?: string;
    code?: string;
    children?: doSitePermissions[];
  };

  type Opening<T = number> = {
    id?: T;
    name?: string;
  };

  type doSiteRoleByOpening = Opening<number>;

  type ArticleInformation = {
    id?: number;
    title?: string;
    thumb?: string;
    content?: string;
    published_at?: string;
    is_top?: number;
    is_recommend?: number;
    created_at?: string;
  };

  type PageInformation = {
    id?: number;
    title?: string;
    content?: string;
    created_at?: string;
  };

  type PersonInformation = {
    id?: string;
    name?: string;
    unit?: string;
    mobile?: string;
    number?: string;
    group_name?: string;
    must_change_password?: number;
    created_at?: string;
  };

  type ScoreItems = {
    theory?: string;
    management?: string;
    cpr?: string;
    respirator?: string;
    escape?: string;
  };

  type ScoreInformation = {
    id?: number;
    person_id?: string;
    name?: string;
    number?: string;
    unit?: string;
    group_name?: string;
    total?: string;
    order?: number;
    created_at?: string;
  } & ScoreItems;

  type ImportResult = {
    total?: number;
    created?: number;
    updated?: number;
    skipped?: number;
  };

  type DrawResult = {
    id?: number;
    category_id?: number;
    category?: string;
    person_id?: string;
    name?: string;
    number?: string;
    unit?: string;
    group_name?: string;
    created_at?: string;
  };
}
