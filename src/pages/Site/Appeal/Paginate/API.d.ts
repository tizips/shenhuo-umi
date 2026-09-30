declare namespace APISiteAppeals {
  type Data = {
    id?: number;
    person_id?: string;
    name?: string;
    number?: string;
    unit?: string;
    group_name?: string;
    id_card?: string;
    reason?: string;
    created_at?: string;
  };

  type Search = {
    page?: number;
    keyword?: string;
  };
}
