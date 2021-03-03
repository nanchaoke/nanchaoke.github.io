/* eslint-disable node/no-unsupported-features/node-builtins */
(function($, moment, ClipboardJS, config) {
    $('.article img:not(".not-gallery-item")').each(function() {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<p class="has-text-centered is-size-6 caption">' + this.alt + '</p>');
            }
        }
    });

    if (typeof $.fn.lightGallery === 'function') {
        $('.article').lightGallery({ selector: '.gallery-item' });
    }
    if (typeof $.fn.justifiedGallery === 'function') {
        if ($('.justified-gallery > p > .gallery-item').length) {
            $('.justified-gallery > p > .gallery-item').unwrap();
        }
        $('.justified-gallery').justifiedGallery();
    }

    if (!$('.columns .column-right-shadow').children().length) {
        $('.columns .column-right-shadow').append($('.columns .column-right').children().clone());
    }

    if (typeof moment === 'function') {
        $('.article-meta time').each(function() {
            $(this).text(moment($(this).attr('datetime')).fromNow());
        });
    }

    $('.article > .content > table').each(function() {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('justify-content-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('justify-content-start');
        }
    }
    adjustNavbar();
    $(window).resize(adjustNavbar);

    function toggleFold(codeBlock, isFolded) {
        const $toggle = $(codeBlock).find('.fold i');
        !isFolded ? $(codeBlock).removeClass('folded') : $(codeBlock).addClass('folded');
        !isFolded ? $toggle.removeClass('fa-angle-right') : $toggle.removeClass('fa-angle-down');
        !isFolded ? $toggle.addClass('fa-angle-down') : $toggle.addClass('fa-angle-right');
    }

    function createFoldButton(fold) {
        return '<span class="fold">' + (fold === 'unfolded' ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-right"></i>') + '</span>';
    }

    $('figure.highlight table').wrap('<div class="highlight-body">');
    if (typeof config !== 'undefined'
        && typeof config.article !== 'undefined'
        && typeof config.article.highlight !== 'undefined') {

        $('figure.highlight').addClass('hljs');
        $('figure.highlight .code .line span').each(function() {
            const classes = $(this).attr('class').split(/\s+/);
            if (classes.length === 1) {
                $(this).addClass('hljs-' + classes[0]);
                $(this).removeClass(classes[0]);
            }
        });


        const clipboard = config.article.highlight.clipboard;
        const fold = config.article.highlight.fold.trim();

        $('figure.highlight').each(function() {
            if ($(this).find('figcaption').length) {
                $(this).find('figcaption').addClass('level is-mobile');
                $(this).find('figcaption').append('<div class="level-left">');
                $(this).find('figcaption').append('<div class="level-right">');
                $(this).find('figcaption div.level-left').append($(this).find('figcaption').find('span'));
                $(this).find('figcaption div.level-right').append($(this).find('figcaption').find('a'));
            } else {
                if (clipboard || fold) {
                    $(this).prepend('<figcaption class="level is-mobile"><div class="level-left"></div><div class="level-right"></div></figcaption>');
                }
            }
        });

        if (typeof ClipboardJS !== 'undefined' && clipboard) {
            $('figure.highlight').each(function() {
                const id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                const button = '<a href="javascript:;" class="copy" title="Copy" data-clipboard-target="#' + id + ' .code"><i class="fas fa-copy"></i></a>';
                $(this).attr('id', id);
                $(this).find('figcaption div.level-right').append(button);
            });
            new ClipboardJS('.highlight .copy'); // eslint-disable-line no-new
        }

        if (fold) {
            $('figure.highlight').each(function() {
                if ($(this).find('figcaption').find('span').length > 0) {
                    const span = $(this).find('figcaption').find('span');
                    if (span[0].innerText.indexOf('>folded') > -1) {
                        span[0].innerText = span[0].innerText.replace('>folded', '');
                        $(this).find('figcaption div.level-left').prepend(createFoldButton('folded'));
                        toggleFold(this, true);
                        return;
                    }
                }
                $(this).find('figcaption div.level-left').prepend(createFoldButton(fold));
                toggleFold(this, fold === 'folded');
            });

            $('figure.highlight figcaption .fold').click(function() {
                const $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });
        }
    }

    const $toc = $('#toc');
    if ($toc.length > 0) {
        const $mask = $('<div>');
        $mask.attr('id', 'toc-mask');

        $('body').append($mask);

        function toggleToc() { // eslint-disable-line no-inner-declarations
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.on('click', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    }

    // 移动端导航栏
    // 上滑下滑显示隐藏导航栏
    /*var windowTop=0;//初始话可视区域距离页面顶端的距离
    $(window).scroll(function() {
        var scrolls = $(this).scrollTop();//获取当前可视区域距离页面顶端的距离
        if(scrolls>=windowTop){//当scrolls>windowTop时，表示页面在向下滑动
            //需要执行隐藏导航的操作
            if ($('.navbar').hasClass('is-hide')) {
                $('.navbar').removeClass('is-hide').animate({'position': 'absolute'}, 300);
            }
            windowTop=scrolls;
        }else{
            //需要执行显示导航动画操作
            if (!$('.navbar').hasClass('is-hide')) {
                $('.navbar').removeClass('is-hide').animate({'position': 'unset'}, 300);
            }
            windowTop=scrolls;
        }
    })*/

    /*$(window).scroll(function() {
        var startY,endY;
        document.addEventListener('touchstart',function(e){
            startY= e.touches[0].pageY;
        },false);
        document.addEventListener('touchend',function(e){
            endY= e.changedTouches[0].pageY;
            moveLoad();
        },false);
        function moveLoad(){
            var movY=endY-startY;
            if(movY<-80){
                //_this.hide();
                $('.navbar').addClass('is-hide').animate({'position': 'absolute'}, 300);
            }else{
                //_this.show();
                $('.navbar').removeClass('is-hide').animate({'position': 'absolute'}, 300);
            }
        }
    })*/

    // 显示/隐藏导航栏
    $('#nav-list').on('click', function() {
        if ($('#navbar-menu').hasClass('is-hide')) {
            // 出现背景
            $('#back-all').addClass('is-show').removeClass('is-hide');

            // 导航栏
            $('#navbar-menu').removeClass('is-hide').addClass('is-show').children().removeClass('is-totop').addClass('is-top');

            // 点击条变化
            $(this).children('i:first-child').removeClass('back-origin').addClass('rotate-line-first');
            $(this).children('i:last-child').removeClass('back-origin').addClass('rotate-line-last');
        } else {
            // 隐藏背景
            $('#back-all').removeClass('is-show').addClass('is-hide');

            // 导航栏
            $('#navbar-menu').addClass('is-hide').removeClass('is-show').children().addClass('is-totop').removeClass('is-top');

            // 点击条变化
            $(this).children('i:first-child').removeClass('rotate-line-first').addClass('back-origin');
            $(this).children('i:last-child').removeClass('rotate-line-last').addClass('back-origin');
        }
    })

    // 移动端：查看目录显隐导航栏
    var toc = $('#toc').length;
    if (toc === 0) {
        $('.btn-menu').addClass('is-hide').remove();
        $('.search-text').addClass('search-text-long').removeClass('search-text');
        $('.columns .column-right').addClass('is-hide');
    }

    // 导航按钮
    $('.btn-menu').on('click', function() {
        // 隐藏背景
        $('#back-all').removeClass('is-show').addClass('is-hide');

        var tocNumber = $('#toc').length;

        if ($('#navbar-menu').hasClass('is-show') && tocNumber > 0) {
            // 导航栏
            $('#navbar-menu').addClass('is-hide').removeClass('is-show').children().addClass('is-totop').removeClass('is-top');

            // 点击条变化
            $('.is-mobile-new .nav-line:first-child').removeClass('rotate-line-first').addClass('back-origin');
            $('.is-mobile-new .nav-line:last-child').removeClass('rotate-line-last').addClass('back-origin');
        } else {
            // 导航栏
            $('#navbar-menu').removeClass('is-hide').addClass('is-show').children().removeClass('is-totop').addClass('is-top');

            // 点击条变化
            $('.is-mobile-new .nav-line:first-child').removeClass('back-origin').addClass('rotate-line-first');
            $('.is-mobile-new .nav-line:last-child').removeClass('back-origin').addClass('rotate-line-last');
        }
    })

    // 移动端点击背景隐藏导航
    $('#back-all').on('click', function() {
        // 隐藏背景
        $('#back-all').removeClass('is-show').addClass('is-hide');

        // 导航栏
        $('#navbar-menu').addClass('is-hide').removeClass('is-show').children().addClass('is-totop').removeClass('is-top');

        // 点击条变化
        $('#nav-list').children('i:first-child').removeClass('rotate-line-first').addClass('back-origin');
        $('#nav-list').children('i:last-child').removeClass('rotate-line-last').addClass('back-origin');
    })


    // 移动端上下滑动显隐导航栏
    $(document).ready(function() {
        var p = 0,
            t = 0;
 
        $(window).scroll(function(e) {
            // 如果已展开导航，即背景出现时，不允许滑动
            if ($('#back-all').hasClass('is-show')) {
                return;
            } else {
                p = $(this).scrollTop();
                // console.log(p);

                if (t <= p) {
                    // 下滑
                    // console.log("down");
                    if (p > 40) {
                        $('#navbar-toggle').addClass('navbar-toggle-hide').removeClass('navbar-toggle-show');
                    }                
                } else {
                    // 上滑
                    // console.log("up");
                    $('#navbar-toggle').removeClass('navbar-toggle-hide').addClass('navbar-toggle-show');
                }
                
                setTimeout(function() {
                    t = p;
                }, 0);
            }
        });
    });

    // pc首页列表图片滑过光班效果
    var ismobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent); // 判断手机端
    if (!ismobile) {
        $('.card').on({
            mouseenter: function() {
                if ($(this).find('.light-move').hasClass('light-hide')) {
                    $(this).find('.light-move').removeClass('light-hide').addClass('light-show');

                    $(this).find('.card-image').addClass('card-image-index-slide').removeClass('card-image-index-inslide');
                    $(this).find('.title-index').addClass('title-index-slide').removeClass('title-index-inslide');
                    $(this).find('.content-index').addClass('content-index-slide').removeClass('content-index-inslide');
                    $(this).find('.index-info').addClass('index-info-slide').removeClass('index-info-inslide');
                }
            },
            mouseleave: function() {
                $(this).find('.light-move').addClass('light-hide').removeClass('light-show');

                $(this).find('.card-image').removeClass('card-image-index-slide').addClass('card-image-index-inslide');
                $(this).find('.title-index').removeClass('title-index-slide').addClass('title-index-inslide');
                $(this).find('.content-index').removeClass('content-index-slide').addClass('content-index-inslide');
                $(this).find('.index-info').removeClass('index-info-slide').addClass('index-info-inslide');
            }
        })
    }

    // 手机端首页-加密文章添加标记
    if(ismobile) {
        $('.encrypt-tip').parents('.info-line').find('.mobile-pwd').removeClass('is-hide').addClass('is-show');
    }

    // pc首页描述生成加密图标
    $('.encrypt-tip').prepend('<i class="hbe-lock fa fa-lock"></i>');

    // 文章页提示文字前生成加密图标
    $('#hexo-blog-encrypt label').prepend('<i class="hbe-lock fa fa-lock"></i>');

    // 关注二维码效果
    $('#gz-qrcode').on({
        mouseenter: function() {
            $('.gz-qrcode-img').addClass('gz-qrcode-img-show');
        },
        mouseleave: function() {
            $('.gz-qrcode-img').removeClass('gz-qrcode-img-show');
        }
    })

    // 文章内页去掉简介
    $('#cur-article .description').remove();
}(jQuery, window.moment, window.ClipboardJS, window.IcarusThemeSettings));
