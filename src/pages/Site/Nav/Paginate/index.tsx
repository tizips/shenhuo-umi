import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, Image, notification, Popconfirm, Space, Table, Tag } from 'antd';
import Editor from '@/pages/Site/Nav/Editor';
import { doDelete, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const typeName: Record<string, string> = { link: '链接', page: '页面' };

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteNavs.Search>({});
  const [editor, setEditor] = useState<APISiteNavs.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteNavs.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISiteNavs.Data>>();

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

  const onDelete = (record: APISiteNavs.Data) => {
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
        title="导航列表"
        extra={
          <Space size={[10, 10]}>
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.nav.create')}>
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
            title="图标"
            align="center"
            width={80}
            render={(record: APISiteNavs.Data) =>
              record.icon ? <Image src={record.icon} height={32} /> : '-'
            }
          />
          <Table.Column title="标题" dataIndex="title" />
          <Table.Column title="排序" dataIndex="order" align="center" width={80} />
          <Table.Column
            title="类型"
            align="center"
            render={(record: APISiteNavs.Data) => (
              <Tag>{record.type ? typeName[record.type] || record.type : '-'}</Tag>
            )}
          />
          <Table.Column
            title="值"
            ellipsis
            render={(record: APISiteNavs.Data) =>
              record.type === 'page' ? record.page_name || record.value : record.value
            }
          />
          <Table.Column
            title="创建时间"
            align="center"
            width={120}
            render={(record: APISiteNavs.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={160}
            render={(record: APISiteNavs.Data) => (
              <>
                <Access accessible={access.page('site.nav.update')}>
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
                <Access accessible={access.page('site.nav.delete')}>
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
