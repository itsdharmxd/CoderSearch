import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import {loginUser} from '../../actions/authActions'
import classnames from 'classnames'
import TextFieldGroup from '../common/TextFieldGroup';

 class Login extends Component {
   
      
    constructor() {
        super();
      
        this.state = {
            password: '',
            email: '',
            errors:{}
     }
   this.onChange=this.onChange.bind(this)
   this.onSubmit=this.onSubmit.bind(this)

    }
     onChange(e) {
        this.setState({
          [e.target.name]:e.target.value
      })
   }
   componentDidMount() {
     if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard')
    }
  }

   
   componentWillReceiveProps(nextProps) {
     if (nextProps.auth.isAuthenticated) {
     this.props.history.push('/dashboard')
   }
      
     
     if (nextProps.errors)
      this.setState({errors:nextProps.errors})
  }
 

      onSubmit(e) {
        e.preventDefault();
        const userData = {
          email :this.state.email,
          password :this.state.password,

        }
   this.props.loginUser(userData)


  }

    
   render() {
     const { errors } = this.state;
      
      
     
        return (
          <div className="login">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your DevConnector account</p>
          <form onSubmit={this.onSubmit} >
                    <TextFieldGroup
                      placeholder="Email Address"
                    name="email"
                      type="email"
                      value={this.state.email}
                      onChange={this.onChange}
                      error={errors.email}
                    />
                     <TextFieldGroup
                      placeholder="Password"
                    name="password"
                      type="password"
                      value={this.state.password}
                      onChange={this.onChange}
                      error={errors.password}
                    />
           
                    {/* <div className="form-group">
              <input  onChange={this.onChange} value={this.state.email} type="email" className={classnames("form-control form-control-lg",{'is-invalid':errors.email})} placeholder="Email Address" name="email" />
                                   {errors.email&& (<div  className="invalid-feedback"  > {errors.email} </div>)  }

                    </div>*/}
            {/* <div className="form-group"> 
              <input onChange={this.onChange} value={this.state.password} type="password" className={classnames("form-control form-control-lg",{'is-invalid':errors.password})} placeholder="Password" name="password" />
                                  {errors.password&& (<div  className="invalid-feedback"  > {errors.password} </div>)  }

                    </div> */}
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
        )
    }
}


Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors:PropTypes.object.isRequired

}



const mapStateToProps = (state) => ({
  auth: state.auth,
  errors:state.errors
})



export default connect(mapStateToProps ,{loginUser}) (Login)