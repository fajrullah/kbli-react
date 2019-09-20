import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Card } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteUser, deleteToken, setAuthenticated } from '../../utils/Action';
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/4sri_logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'
require('../../views/custom.css');

const defaultProps = {};

class DefaultHeader extends Component {

  render() {

    // eslint-disable-next-line
    const { user , children, ...attributes } = this.props;
    const { level } = user
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/kbli" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
          { (level === 1) && <Link to="/users" className="nav-link">Users</Link>
          }
          </NavItem>
          <NavItem className="px-3">
           { (level === 1) &&
            <NavLink to="/register" className="nav-link">Create</NavLink>
           }
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/*<NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>*/}
          {/*<NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>*/}
          {/*<NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem>*/}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/4.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>

              { (level === 1) && <div>
                    <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
                    <DropdownItem><Link to="/registered"> <i className="fa fa-user"></i> Create <Badge color="info">42</Badge></Link></DropdownItem>
                    <DropdownItem header tag="div" className="text-center"><strong>Setting</strong></DropdownItem>
                    <DropdownItem><Link to="/users"> <i className="fa fa-gears"></i> Manage Users <Badge color="info">42</Badge></Link></DropdownItem></div> 
                //<DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
                // <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
                // <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
                // <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
                // <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
                // <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
                // <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
                // <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              }

              <DropdownItem header tag="div" className="text-center"><strong>Logout</strong></DropdownItem>
              <DropdownItem onClick={e => this.props.logout()}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

const propTypes = {
  children: PropTypes.node,
  logout : PropTypes.func,
};


DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

DefaultHeader = connect(
  state => ({
    user: state.user,
    token: state.token,
  }),
  (dispatch, ownProps) => ({
    logout: () => {
      localStorage.clear();
      dispatch(deleteUser());
      dispatch(deleteToken());
      dispatch(setAuthenticated(false));
    }
  })
)(DefaultHeader);

const mapStateToProps = state => ({ authenticated : state.isAuthenticated, level : state.level });
export default connect(mapStateToProps, null)(DefaultHeader);
