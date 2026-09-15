declare namespace APISiteScheduleCategories {
  type Data = {
    id?: number;
    name?: string;
    order?: number;
    total?: number;
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
