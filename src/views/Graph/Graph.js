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
        form : {
            password : '',
            re_password : '',
            email : '',
          },
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
        series1: [{
          data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 60
          })
        }],
        series2: [{
          data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 30
          })
        }],
        series3: [{
          data: generateDayWiseTimeSeries(new Date('11 Feb 2017').getTime(), 20, {
            min: 10,
            max: 90
          })
        }],
        chartOptionsLine1: {
          chart: {
            id: 'fb',
            group: 'social',
          },
          markers: {
            size: 6
          },
          colors: ['#008FFB'],
        },
        chartOptionsLine2: {
          chart: {
            id: 'tw',
            group: 'social',

          },
          colors: ['#546E7A'],

        },
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
          colors: ['#00E396'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Average High & Low Temperature',
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
          }
        }
   };
   this.onAfterSaveCell = this.onAfterSaveCell.bind(this)
   this.jobStatusValidator = this.jobStatusValidator.bind(this)
   this.statusType = this.statusType.bind(this)
   this.levelType = this.levelType.bind(this)
   this.emailType = this.emailType.bind(this)
   this.onDismiss = this.onDismiss.bind(this)
   this.togglePassword = this.togglePassword.bind(this);
   this.onChangeDatePicker = this.onChangeDatePicker.bind(this);

 }
  emailType = (cell) => {
    return (<div><Badge color="warning" onClick={ () => this.togglePassword(cell)}><i className="icon-lock"/></Badge>{cell}</div>)
  }
  statusType = (cell) => {
    if(cell == 0){
      return (<Badge color="danger">Off</Badge>)
    }else{
      return (<Badge color="success">On</Badge>)
    }
  }
  levelType = (cell) => {
    if(cell == 0){
      return (<Badge color="secondary">User</Badge>)
    }else{
      return (<Badge color="primary">Admin</Badge>)
    }
  }
  createdType = (cell) => {
    return toDateTimeLocal(cell)
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { form } = this.state
    const { re_password , password , email } = form
    if(re_password === password && password !== undefined && password.length >= 6){
    putDataAPI('password',{password, email}).then(result => {
      if(result.response === 200){
        this.setState({
                 postData : {
                      isFetching : true,
                      status : 'success',
                      notification : `Success Generate New Password`
                  }
              })
      }
    }).catch( err => console.log(err))          
        }else{
              this.setState({
                 postData : {
                      isFetching : true,
                      status : 'danger',
                      notification : `Password not Match / at Least 6 Character`
                  }
              })
        }
  }
  handleChange = (e) => {
    e.preventDefault()
    this.setState({
      form :{
        ...this.state.form,
        [e.target.name] : e.target.value
      }
    })
  }
  onDeleteCell = async (row) => {
   row.map((k,i) => {
      deleteData('user',{ data: {id : k} })
      .then(result => result)
      .catch(err => console.log(err))
   })
      setTimeout( () => {
           this.setState({
            postData : {
              isFetching : true,
              status : 'success',
              notification : 'Success Delete Data'
          }}
      )
      },2000)
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
 onAfterSaveCell = (row, cellName, cellValue) => {

    if(cellName !== 'email'){
      putDataAPI('user',row).then(
      this.setState({
                postData : {
                  isFetching : true,
                  status : 'success',
                  notification : 'Success Update Data'
              }}
      )).catch(err => console.log(err))
    }
  }
  invalidJobStatus = (cell, row) => {
    return 'invalid-jobstatus-class';
  }
  jobStatusValidator = (value) => {
     const arr = [0,1]
     if(!arr.includes(parseInt(value))){
      return alert('0 For OFF , 1 For On');
     }
    return true;
  }
  togglePassword(v) {
    this.setState(prevState => ({
      modal: !prevState.modal,
      form : {
        email : v,
      }
    }));
  }
  onDismiss = () => {
    this.setState({ postData : {visible: false} });
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
    fetchingDataAPI('user').then(result => {
      this.setState({
        data : result,
        level : level
      })
    }).catch(err => console.log(err));
  }
 }
  render() {
    const { cellEditProp , data , postData , form  } = this.state
    const { email , password , re_password } = form
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      showOnlySelected: true,
      onlyUnselectVisible: true,
      columnWidth :'60px',
      bgColor: 'lightblue',
    };

    const options = {
      paginationShowsTotal: this.renderShowsTotal,
      exportCSVBtn:this.createCustomExportCSV,
      showSelectedOnlyBtn: this.ShowSelectedOnlyButton,
      onDeleteRow  : this.onDeleteCell,
      onRowClick: function(row, columnIndex, rowIndex, e){
          // if(columnIndex === 3){
          //     alert(`Kamu menekan sekali baris dengan Device ID: ${row.email} ,${columnIndex},${rowIndex}`);
          // }
        }
    };

     if (!this.props.isAuthenticated) {
      return (<Redirect to="/login" />);
    }
     if (this.props.isAuthenticated && this.props.level !== 1) {
      return (<Redirect to="/dashboard" />);
    }
    return (
      
      <div className="animated fadeIn">
      {
        postData.isFetching && <Alert color={postData.status} isOpen={this.state.visible} toggle={this.onDismiss}>
             {postData.notification}
            </Alert>
      }

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
                    <div id="chart-line">
                      <Chart type="line" height="160"  options={this.state.chartOptionsLine1} series={this.state.series1}/>
                    </div>

                    <div id="chart-line2">
                      <Chart type="line" height="160"  options={this.state.chartOptionsLine2} series={this.state.series2}/>
                    </div>

                    <div id="chart-area">
                      <Chart type="area" height="160"  options={this.state.chartOptionsArea} series={this.state.series3}/>
                    </div>
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


