import React from 'react';
import Radium from 'radium';
import Color from 'color';

import { getInstaVarious, getSMK, getUserInfo } from 'utils/api.js';
import ContentStore from 'stores/ContentStore.js';
import Constants from 'constants';

import { Col, Carousel, CarouselItem } from 'react-bootstrap';
import Comment from 'components/Comment/index.jsx';
import Comments from 'components/Comments/index.jsx';
import ProfileHeader from 'components/ProfileHeader/index.jsx';

let getStateFromStore = () => {
    return { 
        images: ContentStore.images,
        pagination: ContentStore.pagination,
        comment: ContentStore.comment,
        comments: ContentStore.comments //imageKey: ContentStore.imageKey,
    };
};


class Images extends React.Component {
    constructor(props){
        super(props);
        this.state = getStateFromStore();
        this.direction = null;
        this.imageKey = 0;
        this.handleSelect = this.handleSelect.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    handleSelect(selectedIndex, selectedDirection) {
        this.setState({
          imageKey: selectedIndex,
          direction: selectedDirection
        });
    }

    render() {
        var header = null; 
        header = (this.state.comments) ? this.state.comments[0] : null;
        header = (this.state.comment) ? this.state.comment : header;

        var test = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var zeros = '000000';

        return (
            <Col xs={12} md={6}  mdOffset={3} className="insta-frame">
                <ProfileHeader {...header}/>
                <Carousel activeIndex={this.state.imageKey} direction={this.state.direction} onSelect={this.handleSelect} interval={0}>
                    {test.map((t, key) => {
                        var index = key+1;
                        var number = zeros.substr(0, 4-index.toString().length)+index;
                        var url = `http://maagen.org/photo/photo${number}.jpg`;
                        return (
                            <CarouselItem key={key}>
                                <img style={{margin: '0 auto'}} height={500} alt="900x500" src={url}/>
                            </CarouselItem>
                        );
                    })}
                </Carousel>
                <Comments/>
            </Col>
        );
    }
    componentDidMount() {
        ContentStore.addChangeListener(this._onChange);
    }
    componentWillUnmount() {
        ContentStore.removeChangeListener(this._onChange);
    }
    _onChange() {
        this.setState(getStateFromStore());
    }
}

let style = {
    caption: {
        width: '100%',
        right: 0,
        left: 0,
        bottom: 0,
        padding: '1em',
        paddingBottom: '50px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
}

export default Radium(Images);