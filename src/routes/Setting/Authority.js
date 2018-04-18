import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Select , Divider, Table, Card,Button,Form,Modal,Input,Radio,Slider,TreeSelect,message,Popconfirm } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from '../../layouts/TableList.less';
import {formatterTree} from '../../utils/utils.js'

const newItem={name:'',url:'',description:'',method:'',onlySa:false,sort:0}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const newLocal = Select.Option;
const Option = newLocal;
const { TextArea } = Input;
const CreateForm = Form.create({
  onValuesChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      name: Form.createFormField({
        value: props.item.name,
      }),
      url: Form.createFormField({
        value: props.item.url,
      }),
      description: Form.createFormField({
        value: props.item.description,
      }),
      method: Form.createFormField({
        value: props.item.method,
      }),
      onlySa: Form.createFormField({
        value: props.item.onlySa,
      }),
      sort: Form.createFormField({
        value: props.item.sort,
      }),
      pid: Form.createFormField({
        value: props.item.pid?props.item.pid.toString():'',
      }),
    };
  },
})(props => {
  const { modalVisible, form, handleSave, handleModalVisible ,item,treeData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSave(fieldsValue);
    });
  };
  
  return (
    <Modal
      id="authorityModal"
      title={item!=null?"编辑权限":"新建权限"}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false,{name:'',path:'',onlySa:false,sort:0})}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入权限名称...' }],
        })(<Input placeholder="请输入" maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限URL">
        {form.getFieldDecorator('url', {
          rules: [{ required: true, message: '请输入权限URL...' }],
        })(<Input placeholder="请输入"  maxLength="10" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父级权限">
        {form.getFieldDecorator('pid',{})(
          <TreeSelect
           
            style={{ width: 300 }}           
            treeData={formatterTree(treeData)}
            placeholder="Please select"
            onChange={this.onChange}
            allowClear
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限描述">
        {form.getFieldDecorator('description',{})(<TextArea row={3} maxLength={100} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限方法">
        {form.getFieldDecorator('method',{})(
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
        {form.getFieldDecorator('onlySa', {})(
          <RadioGroup>
            <Radio value>是</Radio>
            <Radio value={false}>否</Radio>
          </RadioGroup>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限序号">
        {form.getFieldDecorator('sort', {})(<Slider />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ global, authority, loading }) => ({
  userMenus: global.userMenus,
  authority,
  loading: loading.models.authority,
}))
export default class Authority extends PureComponent {
  state = {
    modalVisible: false,
    item:Object.assign({},newItem),
  }
  componentWillMount() {
    this.props.dispatch({ type: 'authority/fetch' });
  };  
  handleModalVisible = (flag,record) => {
    this.setState({
      modalVisible: !!flag,
      item:record,
    });
  };
  handleFormChange=(changedFields) => {
    this.setState({
      item: Object.assign(this.state.item,changedFields)
    });
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
      modalVisible: false,
      item:Object.assign({},newItem),
    });
  };
  handlDelete = (param) => {
    this.props.dispatch({
      type: 'authority/deleteAuthority',
      payload: param.id,
      callback:this.showSuccess,
    });
  };
  columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: '权限URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '权限方法',
      dataIndex: 'method',
      key: 'method',
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
      render: (text, record) => (
        <Fragment>
          <Button type="primary" ghost onClick={() => this.handleModalVisible(true,Object.assign({},record))}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="您确定要删除该记录？" onConfirm={() =>this.handlDelete(record)} okText="确定" cancelText="取消">
            <Button type="danger" ghost>删除</Button>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  render() {
    const { userMenus, authority: { data }, loading } = this.props;
    const { modalVisible,item } = this.state;
    const parentMethods = {
      handleSave: this.handleSave,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout userMenus={userMenus}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button style={{marginBottom:'1em'}}  icon="plus" type="primary" onClick={() => this.handleModalVisible(true,Object.assign({},newItem))}>
                新建
              </Button>
            </div>
            <Table
              // selectedRows={selectedRows}
              pagination={false}
              loading={loading}
              dataSource={data.list}
              columns={this.columns}            
              // onSelectRow={this.handleSelectRows}
              // onChange={this.handleStandardTableChange}
              rowKey="id"
            />
          </div>
        </Card>
        <CreateForm treeData={data.list} {...parentMethods} modalVisible={modalVisible} item={item} onChange={this.handleFormChange} />
      </PageHeaderLayout>      
    );
  };
}