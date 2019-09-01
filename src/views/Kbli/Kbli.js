import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row , Alert, Label ,Form ,  Input, InputGroup , InputGroupAddon , InputGroupText , Modal, ModalHeader, ModalBody, ModalFooter , Button} from 'reactstrap';
import Select from 'react-select';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { connect } from 'react-redux';
import { fetchingDataAPI , putDataAPI , deleteData , postingDataAPI  } from '../../utils/AxiosMethod';
import { toRomawiString } from '../../utils/Helper';
import { actionCheckExpired } from '../../utils/Action';
import { Redirect } from 'react-router-dom';

class Kbli extends Component {
 constructor(props) {
   super(props);
   this.state = {
        data : [],
        tableComponent : [],
        labelCal: 'Filter By Date',
        modal: false,
        token : '',
        level : '',
        objectWithMaxProps : [],
        selectedOption: null,
        selectedOptionValue: [],
        form : {
            level_1 : '',
            level_2 : '',
            level_3 : '',
            level_4 : '',
            level_5 : '',
            price : '',
            description : '',
            title : ''
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
   this.onDismiss = this.onDismiss.bind(this)
   this.toggleKbli = this.toggleKbli.bind(this);
 }

  handleChangeSelectOpt = selectedOption => {
    let { tableComponent } = this.state
    let toDefaultvalue = tableComponent.slice(0,4)
    if(selectedOption !== null){
      selectedOption.map(key => {
        return toDefaultvalue.push(key.value)
      })
    }
    this.setState({ selectedOption, tableComponent : toDefaultvalue });
  };

  handleChange = (e) => {
    e.preventDefault()
    this.setState({
      form :{
        ...this.state.form,
        [e.target.name] : e.target.value
      }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form } = this.state
    postingDataAPI('kbli',form).then(result => {
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
  }

  onDeleteCell = async (row) => {
   row.map((k,i) => {
      return deleteData('user',{ data: {id : k} })
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
 onAfterSaveCell = (row, cellName, cellValue) => {
  let priceJSONparse = JSON.parse(row.price)
  if(cellName.search('_price_') >= 1){
    const parseCellName = cellName.split('_') ,
        objectEdit = { 
          [parseCellName[0] + '_price'] : parseInt(cellValue) 
        },
        indexfOfCell = priceJSONparse.map(key => key.year).indexOf(parseInt(parseCellName[2])),
        locateInJSON = priceJSONparse.find(key => key.year === parseInt(parseCellName[2]))
        Object.assign(priceJSONparse[indexfOfCell],objectEdit)
  }
  if(cellName !== 'labels'){
      putDataAPI('kbli',{...row , price : priceJSONparse}).then(
            this.setState({
                postData : {
                  isFetching : true,
                  status : 'success',
                  notification : 'Success Update Data'}
              })
      ).catch(err => console.log(err))
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
  toggleKbli(v) {
    this.setState(prevState => ({
      modal: !prevState.modal,
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
      let json = [], ObjectLeng = 0, 
          indexObject = [], indexWithMaxValue = 0,
          sop = {} , leng = 0 , objectWithMaxProps = []
      let emptyBracket = result.map(key => {
        const toStringLevel = `${key.level_1}${key.level_2}${key.level_3}${key.level_4}${key.level_5}`
        const toStringSeparate = toRomawiString(toStringLevel)
        return Object.assign(key , {labels : toStringSeparate})
      })

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
        indexObject = Object.keys(emptyBracket[indexWithMaxValue]).splice(0,8)
        indexObject.splice( 1, 0, "labels")
        indexObject.splice( 2, 5); 
      return { emptyBracket , indexObject, objectWithMaxProps}
    })
    .then(res => {
      const selectedOptionValue = res.objectWithMaxProps.map((k,i) => {
        return { value : k , label : k}
      })
      let tableComponent = res.indexObject
      this.setState({
        data : res.emptyBracket,
        tableComponent,
        level,
        selectedOptionValue,
        objectWithMaxProps : res.objectWithMaxProps
      })
    })
    .catch(err => console.log(err));
  }
 }

  render() {
    const { cellEditProp , data , 
            postData , 
            tableComponent , 
            selectedOption , selectedOptionValue, form
          } = this.state
    const { level_5, level_4 , level_3 , level_2 , level_1 , price , description, title } = form
    const formComponent = Object.keys(form)
    console.log(form)
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
      <Button color="success" onClick={ () => this.toggleKbli('s')}><i className="icon-plus"/> Add New KBLI</Button>
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
                    isSearchable = {true}
                    isMulti={true}
                  />
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
        <Modal isOpen={this.state.modal} backdrop={true} toggle={this.toggleKbli}>
          <Form onSubmit={this.handleSubmit}>
          <ModalHeader toggle={this.toggleKbli}> Create KBLI </ModalHeader>
          <ModalBody>
            {
                postData.isFetching && <Alert color={postData.status} isOpen={this.state.visible}>
                     {postData.notification}
                    </Alert>
            }
          <Row>
            <Col xs="4">
              <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-options"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}  placeholder="level 1" name={level_1} defaultValue={level_1} name="level_1"  />
              </InputGroup>
            </Col>
            <Col xs="4">
                <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-options"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}   name={level_2} defaultValue={level_2} name="level_2" />
              </InputGroup>
            </Col>
            <Col xs="4">
              <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-options"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}   name={level_3} defaultValue={level_3} name="level_3" />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="4">
              <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-options"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}   name={level_4} defaultValue={level_4} name="level_4" />
              </InputGroup>
            </Col>
            <Col xs="4">
                <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-options"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}   name={level_5}  defaultValue={level_5} name="level_5" />
              </InputGroup>
            </Col>
          </Row>
        <Row>
            <Col xs="12">
              <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-info"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}   name={title} defaultValue={title} name="title"/>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="cui-comment-square"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange}   name={description} defaultValue={description} name="description"   />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="cui-british-pound"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" onChange={this.handleChange} name={price} defaultValue={price} name="price" />
              </InputGroup>
            </Col>
          </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="info"><i className="icon-plus" /> Add New KBLI</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Kbli);


