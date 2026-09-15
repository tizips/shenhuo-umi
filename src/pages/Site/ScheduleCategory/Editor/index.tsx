import React, { useEffect, useState } from 'react';
import { Divider, Form, Input, InputNumber, Modal, notification } from 'antd';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APISiteScheduleCategory.Props> = (props) => {
  const [former] = Form.useForm<APISiteScheduleCategory.Former>();
  const [loading, setLoading] = useState<APISiteScheduleCategory.Loading>({});

  const submit = (values: APISiteScheduleCategory.Former, isUpdate: boolean) => {
    setLoading({ confirmed: true });
    const req = isUpdate ? doUpdate(props.params?.id, values) : doCreate(values);
    req
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: isUpdate ? '修改成功' : '添加成功' });
          props.onSave?.();
          if (isUpdate) {
            props.onUpdate?.();
          } else {
            props.onCreate?.();
          }
        }
      })
      .finally(() => setLoading({ confirmed: false }));
  };

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({
        name: props.params?.name,
        order: props.params?.order ?? 50,
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
        labelCol={{ span: 4 }}
      >
        <Form.Item label="名称" name="name" rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="排序"
          name="order"
          rules={[{ required: true }, { type: 'number', min: 1, max: 99 }]}
          extra="数值越小越靠前，默认 50"
        >
          <InputNumber min={1} max={99} precision={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
