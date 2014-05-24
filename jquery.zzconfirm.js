/*!
 * jQuery Plugin zzConfirm v0.2
 *
 * by zzbaivong
 * http://devs.forumvi.com/
 */
(function($) {

    'use strict';

    var zzConfirm_selector = [];

    jQuery.fn.zzConfirm = function(options) {

        var setting = jQuery.extend({
            content: 'Bạn chắc chứ?', // Are you sure?
            lang: ['Có', 'Không'], // ['Ok', 'Cancel']
            width: 'auto', // auto, 150px
            dir: 'top', // top, bottom, left, right
            toggle: false, // true, false
            clickOut: false, // true, false
            ok: function(ele, boxes) {},
            cancel: function(ele, boxes) {}
        }, options);

        var ele, wrap;

        var setDir = function(el, wra) {
            var objW = el.outerWidth();
            var objH = el.outerHeight();
            var objT = el.offset().top;
            var objL = el.offset().left;
            var wrapW = wra.outerWidth();
            var wrapH = wra.outerHeight();
            var wrapT = objT + (objH - wrapH) / 2;
            var wrapL = objL + (objW - wrapW) / 2;

            var dir = setting.dir;

            switch (dir) {
                case 'top':
                    wrapT = objT - wrapH - 10;
                    break;
                case 'bottom':
                    wrapT = objT + objH + 10;
                    break;
                case 'left':
                    wrapL = objL - wrapW - 10;
                    break;
                case 'right':
                    wrapL = objL + objW + 10;
                    break;
            }

            wra.attr('class', dir).show().animate({
                left: wrapL,
                top: wrapT,
                opacity: 1
            });
        };

        var obj = $(this);
        var select = obj.selector;
        var center;

        zzConfirm_selector.push(select);


        return obj.on('click', function(event) {
            event.preventDefault();

            ele = $(this);

            var destroy = function(wra) {
                var wrap = $('#zzConfirm_wrap');
                if (wra) {
                    wrap = $('#zzConfirm_wrap[data-selector="' + wra + '"]');
                }
                ele.removeClass('zzConfirm_active');
                wrap.hide().css({
                    left: center,
                    top: '-100px',
                    opacity: 0
                });
            }

            $('.zzConfirm_active').not(ele).removeClass('zzConfirm_active');

            var thisEle = ele.hasClass('zzConfirm_active');

            if (thisEle && setting.toggle) {

                destroy();

            } else if (!thisEle) {

                ele.addClass('zzConfirm_active');

                if (!$('#zzConfirm_wrap').length) {
                    $('body').append('<div id="zzConfirm_wrap" style="width:' + setting.width + ';left:50%;top:-100px;display:none"><div id="zzConfirm_content"></div><div id="zzConfirm_btn"><div id="zzConfirm_yes"></div><div id="zzConfirm_cancel"></div></div></div>');
                    wrap = $('#zzConfirm_wrap');
                    center = ($(window).width() - wrap.outerWidth()) / 2;
                    wrap.css('left', center);
                } else {
                    wrap = $('#zzConfirm_wrap');
                }


                $('#zzConfirm_content').html(setting.content);

                $('div', '#zzConfirm_btn').off('click').on('click', function() {
                    destroy();
                });

                $('#zzConfirm_yes').html(setting.lang[0]).on('click', function() {
                    setting.ok(ele, wrap);
                });

                $('#zzConfirm_cancel').html(setting.lang[1]).on('click', function() {
                    setting.cancel(ele, wrap);
                });

                wrap.attr('data-selector', select).css('width', setting.width);
                setDir(ele, wrap);
                
                var reDir = true;
                $(window).resize(function() {
                    if (reDir) {
                        setTimeout(function() {
                            setDir(ele.filter('.zzConfirm_active'), wrap);
                            reDir = true;
                        }, 100);
                        reDir = false;
                    }
                });

                if (setting.clickOut) {
                    $(document).click(function(event) {
                        if (!$(event.target).closest(wrap).length && !$(event.target).closest(zzConfirm_selector.join()).length) {
                            destroy(select);
                        }
                    });
                }

            }

        });

    };

})(jQuery);
