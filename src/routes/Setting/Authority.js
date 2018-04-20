import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin,Row,Col,Select , Divider,  Card,Button,Form,Tree,Input,Radio,Slider,TreeSelect,message,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {formatterTreeSelect} from '../../utils/utils.js'

const newItem={name:'',url:'',description:'',method:'',onlySa:false,sort:0}
const FormItem = Form.Item;
const newLocal = Tree.TreeNode;
const TreeNode = newLocal;
const RadioGroup = Radio.Group;
const newLocal1 = Select.Option;
const Option = newLocal1;
const { TextArea } = Input;
const CreateForm = Form.create({})(props => {
  const { form, handleSave, item,treeData } = props;
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
        {form.getFieldDecorator('name', {initialValue: item.name,
          rules: [{ required: true, message: '请输入权限名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限URL">
        {form.getFieldDecorator('url', {initialValue: item.url,
          rules: [{ required: true, message: '请输入权限URL...' }],
        })(<Input placeholder="请输入"  maxLength="50" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级权限">
        {form.getFieldDecorator('pid',{initialValue: item.pid ? item.pid.toString() : null,
        rules:[{pattern:new RegExp(`^(?!${item.id}$)`),message:'不能选择自己为父级'}]})(
          <TreeSelect  
            treeData={formatterTreeSelect(treeData)}
            placeholder="Please select"
            allowClear
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限描述">
        {form.getFieldDecorator('description',{initialValue: item.description})(<TextArea row={3} maxLength={100} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限方法">
        {form.getFieldDecorator('method',{initialValue: item.method})(
          <Select style={{ width: 120 }}>
            <Option value="ALL">ALL</Option>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        )}
      </FormItem>      
      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="仅超管可见">
        {form.getFieldDecorator('onlySa', {initialValue: item.onlySa})(
          <RadioGroup>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限序号">
        {form.getFieldDecorator('sort', {initialValue: item.sort})(<Slider />)}
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

@connect(({ global, authority, loading }) => ({
  userMenus: global.userMenus,
  authority,
  loading: loading.models.authority,
}))
export default class Authority extends PureComponent {
  state = {
    item:Object.assign({},newItem),
  }
  componentWillMount() {
    this.props.dispatch({ type: 'authority/fetch' });
  };  
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
  showSuccess=()=>{
    message.success('操作成功');
  };
  handleSave = fields => {
    this.props.dispatch({
      type: 'authority/saveAuthority',
      payload: {...fields,id:this.state.item.id},
      callback:this.showSuccess,
    });
    this.setState({
      item:Object.assign({},newItem),
    });
  };
  handlDelete = () => {
    if(this.state.item.id){
      this.props.dispatch({
        type: 'authority/deleteAuthority',
        payload: this.state.item.id,
        callback:this.showSuccess,
      });
      this.setState({
        item: Object.assign({}, newItem),
      });
    }
  };
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}  >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} />;
    });
  };
  render() {
    const { userMenus, authority: { data }, loading } = this.props;
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
                title="权限列表"
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
                <Tree onSelect={this.onTreeSelect} defaultExpandAll>{this.renderTreeNodes(data.list)}</Tree>
              </Card>
            </Col>
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
              <Card
                bordered={false}
                title={item.id ? '编辑权限' : '新建权限'}
                loading={loading}
                extra={
                  <Popconfirm title="您确定要删除该记录？" onConfirm={() =>this.handlDelete()} okText="确定" cancelText="取消">
                    <Button icon="delete" type="danger" style={{ marginBottom: '-14px', marginTop: '-14px' }}>
                      删除
                    </Button>
                  </Popconfirm>
                }
              >
                <CreateForm ref={this.saveFormRef} {...parentMethods} item={item} treeData={data.list} />
              </Card>
            </Col>
          </Row>
        </Spin>
      </PageHeaderLayout>      
    );
  };
}