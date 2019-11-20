import React, { PureComponent } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Layout from './Layout/Layout';
import ArticleBuilder from './ArticleBuilder/ArticleBuilder';
import UserManager from './UserManager/UserManager';
import Welcome from '../components/Welcome/Welcome';
import MarkDownHelp from '../components/MarkDownHelp/MarkDownHelp';
import FullPost from '../components/FullPost/FullPost';
import NotFoundPage from '../components/NotFoundPage/NotFoundPage';
import PictureManager from '../containers/PictureManager/PictureManager';
import Settings from '../containers/Settings/Settings';

import { connect } from 'react-redux';
import * as actionTypes from '../store/actions/actionTypes';
import * as util from '../utils';
import * as config from '../config';
import Path from "../Path";

class App extends PureComponent {

  render() {

    let editArticlePage = <Route
      path={this.getMountedPageByPath(Path.EDIT_ARTICLE_PAGE)} 
      component={ArticleBuilder} />;
    
    let newArticlePage = <Route exact
      path={this.getMountedPageByPath(Path.NEW_ARTICLE_PAGE)} 
      component={ArticleBuilder} />;
    
    let editUsers = <Route exact 
      path={this.getMountedPageByPath(Path.USER_EDITOR_PAGE)}
      component={UserManager} />;
    
    let pictureManager = <Route exact 
      path={this.getMountedPageByPath(Path.PICTURE_MANAGER_PAGE)}
      component={PictureManager} />;
    
    let settings = <Route exact
      path={this.getMountedPageByPath(Path.SETTINGS_PAGE)}
      component={Settings} />;

    if(this.isUserLogged()){
      editArticlePage = <Redirect exact
        from={this.getMountedPageByPath(Path.EDIT_ARTICLE_PAGE)}
        to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />;
      
      newArticlePage = <Redirect exact
        from={this.getMountedPageByPath(Path.NEW_ARTICLE_PAGE)} 
        to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />;
      
      editUsers = <Redirect exact
        from={this.getMountedPageByPath(Path.USER_EDITOR_PAGE)}
        to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />;
      
      pictureManager = <Redirect exact
        from={this.getMountedPageByPath(Path.PICTURE_MANAGER_PAGE)}
        to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />;
      
      settings = <Redirect exact
        from={this.getMountedPageByPath(Path.SETTINGS_PAGE)}
        to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />;

    }else if(!util.userHasPermission(this.getUser(), 'ADMIN')){
      editUsers = <Redirect exact from='/user-editor' to='/welcome'/>;
    }

    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Redirect exact
              from={Path.HOME}
              to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />
            
            <Redirect exact
              from={this.getMountedPageByPath(Path.HOME)}
              to={this.getMountedPageByPath(Path.WELCOME_PAGE)} />

            <Route path={this.getMountedPageByPath(Path.HOME)} exact component={Welcome} />
            <Route path={this.getMountedPageByPath(Path.WELCOME_PAGE)} exact component={Welcome} />
            <Route path={this.getMountedPageByPath(Path.MARKDOWN_HELP_PAGE)} exact component={MarkDownHelp} />
            <Route path={this.getMountedPageByPath(Path.ARTICLE_PAGE)} exact component={Welcome} />
            <Route path={this.getMountedPageByPath(Path.ARTICLE_BY_TAG_PAGE)}exact component={FullPost} />
            
            {editArticlePage}
            {newArticlePage}
            {editUsers}
            {pictureManager}
            {settings}

            <Route component={NotFoundPage} />
          </Switch>        
        </Layout>
      </BrowserRouter>
    );
  }

  getMountedPageByPath(path) {
    return config.URL_HOME_PAGE + path;
  }

  isUserLogged() {
    return this.props.usr === null;
  }

  getUser() {
    return this.props.usr
  }
}

const mapStateToProps = state => {
  return{
      usr: state.usr.user,
      appName: state.app.appName
  };
}

const mapDispathToProps = dispatch => {
  return{
      onLogin: (usr) => dispatch({type: actionTypes.USER_LOGIN, user: usr}),
      getAppName: () => dispatch({type: actionTypes.APP_NAME})
  };
}

export default connect(mapStateToProps, mapDispathToProps)(App);
