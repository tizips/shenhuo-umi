declare namespace APISiteScore {
  type Props = {
    visible?: boolean;
    params?: APISiteScores.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Former = {
    person_id?: string;
  } & APISite.ScoreItems;

  type Loading = {
    confirmed?: boolean;
    persons?: boolean;
    init?: boolean;
  };
}
