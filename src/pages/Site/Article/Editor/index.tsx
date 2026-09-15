import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, notification, Select, Spin, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import WangEditor from '@/components/Common/WangEditor';
import { doSiteArticleOfInformation } from '@/services/site';
import { doCreate, doUpdate } from './service';
import { createUploadRequest } from '@/services/helper';
import Constants from '@/utils/Constants';

const requiredHtml = [
  {
    required: true,
    validator(_: unknown, value?: string) {
      const text = (value || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim();
      return text ? Promise.resolve() : Promise.reject(new Error('请输入内容'));
    },
  },
];

const yesNo = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
];

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

const Editor: React.FC<APISiteArticle.Props> = (props) => {
  const [former] = Form.useForm<APISiteArticle.Former>();
  const [loading, setLoading] = useState<APISiteArticle.Loading>({});
  const thumbs = Form.useWatch('thumbs', former);

  const submit = (values: APISiteArticle.Former, isUpdate: boolean) => {
    const params = {
      title: values.title,
      thumb:
        values.thumbs?.[0]?.response?.data?.url ||
        values.thumbs?.[0]?.thumbUrl ||
        values.thumbs?.[0]?.url,
      content: values.content,
      published_at: dayjs.isDayjs(values.published_at)
        ? values.published_at.format('YYYY-MM-DD HH:mm:ss')
        : values.published_at,
      is_top: values.is_top,
      is_recommend: values.is_recommend,
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
      former.setFieldsValue({
        title: undefined,
        thumbs: undefined,
        published_at: undefined,
        is_top: 2,
        is_recommend: 2,
        content: undefined,
      });
      return;
    }
    setLoading({ init: true });
    doSiteArticleOfInformation(props.params.id)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          props.onCancel?.();
        } else {
          former.setFieldsValue({
            title: response.data.title,
            thumbs: response.data.thumb
              ? [{ uid: String(response.data.id), thumbUrl: response.data.thumb, status: 'done' }]
              : [],
            published_at: response.data.published_at
              ? dayjs(response.data.published_at)
              : undefined,
            is_top: response.data.is_top,
            is_recommend: response.data.is_recommend,
            content: response.data.content,
          });
        }
      })
      .finally(() => setLoading({ init: false }));
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      open={props.visible}
      width={860}
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
          <Form.Item label="标题" name="title" rules={[{ required: true }, { max: 120 }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="缩略图"
            name="thumbs"
            valuePropName="fileList"
            getValueFromEvent={onUpload}
            rules={[{ required: true, message: '请上传缩略图' }]}
          >
            <Upload
              name="file"
              listType="picture-card"
              maxCount={1}
              action={Constants.Upload}
              customRequest={createUploadRequest('/site/article')}
              data={{ dir: '/site/article' }}
            >
              {thumbs && thumbs.length > 0 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="发布时间" name="published_at" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="置顶" name="is_top" rules={[{ required: true }]}>
            <Select options={yesNo} />
          </Form.Item>
          <Form.Item label="首页推荐" name="is_recommend" rules={[{ required: true }]}>
            <Select options={yesNo} />
          </Form.Item>
          <Form.Item label="内容" name="content" rules={requiredHtml}>
            <WangEditor dir="/site/article" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
