declare namespace APISiteScores {
  type Data = {
    id?: number;
    person_id?: string;
    name?: string;
    number?: string;
    unit?: string;
    group_name?: string;
    total?: string;
    order?: number;
    created_at?: string;
    loading_deleted?: boolean;
  } & APISite.ScoreItems;

  type Visible = {
    editor?: boolean;
    import?: boolean;
  };

  type Search = {
    page?: number;
    size?: number;
    keyword?: string;
  };
}
