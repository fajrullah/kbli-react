import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table, Button , Alert } from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import usersData from './UsersData'
import * as moment from 'moment/moment';
import { fetchingDataAPI , putDataAPI , deleteData } from '../../utils/AxiosMethod';
import { toDateTimeLocal } from '../../utils/Helper';
let contentData = []
class User extends Component {
 constructor(props) {
   super(props);
   this.state = {
        data : [],
        startDateDR: moment().subtract(30, 'days'),
        endDate: moment(),
        labelCal: 'Filter By Date',
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
   this.onDismiss = this.onDismiss.bind(this)
   this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
 }
  statusType(cell) {
    if(cell == 0){
      return (<Badge color="danger">Off</Badge>)
    }else{
      return (<Badge color="success">On</Badge>)
    }
  }
  levelType(cell) {
    if(cell == 0){
      return (<Badge color="secondary">User</Badge>)
    }else{
      return (<Badge color="primary">Admin</Badge>)
    }
  }
  createdType(cell) {
    return toDateTimeLocal(cell)
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
  onChangeDatePicker(event, picker){
      if(event.handleObj.type === 'apply'){
       
    }
  }
 onAfterSaveCell = (row, cellName, cellValue) => {
    const { id , status } = row
    putDataAPI('user',row).then(
    this.setState({
              postData : {
                isFetching : true,
                status : 'success',
                notification : 'Success Update Data'
            }}
    )).catch(err => console.log(err))
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
  onDismiss = () => {
    this.setState({ postData : {visible: false} });
  }
 componentDidMount(){
    fetchingDataAPI('user').then(result => {
      this.setState({
        data : result
      })
    }).catch(err => console.log(err));
 }
  render() {
    const { cellEditProp , data , postData } = this.state
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
        // alert(`Kamu menekan sekali baris dengan Device ID: ${row.id} ,${columnIndex},${rowIndex}`);
        }

    };

    const user = usersData.find( user => user.id.toString() === this.props.match.params.id)

    const userDetails = user ? Object.entries(user) : [['id', (<span><i className="text-muted icon-ban"></i> Not found</span>)]]

    return (
      <div className="animated fadeIn">
      {
        postData.isFetching && <Alert color={postData.status} isOpen={this.state.visible} toggle={this.onDismiss}>
             {postData.notification}
            </Alert>
      }

        <Row>
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
                 {/*<button onClick={this.getSelectedRowKeys.bind(this)}>Get selected row keys</button>*/}
                 <BootstrapTable data={ data } remote={ this.remote } selectRow={ selectRowProp } cellEdit={ cellEditProp } pagination scrollTop={ 'Bottom' } hover condensed striped exportCSV
                   expandableRow={ this.isExpandableRow } expandComponent={ this.expandComponent } options={ options } deleteRow={ true }>
                  <TableHeaderColumn ref='id' dataField='id' isKey={ true } headerAlign='center'  dataAlign='center' width="100px">ID</TableHeaderColumn>
                  <TableHeaderColumn ref='first_name' dataField='first_name' filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='center'>First Name</TableHeaderColumn>
                  <TableHeaderColumn ref='last_name' dataField='last_name' filter={ { type: 'TextFilter'} } headerAlign='center' dataAlign='center'>Last Name</TableHeaderColumn>
                  <TableHeaderColumn ref='email' dataField='email' filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='center'>Email</TableHeaderColumn>
                  <TableHeaderColumn ref='status' width="150px" filter={ { type: 'TextFilter' } } dataField='status' dataFormat={ this.statusType } headerAlign='center' dataAlign='center' editable={ { type: 'textarea' , validator: this.jobStatusValidator } }>Status</TableHeaderColumn>
                  <TableHeaderColumn ref='level' width="150px" dataField='level' dataFormat={ this.levelType } filter={ { type: 'TextFilter' } } headerAlign='center' dataAlign='center' editable={ { type: 'textarea' , validator: this.jobStatusValidator } } >Level</TableHeaderColumn>
                  <TableHeaderColumn ref='created' dataField='created' filter={ { type: 'TextFilter' } } dataFormat = {this.createdType} headerAlign='center' dataAlign='center'>Create Time</TableHeaderColumn>
                </BootstrapTable>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
