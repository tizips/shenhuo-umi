declare namespace APISiteSchedules {
  type Item = {
    name?: string;
    time?: string;
  };

  type Data = {
    id?: number;
    category_id?: number;
    category_name?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    time?: string;
    items?: Item[];
    order?: number;
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
