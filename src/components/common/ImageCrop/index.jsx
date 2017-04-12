/*
 * @Author: pengzhen
 * @Date:   2016-12-12 14:22:51
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-22 16:32:07
 */

'use strict';
import './index.less';
import React from 'react';
import ReactCrop from './ReactCrop.jsx';
import {
    Button
} from 'antd';

export default class ImageCrop extends React.Component {
    static propTypes = {
        src: React.PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            crop: this.getDefaultCrop(),
            pixelCrop: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
    }
    getDefaultCrop() {
        return {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            aspect: this.props.aspect
        };
    }
    getContainerSize() {
        let width = 200;
        return {
            width: width,
            height: this.props.aspect ? width / this.props.aspect : width
        }
    }
    handleChange = (crop, pixelCrop) => {
        this.setState({
            crop,
            pixelCrop
        });
    }
    onImageLoaded = (crop, image, pixelCrop) => {
        this.setState({
            crop,
            pixelCrop,
        });
    }
    handleSelectFile = (e) => {
        let file, base64;
        let call = this.props.onSelect || function() {};
        if (e.dataTransfer) {
            file = e.dataTransfer.files[0];
        } else if (e.target) {
            file = e.target.files[0];
        }
        if (typeof FileReader === 'undefined') {
            call(file, base64);
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                base64 = reader.result;
                call(file, base64);
            };
        }
    }
    handleSubmit = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.pixelCrop)
    }
    renderPriviewStyle() {
        const {
            src
        } = this.props;

        const {
            pixelCrop = {}
        } = this.state;

        const container = this.getContainerSize();

        let width, height, scale;
        if (pixelCrop.width / pixelCrop.height >= container.width / container.height) {
            scale = container.width / pixelCrop.width;
            width = '100%';
            height = scale * pixelCrop.height || 0;
        } else {
            scale = container.height / pixelCrop.height;
            height = '100%';
            width = scale * pixelCrop.width || 0;
        }
        let style1 = {
            width,
            height,
        }
        let style = {
            left: -(pixelCrop.x * scale || 0),
            top: -(pixelCrop.y * scale || 0),
            transform: `scale(${scale})`,
        }
        return <div className="preview-image" style={style1}>
            <img src={src} style={style} />
        </div>
    }
    renderUploader(title) {
        return <div className='upload-btn ant-btn-primary'>
            <label className='upload-wrapper'>
                {title}
                <input type='file' onChange={this.handleSelectFile} />
            </label>
        </div>
    }
    render() {
        const {
            src,
            cropProps = {},
        } = this.props;
        const {
            crop,
        } = this.state;

        return (
            <div className='image-crop'>
                <div className="crop-container-wrapper">
                    <div className="crop-container">
                        {src && <ReactCrop
                            style={{
                                width: 400,
                                height: 300
                            }}
                            crop={crop}
                            src={src}
                            onChange={this.handleChange}
                            onImageLoaded={this.onImageLoaded}
                            {...cropProps}
                        />}
                    </div>
                    <div className="btn-box">
                        <Button type='primary' onClick={this.handleSubmit}>保存</Button>
                        {this.renderUploader(src && '重新选择' || '请选择图片')}
                    </div>
                </div>
                <div className="preview">
                    <h4>裁剪预览</h4>
                    <div className="preview-image-wrapper" style={this.getContainerSize()}>
                        {this.renderPriviewStyle()}
                    </div>
                </div>
            </div>
        );
    }
}
