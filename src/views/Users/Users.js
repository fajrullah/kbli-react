import React, { Component } from 'react';
import { Form, Input, Badge, Card, CardBody, CardHeader, Col, Row, Table, Button , Alert, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup , InputGroupAddon , InputGroupText } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import usersData from './UsersData'
import * as moment from 'moment/moment';
import { connect } from 'react-redux';
import { fetchingDataAPI , putDataAPI , deleteData , postingDataAPI } from '../../utils/AxiosMethod';
import { toDateTimeLocal, toDateTimeLocalDB } from '../../utils/Helper';
import { actionCheckExpired , deleteUser, deleteToken, setAuthenticated  } from '../../utils/Action';
import { Redirect } from 'react-router-dom';
require('../custom.css');
let contentData = []
const CryptoJS = require("crypto-js");
class User extends Component {
 constructor(props) {
   super(props);
   this.state = {
        data : [],
        startDateDR: moment().subtract(30, 'days'),
        endDate: moment(),
        labelCal: 'Filter By Date',
        loading : true ,
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
        level : level,
        loading : false,
      })
    }).catch(err => console.log(err));
  }
 }
  render() {
    const { cellEditProp , data , postData , form , loading } = this.state
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

    const user = usersData.find( user => user.id.toString() === this.props.match.params.id)

    const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]
     if (!this.props.isAuthenticated) {
      return (<Redirect to="/login" />);
    }
     if (this.props.isAuthenticated && this.props.level !== 1) {
      return (<Redirect to="/dashboard" />);
    }
    if(loading){
      return <div> Loading ... </div>
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
            <Card className="cardcustom">
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
                 {/*<button onClick={this.getSelectedRowKeys.bind(this)}>Get selected row keys</button>*/}
                 <BootstrapTable data={ data } remote={ this.remote } selectRow={ selectRowProp } cellEdit={ cellEditProp } pagination scrollTop={ 'Bottom' } hover condensed striped exportCSV
                   expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } options={ options } deleteRow={ true } width="100%">
                  <TableHeaderColumn ref='id' dataField='id' isKey={ true } headerAlign='center'  dataAlign='center' width="50px">ID</TableHeaderColumn>
                  <TableHeaderColumn ref='first_name' dataField='first_name' filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='center' width="100px">First Name</TableHeaderColumn>
                  <TableHeaderColumn ref='last_name' dataField='last_name' filter={ { type: 'TextFilter'} } headerAlign='center' dataAlign='center' width="100px">Last Name</TableHeaderColumn>
                  <TableHeaderColumn ref='email' dataFormat={ this.emailType } dataField='email' filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='left'>Email</TableHeaderColumn>
                  <TableHeaderColumn ref='status' filter={ { type: 'TextFilter' } } dataField='status' dataFormat={ this.statusType } headerAlign='center' dataAlign='center' editable={ { type: 'textarea' , validator: this.jobStatusValidator } } width="80px">Status</TableHeaderColumn>
                  <TableHeaderColumn ref='level'  dataField='level' dataFormat={ this.levelType } filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='center' editable={ { type: 'textarea' , validator: this.jobStatusValidator } } width="80px">Level</TableHeaderColumn>
                  <TableHeaderColumn ref='created' dataField='created' filter={ { type: 'TextFilter' } } dataFormat = {this.createdType} headerAlign='center' dataAlign='left'>Create Time</TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={this.state.modal} backdrop={true} toggle={this.togglePassword}>
          <Form onSubmit={this.handleSubmit}>
          <ModalHeader toggle={this.togglePassword}> Generate New Password </ModalHeader>
          <ModalBody>
            {
                postData.isFetching && <Alert color={postData.status} isOpen={this.state.visible}>
                     {postData.notification}
                    </Alert>
              }
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="icon-user"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input type="email" onChange={this.handleChange}  readOnly name="email" defaultValue={email}/>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="icon-lock"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input type="password" onChange={this.handleChange} defaultValue={password}  name="password" placeholder="Password" autoComplete="password" />
            </InputGroup>
            <InputGroup className="mb-4">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="icon-lock"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input type="password" onChange={this.handleChange} defaultValue={re_password} name="re_password" placeholder="Repeat password" autoComplete="new-password" />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="warning">Generate New Password <i className="icon-lock" /></Button>
          </ModalFooter>
          </Form>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(User);


