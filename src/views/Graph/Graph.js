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
import { Data } from '../../utils/Data';
import Select from 'react-select';
import Chart from 'react-apexcharts';
require('../custom.css');

let contentData = []
const CryptoJS = require("crypto-js");
const generateColors = (leng) => {
  let colors = []
  for(let i = 0; i < leng ; i++){
    const gen = '#'+(Math.random()*0xFFFFFF<<0).toString(16)
    colors.push(`${gen}`)
  }
  return colors
}
const createOption = (label: string, value) => ({
  label,
  value: value,
});

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
        selectedOption: null,
        selectedOptionValue: [],
        selectedOptionKbli : null,
        selectedOptionValueKbli : [],
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
        series: [{
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
              breakpoint: undefined,
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
 
   handleChangeSelectOptKbli = selectedOptionKbli => {
    if(selectedOptionKbli !== null){
      console.log(selectedOptionKbli)
      const id_row = selectedOptionKbli.map((key) => {
        return key.value
      })
        postingDataAPI('kbli/row',{id_row})
          .then(result => result.data)
          .then(data => {
              let series = []
              const price = data.map((key) => {
                 const title = `${key.title}`
                 const price = JSON.parse(key.price)
                 let minprice = []
                 let maxprice = []
                 const formatData = price.map((key) => {
                    minprice.push(key.min_price)
                    maxprice.push(key.max_price)
                 })
                 series.push({ name : `Min Price ${title}`, data : minprice})
                 series.push({ name : `Max Price ${title}`, data : maxprice})
              })
              const leng = series.length
              const colors = generateColors(leng)
              this.setState({
                  series,          
                  chartOptionsArea : {
                      ...this.state.chartOptionsArea,
                      colors
                  },
                })
          })
          .catch(error => console.log(error))
        // const json = JSON.parse(result.price)
        // const data =  json.map(key => key.min_price)
        // this.setState({
        //   selectedOptionValue,
          // chartOptionsArea : {
          //     ...this.state.chartOptionsArea,
          //   xaxis : {
          //     ...this.state.chartOptionsArea.xaxis,
          //     categories,
          //   }
          // },
        //   series : [{ name : "First", data}]
        // })
    }
    this.setState({ selectedOptionKbli });
  };
  handleChangeSelectOpt = selectedOption => {
    if(selectedOption !== null){
      console.log(selectedOption)
    }
    this.setState({ selectedOption });
  };
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
  const generateData = Data()
  let selectedOptionValue = [] , selectedOptionValueKbli = []
  const categories = generateData.map(key => {
    selectedOptionValue.push(createOption(`Max Price ${key.toString()}`,`max_price_${key.toString()}`))
    selectedOptionValue.push(createOption(`Min Price ${key.toString()}`,`min_price_${key.toString()}`))
    return key.toString()
  })
  if(isAuthenticated){
    fetchingDataAPI('kbli')
    .then(result => {
        selectedOptionValueKbli = result.map((key) => createOption(`${key.level_1}.${key.level_2}.${key.level_3}.${key.level_4}.${key.level_5} 
          - ${key.title}`,key.id_row))
        this.setState({
          selectedOptionValue,
          selectedOptionValueKbli,
          chartOptionsArea : {
              ...this.state.chartOptionsArea,
            xaxis : {
              ...this.state.chartOptionsArea.xaxis,
              categories,
            }
          },
        })
        return selectedOptionValueKbli
    })
    .catch(err => console.log(err));
  }
 }
  render() {
    const { selectedOption , selectedOptionValue , 
      selectedOptionKbli, selectedOptionValueKbli } = this.state
    //  if (!this.props.isAuthenticated) {
    //   return (<Redirect to="/login" />);
    // }
    //  if (this.props.isAuthenticated && this.props.level !== 1) {
    //   return (<Redirect to="/dashboard" />);
    // }
    return (
      <div className="animated fadeIn">
        <Row xs="12" lg="12" className="select_row">
            <Col xs="12" lg="12">
                <Select
                value={selectedOptionKbli}
                onChange={this.handleChangeSelectOptKbli}
                options={selectedOptionValueKbli}
                isSearchable = {true}
                placeholder = "KBLI ..."
                isMulti={true}
              />
            </Col>
        </Row>
        <Row xs="12" lg="12">
          <Col xs="12" lg="12">
            <Card className="cardcustom">
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Graph</strong>
              </CardHeader>
              <CardBody className="cardbody-custom">
                  <div id="wrapper">
                      <Chart type="area" options={this.state.chartOptionsArea} series={this.state.series}/>
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


