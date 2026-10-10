declare namespace APISitePerson {
  type Props = {
    visible?: boolean;
    params?: APISitePersons.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    name?: string;
    id_card?: string;
    unit?: string;
    mobile?: string;
    password?: string;
    number?: string;
    group_name?: string;
    category_id?: number;
  };

  type Loading = {
    confirmed?: boolean;
    categories?: boolean;
  };
}
