const { Component, Fragment } = require('inferno');
const Index = require('./index');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { url_for, _p } = helper;

        return <Fragment>
            
            <Index config={config} page={page} helper={helper} />
        </Fragment>;
    }
};
