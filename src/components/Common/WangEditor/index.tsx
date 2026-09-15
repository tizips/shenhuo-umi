import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { doUpload } from '@/services/helper';
import Constants from '@/utils/Constants';

import '@wangeditor/editor/dist/css/style.css';
import styles from './index.less';

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  dir?: string;
};

const WangEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder = '请输入内容',
  height = 320,
  dir = '/site/content',
}) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  useEffect(() => {
    return () => {
      if (!editor || editor.isDestroyed) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: ['undo', 'redo'],
  };

  const editorConfig: Partial<IEditorConfig> = {
    placeholder,
    autoFocus: false,
    MENU_CONF: {
      uploadImage: {
        customUpload: async (
          file: File,
          insertFn: (url: string, alt: string, href: string) => void,
        ) => {
          const response = await doUpload(file, dir);
          if (response.code !== Constants.Success) {
            notification.error({ message: response.message });
            return;
          }
          insertFn(response.data.url || '', response.data.name || '', response.data.url || '');
        },
      },
      uploadVideo: {
        customUpload: async (file: File, insertFn: (url: string, poster?: string) => void) => {
          const response = await doUpload(file, dir);
          if (response.code !== Constants.Success) {
            notification.error({ message: response.message });
            return;
          }
          insertFn(response.data.url || '');
        },
      },
    },
  };

  return (
    <div className={styles.wangEditor} style={{ border: '1px solid #d9d9d9', zIndex: 99 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #d9d9d9' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(current) => {
          const html = current.getHtml();
          if (html !== value) {
            onChange?.(html);
          }
        }}
        mode="default"
        style={{ height: `${height}px`, overflowY: 'hidden' }}
      />
    </div>
  );
};

export default WangEditor;
