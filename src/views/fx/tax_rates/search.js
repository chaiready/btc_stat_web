import React, {component} from 'react';
import {Form,InputNumber, Input, DatePicker, Checkbox, Row, Col, Select, Button} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import {connect} from 'react-redux';
import {getTaxRates} from '../../../reducers/actions/fx/tax_rates';
import {PAGE_CATEGORY} from '../../../constants/actionTypes'

let Search = React.createClass({
  getInitialState() {
    return {start_date: "", end_date: ""};
  },
  // 选择日期范围
  dateChange(value1, value2) {
    this.setState({start_date: value2[0]});
    this.setState({end_date: value2[1]});
  },

  handleSubmit(e) {
    e.preventDefault();
    console.log('搜索表单值：', this.props.form.getFieldsValue());
    let params = this.props.form.getFieldsValue();
    params["where"] = params["where"] || {}
    if (this.state.start_date) {
      params["where"]["created_at"] = {};
      params["where"]["created_at"]["gteq"] = this.state.start_date;
      params["where"]["created_at"]["lteq"] = this.state.end_date;
    }

    this.setState({query: params})
    this.props.indexPage.props.getListData(params);
  },

  clearForm(e) {
    e.preventDefault();
    this.props.form.resetFields()
  },
  componentDidMount() {
    console.log(this.props, "--+++++++++rrrrthis")
    this.props.getTaxRates();
  },
  onChange(){

  },

  render() {
    const {getFieldProps} = this.props.form;
    //动态添加账户名字
    //console.log(this.props.tagsData , "------------this.props");
    const categroyOptions = _.map(this.props.tagsData, function (item) {
      console.log( item ,"-------------item,tagsdata")
      return (<Option key={item.id}>{item.user.name}</Option>)
    })
    categroyOptions.unshift(<Option key=" ">全部</Option>);


    return (
        <Form horizontal className="ant-advanced-search-form">
          <Row>
            <Col sm={8}>
              <FormItem id="category_id" label="ID" labelCol={{span: 4}} wrapperCol={{span: 10}}>
                <InputNumber min={1} max={1000} defaultValue={3} onChange={this.onChange.bind(this)} />
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem id="category_item" label="账户" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <Select id="category_select" size="large"
                        defaultValue=" "  {...getFieldProps('where.category_id', {initialValue: ''})}
                        >
                  {categroyOptions}
                </Select>
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem id="tag" label="创建时间" labelCol={{span: 6}} wrapperCol={{span: 14}}>
                <RangePicker onChange={this.dateChange.bind(this)}/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} offset={12} style={{textAlign: 'right'}}>
              <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.clearForm}>清除条件</Button>
            </Col>
          </Row>
        </Form>
    )
  }
})


//===== redux动作 ===
function mapStateToProps(state) {
  console.log(state , "stata+++++++++++++++++++++")
  return {
    tagsData: state.fx_tax_rates.data.tax_rates
  };
}
function mapDispatchToProps(dispatch) {
  return {
        getTaxRates: (params) => dispatch(getTaxRates(params))
  }
}
Search = Form.create()(Search);

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Search);
