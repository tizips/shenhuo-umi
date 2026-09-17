import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, Image, Input, notification, Popconfirm, Space, Table, Tag,  } from 'antd';
import Editor from '@/pages/Site/Article/Editor';
import { doDelete, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteArticles.Search>({});
  const [editor, setEditor] = useState<APISiteArticles.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteArticles.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISiteArticles.Data>>();

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then((response) => {
        if (response.code === Constants.Success) {
          setData(response.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APISiteArticles.Data) => {
    if (data?.data) {
      const temp = { ...data };
      if (temp.data) {
        Loop.ById(temp.data, record.id, (item) => (item.loading_deleted = true));
      }
      setData(temp);
    }
    doDelete(record.id)
      .then((response) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        if (data?.data) {
          const temp = { ...data };
          if (temp.data) {
            Loop.ById(temp.data, record.id, (item) => (item.loading_deleted = false));
          }
          setData(temp);
        }
      });
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="资讯列表"
        extra={
          <Space size={[10, 10]}>
            <Input.Search
              allowClear
              placeholder="标题"
              onSearch={(keyword) => setSearch({ ...search, page: 1, keyword })}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.article.create')}>
              <Button
                onClick={() => {
                  setEditor(undefined);
                  setVisible({ editor: true });
                }}
              >
                创建
              </Button>
            </Access>
          </Space>
        }
      >
        <Table
          rowKey="id"
          dataSource={data?.data}
          loading={load}
          pagination={{
            current: data?.page,
            pageSize: data?.size,
            total: data?.total,
            showQuickJumper: false,
            showSizeChanger: false,
            onChange: (page) => setSearch({ ...search, page }),
          }}
        >
          <Table.Column
            title="缩略图"
            align="center"
            width={90}
            render={(record: APISiteArticles.Data) =>
              record.thumb ? <Image src={record.thumb} height={40} /> : '-'
            }
          />
          <Table.Column title="标题" dataIndex="title" />
          <Table.Column
            title="置顶"
            align="center"
            render={(record: APISiteArticles.Data) => (
              <Tag color={record.is_top === 1 ? '#87d068' : '#2db7f5'}>
                {record.is_top === 1 ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column
            title="推荐"
            align="center"
            render={(record: APISiteArticles.Data) => (
              <Tag color={record.is_recommend === 1 ? '#87d068' : '#2db7f5'}>
                {record.is_recommend === 1 ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column
            title="发布时间"
            align="center"
            width={140}
            render={(record: APISiteArticles.Data) =>
              record.published_at && dayjs(record.published_at).format('YY/MM/DD HH:mm')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={160}
            render={(record: APISiteArticles.Data) => (
              <>
                <Access accessible={access.page('site.article.update')}>
                  <Button
                    type="link"
                    onClick={() => {
                      setEditor(record);
                      setVisible({ editor: true });
                    }}
                  >
                    编辑
                  </Button>
                </Access>
                <Access accessible={access.page('site.article.delete')}>
                  <Popconfirm
                    title="确定要删除该数据?"
                    placement="leftTop"
                    onConfirm={() => onDelete(record)}
                  >
                    <Button type="link" danger loading={record.loading_deleted}>
                      删除
                    </Button>
                  </Popconfirm>
                </Access>
              </>
            )}
          />
        </Table>
      </Card>
      <Editor
        visible={visible.editor}
        params={editor}
        onSave={() => {
          setVisible({ editor: false });
          toPaginate();
        }}
        onCancel={() => setVisible({ editor: false })}
      />
    </>
  );
};

export default Paginate;
