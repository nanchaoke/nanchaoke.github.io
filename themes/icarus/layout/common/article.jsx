const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');

/**
 * Get the word count of text.
 */
function getWordCount(content) {
    if (typeof content === 'undefined') {
        return 0;
    }
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { has_thumbnail, get_thumbnail, url_for, date, date_xml, __, _p } = helper;

        const indexLaunguage = config.language || 'en';
        const language = page.lang || page.language || config.language || 'en';

        return <Fragment>
            {/* Main content */}
            <div class={index?'card card-index':'card card-context'}>
                {/* Thumbnail */}
                {has_thumbnail(page) ? <div class={`card-image ${index ? 'card-image-index is-pc-only' : 'card-image-context'}`}>
                    <a class="image is-7by3 image-pic" href={index ? url_for(page.link || page.path) : `javascript:;`} target={index ? '_blank' : '_self'}>
                        {index ? <span class="light-move light-hide"></span> : null}
                        <img class="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </a>
                </div> : null}

                {/* Metadata */}
                <article class={`card-content article${'direction' in page ? ' ' + page.direction : ''} ${index ? 'card-content-index' : 'card-content-context'}`} role="article">
                    {/* Title */}
                    {index ? <h1 class="title is-3 is-size-4-mobile title-index">
                        {index ? <a class="link-muted nav-link" href={url_for(page.link || page.path)} target="_blank">{page.title}</a> : page.title}
                    </h1> : <h1 class="title is-3 is-size-4-mobile context-title">
                        {index ? <a class="link-muted nav-link" href={url_for(page.link || page.path)} target="_blank">{page.title}</a> : page.title}
                    </h1>}

                    {!index && page.layout !== 'page' ? <div class="article-meta size-small is-uppercase level is-mobile article-meta-context article-meta-mobile">
                        <div class="level-left level-left-toggle">
                            {/* yuanchuang */}
                            {page.author && page.author === '南朝客' ? <span class="level-item yuanchuang"> 原创 </span> : <span class="level-item yuanchuang"> 转载 </span>}
                            
                            {/* Last Update Date */}
                            {/*page.updated && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.updated_at', `<time dateTime="${date_xml(page.updated)}" title="${date_xml(page.updated)}">${date(page.updated)}</time>`)
                            }}></span>/*}

                            {/* author */}
                            {page.author ? <span class="level-item"> {page.author} </span> : null}
                            
                            {/* Categories */}
                            {/* page.categories && page.categories.length ? <span class="level-item">
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a class="link-muted" href={url_for(category.path)} target="_blank">{category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push(<span>&nbsp;/&nbsp;</span>);
                                        }
                                    });
                                    return categories;
                                })()}
                            </span> : null */}
                            
                            {/* Creation Date */}
                            {page.date && <span class="level-item time-context">{date(page.date) === date() ? '今天' : date(page.date)}</span>}

                            {/* Read time */}
                            {/* article && article.readtime && article.readtime === true ? <span class="level-item">
                                {(() => {
                                    const words = getWordCount(page._content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${_p('article.read_time', time.locale(index ? indexLaunguage : language).humanize())} (${_p('article.word_count', words)})`;
                                })()}
                            </span> : null */}
                            
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', '<span id="busuanzi_value_page_pv">0</span> ')
                            }}></span> : null}
                        </div>
                    </div> : null}

                    {!index && page.layout !== 'page' && page.categories && page.categories.length ? <div class="categories-list">
                        <div class="categories-left">
                            <span>收录于分类</span>
                            <span class="level-item">
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a class="link-muted" href={url_for(category.path)} target="_blank"># {category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push(<span>&nbsp;/&nbsp;</span>);
                                        }
                                    });
                                    return categories;
                                })()}
                            </span>
                        </div>

                        <div class="categories-right">
                            {(() => {
                                const categories = [];
                                page.categories.forEach((category, i) => {
                                    categories.push(<a class="link-muted" href={url_for(category.path)} target="_blank"><i class="fa fa-chevron-right"></i></a>);
                                    if (i < page.categories.length - 1) {
                                        categories.push(<span>&nbsp;/&nbsp;</span>);
                                    }
                                });
                                return categories;
                            })()}
                        </div>
                    </div> : null}

                    {index ? <div class="info-line">
                        <div class="content content-index info-line-content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>

                        {has_thumbnail(page) ? <div class="card-image card-image-index info-line-image">
                            <a class="image is-7by3 image-pic" href={index ? url_for(page.link || page.path) : `javascript:;`} target={index ? '_blank' : '_self'}>
                                {index ? <span class="light-move light-hide"></span> : null}
                                <img class="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                            </a>
                        </div> : null}
                    </div> : null}
                    
                    {/* Content/Excerpt */}
                    {!index ? <div class={`content ${index ? 'content-index' : 'content-context'}`} dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div> : null}

                    {index ? <div class="index-info">
                        {/* Index Categories */}
                        {page.categories && page.categories.length ? <span class="level-item categories-index">
                            {(() => {
                                const categories = [];
                                page.categories.forEach((category, i) => {
                                    categories.push(<a class="link-muted" href={url_for(category.path)}>{category.name}</a>);
                                    if (i < page.categories.length - 1) {
                                        categories.push(<span>&nbsp;/&nbsp;</span>);
                                    }
                                });
                                return categories;
                            })()}
                        </span> : null}

                        {/* Index Creation Date */}
                        {page.date && <span class="level-item time-index">{date(page.date)}</span>}
                    </div> : null}

                    {/* Tags */}
                    {/* !index && page.tags && page.tags.length ? <div class="article-tags size-small mb-4">
                        <span class="mr-2">#</span>
                        {page.tags.map(tag => {
                            return <a class="link-muted mr-2" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;
                        })}
                    </div> : null */}

                    {/* Tags */}
                    {!index && page.tags && page.tags.length ? <div class="article-tags size-small mb-4">
                        {page.tags.map(tag => {
                            return <a class="link-muted mr-2 tagname" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;
                        })}
                    </div> : null}

                    {!index ? <div class="guanzhushengming">
                        <div class="shengming">
                            <p>本站文章除注明转载/出处外，均为本站原创或翻译，转载前请务必署名</p>
                            <p>关注我，一起品读纵横的世界</p>
                            <p>
                                微博：<a href="https://weibo.com/u/2821715870" target="_blank">Mr南朝客</a>，公众号：南朝客（NanChaoKe）
                            </p>
                        </div>

                        {/* <div class="guanzhuwo">
                            <img src="/img/wxwbwz.png" alt="关注我，一起品读纵横的世界" title="关注我，一起品读纵横的世界" />
                        </div> */}
                    </div> : null}

                    {/* "Read more" button */}
                    {/*index && page.excerpt ? <a class="article-more button is-small size-small" href={`${url_for(page.link || page.path)}#more`}>{__('article.more')}
                        <i class="fa fa-caret-right famore"></i>
                    </a> : null*/}
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <nav class="post-navigation mt-4 level is-mobile pinglunjuli">
                {page.prev ? <div class="level-start">
                    <a class={`article-nav-prev level level-item${!page.prev ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.prev.path)}>
                        <i class="level-item fas fa-chevron-left"></i>
                        <span class="level-item">{page.prev.title}</span>
                    </a>
                </div> : null}
                {page.next ? <div class="level-end">
                    <a class={`article-nav-next level level-item${!page.next ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.next.path)}>
                        <span class="level-item">{page.next.title}</span>
                        <i class="level-item fas fa-chevron-right"></i>
                    </a>
                </div> : null}
            </nav> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
