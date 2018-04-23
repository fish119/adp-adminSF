import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Popconfirm,
  Icon,
  Button,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  TreeSelect,
} from 'antd';
import { reg_phone, reg_email } from '../../utils/constant';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { formatterTreeSelect, getIdStrings } from '../../utils/utils.js';
import styles from '../../layouts/TableList.less';

const FormItem = Form.Item;
const newItem = { username: '', nickname: '', phone: '', email: '', roles: [] };
const UserForm = Form.create({})(props => {
  const {
    modalVisible,
    form,
    handleSave,
    handleModalVisible,
    item,
    departs,
    rolesData,
    checkUsername,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSave(fieldsValue);
    });
  };
  return (
    <Modal
      title={item != null ? '编辑用户' : '新建用户'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        handleModalVisible(false, Object.assign({}, newItem));
      }}
      width={650}
    >
      <Form>
        <Row>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户名">
              {form.getFieldDecorator('username', {
                initialValue: item.username,
                rules: [
                  { required: true, message: '请输入用户名...' },
                  { validator: checkUsername },
                ],
              })(<Input placeholder="请输入" maxLength="10" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="昵称">
              {form.getFieldDecorator('nickname', {
                initialValue: item.nickname,
              })(<Input placeholder="请输入" maxLength="10" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="手机号码">
              {form.getFieldDecorator('phone', {
                initialValue: item.phone,
                rules: [
                  { required: true, message: '请输入手机号码...' },
                  { pattern: new RegExp(reg_phone), message: '请输入正确的手机号码' },
                ],
              })(<Input placeholder="请输入" maxLength="11" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="email">
              {form.getFieldDecorator('email', {
                initialValue: item.email,
                rules: [{ pattern: new RegExp(reg_email), message: '请输入正确Email' }],
              })(<Input placeholder="请输入" maxLength="50" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="部门">
              {form.getFieldDecorator('department', {
                initialValue: item.department ? item.department.id.toString() : null,
              })(
                <TreeSelect
                  treeData={formatterTreeSelect(departs)}
                  placeholder="Please select"
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="角色">
              {form.getFieldDecorator('roles', { initialValue: getIdStrings(item.roles) })(
                <TreeSelect
                  treeData={formatterTreeSelect(rolesData)}
                  placeholder="Please select"
                  allowClear
                  treeCheckable
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

@connect(({ global, user, loading, depart, role }) => ({
  userMenus: global.userMenus,
  user,
  depart,
  role,
  loading: loading.models.user || loading.models.depart,
}))
@Form.create()
export default class User extends PureComponent {
  state = {
    formValues: {},
    modalVisible: false,
    item: Object.assign({}, newItem),
  };
  componentWillMount() {
    this.props.dispatch({ type: 'user/fetch' });
    this.props.dispatch({ type: 'depart/fetch' });
    this.props.dispatch({ type: 'role/fetch' });
  }
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      item: record,
    });
  };
  handleStandardTableChange = pagination => {
    const { formValues } = this.state;
    const params = {
      currentPage: pagination.current - 1,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    this.props.dispatch({
      type: 'user/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {},
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'user/fetch',
        payload: values,
      });
    });
  };
  checkUsername = (rule, value, callback) => {
    if (value === 'sa') {
      callback();
    } else {
      callback('错误');
    }
  };
  renderSimpleForm(treeData) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('searchStr')(
                <Input placeholder="用户名、昵称、电话或Email" style={{ width: 200 }} />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="部门">
              {getFieldDecorator('department')(
                <TreeSelect
                  treeData={formatterTreeSelect(treeData)}
                  placeholder="Please select"
                  allowClear
                  style={{ width: 120 }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <Button
                icon="plus"
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => this.handleModalVisible(true, Object.assign({}, newItem))}
              >
                新增
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { userMenus, user: { data }, loading, depart, role } = this.props;
    const columns = [
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
        render: record => (
          <Fragment>
            <Button
              type="primary"
              ghost
              onClick={() => this.handleModalVisible(true, Object.assign({}, record))}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="您确定要删除该记录？"
              onConfirm={() => this.handlDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="danger" ghost>
                删除
              </Button>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const parentMethods = {
      checkUsername: this.checkUsername,
      handleSave: this.handleSave,
      handleModalVisible: this.handleModalVisible,
    };
    const { modalVisible, item } = this.state;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div style={{ marginBottom: '10px' }} className={styles.tableListForm}>
              {this.renderSimpleForm(depart.data.list)}
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={columns}
              rowKey={record => record.id}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <UserForm
          departs={depart.data.list}
          rolesData={role.data.list}
          {...parentMethods}
          modalVisible={modalVisible}
          item={item}
        />
      </PageHeaderLayout>
    );
  }
}
