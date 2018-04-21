import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Icon,
  List,
  Spin,
  Row,
  Col,
  Divider,
  Card,
  Button,
  Form,
  Input,
  Slider,
  TreeSelect,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  formatterTreeSelect,
  getIdStrings,
  arraysEqual,
  getObjFromKeys,
  getMenuTreeData,
} from '../../utils/utils.js';

const newItem = { name: '', sort: 0 };
const FormItem = Form.Item;
const CreateForm = Form.create({})(props => {
  const { form, handleSave, item, authorities, menus } = props;
  const menusTreeData = formatterTreeSelect(menus);
  const menusAuthoritiesData = formatterTreeSelect(authorities);
  const onCancle = () => {
    form.resetFields();
  };
  const onSave = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newMenus = arraysEqual(fieldsValue.menus.map(o => o.value), getIdStrings(item.menus))
        ? item.menus
        : getObjFromKeys(fieldsValue.menus.map(o => o.value), menus);
      const newAuthorities = arraysEqual(fieldsValue.authorities, getIdStrings(item.authorities))
        ? item.authorities
        : getObjFromKeys(fieldsValue.authorities, authorities);
      const payload = { ...fieldsValue, menus: newMenus, authorities: newAuthorities };
      form.resetFields();
      handleSave(payload);
    });
  };
  return (
    <Form>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, message: '请输入角色名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色序号">
        {form.getFieldDecorator('sort', { initialValue: item.sort })(<Slider />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限设置">
        {form.getFieldDecorator('authorities', { initialValue: getIdStrings(item.authorities) })(
          <TreeSelect
            treeData={menusAuthoritiesData}
            placeholder="Please select"
            allowClear
            treeCheckable
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单设置">
        {form.getFieldDecorator('menus', { initialValue: getMenuTreeData(item.menus) })(
          <TreeSelect
            treeData={menusTreeData}
            placeholder="Please select"
            allowClear
            treeCheckable
            treeCheckStrictly
          />
        )}
      </FormItem>
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <FormItem>
          <Button type="primary" onClick={onSave}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancle}>
            取消
          </Button>
        </FormItem>
      </div>
    </Form>
  );
});

@connect(({ global, role, loading, authority, menu }) => ({
  userMenus: global.userMenus,
  role,
  authority,
  menu,
  loading: loading.models.role,
}))
export default class Role extends PureComponent {
  state = {
    item: Object.assign({}, newItem),
  };
  componentWillMount() {
    this.props.dispatch({ type: 'role/fetch' });
    this.props.dispatch({ type: 'authority/fetch' });
    this.props.dispatch({ type: 'menu/fetch' });
  }
  onItemClick = roleParam => {
    this.setState({
      item: Object.assign({}, roleParam),
    });
    this.formRef.resetFields();
  };
  onNewBtnClick = () => {
    this.setState({
      item: Object.assign({}, newItem),
    });
    this.formRef.resetFields();
  };
  showSuccess = () => {
    message.success('操作成功');
  };
  handleSave = fields => {
    const pld = {
      ...fields,
      id: this.state.item.id,
      createTime: this.state.item.createTime,
      updateTime: this.state.item.updateTime,
    };
    this.props.dispatch({
      type: 'role/saveRole',
      payload: pld,
      callback: this.showSuccess,
    });
    this.setState({
      item: Object.assign({}, newItem),
    });
  };
  handlDelete = () => {
    if (this.state.item.id) {
      this.props.dispatch({
        type: 'role/deleteRole',
        payload: this.state.item.id,
        callback: this.showSuccess,
      });
      this.setState({
        item: Object.assign({}, newItem),
      });
    }
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  render() {
    const { userMenus, role: { data }, loading, authority, menu } = this.props;
    const { item } = this.state;
    const parentMethods = {
      handleSave: this.handleSave,
    };
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Card
                loading={loading}
                bordered={false}
                title="角色列表"
                extra={
                  <Button
                    icon="plus"
                    type="primary"
                    style={{ marginBottom: '-14px', marginTop: '-14px' }}
                    onClick={this.onNewBtnClick}
                  >
                    新建
                  </Button>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={data.list}
                  renderItem={role => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <a onClick={() => this.onItemClick(role)} href="javascript:void(0);">
                            <Icon type="solution" />&nbsp;&nbsp;{role.name}
                          </a>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
              <Card
                bordered={false}
                title={item.id ? '编辑角色' : '新建角色'}
                loading={loading}
                extra={
                  <Popconfirm
                    title="您确定要删除该记录？"
                    onConfirm={() => this.handlDelete()}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      icon="delete"
                      type="danger"
                      style={{ marginBottom: '-14px', marginTop: '-14px' }}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                }
              >
                <CreateForm
                  ref={this.saveFormRef}
                  {...parentMethods}
                  item={item}
                  authorities={authority.data.list}
                  menus={menu.data.list}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
