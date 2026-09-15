import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, Modal, notification } from 'antd';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';
import Pattern from '@/utils/Pattern';

const Editor: React.FC<APISitePerson.Props> = (props) => {
  const [former] = Form.useForm<APISitePerson.Former>();
  const [loading, setLoading] = useState<APISitePerson.Loading>({});

  const submit = (values: APISitePerson.Former, isUpdate: boolean) => {
    setLoading({ confirmed: true });
    const req = isUpdate ? doUpdate(props.params?.id, values) : doCreate(values);
    req
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: isUpdate ? '修改成功' : '添加成功' });
          props.onSave?.();
        }
      })
      .finally(() => setLoading({ confirmed: false }));
  };

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({
        name: props.params?.name,
        unit: props.params?.unit,
        mobile: props.params?.mobile,
        number: props.params?.number,
        group_name: props.params?.group_name,
        password: undefined,
      });
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
      <Divider />
      <Form
        form={former}
        onFinish={(values) => submit(values, !!props.params)}
        labelCol={{ span: 5 }}
      >
        <Form.Item label="姓名" name="name" rules={[{ required: true }, { max: 32 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="单位" name="unit" rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="mobile"
          rules={[
            { required: true },
            { pattern: RegExp(Pattern.MOBILE), message: '手机号格式错误' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="参赛号" name="number" rules={[{ required: true }, { max: 32 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="小组名称" name="group_name" rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: !props.params },
            { pattern: RegExp(Pattern.ADMIN_PASSWORD), message: '密码格式错误' },
          ]}
        >
          <Input.Password placeholder="留空不修改" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
