import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row , Alert, Label ,Form ,  Input, InputGroup , InputGroupAddon , InputGroupText , Modal, ModalHeader, ModalBody, ModalFooter , Button} from 'reactstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { connect } from 'react-redux';
import { fetchingDataAPI , putDataAPI , deleteData , postingDataAPI , fetchingMultipleDataAPI  } from '../../utils/AxiosMethod';
import { toRomawiString } from '../../utils/Helper';
import { actionCheckExpired } from '../../utils/Action';
import { Data } from '../../utils/Data';
import { Redirect } from 'react-router-dom';

type State = {
  options: [{ [string]: string }],
  value: string | void,
};

const createOption = (label: string, value) => ({
  label,
  value: value,
});


const defaultOptions = [
  createOption('One'),
  createOption('Two'),
  createOption('Three'),
];

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
        selectOptionYear : [],
        selectedOptionLevelOne : [],
        selectedOptionLevelTwo : [],
        selectedOptionLevelThree : [],
        selectedOptionLevelFour : [],
        isLoading: false,
        optionsSelect: defaultOptions,
        value: undefined,
        selectedValueLevelOne : undefined,
        selectedValueLevelTwo : undefined,
        selectedValueLevelThree : undefined,
        selectedValueLevelFour : undefined,
        levelTitle : '' ,
        generatePrice : [],
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
        year : '',
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

  handleSelectLevelOne = (newValue: any, actionMeta: any) => {
    //console.log(`action: ${actionMeta.action}`);
    // this.setState({
    //   selectedValueLevelTwo : undefined,
    //   selectedValueLevelThree : undefined,
    //   selectedValueLevelFour : undefined,
    // })
    if(newValue !== null){
      postingDataAPI('/kbliByLevel/custom',{ param : 'level_2', level_1 : newValue.value , level_3 : 0, level_4 : 0, level_5 : 0})
      .then(result => {
            const selectedOptionLevelTwo = result.data.map((key,index) => {
              return createOption(`${key.level_2} - ${key.title}`, key.level_2)
            })
            this.setState({
              selectedOptionLevelTwo,
              selectedValueLevelTwo : undefined,
              levelTitle : newValue.value,
              selectedValueLevelOne : newValue,
              form : { ...this.state.form , level_1 : newValue.value }
            })
        }
      )
    }
  };

  handleSelectLevelTwo = (newValue: any, actionMeta: any) => {
    //console.log(`action: ${actionMeta.action}`);
    const { selectedValueLevelOne } = this.state 
    if(newValue !== null){
      postingDataAPI('/kbliByLevel/custom',{ param : 'level_3', level_1 : selectedValueLevelOne.value , level_2 : newValue.value, level_4 : 0, level_5 : 0})
      .then(result => {
            const selectedOptionLevelThree= result.data.map((key,index) => {
              return createOption(`${key.level_3} - ${key.title}`, key.level_3)
            })
            this.setState(prevState => ({
              selectedOptionLevelThree,
              selectedValueLevelThree : undefined,
              levelTitle : `${selectedValueLevelOne.value}.${newValue.value}`,
              selectedValueLevelTwo : newValue,
              form : { ...this.state.form , level_2 : newValue.value }
            }));
        }
      )
    }
  };

  handleSelectLevelThree = (newValue: any, actionMeta: any) => {
    //console.log(`action: ${actionMeta.action}`);
    const { selectedValueLevelOne , selectedValueLevelTwo } = this.state 
    if(newValue !== null){
      postingDataAPI('/kbliByLevel/custom',{ param : 'level_4', level_1 : selectedValueLevelOne.value , level_2 : selectedValueLevelTwo.value, level_3 : newValue.value, level_5 : 0})
      .then(result => {
            const selectedOptionLevelFour= result.data.map((key,index) => {
              return createOption(`${key.level_4} - ${key.title}`, key.level_4)
            })
            this.setState(prevState => ({
              selectedOptionLevelFour,
              selectedValueLevelFour : undefined,
              levelTitle : `${selectedValueLevelOne.value}.${selectedValueLevelTwo.value}.${newValue.value}`,
              selectedValueLevelThree : newValue,
              form : { ...this.state.form , level_3 : newValue.value }
            }))
        }
      )
    }
  };

  handleSelectLevelFour = (newValue: any, actionMeta: any) => {
    //console.log(`action: ${actionMeta.action}`);
    const { selectedValueLevelOne , selectedValueLevelTwo , selectedValueLevelThree } = this.state
    if(newValue !== null){ 
      postingDataAPI('/kbliByLevel/custom',{ param : 'level_5', level_1 : selectedValueLevelOne.value , level_2 : selectedValueLevelTwo.value, level_3 : selectedValueLevelThree.value, level_5 : 0})
      .then(result => {
            const selectedOptionLevelFour= result.data.map((key,index) => {
              return createOption(`${key.level_4} - ${key.title}`, key.level_4)
            })
            this.setState(prevState => ({
              selectedOptionLevelFour,
              levelTitle : `${selectedValueLevelOne.value}.${selectedValueLevelTwo.value}.${selectedValueLevelThree.value}.${newValue.value}`,
              selectedValueLevelFour : newValue,
              form : { ...this.state.form , level_4 : newValue.value }
            }))
        }
      )
    }
  };

  handleSelect = (newValue: any, actionMeta: any) => {
    console.group('Value Changed');
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value: newValue });
  };

  handleCreateSelect = (inputValue: any) => {
    this.setState({ isLoading: true });
    console.group('Option created');
    console.log('Wait a moment...');
    setTimeout(() => {
      const { optionsSelect } = this.state;
      const newOption = createOption(inputValue);
      console.log(newOption);
      console.groupEnd();
      this.setState({
        isLoading: false,
        optionsSelect: [...optionsSelect, newOption],
        value: newOption,
      });
    }, 1000);
  };

  addBySelectOption = (obj) => {
    const { generatePrice } = this.state
    postingDataAPI('kbli',{...obj, price : JSON.stringify(generatePrice)}).then(result => {
      if(result.response === 200){
        this.setState({
                 postData : {
                      isFetching : true,
                      status : 'success',
                      notification : `Success action KBLI`
                  }
              })
      }
    }).catch( err => console.log(err))    
  }

  handleCreateLevelOne = (inputValue: any) => {
    const { generatePrice , selectedOptionLevelOne } = this.state
    this.setState({ isLoading: true });
    postingDataAPI('kblilast', {level_2 : 0, level_3 : 0 , level_4 : 0, level_5 : 0})
    .then(response => {
        if(response.response === 200){
            const numberID = response.data[0].level_1 + 1
            this.addBySelectOption({level_1 : numberID , level_2 : 0, level_3 : 0 , level_4 : 0, level_5 : 0, title : inputValue})
            setTimeout(() => {
                const newOption = createOption(`${numberID} - ${inputValue}`,numberID);
                this.setState({
                  isLoading: false,
                  selectedOptionLevelOne: [...selectedOptionLevelOne, newOption],
                  selectedValueLevelOne: newOption,
                });
              }, 1000);
            return numberID
          }
    })
    .catch( err => console.log(err))

  };

  handleCreateLevelTwo = (inputValue: any) => {
    const { generatePrice , selectedOptionLevelTwo , selectedValueLevelOne } = this.state
    this.setState({ isLoading: true });
    if(selectedValueLevelOne !== undefined){
      postingDataAPI('kblilasttwo', {level_1 : selectedValueLevelOne.value  , level_3 : 0 , level_4 : 0, level_5 : 0})
      .then(response => {
          if(response.response === 200){
              const numberID = response.data[0].level_2 + 1
              this.addBySelectOption({level_1 : selectedValueLevelOne.value , level_2 : numberID, level_3 : 0 , level_4 : 0, level_5 : 0, title : inputValue})
              setTimeout(() => {
                const newOption = createOption(`${numberID} - ${inputValue}`,numberID);
                this.setState({
                  isLoading: false,
                  selectedOptionLevelTwo: [...selectedOptionLevelTwo, newOption],
                  selectedValueLevelTwo: newOption,
                });
              }, 1000);
              return numberID
            }
      })
      .catch( err => console.log(err))
    }else{
        this.setState({
          isLoading: false,
        });
    }

  };

  handleCreateLevelThree = (inputValue: any) => {
    const { generatePrice , selectedValueLevelTwo , selectedValueLevelOne , selectedOptionLevelThree } = this.state
    this.setState({ isLoading: true });
    if(selectedValueLevelOne !== undefined && selectedValueLevelTwo !== undefined){
    postingDataAPI('kblilastthree', {level_1 : selectedValueLevelOne.value  , level_2 : selectedValueLevelTwo.value , level_4 : 0, level_5 : 0})
      .then(response => {
          if(response.response === 200){
              const numberID = response.data[0].level_3 + 1
              this.addBySelectOption({level_1 : selectedValueLevelOne.value , level_2 : selectedValueLevelTwo.value , level_3 : numberID , level_4 : 0, level_5 : 0, title : inputValue})
              setTimeout(() => {
              const newOption = createOption(`${numberID} - ${inputValue}`,numberID);
              this.setState({
                isLoading: false,
                selectedOptionLevelThree: [...selectedOptionLevelThree, newOption],
                selectedValueLevelThree: newOption,
                    });
              }, 1000);
              return numberID
            }
      })
      .catch( err => console.log(err))
    }else{
        this.setState({
          isLoading: false,
        });
    }
  };

  handleCreateLevelFour = (inputValue: any) => {
    const { generatePrice , selectedValueLevelTwo , selectedValueLevelOne , selectedValueLevelThree , selectedOptionLevelFour } = this.state
    this.setState({ isLoading: true });
    if(selectedValueLevelOne !== undefined && selectedValueLevelTwo !== undefined && selectedValueLevelThree != undefined){
    postingDataAPI('kblilastfour', {level_1 : selectedValueLevelOne.value  , level_2 : selectedValueLevelTwo.value , level_3 : selectedValueLevelThree.value, level_5 : 0})
      .then(response => {
          if(response.response === 200){
              const numberID = response.data[0].level_4 + 1
              this.addBySelectOption({level_1 : selectedValueLevelOne.value , level_2 : selectedValueLevelTwo.value , level_3 : selectedValueLevelThree.value , level_4 : numberID, level_5 : 0, title : inputValue})
              setTimeout(() => {
                  const newOption = createOption(`${numberID} - ${inputValue}`,numberID);
                  this.setState({
                    isLoading: false,
                    selectedOptionLevelFour: [...selectedOptionLevelFour, newOption],
                    selectedValueLevelFour: newOption,
                    });
              }, 1000);
              return numberID
            }
      })
      .catch( err => console.log(err))
    }else{
        this.setState({
          isLoading: false,
        });
    }
  };


  handleSubmit = (e) => {
    e.preventDefault()
    const { form , selectOptionYear , generatePrice , 
      selectedValueLevelFour , selectedValueLevelThree , 
      selectedValueLevelTwo ,selectedValueLevelOne } = this.state
    let { price , level_5 , ...rest } = form
    if(selectedValueLevelFour !== undefined && selectedValueLevelThree !== undefined && selectedValueLevelTwo !== undefined && selectedValueLevelOne !== undefined){
      postingDataAPI('kblilastfive', {level_1 : selectedValueLevelOne.value  , level_3: selectedValueLevelThree.value, level_2 : selectedValueLevelTwo.value , level_4 : selectedValueLevelFour.value})
        .then(response => {
            if(response.response === 200){
                const numberID = response.data[0].level_5 + 1
                this.addBySelectOption({...rest , price : JSON.stringify(generatePrice), level_5 : numberID})
                return numberID
              }
        })
        .catch( err => console.log(err))     
    }     
  }

  onDeleteCell = async (row) => {
   row.map((k,i) => {
      return deleteData('kbli',{ data: {id : k} })
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
    console.log(priceJSONparse)
    if(cellName !== 'labels'){
        putDataAPI('kbli',{...row , price : priceJSONparse}).then(result => {
              this.setState({
                  postData : {
                    isFetching : true,
                    status : 'success',
                    notification : 'Success Update Data'}
                })
           }
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
  const generateData = Data()
  const defaultPrice = []
  const generatePrice = generateData.map((key,index) => {
        defaultPrice.push(createOption(`max_price_${key}`,`max_price_${key}`))
        defaultPrice.push(createOption(`min_price_${key}`,`min_price_${key}`))
       return {year : key , [`max_price`] : 0 ,[`min_price`] : 0 } 
    })

  if(isAuthenticated){
    let json = [], ObjectLeng = 0, 
          indexObject = [], indexWithMaxValue = 0,
          sop = {} , leng = 0 , objectWithMaxProps = [] , selectOptionYear = []

    fetchingMultipleDataAPI([`kbli`,`kbliByLevel/one`]).then(result => {
      const dataFirst = result[0].data
      const dataSecond = result[1].data
      let emptyBracket = dataFirst.map(key => {
        const toStringLevel = `${key.level_1}${key.level_2}${key.level_3}${key.level_4}${key.level_5}`
        const toStringSeparate = toRomawiString(toStringLevel)
        return Object.assign(key , {labels : toStringSeparate})
      })

      dataFirst.map((key,index) => {
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
      return { emptyBracket , indexObject, objectWithMaxProps , dataSecond}
    })
    .then(res => {
      const selectedOptionValue = defaultPrice
      const selectedOptionLevelOne = res.dataSecond.map((key,index) => {
        return createOption(`${key.level_1} - ${key.title}`,key.level_1)
      })
      let tableComponent = res.indexObject
      this.setState({
        data : res.emptyBracket,
        tableComponent,
        level,
        selectedOptionValue,
        selectedOptionLevelOne,
        generatePrice,
        objectWithMaxProps : res.objectWithMaxProps
      })
    })
    .catch(err => console.log(err));
    
  }
  // postingDataAPI('kbliByLevel').then(result => console.log(result))
 }

  render() {
    const { cellEditProp , data , 
            postData , 
            tableComponent , 
            selectedOption , selectedOptionValue, form , year,
            isLoading, optionsSelect, value,
            selectedOptionLevelOne , selectedValueLevelOne,
            selectedOptionLevelTwo , selectedValueLevelTwo,
            selectedOptionLevelThree , selectedValueLevelThree,
            selectedOptionLevelFour , selectedValueLevelFour,
            levelTitle
          } = this.state
    const { level_5, level_4 , level_3 , level_2 , level_1 , price , description, title } = form

    const formComponent = Object.keys(form)
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
      <Row>
        <Col xs="2">
            <Button color="success" onClick={ () => this.toggleKbli('s')}><i className="icon-plus"/> Add KBLI</Button>
        </Col>
      </Row> 
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
                    placeholder = "Select ..."
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
              <Col xs="12">
               Parameter :  {levelTitle}
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                  <div className='form-group'>
                    <CreatableSelect
                      isClearable
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={this.handleSelectLevelOne}
                      onCreateOption={this.handleCreateLevelOne}
                      options={selectedOptionLevelOne}
                      placeholder = "Level 1"
                      value={selectedValueLevelOne}
                    />
                </div>

              </Col>
            </Row>
            <Row>
              <Col xs="12">
                  <div className='form-group'>
                    <CreatableSelect
                      isClearable
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={this.handleSelectLevelTwo}
                      onCreateOption={this.handleCreateLevelTwo}
                      options={selectedOptionLevelTwo}
                      placeholder = "Level 2"
                      value={selectedValueLevelTwo}
                    />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                  <div className='form-group'>
                    <CreatableSelect
                      isClearable
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={this.handleSelectLevelThree}
                      onCreateOption={this.handleCreateLevelThree}
                      options={selectedOptionLevelThree}
                      placeholder = "Level 3"
                      value={selectedValueLevelThree}
                    />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                  <div className='form-group'>
                    <CreatableSelect
                      isClearable
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      onChange={this.handleSelectLevelFour}
                      onCreateOption={this.handleCreateLevelFour}
                      options={selectedOptionLevelFour}
                      placeholder = "Level 4"
                      value={selectedValueLevelFour}
                    />
                </div>
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
                        <Input type="text" onChange={this.handleChange}  placeholder="Title" name={title} defaultValue={title} name="title"/>
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
                        <Input type="text" onChange={this.handleChange}  placeholder="Description"  name={description} defaultValue={description} name="description"   />
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


