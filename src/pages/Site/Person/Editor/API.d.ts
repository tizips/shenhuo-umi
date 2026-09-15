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
    unit?: string;
    mobile?: string;
    password?: string;
    number?: string;
    group_name?: string;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
