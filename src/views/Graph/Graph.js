import React, { Component } from 'react';
import { Form, Input, Badge, Card, CardBody, CardHeader, Col, Row, Table, Button , Alert, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup , InputGroupAddon , InputGroupText } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import * as moment from 'moment/moment';
import { connect } from 'react-redux';
import { fetchingDataAPI , putDataAPI , deleteData , postingDataAPI } from '../../utils/AxiosMethod';
import { toDateTimeLocal, toDateTimeLocalDB } from '../../utils/Helper';
import { actionCheckExpired , deleteUser, deleteToken, setAuthenticated  } from '../../utils/Action';
import { Redirect } from 'react-router-dom';
import Chart from 'react-apexcharts'
let contentData = []
const CryptoJS = require("crypto-js");
function generateDayWiseTimeSeries(baseval, count, yrange) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = baseval;
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
      }
      return series;
    }

    // The global window.Apex variable below can be used to set common options for all charts on the page
const Apex = {
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      toolbar: {
        tools: {
          selection: false
        }
      },
      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      tooltip: {
        followCursor: false,
        theme: 'dark',
        x: {
          show: false
        },
        marker: {
          show: false
        },
        y: {
          title: {
            formatter: function () {
              return ''
            }
          }
        }
      },
      grid: {
        clipMarkers: false
      },
      yaxis: {
        tickAmount: 2
      },
      xaxis: {
        type: 'datetime'
      },
    }
class Graph extends Component {
 constructor(props) {
   super(props);
   this.state = {
        data : [],
        startDateDR: moment().subtract(30, 'days'),
        endDate: moment(),
        labelCal: 'Filter By Date',
        modal: false,
        token : '',
        level : '',
        postData : {
          notification : '',
          isFetching : true,
          status : '',
          visible: true,
        },
        cellEditProp : {
          mode: 'click',
          blurToSave: true,
          afterSaveCell: this.onAfterSaveCell // a hook for after saving cell
        },
        series3: [{
          name: "Max Price",
          data: [12,20,420,102,22,402]
        },{
          name: "Min Price",
          data: [10,20,40,102,203,402]
        }],
        chartOptionsArea: {
          chart: {
            id: 'yt',
            group: 'social',
            type: 'area',
            toolbar: {
                show: true
              },
            shadow: {
              enabled: true,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 1
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [{
              breakpoint: 480,
              options: {
                legend: {
                  show:true,
                  position: 'bottom',
                  offsetX: -10,
                  // offsetY: 0
                }
              }
            }],
           fill: {
              opacity: 1,
            },
          colors: ['#00E396','#545454'],
          dataLabels: {
              enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Klasifikasi Baku Lapangan Usaha Indonesia',
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 6
          },
          yaxis: {
              labels : {
                minWidth : 10
              },
              tickAmount: 2
            },
          xaxis: {
            type: 'datetime',
            categories: ['2019-05-01', '2019-05-11', '2019-06-12', '2019-06-21',
              '2019-07-01', '2019-07-12'
            ],
          },
        }
   };

   this.onChangeDatePicker = this.onChangeDatePicker.bind(this);

 }
 
  onChangeDatePicker = (event, picker) =>{
      const dataTime = {
          start : toDateTimeLocalDB(picker.startDate._d),
          end : toDateTimeLocalDB(picker.endDate._d)
      }
      if(event.handleObj.type === 'apply'){
        postingDataAPI('/user/createtime',dataTime).then(res => {
          return res.data
        })
        .then(data => {
          this.setState({data,
                postData : {
                  isFetching : true,
                  status : 'info',
                  notification : `Success Filtered Data From ${dataTime.start} to ${dataTime.end}`
              },
              labelCal: (`${dataTime.start} s/d ${dataTime.end}`)
          })
        })
        .catch(err => console.log(err))
    }
  }

 componentWillUnmount(){

 }

 componentWillMount(){
  const { token , isAuthenticated } = this.props
  this.props.checkToken(token.token)
}
 componentDidMount(){
  const { isAuthenticated , level } = this.props
  if(isAuthenticated){
    postingDataAPI('/kbli/sps',{ level_1:1 }).then(result => result.data)
    .then(data => {
        console.log(data)
        this.setState({
          chartOptionsArea : {
            ...this.state.chartOptionsArea,
            xaxis : {
              ...this.state.chartOptionsArea.xaxis,
              categories : ['2019-01-01', '2019-02-11', '2019-03-12', '2019-04-21',
                '2019-05-01', '2019-05-12'
              ],
            }
          }
        })
    })
    .catch(err => console.log(err));
  }
 }
  render() {
     if (!this.props.isAuthenticated) {
      return (<Redirect to="/login" />);
    }
     if (this.props.isAuthenticated && this.props.level !== 1) {
      return (<Redirect to="/dashboard" />);
    }
    return (
      <div className="animated fadeIn">
        <Row xs="12" lg="12">
          <Col xs="12" lg="12">
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>User List</strong>
              </CardHeader>
              <CardBody>
                 <div className='form-group'>
                  <DateRangePicker 
                    startDate={this.state.startDateDR} 
                    endDate={this.state.endDate}
                    onEvent={this.onChangeDatePicker}
                    showWeekNumbers
                    >
                    <Button onClick={this.onClick}>
                      <i className="fa fa-calendar"/>
                      <span> {this.state.labelCal}</span>                          
                    </Button>            
                  </DateRangePicker>
                </div>
                  <div id="wrapper">
                      <Chart type="area" options={this.state.chartOptionsArea} series={this.state.series3}/>
                  </div>
              </CardBody>
            </Card>

          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({  isAuthenticated : state.isAuthenticated, token : state.token , level : state.user.level });
const mapDispatchToProps = dispatch => {
  return {
    checkToken : (values) => dispatch(actionCheckExpired(values)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph);


