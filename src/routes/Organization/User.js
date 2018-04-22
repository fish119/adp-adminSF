import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../../layouts/TableList.less';

const columns = [
  {
    title: '序号',
    render(text, record, index) {
      return index;
    },
    align: 'center',
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    render: value => (value ? value.name : '无'),
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

@connect(({ global, user, loading }) => ({
  userMenus: global.userMenus,
  user,
  loading: loading.models.user,
}))
export default class User extends PureComponent {
  componentWillMount() {
    const params = {
      currentPage: 0,
      pageSize: 10,
    };
    this.props.dispatch({
      type: 'user/fetch',
      payload: params,
    });
  }
  handleStandardTableChange = pagination => {
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.props.dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };
  render() {
    const { userMenus, user: { data }, loading } = this.props;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Card bordered={false}>
          <Table
            // selectedRows={selectedRows}
            loading={loading}
            dataSource={data.list.content}
            columns={columns}
            // rowKey="id"
            // onSelectRow={this.handleSelectRows}
            // onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
