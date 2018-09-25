import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {Input, Form, Menu as MenuGroup, Upload, Modal, Button, Card, Icon, message} from 'antd';
import {getUpToken, formItemLayout} from '../../utils/helper';
import {API_CONFIG} from '../../config/api';

// 当图片上传成功 ,调用父组件方法 onPicUploadSuccess
// 返回值 {key:imageUrl_key,url:imageUrl}
export  default class SingleUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priviewVisible: false,
      priviewImage: '',
      showUpload: '',
      imageUrl: this.props.pic || null,
      imageUrl_key: null,
      required: this.props.required || false,
      valid_required: false
    };

  }

  componentWillReceiveProps(nextProps) {
    console.log("8888888888888888888888888",nextProps,this.props)
    if (nextProps.pic != this.props.pic) {
      this.setState({
        imageUrl: nextProps.pic,
        imageUrl_key: nextProps.pic?nextProps.pic.split("/").pop():null
      });
    }
    if (nextProps.required != this.props.required) {
      this.setState({required: nextProps.required})
    }
  }

  // componentDidUpdate(prevProps, prevState){
  //   if(this.valid_required){
  //     if(prevState.state!=this.state.imageUrl){
  //       this.set
  //     }
  //   }
  // }
  validate() {
    if (this.state.imageUrl == null) {
      this.setState({error: "请上传图片"})
      return false
    } else {
      this.setState({error: null})
      return true
    }
  }

  render() {
    var that = this;
    const uploadProps = {
      action: 'http://upload.qiniu.com',
      showUploadList: false,
      listType: 'picture-card',
      defaultFileList: [],
      data: (file)=> {
        let image_type=file.type.split("/")[1];
        var timestamp = (new Date()).valueOf();
        var key = timestamp + Math.random();
        file.postData["key"]=key+"."+image_type
        return file.postData;
      },
      onChange: (info)=> {
        if (info.file.status === 'done') {
          let imageUrl_key = info.file.response.key
          let imageUrl = API_CONFIG["qiniu"] + "/" + imageUrl_key + "-thumb";
          // 验证tip
          that.setState({imageUrl: imageUrl, imageUrl_key: imageUrl_key});
          // 当图片上传成功 ,调用父组件方法 onPicUploadSuccess
          that.props.onPicUploadSuccess && that.props.onPicUploadSuccess({key:imageUrl_key,url:API_CONFIG["qiniu"] + "/" + imageUrl_key})
          let error = '';
          if (this.props.required) {
            if (info.fileList.length < 1) {
              error = "请上传图片";
            } else {
              error = ''
            }
          }

          this.setState({error: error})
        }
      },

      beforeUpload(file) {
        //图片类型
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPG) {
          message.error('文件格式不对，请选择png,jpg格式的文件');
        }

        // 图片大小
        let fileSize = that.props.fileSize || 3;
        let isLt2M = file.size / 1024 / 1024 < fileSize;
        if (!isLt2M) {
          message.error('图片过大，请选择小于' + fileSize + "M的文件");
        }
        //不支持转换成变量
        return isLt2M && isJPG && new Promise(function (resolve) {
            let reader = new FileReader(file);
            reader.readAsDataURL(file);
            reader.onload = (e)=> {
              getUpToken().then(function (token) {
                let data = Object.assign(file, {
                  postData: {token: token}
                });
                resolve(data)
              })
            }
          })
      },

      onPreview: (file) => {
        this.setState({
          priviewImage: file.url,
          priviewVisible: true,
        });
      }
    };

    return (
      <div className="single_upload inline">
        <Upload {...uploadProps}>
          {
            this.state.imageUrl ?
              <div><img src={this.state.imageUrl} width={94} height={94} role="presentation"
                        className="avatar"/>
                <div className="tip">修改图片</div>
              </div> :
              <Icon type="plus" className="avatar-uploader-trigger"/>
          }
        </Upload>
        { this.state.error ?
          <p className="error">{this.state.error}</p> : null
        }
        <p className="help">{this.props.help}</p>
      </div>
    )
  }
}
