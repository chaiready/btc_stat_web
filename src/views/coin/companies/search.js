import React, {Component} from 'react';
import {Form, Radio, Input, DatePicker, Checkbox, Row, Col, Select, Button} from 'antd';
import {push} from 'react-router-redux'
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import {connect} from 'react-redux';
import {getDateRange, getDateRangeByYear} from '../../../utils/helper';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class SearchPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modeType: 0,
      dateRangeMode: "",
      dateMode: 2,
      star_level: "all",
      country_code: "all",
      start_date: "", end_date: "", dateRange: null
    };
  }


  componentDidMount() {
    // this.props.getCompanies({});
  }


  handleSubmit() {
    let params = this.props.form.getFieldsValue() || {};

    if (this.state.dateRange && this.state.dateRange.length > 1) {
      params["from_date"] = this.state.dateRange[0].format("YYYY-MM-DD");
      params["to_date"] = this.state.dateRange[1].format("YYYY-MM-DD");
    }
    if (this.state.star_level != "all") {
      params["star_level"] = this.state.star_level;
    }
    if (this.state.country_code != "all") {
      params["country_code"] = this.state.country_code;
    }
    console.log("data: 搜索参数22", params, this.props)
    params["page"] = 1;
    this.props.pushQuery({
      pathname: this.props.pathname,
      query: params
    })
  }

  clearForm(e) {
    e.preventDefault();
    this.props.form.resetFields();
    this.setState({dateRange: []})
    this.setState({dateRangeMode: ""})
    this.setState({star_level: "all"})
    this.setState({country_code: "all"})
    this.props.pushQuery({
      pathname: this.props.pathname
    })
  }

  setStarLevel(e) {
    let star_level = e.target.value;
    this.setState({star_level: star_level}, () => {
      this.handleSubmit()
    });
  }

  setCountryCode(e) {
    let country_code = e.target.value;
    this.setState({country_code: country_code}, () => {
      this.handleSubmit()
    });
  }

  // 选择日期范围
  dateChange(value1, value2) {
    console.log("ddd===", value1)
    this.setState({dateRange: value1}, () => {
      this.handleSubmit()
    });
  }

  onDayRangeChange(e) {
    let dayType = e.target.value;
    let range = getDateRange(dayType);
    this.setState({dateRangeMode: dayType, dateRangeYearMode: "", dateRange: range}, () => {
      this.handleSubmit()
    })
  }

  onDayModeChange(e) {
    let modeType = e.target.value;
    this.setState({dateMode: modeType})
  }

  onSelectChange(data) {
    console.log("ssss===", data)
  }

  render() {
    let {companiesData} = this.props;
    const {getFieldProps} = this.props.form;

    console.log("ooooo----", companiesData);
    return (
      <Form horizontal>
        <Row gutter={16}>
          <Col sm={8}>
            <FormItem id="tag" label="发布时间" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <RangePicker value={this.state.dateRange} allowClear={false} onChange={this.dateChange.bind(this)}/>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="最近发布" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <RadioGroup defaultValue="" value={this.state.dateRangeMode} onChange={this.onDayRangeChange.bind(this)}>
                <RadioButton value="">全部</RadioButton>
                <RadioButton value="today">今日</RadioButton>
                <RadioButton value="latest_week">最近7天</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col sm={8}>
            <FormItem label="重要程度" labelCol={{span: 6}} wrapperCol={{span: 18}}>
              <RadioGroup defaultValue="all" value={this.state.star_level} onChange={this.setStarLevel.bind(this)}>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="high">重要</RadioButton>
                <RadioButton value="normal">一般</RadioButton>
                <RadioButton value="low">普通</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col sm={8}>
            <FormItem id="tag" label="国际" labelCol={{span: 6}} wrapperCol={{span: 14}}>
              <RadioGroup defaultValue="all" value={this.state.country_code} onChange={this.setCountryCode.bind(this)}>
                <RadioButton value="all">全部</RadioButton>
                <RadioButton value="cn">中国</RadioButton>
                <RadioButton value="unknow">未知</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={12} style={{textAlign: 'right'}}>
            {/*<Button type="primary" onClick={this.handleSubmit.bind(this)}>搜索</Button>*/}
            <Button onClick={this.clearForm.bind(this)}>清除条件</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

let Search = Form.create({withRef: true})(SearchPanel);

export  default  Search;
