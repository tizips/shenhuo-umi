import type { UploadProps } from 'antd';
import { notification } from 'antd';
import Constants from '@/utils/Constants';
import { doBasicUpload } from './basic';

export const doUpload = doBasicUpload;

export const createUploadRequest = (dir: string = '/file'): UploadProps['customRequest'] => {
  return async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const response = await doBasicUpload(file, dir);
      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
        onError?.(new Error(response.message));
      } else {
        onSuccess?.(response, file as any);
      }
    } catch (err: any) {
      notification.error({ message: err?.message || '上传失败' });
      onError?.(err);
    }
  };
};

export default doUpload;
