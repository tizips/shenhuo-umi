declare namespace APISiteDrawCategories {
  type Data = {
    id?: number;
    name?: string;
    icon?: string;
    quota?: number;
    drawn?: number;
    order?: number;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
  };
}
