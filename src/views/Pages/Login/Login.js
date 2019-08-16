import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form,  Row , FormGroup } from 'reactstrap';
import { Link } from 'react-router-dom';
import { reduxForm, Field, reset } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionTryLogin, setToken } from '../../../utils/Action';
import TextField from '@material-ui/core/TextField';
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
      return (<Redirect to="/dashboard" />);
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.props.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                        <FormGroup>
                          <Field name="email" component={renderInput} type="text" placeholder="Email" />
                        </FormGroup>
                        <FormGroup>
                          <Field name="password" component={renderInput} type="password" placeholder="Password" />
                        </FormGroup>
                      <Row>
                        <Col xs="6">
                          { isFetching ? (<p><i className="fa fa-spinner fa-spin"></i>..Loading</p>) : (<Button type="submit" color="light" className="px-4">Login</Button>) }
                          
                        </Col>
                        <Col xs="6" className="text-right">
                         <Link to="/register"> 
                          <Button color="link" className="px-0">Register</Button>
                          </Link>
                        </Col>
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
        dispatch(setToken(JSON.parse(token)));
      };
    }
  })
)(Login);

export default Login;
