import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Modal, notification, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { doSitePageOfOpening } from '@/services/site';
import { doCreate, doUpdate } from './service';
import { createUploadRequest } from '@/services/helper';
import Constants from '@/utils/Constants';

const onUpload = (e: any) => {
  if (Array.isArray(e)) return e;
  if (e.file.status === 'done') {
    e.fileList?.forEach((item: any) => {
      if (item.uid === e.file.uid) {
        if (e.file.response?.code !== Constants.Success) {
          notification.error({ message: e.file.response?.message });
        } else {
          item.thumbUrl = e.file.response.data.url;
          item.url = e.file.response.data.url;
        }
      }
    });
  }
  return e.fileList;
};

const Editor: React.FC<APISiteNav.Props> = (props) => {
  const [former] = Form.useForm<APISiteNav.Former>();
  const [loading, setLoading] = useState<APISiteNav.Loading>({});
  const [pages, setPages] = useState<APISite.Opening[]>([]);
  const type = Form.useWatch('type', former);
  const icons = Form.useWatch('icons', former);

  const toPages = () => {
    setLoading({ ...loading, pages: true });
    doSitePageOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setPages(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, pages: false }));
  };

  const submit = (values: APISiteNav.Former, isUpdate: boolean) => {
    const params = {
      title: values.title,
      icon:
        values.icons?.[0]?.response?.data?.url ||
        values.icons?.[0]?.thumbUrl ||
        values.icons?.[0]?.url,
      type: values.type,
      value: values.value,
      order: values.order ?? 50,
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

  useEffect(() => {
    if (props.visible) {
      former.setFieldsValue({
        title: props.params?.title,
        icons: props.params?.icon
          ? [{ uid: String(props.params.id), thumbUrl: props.params.icon, status: 'done' }]
          : [],
        type: props.params?.type,
        value: props.params?.value,
        order: props.params?.order ?? 50,
      });
      if (pages.length <= 0) {
        toPages();
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
      <Form
        form={former}
        onFinish={(values) => submit(values, !!props.params)}
        labelCol={{ span: 4 }}
      >
        <Form.Item label="标题" name="title" rules={[{ required: true }, { max: 64 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="图标"
          name="icons"
          valuePropName="fileList"
          getValueFromEvent={onUpload}
          rules={[{ required: true, message: '请上传图标' }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            maxCount={1}
            action={Constants.Upload}
            customRequest={createUploadRequest('/site/nav')}
            data={{ dir: '/site/nav' }}
          >
            {icons && icons.length > 0 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item label="类型" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              { label: '链接', value: 'link' },
              { label: '页面', value: 'page' },
            ]}
            onChange={() => former.setFieldValue('value', undefined)}
          />
        </Form.Item>
        {type === 'page' ? (
          <Form.Item label="页面" name="value" rules={[{ required: true }]}>
            <Select
              loading={loading.pages}
              options={pages.map((item) => ({ label: item.name, value: String(item.id) }))}
            />
          </Form.Item>
        ) : (
          <Form.Item label="链接" name="value" rules={[{ required: true }, { max: 255 }]}>
            <Input placeholder="https://" />
          </Form.Item>
        )}
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
