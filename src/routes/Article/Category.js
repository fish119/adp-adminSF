import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Tree,
  Button,
  Spin,
  Form,
  Input,
  Slider,
  TreeSelect,
  message,
  Popconfirm,
  Divider,
} from 'antd';
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别名称">
        {form.getFieldDecorator('name', {
          initialValue: item.name,
          rules: [{ required: true, message: '请输入类别名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级类别">
        {form.getFieldDecorator('pid', {
          initialValue: item.pid ? item.pid.toString() : null,
          rules: [{ pattern: new RegExp(`^(?!${item.id}$)`), message: '不能选择自己为父级' }],
        })(
          <TreeSelect
            treeData={formatterTreeSelect(treeData)}
            placeholder="Please select"
            allowClear
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类别序号">
        {form.getFieldDecorator('sort', { initialValue: item.sort })(<Slider />)}
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

@connect(({ global, article, loading }) => ({
  userMenus: global.userMenus,
  article,
  loading: loading.models.article,
}))
export default class Category extends PureComponent {
  state = {
    item: Object.assign({}, newItem),
  };
  componentWillMount() {
    this.props.dispatch({ type: 'article/fetchCategories' });
  }
  onTreeSelect = (selectedKeys, info) => {
    this.setState({
      item: Object.assign({}, info.node.props.dataRef),
    });
    this.formRef.resetFields();
  };
  onNewBtnClick = () => {
    this.setState({
      item: Object.assign({}, newItem),
    });
    this.formRef.resetFields();
  };
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  showSuccess = () => {
    message.success('操作成功');
  };
  handleSave = fields => {
    this.props.dispatch({
      type: 'article/saveCategory',
      payload: { ...fields, id: this.state.item.id },
      callback: this.showSuccess,
    });
    this.setState({
      item: Object.assign({}, newItem),
    });
  };
  handlDelete = () => {
    if (this.state.item.id) {
      this.props.dispatch({
        type: 'article/deleteCategory',
        payload: this.state.item.id,
        callback: this.showSuccess,
      });
      this.setState({
        item: Object.assign({}, newItem),
      });
    }
  };
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children && !item.isDeleted) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return item.isDeleted ? null : <TreeNode {...item} dataRef={item} />;
    });
  };
  render() {
    const { userMenus, article: { data }, loading } = this.props;
    const { item } = this.state;
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Card
                loading={loading}
                bordered={false}
                title="类别列表"
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
                <Tree showLine onSelect={this.onTreeSelect} defaultExpandAll>
                  {this.renderTreeNodes(data.categories)}
                </Tree>
              </Card>
            </Col>
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
              <Card
                bordered={false}
                title={item.id ? '编辑类别' : '新建类别'}
                loading={loading}
                extra={
                  <Popconfirm
                    title="删除类别将删除所有子类和信息，您是否确定删除？"
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
                  handleSave={this.handleSave}
                  item={item}
                  treeData={data.categories}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
