import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Popconfirm,
  Button,
  Modal,
  message,
  Divider,
  TreeSelect,
} from 'antd';
import { regPhone, regEmail } from '../../utils/constant';
import { checkUsername, checkNickname, checkPhone, checkEmail } from '../../utils/check';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  formatterTreeSelect,
  getIdStrings,
  arraysEqual,
  getObjFromKeys,
} from '../../utils/utils.js';
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
    testUserName,
    testNickname,
    testEmail,
    testPhone,
    handleSetDefaultPassword,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newRoles = arraysEqual(fieldsValue.roles, getIdStrings(item.roles))
        ? item.roles
        : getObjFromKeys(fieldsValue.roles, rolesData);
      const newDept =
        fieldsValue.department === (item.department ? item.department.id : null)
          ? item.department
          : getObjFromKeys([fieldsValue.department], departs)[0];
      const payload = { ...fieldsValue, roles: newRoles, department: newDept };
      form.resetFields();
      handleSave(payload);
    });
  };
  const cancelHandle = () => {
    handleModalVisible(false, Object.assign({}, newItem));
  };
  const setDefaultPassword = () => {
    handleSetDefaultPassword();
  };
  return (
    <Modal
      title={item != null ? '编辑用户' : '新建用户'}
      visible={modalVisible}
      onOk={okHandle}
      width={650}
      footer={[
        <Button key="back" onClick={cancelHandle}>
          取消
        </Button>,
        <Popconfirm
          title="您确定要重置该用户的密码？"
          onConfirm={setDefaultPassword}
          okText="确定"
          cancelText="取消"
          key="setDefaultPassword"
        >
          <Button key="setDefaultPasswordButton">重置密码</Button>
        </Popconfirm>,
        <Button key="submit" type="primary" onClick={okHandle}>
          确定
        </Button>,
      ]}
    >
      <Form>
        <Row>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="用户名">
              {form.getFieldDecorator('username', {
                initialValue: item.username,
                rules: [
                  { required: true, message: '请输入用户名...' },
                  { validator: testUserName },
                ],
                validateTrigger: 'onBlur',
              })(<Input placeholder="请输入" maxLength="10" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="昵称">
              {form.getFieldDecorator('nickname', {
                initialValue: item.nickname,
                rules: [{ required: true, message: '请输入昵称...' }, { validator: testNickname }],
                validateTrigger: 'onBlur',
              })(<Input placeholder="请输入" maxLength="10" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="手机号码">
              {form.getFieldDecorator('phone', {
                initialValue: item.phone,
                rules: [
                  { required: true, message: '请输入手机号码...' },
                  { pattern: new RegExp(regPhone), message: '请输入正确的手机号码' },
                  { validator: testPhone },
                ],
                validateTrigger: 'onBlur',
              })(<Input placeholder="请输入" maxLength="11" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="email">
              {form.getFieldDecorator('email', {
                initialValue: item.email,
                rules: [
                  { pattern: new RegExp(regEmail), message: '请输入正确Email' },
                  { validator: testEmail },
                ],
                validateTrigger: 'onBlur',
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
  showSuccess = () => {
    message.success('操作成功');
    this.handleModalVisible(false, Object.assign({}, newItem));
  };
  handleSave = fields => {
    this.props.dispatch({
      type: 'user/saveUser',
      payload: {
        ...fields,
        id: this.state.item.id,
        createTime: this.state.item.createTime,
        updateTime: this.state.item.updateTime,
      },
      callback: this.showSuccess,
    });
    this.setState({
      item: Object.assign({}, newItem),
    });
  };
  handlDelete = record => {
    if (record.id) {
      this.props.dispatch({
        type: 'user/deleteUser',
        payload: record.id,
        callback: this.showSuccess,
      });
      this.setState({
        item: Object.assign({}, newItem),
      });
    }
  };
  handleSetDefaultPassword = () => {
    if (this.state.item && this.state.item.id) {
      this.props.dispatch({
        type: 'user/setDefaultPassword',
        payload: this.state.item.id,
        callback: message.success('操作成功'),
      });
    }
  };
  testUserName = (rule, value, callback) => {
    checkUsername(rule, value, callback, this.state.item.id ? this.state.item.id : -1);
  };
  testNickname = (rule, value, callback) => {
    checkNickname(rule, value, callback, this.state.item.id ? this.state.item.id : -1);
  };
  testEmail = (rule, value, callback) => {
    checkEmail(rule, value, callback, this.state.item.id ? this.state.item.id : -1);
  };
  testPhone = (rule, value, callback) => {
    checkPhone(rule, value, callback, this.state.item.id ? this.state.item.id : -1);
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
      handleSetDefaultPassword: this.handleSetDefaultPassword,
      testUserName: this.testUserName,
      testNickname: this.testNickname,
      testPhone: this.testPhone,
      testEmail: this.testEmail,
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
