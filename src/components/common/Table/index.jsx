/*
 * @Author: pengzhen
 * @Date:   2016-11-16 15:09:35
 * @Desc: this_is_desc
 * @Last Modified by:   pengzhen
 * @Last Modified time: 2016-12-19 18:33:48
 */

'use strict';
import './index.less';
import React from 'react';
// import Dragula from 'react-dragula';
import { Table, Pagination } from 'antd';
import ajax from 'common/Ajax';

function noop() { }

export default class QTable extends React.Component {
    static propTypes = {
        url: React.PropTypes.any.isRequired,
        columns: React.PropTypes.array.isRequired,
        emptyText: React.PropTypes.node,
        options: React.PropTypes.array,
        onLoad: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired,
    };
    static defaultProps = {
        data: {
            currentPage: 1,
            totalCount: 0,
            list: []
        },
        onLoad: noop,
        onChange: noop
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pageSize: props.pageSize || 10,
            data: {
                currentPage: 1,
                totalCount: 0,
                list: []
            }
        }
    }
    componentWillMount() {
        this.refresh();
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.searchData, this.props.searchData)) {
            this.refresh(nextProps.searchData);
        }
    }
    refresh(params) {
        this.loadData({
            currentPage: 1,
            ...params
        });
    }
    loadData(params) {
        this.setState({
            loading: true
        });
        ajax({
            url: this.props.url,
            data: {
                // currentPage: currentPage + 1,
                pageSize: this.state.pageSize,
                requireTotalCount: true,
                ...this.props.searchData,
                ...params
            },
            success: (data) => {
                this.props.rowSelection && this.props.rowSelection.onChange && this.props.rowSelection.onChange([], []);
                this.setState({
                    loading: false,
                    data: data
                });
                this.props.onLoad(data)
            },
            error: () => {
                console.error(`请求接口[${this.props.url}]异常`);
            }
        })
    }
    getPagination(data) {
        data = {
            ...QTable.defaultProps.data,
            ...data
        }
        const { currentPage, totalCount } = data;
        return {
            current: currentPage,
            total: totalCount,
            pageSize: this.state.pageSize
        };
    }
    getColumns() {
        let columns = [...this.props.columns];
        let sorter = this.props.sorter;
        if (this.props.sorter) {
            columns = columns.map(item => {
                if (item.sorter) {
                    item.sortOrder = sorter.dataIndex == item.dataIndex && (sorter.order == 'asc' ? 'ascend' : 'descend')
                }
                return item;
            });
        }
        if (this.props.options) {
            columns.push({
                title: '操作',
                key: 'options',
                className: 'td-options',
                render: (row) => {
                    return <div>
                        {this.props.options.map((item, i) => {
                            return <a key={i} className='option-btn'
                                onClick={item.onClick && item.onClick.bind(this, row)}>
                                <span className="icon" style={{ color: item.color }}>{item.icon}</span>
                                <span className="text" style={{ background: item.color }}>{item.text}</span>
                            </a>
                        })}
                    </div>
                }
            })
        }
        return columns;
    }
    handPaginationChange = (currentPage) => {
        this.loadData({
            currentPage
        })
    }
    onChange = (pagination, filters, sorter) => {
        pagination = this.getPagination(this.state.data);
        this.props.onChange(pagination, filters, sorter);
        this.props.onSorterChange && this.props.onSorterChange({
            dataIndex: sorter.field,
            order: sorter.order == 'ascend' ? 'asc' : 'desc',
        });
    }
    changePageSize = (current, pageSize) => {
        this.setState({
            pageSize
        }, this.refresh);
    }
    render() {
        const {
            rowKey,
            className,
            emptyText,
            rowSelection,
            showSizeChanger = true,
            showTotalCount = true
        } = this.props;
        const data = this.state.data;
        const pagination = this.getPagination(data);
        const dataSource = data.list;
        return (
            <div className={'q-table-wrapper ' + (className || '')}>
                <Table
                    rowKey={rowKey}
                    columns={this.getColumns()}
                    dataSource={dataSource}
                    loading={this.state.loading}
                    pagination={false}
                    onChange={this.onChange}
                    rowSelection={rowSelection}
                    locale={{
                        emptyText: emptyText || <div className="table-empty">未找到相关数据</div>
                    }}
                />
                {!this.props.hidePager &&
                    <div className="pagination-wrap">
                        {showTotalCount && <span className="total-box">
                            当前第 {pagination.current || 0}-{pagination.pageSize || 0} 条
                            &nbsp;&nbsp;共计 {pagination.total || 0} 条
                        </span>}
                        <Pagination
                            {...pagination}
                            showSizeChanger={showSizeChanger}
                            pageSizeOptions={['10', '20', '30', '40']}
                            onChange={this.handPaginationChange}
                            onShowSizeChange={this.changePageSize}
                        />
                    </div>}
            </div>
        );
    }
}
