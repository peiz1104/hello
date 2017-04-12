import React from 'react';
import echarts from 'echarts/dist/echarts';
import * as DomUtils from 'common/utils/dom';

var color = ['#f59b50', '#5b9cd6', '#ed7d31', '#c23531', '#314656', '#61a0a8', '#dd8668', '#91c7ae', '#6e7074', '#61a0a8', '#bda29a', '#44525d', '#c4ccd3'];

var Echarts = {};


class LivePortraitLine extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
    };
    static defaultProps = {
        type: 'bar'
    };
    constructor(props) {
        super(props);
        this.id = 'chart_' + (~~(Math.random() * 100000));
        this.state = {
            portraitBarOption: {
                title: {
                    text: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    show: false,
                    data: [],
                    y: 'bottom'
                },
                calculable: true,
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    name: '',
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            width: 2,
                            color: '#388ecb'
                        }
                    }
                }]
            }
        }
    }

    componentWillReceiveProps(nextProps = {}) {
        if (this.props.data == nextProps.data) {
            return
        }
        this.loadDate(nextProps.data)
        this.resize();
    }
    componentDidMount = () => {
        this.loadDate(this.props.data || {});
    }
    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    loadDate = (data) => {
        if (!data) {
            return;
        }
        var charts = document.getElementById(this.id);
        this.mychart = echarts.init(charts);
        setTimeout(() => {
            this.initChart(data);
        }, 0);
    }
    initChart = (data) => {
        let portraitBarOption = this.state.portraitBarOption;
        portraitBarOption.legend.data = [];
        portraitBarOption.xAxis[0].data = data.xAxis;
        portraitBarOption.title.text = data.title;
        portraitBarOption.series = (data.data || []).map((item, i) => {
            portraitBarOption.legend.data.push(item.name);
            return {
                name: item.name,
                type: this.props.type,
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        // formatter: (data) => {
                        //     return `${data.value}人`
                        // }
                    }
                },
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                },
                data: item.data
            }
        });
        // this.setState({
        //     portraitBarOption: portraitBarOption
        // });
        this.mychart && this.mychart.setOption(portraitBarOption);
        this.listener = DomUtils.addEventListener(window, 'resize', () => {
            this.resize();
        })
    }

    resize = () => {
        this.mychart && this.mychart.resize();
    }
    render() {
        return (
            <div>
                <div id={this.id} style={{ height: '300px' }}> </div>
            </div>
        );
    }
}




var QuestionTitleBar = React.createClass({

    render: function () {
        var question_text = this.props.data.question_text;
        var question_id = this.props.data.question_id;
        question_text = '第' + (this.props.index + 1) + '题：' + question_text;
        var questionType = this.props.data.question_type == 'S' ? (<div className="questionType">[单选题]</div>) : (<div className="questionType">[多选题]</div>);
        return (
            <div className="questionTitle">{question_text}{questionType}</div>
        )
    }
});

class TransverseBar extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,

    };

    constructor(props) {
        super(props);
        this.id = 'chart_' + (~~(Math.random() * 100000));
        this.state = {
            transverseBarOption: { //横向柱状图
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: []
                }

            }
        }
    }

    componentDidMount = () => {
        this.loadDate(this.props.data || {});
    }

    loadDate = (data) => {
        var charts = document.getElementById(this.id);
        this.mychart = echarts.init(charts);
        this.initChart(data);
    }

    initChart = (data) => {
        var transverseBarOption = this.state.transverseBarOption;
        transverseBarOption.series = this.analysisData(data);
        this.setState({
            transverseBarOption: transverseBarOption
        });
        this.mychart && this.mychart.setOption(transverseBarOption);
        var sup = window.onresize;
        window.onresize = function () {
            sup && sup();
            this.mychart.resize();
        }.bind(this)
    }

    analysisData = (data) => {
        var series = {
            name: '',
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    position: 'right'
                }
            },
            data: []
        };
        var data2 = data.data.data;
        var name = data.data.name;
        for (var j = data2.length - 1; j > -1; j--) {
            this.state.transverseBarOption.yAxis.data.push(name[j]);
            series.name = name[j];
            series.data.push({
                value: data2[j],
                itemStyle: {
                    normal: {
                        color: color[j]
                    }
                }
            })
        }
        return series;
    }

    resize = () => {
        this.mychart && this.mychart.resize();
    }
    componentWillReceiveProps = (nextProps = {}) => {
        if (this.props.data == nextProps.data) {
            return
        }
        this.loadDate(nextProps.data)
        this.resize();
    }
    render() {
        return (
            <div className="question-bar">
                <QuestionTitleBar data={this.props.data} index={this.props.eventKey || 0}></QuestionTitleBar>
                <div id={this.id} style={{ height: '300px' }}> </div>
            </div>
        );
    }
}

class PieBar extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.id = 'chart_' + (~~(Math.random() * 100000));
        this.state = {
            pieOption: {
                title: {
                    text: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    left: 'center',
                    top: '13.5%',
                    data: []
                },
                series: [
                    {
                        name: '考试',
                        type: 'pie',
                        radius: '70%',
                        center: ['50%', '60%'],
                        data: [],
                        label: {
                            normal: {
                                position: 'inside',
                                formatter: '{b} \n({c}人)'
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            }
        }
    }

    componentDidMount = () => {
        this.loadDate(this.props.data || {});
    }

    loadDate = (data) => {
        var charts = document.getElementById(this.id);
        this.mychart = echarts.init(charts);
        this.initChart(data);
    }

    initChart = (data) => {
        let pieOption = this.state.pieOption;
        pieOption.legend.data = [];
        pieOption.title.text = data.title;
        var data1 = data.data;
        pieOption.series[0].data = (data1 || []).map(function (item, i) {
            pieOption.legend.data.push(item.name);
            return {
                name: item.name,
                value: item.value
            }
        });
        this.setState({
            pieOption: pieOption
        });
        this.mychart && this.mychart.setOption(pieOption);
        var sup = window.onresize;
        window.onresize = function () {
            sup && sup();
            this.mychart.resize();
        }.bind(this)
    }

    resize = () => {
        this.mychart && this.mychart.resize();
    }
    componentWillReceiveProps = (nextProps = {}) => {
        if (this.props.data == nextProps.data) {
            return
        }
        this.loadDate(nextProps.data)
        this.resize();
    }
    render() {
        return (
            <div>
                <div id={this.id} style={{ height: '300px' }}> </div>
            </div>
        );
    }
}
Echarts.LivePortraitLine = LivePortraitLine;
Echarts.TransverseBar = TransverseBar;
Echarts.PieBar = PieBar;
export default Echarts;
