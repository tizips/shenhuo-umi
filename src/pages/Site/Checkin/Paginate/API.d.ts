declare namespace APISiteCheckins {
  type Data = {
    id?: number;
    name?: string;
    created_at?: string;
  };

  type Search = {
    page?: number;
    name?: string;
  };
}
