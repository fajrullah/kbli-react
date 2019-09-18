import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form,  Row , FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionTryLogin, setToken } from '../../../utils/Action';
import TextField from '@material-ui/core/TextField';
import building from '../../../assets/img/building.jpg';
require('../../custom.css');

const CryptoJS = require("crypto-js");
const renderInput = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <TextField
    style={{width: 100+'%'}}
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
)

class Login extends Component {
  componentWillMount() {
    this.props.checkUser();
  }
  render() {
    const isFetching = this.props.isFetching;
    const isAuthenticated = this.props.isAuthenticated;

    if (isAuthenticated) {
      return (<Redirect to="/graph" />);
    }
    return (
      <div className="app flex-row align-items-center background-custom">
        <p className="title-side">Selamat Datang</p>
        <p className="word-side">Daftar di Halaman Register untuk membuat akun</p>
        <Link to="/register"> 
          <Button className="register_button"> Register </Button>
        </Link>
        <img src={building} className="building-style"/>
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4 cardcustom">
                  <CardBody>
                    <Form onSubmit={this.props.handleSubmit}>
                      <h1 className="login-tittle">Login</h1>
                      <p className="text-muted">Silahkan login menggunakan akun yang telah terdaftar</p>
                        <FormGroup>
                          <Field name="email" component={renderInput} type="text" placeholder="Email" className="field-email"/>
                        </FormGroup>
                        <FormGroup>
                          <Field name="password" component={renderInput} type="password" placeholder="Password" />
                        </FormGroup>
                      <Row>
                        <Col xs="12">
                          { isFetching ? (<p><i className="fa fa-spinner fa-spin"></i>..Loading</p>) : (<Button type="submit" color="light" className="px-4 login-button">Login</Button>) }
                          
                        </Col>
                        {/*<Col xs="6" className="text-right">*/}
                         {/*<Link to="/register"> 
                          <Button color="link" className="px-0">Register</Button>
                          </Link>*/}
                        {/*</Col>*/}
                      </Row>
                      <Row>
                        <Col className="text-right">
                         {
          // <Button color="link" className="px-0">Forgot Your Password ?</Button>

                         }  
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <p className="forget_pass">Lupa password?</p>
              {
               // <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
               //    <CardBody className="text-center">
               //      <div>
               //        <h2>Sign up</h2>

                  // <Link to="/register">
                  //       <Button color="light" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                  //     </Link>
               //      </div>
               //    </CardBody>
               //  </Card>
               } 
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login = reduxForm({
  form: 'Login'
})(Login);

Login = connect(
  state => ({
    isFetching: state.isFetching,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token : state.token,
  }),
  (dispatch, ownProps) => ({
    onSubmit: values => {
      dispatch(actionTryLogin(values));
      setTimeout(function() {dispatch(reset('Login'));},
        3000
      );
    },
    checkUser: () => {
      const token = localStorage.getItem('token');
      if (token !== null){
        dispatch(setToken(token));
      };
    }
  })
)(Login);

export default Login;
