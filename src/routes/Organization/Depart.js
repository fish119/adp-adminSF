import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tree, Button, Spin, Form, Input, Slider, TreeSelect, message,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { formatterTreeSelect } from '../../utils/utils.js';

const FormItem = Form.Item;
const newLocal = Tree.TreeNode;
const TreeNode = newLocal;
const newItem = { name: '', sort: 0, pid: '' };

const CreateForm = Form.create({})(props => {
  const { form, handleSave, item, treeData } = props;
  const onCancle = () => {
    form.resetFields();
  };
  const onSave = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSave(fieldsValue);
    });
  };
  return (
    <Form>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限名称">
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, message: '请输入权限名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级权限">
        {form.getFieldDecorator('pid', { initialValue: item.pid ? item.pid.toString() : null })(
          <TreeSelect
            style={{ width: 300 }}
            treeData={formatterTreeSelect(treeData)}
            placeholder="Please select"
            onChange={this.onChange}
            allowClear
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限序号">
        {form.getFieldDecorator('sort', { initialValue: item.sort })(<Slider />)}
      </FormItem>
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

@connect(({ global, depart, loading }) => ({
  userMenus: global.userMenus,
  depart,
  loading: loading.models.depart,
}))
export default class Depart extends PureComponent {
  state = {
    item: Object.assign({}, newItem),
  };
  componentWillMount() {
    this.props.dispatch({ type: 'depart/fetch' });
  }
  onTreeSelect = (selectedKeys, info) => {
    this.setState({
      item: Object.assign({}, info.node.props.dataRef),
    });
  };
  onNewBtnClick = () => {
    this.setState({
      item: Object.assign({}, newItem),
    });
  };
  showSuccess = () => {
    message.success('操作成功');
  };
  handleSave = fields => {
    this.props.dispatch({
      type: 'depart/saveDepart',
      payload: { ...fields, id: this.state.item.id },
      callback: this.showSuccess,
    });
    this.setState({
      item: Object.assign({}, newItem),
    });
  };
  handlDelete = () => {
    if(this.state.item.id){
      this.props.dispatch({
        type: 'depart/deleteDepart',
        payload: this.state.item.id,
        callback:this.showSuccess,
      });
      this.setState({
        item: Object.assign({}, newItem),
      });
    }
  };
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };
  render() {
    const { userMenus, depart: { data }, loading } = this.props;
    const { item } = this.state;
    const parentMethods = {
      handleSave: this.handleSave,
    };
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                loading={loading}
                bordered={false}
                title="部门列表"
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
                <Tree onSelect={this.onTreeSelect}>{this.renderTreeNodes(data.list)}</Tree>
              </Card>
            </Col>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                bordered={false}
                title={item.id ? '编辑部门' : '新建部门'}
                loading={loading}
                extra={
                  <Popconfirm title="您确定要删除该记录？" onConfirm={() =>this.handlDelete()} okText="确定" cancelText="取消">
                    <Button icon="delete" type="danger" style={{ marginBottom: '-14px', marginTop: '-14px' }}>
                      删除
                    </Button>
                  </Popconfirm>
                }
              >
                <CreateForm {...parentMethods} item={item} treeData={data.list} />
              </Card>
            </Col>
          </Row>
        </Spin>
      </PageHeaderLayout>
    );
  }
}