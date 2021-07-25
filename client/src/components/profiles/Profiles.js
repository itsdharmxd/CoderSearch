import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';
import Trie from './Trie';
import isEmpty from '../../validation/is-empty';

class Profiles extends Component {


  constructor() {
    super();

    this.state={
      search: '',
      trie:new Trie()
       
   }
  
      this.onChange=this.onChange.bind(this)
  } 
  onChange(e) {
    this.setState({
      [e.target.name]:e.target.value
    })
  }
 
  componentWillReceiveProps(newProps) {
    const { profiles, loading } = newProps.profile;
    let arr = []
    if (!isEmpty(profiles) ) {
      profiles.forEach(profile => {
        profile.skills.forEach(skill => this.state.trie.add(skill.toString().toLowerCase()));
      })
    }
      
  }  

  componentDidMount() {
    this.props.getProfiles();
    
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;
    let options=[];
    this.state.trie.findPostFix(this.state.search.toString().toLowerCase())
    options=    this.state.trie.list
    options= options.map((op,i) => (<div class="label label-default ml-1" key={i}  style={{ textAlign: 'left'  ,display:'block' }} > {op }</div>))
  //  console.log(options)
    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.filter(profile => {
          if (this.state.search == '')
            return true;
          if (profile.skills.toString().toLowerCase().includes(this.state.search.toString().toLowerCase())) {
            return true
          }else return false

        }).map(profile => {

        return  <ProfileItem key={profile._id} profile={profile} />
        } );
      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (


      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
                <div className="form-outline" style={{width:'400px' }} >
  <input name='search'  autoCorrect="off"   value={this.state.search}   onChange={this.onChange}  type="search" id="form1"  style={{width:'400px', }}  className="form-control" autoComplete={false} placeholder="Search ..."
                    aria-label="Search" />
                  <div className="options card-form" style={{position:'absolute' ,zIndex:'10',backgroundColor:'white' ,width:'400px'} }  >
 {this.state.search.toString().trim().length==0?'' :options}
  

                  </div>
  
</div>  
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
