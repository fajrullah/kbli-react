import React, { Component } from 'react';
import { Alert , Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import building from '../../../assets/img/building2.jpg';
import { Link } from 'react-router-dom';
require('../../custom.css');

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      first_name : '',
      last_name : '',
      password : '',
      re_password : '',
      postData : {
        notification : '',
        isFetching : false,
        status : '',
        visible: true,
      }
    };
    this.onDismiss = this.onDismiss.bind(this);
  }
  onDismiss = () => {
    this.setState({ postData : {visible: false} });
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const {re_password, postData, ...rest}  = this.state
    if(re_password === this.state.password){
        const data = JSON.stringify({...rest})
        const config = {
              headers: {
                'Content-Type': 'application/json'
              }
            }
        axios.post('http://localhost:4000/register',data,config)
        .then(response => {
           this.setState({
              ...this.state,
              postData : {
                isFetching : true,
                status : response.data.msgCode,
                notification : response.data.description
              }
           })
        })
        .catch(err => console.log(err))
    }else{
         this.setState({
              ...this.state,
              postData : {
                isFetching : true,
                status : 'danger',
                notification : 'Your Password Not Matching'
              }
           })
    }
  }
  handleChange = (e) => {
    e.preventDefault()
    const target = e.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    });
  }

  render() {
    const { postData } = this.state
    console.log(postData)
    return (
      <div className="app flex-row align-items-center background-custom" style={{position:"absolute"}}>
        <img src={building} className="building-style-register"/>
        <Container className="container-register">
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleSubmit}>
                    <h1 className="tittle_register">Register</h1>
                    {
                      postData.isFetching &&  
                                   <Alert color={postData.status} isOpen={this.state.visible} toggle={this.onDismiss}>
                                      {postData.notification}
                                    </Alert>
                    }
                    <p className="text-muted">Silahkan Buat Akun Anda</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="first_name" onChange={this.handleChange} value={this.state.first_name} placeholder="First Name" autoComplete="first_name" />
                      <Input type="text" name="last_name" onChange={this.handleChange} value={this.state.last_name} placeholder="Last Name" autoComplete="last_name" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-envelope"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" autoComplete="Email" />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" onChange={this.handleChange} value={this.state.password}  name="password" placeholder="Password" autoComplete="password" />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" onChange={this.handleChange} value={this.state.re_password} name="re_password" placeholder="Repeat password" autoComplete="new-password" />
                    </InputGroup>
                    <Button className="login-button">Create Account</Button>
                  </Form>
                </CardBody>
                {/*<CardFooter className="p-4">*/}
                  {/*<Row>*/}
                    {/*<Col xs="12" sm="6">*/}
                      {
                      //<Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                     }
                    {/*</Col>*/}
                    {/*<Col xs="12" sm="6">*/}
                    {
                      //<Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    }
                    {/*</Col>*/}
                  {/*</Row>*/}
                {/*</CardFooter>*/}
              </Card>
              <p className="back_reg">Sudah Punya akun?, Kembali ke halaman 
                <Link to="/login" className="back_login"> Login</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
