import React from 'react';
import Radium from 'radium';
import Color from 'color';

import { getInstaVarious, getSMK, getUserInfo } from 'utils/api.js';
import ContentStore from 'stores/ContentStore.js';
import ContentActions from 'actions/ContentActions.js';
import Constants from 'constants';

import { Col, Row, Button, Input, Glyphicon, Well, Alert } from 'react-bootstrap';
import Comment from 'components/Comment/index.jsx';

let getStateFromStore = () => {
    return { 
        comments: ContentStore.allComments,
        pagination: ContentStore.pagination,
        postKey: ContentStore.postKey
    };
};


class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = getStateFromStore();
        this.state.searchQuery = '';
        this.state.picked = null;

        this.getCommments = this.getCommments.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);

        this.handleFeed = this.handleFeed.bind(this);
        this.handleSelf = this.handleSelf.bind(this);
        this.handlePopular = this.handlePopular.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handlePick = this.handlePick.bind(this);
        this.handlePickAll = this.handlePickAll.bind(this);

        this._onChange = this._onChange.bind(this);
    }

    handlePick(commentKey) {
        ContentActions.PickComment(this.state.postKey, commentKey);
    }
    handlePickAll() {
        ContentActions.PickComment(this.state.postKey);
    }

    getCommments(searchQuery) {
        let query = this.state.pagination || Constants.Various.Instagram.URL+'users/self/feed';
        
        if (searchQuery === 'self') {
            query = Constants.Various.Instagram.URL+'users/self/media/recent';
        } else if (searchQuery === 'feed') {
            query = Constants.Various.Instagram.URL+'users/self/feed';
        } else if (searchQuery === 'popular') {
            query = Constants.Various.Instagram.URL+`media/popular`;
        } else if (searchQuery && searchQuery.length > 1) {
            searchQuery = searchQuery.match(/[A-Za-z0-9]/g).join('');
            query = Constants.Various.Instagram.URL+`tags/${searchQuery}/media/recent`;
        }

        getInstaVarious(query, 'feed', this.props.user.token);
        let SMKquery = '?q=id:KMS1032&wt=json&indent=true';
    }

    handleFeed() {
        this.getCommments('feed');
    }
    handleSelf() {
        this.getCommments('self');
    }
    handlePopular() {
        this.getCommments('popular');
    }
    handleSearch() {
        let value = this.refs.search.getValue();
        this.setState({searchQuery: value});
        this.getCommments(value);
    }

    handleBack() {
        var back = this.state.postKey-1;
        ContentActions.PickComment(back);
        this.setState({postKey: (back > 0) ? back : 0});
    }
    handleNext() {
        var next = this.state.postKey+1;
        ContentActions.PickComment(next);
        if (this.state.comments[next]) {
            this.setState({postKey: next});
        } else {
            this.getCommments();
        }
    }

    render() {
        var user = this.props.user;
        if (!this.props.user.self) return null;

        var currentComment = this.state.comments[this.state.postKey];

        return (
            <Col xs={12} md={6} mdOffset={3}>
                <Row>
                    <Input type="text" value={this.state.searchQuery} ref="search" onChange={this.handleSearch} addonAfter={<Glyphicon glyph="search" />} placeholder="#cats" />
                    <Button onClick={this.handleBack}>Previous</Button>
                    <Button style={{marginLeft: '15px'}} onClick={this.handleNext}>Next</Button>
                    <Button style={{float: 'right', marginLeft: '15px'}} onClick={this.handleSelf}>Yours</Button>
                    <Button style={{float: 'right', marginLeft: '15px'}} onClick={this.handleFeed}>Your feed</Button>
                    <Button style={{float: 'right'}} onClick={this.handlePopular}>Search popular</Button>
                </Row>
            </Col>
        );
    }
    componentDidMount() {
        this.getCommments('feed');
        ContentStore.addChangeListener(this._onChange);
    }
    componentWillUnmount() {
        ContentStore.removeChangeListener(this._onChange);
    }
    _onChange() {
        this.setState(getStateFromStore());
    }
}

export default Radium(Search);