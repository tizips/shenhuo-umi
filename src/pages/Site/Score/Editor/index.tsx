import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, notification, Select, Spin } from 'antd';
import { doSitePersonOfOpening, doSiteScoreOfInformation } from '@/services/site';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const SCORE_ITEMS: Array<{ name: string; field: keyof APISite.ScoreItems }> = [
  { name: '理论成绩', field: 'theory' },
  { name: '管理能力', field: 'management' },
  { name: '心肺复苏', field: 'cpr' },
  { name: '自救器', field: 'respirator' },
  { name: '紧急避险', field: 'escape' },
];

const Editor: React.FC<APISiteScore.Props> = (props) => {
  const [former] = Form.useForm<APISiteScore.Former>();
  const [loading, setLoading] = useState<APISiteScore.Loading>({});
  const [persons, setPersons] = useState<APISite.Opening<string>[]>([]);

  const toPersons = () => {
    setLoading({ ...loading, persons: true });
    doSitePersonOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setPersons(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, persons: false }));
  };

  const submit = (values: APISiteScore.Former, isUpdate: boolean) => {
    const params = {
      person_id: values.person_id,
      theory: values.theory,
      management: values.management,
      cpr: values.cpr,
      respirator: values.respirator,
      escape: values.escape,
    };
    setLoading({ ...loading, confirmed: true });
    const req = isUpdate ? doUpdate(props.params?.id, params) : doCreate(params);
    req
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: isUpdate ? '修改成功' : '添加成功' });
          props.onSave?.();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const toInit = () => {
    if (!props.params) {
      former.setFieldsValue({ person_id: undefined });
      SCORE_ITEMS.forEach(({ field }) => former.setFieldsValue({ [field]: undefined }));
      return;
    }
    setLoading({ init: true });
    doSiteScoreOfInformation(props.params.id)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          props.onCancel?.();
        } else {
          const { data } = response;
          former.setFieldsValue({
            person_id: data.person_id,
            theory: data.theory,
            management: data.management,
            cpr: data.cpr,
            respirator: data.respirator,
            escape: data.escape,
          });
        }
      })
      .finally(() => setLoading({ init: false }));
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (persons.length <= 0) {
        toPersons();
      }
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      open={props.visible}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Spin spinning={!!loading.init}>
        <Form
          form={former}
          onFinish={(values) => submit(values, !!props.params)}
          labelCol={{ span: 4 }}
        >
          <Form.Item label="人员" name="person_id" rules={[{ required: true }]}>
            <Select
              disabled={!!props.params}
              showSearch
              optionFilterProp="label"
              loading={loading.persons}
              options={persons.map((item) => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          {SCORE_ITEMS.map(({ name, field }) => (
            <Form.Item key={field} label={name} name={field} rules={[{ max: 32 }]}>
              <Input placeholder="未参加则留空" />
            </Form.Item>
          ))}
          <Form.Item label="提示" colon={false}>
            总分与名次由系统按各项成绩自动计算，无需填写。
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
