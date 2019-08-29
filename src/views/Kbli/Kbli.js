import React, { Component } from 'react';
import { Form, Input, Badge, Card, CardBody, CardHeader, Col, Row,  Button , Alert, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup , InputGroupAddon , InputGroupText, ButtonToolbar, ButtonGroup } from 'reactstrap';
import Select from 'react-select';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import * as moment from 'moment/moment';
import { connect } from 'react-redux';
import { fetchingDataAPI , putDataAPI , deleteData , postingDataAPI } from '../../utils/AxiosMethod';
import { toDateTimeLocal, toDateTimeLocalDB } from '../../utils/Helper';
import { actionCheckExpired } from '../../utils/Action';
import { Redirect } from 'react-router-dom';

class Kbli extends Component {
 constructor(props) {
   super(props);
   this.state = {
        data : [],
        tableComponent : [],
        startDateDR: moment().subtract(30, 'days'),
        endDate: moment(),
        labelCal: 'Filter By Date',
        modal: false,
        token : '',
        level : '',
        objectWithMaxProps : [],
        selectedOption: null,
        selectedOptionValue: [],
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
  handleChangeSelectOpt = selectedOption => {
    let { tableComponent, objectWithMaxProps } = this.state
    selectedOption.map(key => {
      if(!tableComponent.includes(key.value)){
        tableComponent.push(key.value)
      }
    })
    this.setState({ selectedOption, tableComponent });
   // console.log(`Option selected:`, selectedOption);
  };

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
  const { token } = this.props
  this.props.checkToken(token.token)
}
 componentDidMount(){
  const { isAuthenticated , level } = this.props
  if(isAuthenticated){
    fetchingDataAPI('kbli').then(result => {
      let emptyBracket = result, 
          json = [], ObjectLeng = 0, 
          indexObject = [], indexWithMaxValue = 0,
          sop = {} , leng = 0 , objectWithMaxProps = []

      result.map((key,index) => {
        json = JSON.parse(key.price)
        json.map(k => {
            return Object.assign(sop, {['max_price_'+k.year] : k.max_price , ['min_price_' + k.year] : k.min_price  })  
          })
          if(ObjectLeng >= Object.keys(sop).length){
            leng = ObjectLeng 
          }else{
            indexWithMaxValue = index
            objectWithMaxProps = Object.keys(sop)
            leng = Object.keys(sop).length
          }
        ObjectLeng = leng
        return Object.assign(emptyBracket[index],sop)
      })
        indexObject = Object.keys(emptyBracket[indexWithMaxValue]).splice(0,10)
      return { emptyBracket , indexObject, objectWithMaxProps}
    })
    .then(res => {
      const selectedOptionValue = res.objectWithMaxProps.map((k,i) => {
        return { value : k , label : k}
      })
      this.setState({
        data : res.emptyBracket,
        tableComponent : res.indexObject,
        level : level,
        selectedOptionValue : selectedOptionValue,
        objectWithMaxProps : res.objectWithMaxProps
      })
    })
    .catch(err => console.log(err));
  }
 }

  render() {
    const { cellEditProp , data , 
            postData , form , 
            tableComponent , objectWithMaxProps,
            selectedOption , selectedOptionValue
          } = this.state
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

    const user = ''
     if (!this.props.isAuthenticated) {
      return (<Redirect to="/login" />);
    }
     if (this.props.isAuthenticated && this.props.level !== 1) {
      return (<Redirect to="/dashboard" />);
    }
    console.log(objectWithMaxProps)
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
                <strong><i className="icon-info pr-1"></i>Kbli List</strong>
              </CardHeader>
              <CardBody>
                <div className='form-group' wdith="40%">
                  <Select
                    value={selectedOption}
                    onChange={this.handleChangeSelectOpt}
                    options={selectedOptionValue}
                    isMulti={true}
                  />
                </div>
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
                 {/*<button onClick={this.getSelectedRowKeys.bind(this)}>Get selected row keys</button>*/}
                 <BootstrapTable data={ data } remote={ this.remote } selectRow={ selectRowProp } cellEdit={ cellEditProp } pagination scrollTop={ 'Bottom' } hover condensed striped exportCSV
                   expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } options={ options } deleteRow={ true } width="100%" keyField='id_row'>
                     {
                        tableComponent.map((column,index) => {
                          return (<TableHeaderColumn key={index} ref={column} dataField={column} filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='left'>{column}</TableHeaderColumn>);
                        })
                    }
                </BootstrapTable>
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

export default connect(mapStateToProps, mapDispatchToProps)(Kbli);


