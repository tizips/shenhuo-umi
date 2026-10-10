import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import { Button, Card, notification, Popconfirm, Space, Table } from 'antd';
import Editor from '@/pages/Site/Draw/Editor';
import { doSiteDrawCategoryOfOpening } from '@/services/site';
import { doDelete, doExport, doPaginate } from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';
import dayjs from 'dayjs';

const Paginate: React.FC = () => {
  const access = useAccess();
  const [search, setSearch] = useState<APISiteDraws.Search>({});
  const [load, setLoad] = useState(false);
  const [loadExport, setLoadExport] = useState(false);
  const [visible, setVisible] = useState<APISiteDraws.Visible>({});
  const [data, setData] = useState<APISiteDraws.Data[]>([]);
  const [categories, setCategories] = useState<APISite.Opening[]>([]);

  const toPaginate = () => {
    if (!search.category_id) {
      setData([]);
      return;
    }
    setLoad(true);
    doPaginate(search)
      .then((response) => {
        if (response.code === Constants.Success) {
          setData(response.data || []);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APISiteDraws.Data) => {
    setData((prev) => {
      const next = [...prev];
      Loop.ById(next, record.id, (item) => (item.loading_deleted = true));
      return next;
    });
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
        setData((prev) => {
          const next = [...prev];
          Loop.ById(next, record.id, (item) => (item.loading_deleted = false));
          return next;
        });
      });
  };

  const onExport = () => {
    setLoadExport(true);
    return doExport()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '抽签结果.xlsx';
        link.click();
        URL.revokeObjectURL(url);
        notification.success({ message: '导出成功！' });
      })
      .catch((error: Error) => {
        notification.error({ message: error.message || '导出失败！' });
      })
      .finally(() => setLoadExport(false));
  };

  useEffect(() => {
    doSiteDrawCategoryOfOpening().then((response) => {
      if (response.code === Constants.Success) {
        setCategories(response.data || []);
        if (response.data?.length) {
          setSearch((prev) => (prev.category_id ? prev : { category_id: response.data[0].id }));
        }
      }
    });
  }, []);

  useEffect(() => {
    if (search.category_id) {
      toPaginate();
    }
  }, [search]);

  return (
    <>
      <Card
        tabList={categories.map((item) => ({
          key: String(item.id),
          tab: item.name || '-',
        }))}
        activeTabKey={search.category_id ? String(search.category_id) : undefined}
        onTabChange={(key) => setSearch({ category_id: Number(key) })}
        tabBarExtraContent={
          <Space size={[10, 10]}>
            <Button type="primary" onClick={toPaginate} loading={load}>
              刷新
            </Button>
            <Access accessible={access.page('site.draw.create')}>
              <Button onClick={() => setVisible({ editor: true })}>抽签</Button>
            </Access>
            <Access accessible={access.page('site.draw.paginate')}>
              <Popconfirm
                title="确定要导出抽签结果吗？"
                placement="bottomRight"
                onConfirm={onExport}
                okText="确定"
                cancelText="取消"
              >
                <Button loading={loadExport}>导出</Button>
              </Popconfirm>
            </Access>
          </Space>
        }
      >
        <Table
          rowKey="id"
          dataSource={data}
          loading={load}
          pagination={false}
        >
          <Table.Column title="序号" dataIndex="sequence" width={80} align="center" />
          <Table.Column title="参赛号" dataIndex="number" />
          <Table.Column title="姓名" dataIndex="name" />
          <Table.Column title="单位" dataIndex="unit" />
          <Table.Column title="小组" dataIndex="group_name" />
          <Table.Column
            title="抽签时间"
            align="center"
            width={140}
            render={(record: APISiteDraws.Data) =>
              record.created_at && dayjs(record.created_at).format('YY/MM/DD HH:mm')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={160}
            render={(record: APISiteDraws.Data) => (
              <Access accessible={access.page('site.draw.delete')}>
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
            )}
          />
        </Table>
      </Card>
      <Editor
        visible={visible.editor}
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
