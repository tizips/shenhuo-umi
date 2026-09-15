import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, Image, notification, Popconfirm, Select, Space, Table, Tag } from 'antd';
import Editor from '@/pages/Site/Media/Editor';
import { doSiteSceneOfOpening } from '@/services/site';
import { doDelete, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const tabList = [
  { key: 'all', tab: '全部', label: '全部' },
  { key: 'image', tab: '图片', label: '图片' },
  { key: 'video', tab: '视频', label: '视频' },
];

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteMedias.Search>({});
  const [editor, setEditor] = useState<APISiteMedias.Data | undefined>();
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState<APISiteMedias.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APISiteMedias.Data>>();
  const [scenes, setScenes] = useState<APISite.Opening[]>([]);

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

  const onDelete = (record: APISiteMedias.Data) => {
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
    doSiteSceneOfOpening().then((response) => {
      if (response.code === Constants.Success) {
        setScenes(response.data);
      }
    });
  }, []);

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        tabList={tabList}
        activeTabKey={search.type || 'all'}
        onTabChange={(key) =>
          setSearch((prev) => ({
            ...prev,
            page: 1,
            type: key === 'all' ? undefined : key,
          }))
        }
        tabBarExtraContent={
          <Space size={[10, 10]}>
            <Select
              allowClear
              placeholder="场景"
              style={{ width: 160 }}
              value={search.scene_id}
              onChange={(scene_id) => setSearch((prev) => ({ ...prev, page: 1, scene_id }))}
              options={scenes.map((item) => ({ label: item.name, value: item.id }))}
            />
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.media.create')}>
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
            onChange: (page) => setSearch((prev) => ({ ...prev, page })),
          }}
        >
          <Table.Column title="场景" dataIndex="scene" />
          <Table.Column
            title="类型"
            align="center"
            render={(record: APISiteMedias.Data) => (
              <Tag>{record.type === 'video' ? '视频' : '图片'}</Tag>
            )}
          />
          <Table.Column
            title="置顶"
            align="center"
            width={80}
            render={(record: APISiteMedias.Data) => (
              <Tag color={record.is_top === 1 ? '#87d068' : '#2db7f5'}>
                {record.is_top === 1 ? '是' : '否'}
              </Tag>
            )}
          />
          <Table.Column
            title="预览"
            align="center"
            width={120}
            render={(record: APISiteMedias.Data) => {
              if (!record.url) return '-';
              if (record.type === 'video') {
                return (
                  <a href={record.url} target="_blank" rel="noreferrer">
                    查看视频
                  </a>
                );
              }
              return <Image src={record.url} height={40} />;
            }}
          />
          <Table.Column
            title="创建时间"
            align="center"
            width={120}
            render={(record: APISiteMedias.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APISiteMedias.Data) => (
              <>
                <Access accessible={access.page('site.media.update')}>
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
                <Access accessible={access.page('site.media.delete')}>
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
