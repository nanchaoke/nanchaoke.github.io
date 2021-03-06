const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const classname = require('hexo-component-inferno/lib/util/classname');

function isSameLink(a, b) {
    function santize(url) {
        let paths = url.replace(/(^\w+:|^)\/\//, '').split('#')[0].split('/').filter(p => p.trim() !== '');
        if (paths.length > 0 && paths[paths.length - 1].trim() === 'index.html') {
            paths = paths.slice(0, paths.length - 1);
        }
        return paths.join('/');
    }
    return santize(a) === santize(b);
}

class Navbar extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            menu,
            links,
            showToc,
            tocTitle,
            showSearch,
            searchTitle
        } = this.props;

        return <nav class="navbar navbar-main navbar-toggle" id="navbar-toggle">
            <div class="container">
                <div class="navbar-brand justify-content-center">
                    <a class="navbar-item navbar-logo" href={siteUrl}>
                        {logo && logo.text ? logo.text : <img src={logoUrl} alt={siteTitle} height="28" />}
                    </a>

                    <div class="navbar-end navbar-end-new is-mobile-new">
                        {Object.keys(links).length ? <Fragment>
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <a class="navbar-item navbar-item-new" target="_blank" rel="noopener" title={name} href={link.url}>
                                    {link.icon ? <i class={link.icon}></i> : name}
                                </a>;
                            })}
                        </Fragment> : null}

                        {showSearch ? <a class="navbar-item search is-pc" title={searchTitle} href="javascript:;">
                            <i class="fas fa-search" style="color: #2c97e8"></i>
                        </a> : null}

                        <a class="navbar-item nav-list" id="nav-list" title="移动端导航栏" href="javascript:;">
                            <i class="nav-line"></i>
                            <i class="nav-line"></i>
                        </a>
                    </div>
                </div>
                <div class="navbar-menu">
                    {Object.keys(menu).length ? <div class="navbar-start is-pc">
                        {Object.keys(menu).map(name => {
                            const item = menu[name];
                            return <a class={classname({'navbar-item': true, 'is-active': item.active })} href={item.url}>{name}</a>;
                        })}
                    </div> : null}

                    {Object.keys(menu).length ? <div class="navbar-start navbar-start-new is-mobile-new is-hide" id="navbar-menu">
                        {showSearch ? <div class="search-container">
                            {showToc ? <a class="search" title={searchTitle} href="javascript:;">
                                <i class="fas fa-search search-icon"></i>
                                <span class="search-text">搜索你想看的...</span>
                            </a> : <a class="search" title={searchTitle} href="javascript:;">
                                <i class="fas fa-search search-icon"></i>
                                <span class="search-text-long">搜索你想看的...</span>
                            </a>}

                            {showToc ? <a class="navbar-item is-hidden-tablet catalogue btn-menu" title={tocTitle} href="javascript:;">
                                <i class="fas fa-list-ul"></i>
                            </a> : null}
                        </div> : null}

                        {Object.keys(menu).map(name => {
                            const item = menu[name];
                            return <a class={classname({ 'navbar-item': true, 'is-active': item.active, 'navbar-item-new': true, 'is-totop':true})} href={item.url}>{name}</a>;
                        })}

                        <div class="mobile-qrcode" id="mobile-qrcode" data-code="0">
                            <i class="fa fa-qrcode"></i>
                            <span class="gzgzh">关注公众号</span>
                        </div>
                    </div> : null}

                    <div class="navbar-end is-pc">
                        {Object.keys(links).length ? <Fragment>
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <a class="navbar-item" target="_blank" rel="noopener" title={name} href={link.url}>
                                    {link.icon ? <i class={link.icon}></i> : name}
                                </a>;
                            })}
                        </Fragment> : null}

                        {showToc ? <a class="navbar-item is-hidden-tablet catalogue" title={tocTitle} href="javascript:;">
                            <i class="fas fa-list-ul"></i>
                        </a> : null}

                        {showSearch ? <a class="navbar-item search" title={searchTitle} href="javascript:;">
                            <i class="fas fa-search"></i>
                        </a> : null}
                    </div>

                    <div class="gz-qrcode" id="gz-qrcode"><i class="fa fa-qrcode"></i></div>
                    <div class="gz-qrcode-img"><img src="/img/wxwbwz.png" alt="关注我，一起品读纵横的世界" title="关注我，一起品读纵横的世界" /></div>
                </div>
            </div>
        </nav>;
    }
}

module.exports = cacheComponent(Navbar, 'common.navbar', props => {
    const { config, helper, page } = props;
    const { url_for, _p, __ } = helper;
    const { logo, title, navbar, widgets, search } = config;

    const hasTocWidget = Array.isArray(widgets) && widgets.find(widget => widget.type === 'toc');
    const showToc = (config.toc === true || page.toc) && hasTocWidget && ['page', 'post'].includes(page.layout);

    const menu = {};
    if (navbar && navbar.menu) {
        const pageUrl = typeof page.path !== 'undefined' ? url_for(page.path) : '';
        Object.keys(navbar.menu).forEach(name => {
            const url = url_for(navbar.menu[name]);
            const active = isSameLink(url, pageUrl);
            menu[name] = { url, active };
        });
    }

    const links = {};
    if (navbar && navbar.links) {
        Object.keys(navbar.links).forEach(name => {
            const link = navbar.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        menu,
        links,
        showToc,
        tocTitle: _p('widget.catalogue', Infinity),
        showSearch: search && search.type,
        searchTitle: __('search.search')
    };
});
