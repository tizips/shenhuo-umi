import React, { useEffect, useState } from 'react';
import { Alert, Button, Divider, Modal, Upload, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { doImport, doTemplate } from './service';
import Constants from '@/utils/Constants';

const Import: React.FC<APISitePersonOfImport.Props> = (props) => {
  const [file, setFile] = useState<UploadFile>();
  const [loading, setLoading] = useState<APISitePersonOfImport.Loading>({});

  useEffect(() => {
    if (props.visible) setFile(undefined);
  }, [props.visible]);

  const onTemplate = () => {
    setLoading({ template: true });
    doTemplate()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '人员导入模板.xlsx';
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error: Error) => message.error(error.message))
      .finally(() => setLoading({ template: false }));
  };

  const onImport = () => {
    if (!file?.originFileObj) return;
    setLoading({ importing: true });
    doImport(file.originFileObj)
      .then((response) => {
        if (response.code !== Constants.Success) {
          message.error(response.message);
        } else {
          message.success(
            `导入完成：共 ${response.data.total} 条，成功 ${response.data.created}，跳过 ${response.data.skipped}`,
          );
          props.onSave?.();
        }
      })
      .finally(() => setLoading({ importing: false }));
  };

  return (
    <Modal
      title="导入人员"
      open={props.visible}
      onCancel={props.onCancel}
      confirmLoading={loading.importing}
      okText="开始导入"
      okButtonProps={{ disabled: !file }}
      onOk={onImport}
      width={480}
    >
      <Divider />
      <Upload.Dragger
        accept=".xls,.xlsx"
        multiple={false}
        maxCount={1}
        disabled={loading.importing}
        fileList={file ? [file] : []}
        beforeUpload={(file) => {
          setFile({ uid: file.uid, name: file.name, status: 'done', originFileObj: file });
          return false;
        }}
        onRemove={() => setFile(undefined)}
        style={{ marginTop: 16 }}
      >
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
        <p className="ant-upload-hint">第一步上传 Excel 文件，确认后点击「开始导入」</p>
      </Upload.Dragger>
      <Alert
        type="info"
        showIcon
        message="导入说明"
        description={
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>请使用模板中的表头：姓名、单位、手机号、参赛号、小组名称</li>
            <li>
              表头或格式不确定？
              <Button
                type="link"
                size="small"
                onClick={onTemplate}
                loading={loading.template}
                style={{ padding: 0 }}
              >
                点击此处下载模板
              </Button>
            </li>
            <li>仅支持 .xls / .xlsx 格式文件</li>
            <li>手机号已存在的数据将被跳过，不会重复导入</li>
          </ul>
        }
        style={{ marginTop: 16 }}
      />
    </Modal>
  );
};

export default Import;
