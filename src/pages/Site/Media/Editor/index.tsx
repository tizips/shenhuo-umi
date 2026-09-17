import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, notification, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { doSiteSceneOfOpening } from '@/services/site';
import { doCreate, doUpdate } from './service';
import { createUploadRequest } from '@/services/helper';
import Constants from '@/utils/Constants';

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

const Editor: React.FC<APISiteMedia.Props> = (props) => {
  const [former] = Form.useForm<APISiteMedia.Former>();
  const [loading, setLoading] = useState<APISiteMedia.Loading>({});
  const [scenes, setScenes] = useState<APISite.Opening[]>([]);
  const type = Form.useWatch('type', former);
  const files = Form.useWatch('files', former);

  const toScenes = () => {
    setLoading({ ...loading, scenes: true });
    doSiteSceneOfOpening()
      .then((response) => {
        if (response.code === Constants.Success) {
          setScenes(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, scenes: false }));
  };

  const submit = (values: APISiteMedia.Former, isUpdate: boolean) => {
    const params = {
      title: values.type === 'video' ? values.title?.trim() : undefined,
      scene_id: values.scene_id,
      type: values.type,
      url: values.files?.[0]?.thumbUrl || values.files?.[0]?.url,
      is_top: values.is_top ?? 2,
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
      former.resetFields();
      former.setFieldsValue({
        title: props.params?.title,
        scene_id: props.params?.scene_id,
        type: props.params?.type,
        is_top: props.params?.is_top ?? 2,
        files: props.params?.url
          ? [
              {
                uid: String(props.params.id),
                thumbUrl: props.params.url,
                url: props.params.url,
                status: 'done',
              },
            ]
          : [],
      });
      if (scenes.length <= 0) {
        toScenes();
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
        <Form.Item label="场景" name="scene_id" rules={[{ required: true }]}>
          <Select
            loading={loading.scenes}
            options={scenes.map((item) => ({ label: item.name, value: item.id }))}
          />
        </Form.Item>
        <Form.Item label="类型" name="type" rules={[{ required: true }]}>
          <Select
            options={[
              { label: '图片', value: 'image' },
              { label: '视频', value: 'video' },
            ]}
            onChange={(val) => {
              former.setFieldValue('files', []);
              if (val !== 'video') {
                former.setFieldValue('title', undefined);
              }
            }}
          />
        </Form.Item>
        {type === 'video' && (
          <Form.Item
            label="标题"
            name="title"
            rules={[
              { required: true, message: '请输入视频标题' },
              { max: 128, message: '标题最多 128 个字符' },
            ]}
          >
            <Input placeholder="请输入视频标题" maxLength={128} />
          </Form.Item>
        )}
        <Form.Item
          label="文件"
          name="files"
          valuePropName="fileList"
          getValueFromEvent={onUpload}
          rules={[{ required: true, message: '请上传文件' }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            maxCount={1}
            accept={type === 'video' ? 'video/*' : 'image/*'}
            action={Constants.Upload}
            customRequest={createUploadRequest('/site/media')}
            data={{ dir: '/site/media' }}
          >
            {files && files.length > 0 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="置顶"
          name="is_top"
          rules={[{ required: true }]}
          extra="置顶内容在小程序端优先展示"
        >
          <Select options={yesNo} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
