import React, { PureComponent} from 'react';
import { connect } from 'dva';
import {Divider,Spin,Row,Col, Tree, Icon,Card,Button,Form,Input,Slider,TreeSelect,message,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {formatterTreeSelect} from '../../utils/utils.js'

const newItem={name:'',path:'',onlySa:false,sort:0}
const FormItem = Form.Item;
const newLocal = Tree.TreeNode;
const TreeNode = newLocal;
const CreateForm = Form.create({
  onValuesChange(props, changedFields) {
   if(changedFields.icon){
      props.onChange(changedFields);
    }
  },
})(props => {
  const { form, handleSave, item,treeData,icon } = props;
  const onCancle = () => {
    form.resetFields();
    props.onChange({icon:item.icon});
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单名称">
        {form.getFieldDecorator('name', {initialValue: item.name,
          rules: [{ required: true, message: '请输入菜单名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单URL">
        {form.getFieldDecorator('path', {initialValue: item.path,
          rules: [{ required: true, message: '请输入菜单URL...' }],
        })(<Input placeholder="请输入"  maxLength="50" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单图标">
        {form.getFieldDecorator('icon',{initialValue: item.icon,})(<Input placeholder="请输入" addonBefore={<Icon type={icon} />} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级菜单">
        {form.getFieldDecorator('pid',{initialValue: item.pid ? item.pid.toString() : null,
        rules:[{pattern:new RegExp(`^(?!${item.id}$)`),message:'不能选择自己为父级'}]})(
          <TreeSelect
            style={{ width: 300 }}
            treeData={formatterTreeSelect(treeData)}
            placeholder="Please select"
            treeDefaultExpandAll
            onChange={this.onChange}
            allowClear
          />
        )}
      </FormItem>
      {/* <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="仅超管可见">
        {form.getFieldDecorator('onlySa', {initialValue: item.onlySa})(
          <RadioGroup>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单序号">
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

@connect(({ global, menu, loading }) => ({
  userMenus: global.userMenus,
  menu,
  loading: loading.models.menu,
}))
export default class Menu extends PureComponent {
  state = {
    item:Object.assign({},newItem),
    icon:'',
  }
  componentWillMount() {
    this.props.dispatch({ type: 'menu/fetch' });
  };  
  onTreeSelect = (selectedKeys, info) => {
    this.setState({
      item: Object.assign({}, info.node.props.dataRef),
      icon:info.node.props.dataRef.icon,
    });
    this.formRef.resetFields();
  };
  onNewBtnClick = () => {
    this.setState({
      item: Object.assign({}, newItem),
      icon:'',
    });
    this.formRef.resetFields();
  };
  handleFormChange=(changedFields) => {
    this.setState({
      icon: changedFields.icon,
    });
  };
  showSuccess=(response)=>{
    message.success('操作成功');
    this.props.dispatch({ type: 'global/changeMenu',payload:response.userMenus });
  };
  handleSave = fields => {
    this.props.dispatch({
      type: 'menu/saveMenu',
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
        type: 'menu/deleteMenu',
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
    const { userMenus, menu: { data }, loading } = this.props;
    const { item ,icon} = this.state;
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
                <Tree showLine onSelect={this.onTreeSelect} defaultExpandAll>{this.renderTreeNodes(data.list)}</Tree>
              </Card>
            </Col>
            <Col xl={16} lg={16} md={16} sm={24} xs={24}>
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
                <CreateForm onChange={this.handleFormChange} ref={this.saveFormRef} {...parentMethods} icon={icon} item={item} treeData={data.list} />
              </Card>
            </Col>
          </Row>
        </Spin>  
      </PageHeaderLayout>      
    );
  };
}