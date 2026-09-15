declare namespace APISiteDraws {
  type Data = {
    id?: number;
    category_id?: number;
    category?: string;
    person_id?: string;
    name?: string;
    number?: string;
    unit?: string;
    group_name?: string;
    created_at?: string;
    loading_deleted?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
    category_id?: number;
  };
}
