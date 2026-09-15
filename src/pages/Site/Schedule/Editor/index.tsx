import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Space,
} from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { doSiteScheduleCategoryOfOpening } from '@/services/site';
import { doCreate, doUpdate } from './service';
import Constants from '@/utils/Constants';

const Editor: React.FC<APISiteSchedule.Props> = (props) => {
  const [former] = Form.useForm<APISiteSchedule.Former>();
  const [loading, setLoading] = useState<APISiteSchedule.Loading>({});
  const [categories, setCategories] = useState<APISite.Opening[]>([]);

  const toCategories = () => {
    setLoading({ ...loading, categories: true });
    doSiteScheduleCategoryOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setCategories(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, categories: false }));
  };

  const submit = (values: APISiteSchedule.Former, isUpdate: boolean) => {
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
        category_id: props.params?.category_id,
        title: props.params?.title,
        subtitle: props.params?.subtitle,
        description: props.params?.description,
        time: props.params?.time,
        items: props.params?.items,
        order: props.params?.order ?? 50,
      });
      toCategories();
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
        <Form.Item label="分类" name="category_id" rules={[{ required: true }]}>
          <Select
            loading={loading.categories}
            options={categories.map((item) => ({ label: item.name, value: item.id }))}
            placeholder="请选择日程分类"
          />
        </Form.Item>
        <Form.Item label="标题" name="title" rules={[{ required: true }, { max: 120 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="副标题" name="subtitle" rules={[{ max: 120 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="时间" name="time" rules={[{ max: 64 }]}>
          <Input placeholder="如：上午 9:00" />
        </Form.Item>
        <Form.Item label="子项目" style={{ marginBottom: 0 }}>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space key={field.key} align="baseline" style={{ display: 'flex' }}>
                    <Form.Item
                      name={[field.name, 'time']}
                      rules={[{ max: 64 }]}
                      style={{ width: 140 }}
                    >
                      <Input placeholder="时间，如：上午 9:00" />
                    </Form.Item>
                    <Form.Item
                      name={[field.name, 'name']}
                      rules={[{ required: true, message: '请输入子项名称' }, { max: 120 }]}
                    >
                      <Input placeholder="子项名称" style={{ width: 220 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" block onClick={() => add()} style={{ marginBottom: 24 }}>
                  添加子项
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="描述" name="description" rules={[{ max: 255 }]}>
          <Input.TextArea rows={3} maxLength={255} showCount />
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
