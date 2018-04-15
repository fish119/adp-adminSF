import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Divider, Table, Icon,Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    align: 'center',
    render: icon => <Icon type={icon} />,
  },
  {
    title: '菜单URL',
    dataIndex: 'path',
    key: 'path',
    align: 'center',
  },
  {
    title: '仅管理员可见',
    dataIndex: 'onlySa',
    key: 'onlySa',
    align: 'center',
    render:value=> value?'是':'否',
  },
  {
    title: '排序号',
    dataIndex: 'sort',
    key: 'sort',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
    render: () => (
      <Fragment>
        <a href="javascript:void(0);">编辑</a>
        <Divider type="vertical" />
        <a href="javascript:void(0);">删除</a>
      </Fragment>
    ),
  },
];

@connect(({ global, menu, loading }) => ({
  userMenus: global.userMenus,
  menu,
  loading: loading.effects['menu/fetch'],
}))
export default class Menu extends PureComponent {
  componentWillMount() {
    this.props.dispatch({ type: 'menu/fetch' });
  }
  render() {
    const { userMenus, menu: { data }, loading } = this.props;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Card bordered={false}>
          <Table
            // selectedRows={selectedRows}
            loading={loading}
            dataSource={data.list}
            columns={columns}
            rowKey="id"
            // onSelectRow={this.handleSelectRows}
            // onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderLayout>      
    );
  }
}
