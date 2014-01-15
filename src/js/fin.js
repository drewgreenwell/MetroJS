/* Preload Images */
// Usage: jQuery(['img1.jpg', { src: 'img2.jpg' }]).metrojs.preloadImages(function(){ ... });
// Callback function gets called after all images are preloaded
$.fn.metrojs.preloadImages = function (callback) {
        var checklist = $(this).toArray();
        var $img = $("<img style='display:none;' />").appendTo("body");
        $(this).each(function () {
                var src = this;
                if (typeof(this) == "object")
                        src = this.src;
                $img.attr({ src: src }).load(function() {
                        for (var i = 0; i < checklist.length; i++) {
                                if (checklist[i] == element) {
                                        checklist.splice(i, 1);
                                }
                        }
                        if (checklist.length == 0) {
                                callback();
                        }
                });
               
        });
    $img.remove();
};
// object used for compatibility checks
$.fn.metrojs.MetroModernizr = function (stgs) {
    if(typeof(stgs) === "undefined") {
                stgs = { useHardwareAccel: true, useModernizr: typeof(window.Modernizr) !== "undefined" };
        }
    this.isOldJQuery =  /^1\.[0123]/.test($.fn.jquery),
    this.isOldAndroid = (function(){
        try{
            var ua = navigator.userAgent;        
            if( ua.indexOf("Android") >= 0 )
            {
                var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
                if (androidversion < 2.3)
                    return true;
            }
        }catch(err){ $.error(err); }
        return false;
    })();
    this.canTransform = false;
    this.canTransition = false;
    this.canTransform3d = false;
    this.canAnimate = false;
    this.canTouch = false;
    this.canFlip3d = stgs.useHardwareAccel;
    if (stgs.useHardwareAccel == true) {
        if (stgs.useModernizr == false) {
            //determine if the browser supports the neccessary accelerated features
            if (typeof (window.MetroModernizr) !== "undefined") {
                this.canTransform = window.MetroModernizr.canTransform;
                this.canTransition = window.MetroModernizr.canTransition;
                this.canTransform3d = window.MetroModernizr.canTransform3d;
                this.canAnimate = window.MetroModernizr.canAnimate;
                this.canTouch = window.MetroModernizr.canTouch;
            } else {
                window.MetroModernizr = {};
                /***** check for browser capabilities credit: modernizr-1.7 http://modernizr.com/ *****/
                var mod = 'metromodernizr';
                var docElement = document.documentElement;
                var docHead = document.head || document.getElementsByTagName('head')[0];
                var modElem = document.createElement(mod);
                var m_style = modElem.style;
                var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
                var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
                var test_props = function (props, callback) {
                    for (var i in props) {
                        if (m_style[props[i]] !== undefined && (!callback || callback(props[i], modElem))) {
                            return true;
                        }
                    }
                };
                var test_props_all = function (prop, callback) {
                    var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props = (prop + ' ' + domPrefixes.join(uc_prop + ' ') + uc_prop).split(' ');
                    return !!test_props(props, callback);
                };
                var test_3d = function () {
                    var ret = !!test_props(['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']);
                    if (ret && 'webkitPerspective' in docElement.style) {
                        // Webkit allows this media query to succeed only if the feature is enabled.
                        // '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){ ... }'
                        ret = testMediaQuery(['@media (',prefixes.join('transform-3d),('),mod,')','{#metromodernizr{left:9px;position:absolute;height:3px;}}'].join(''), function(div){
                            return div.offsetHeight === 3 && div.offsetLeft === 9;
                        });
                    }
                    return ret;
                };
                var testMediaQuery = function (mq, predicate) {
                    var st = document.createElement('style'),
                        div = document.createElement('div'),
                        ret;
                    st.textContent = mq;
                    docHead.appendChild(st);
                    div.id = mod;
                    docElement.appendChild(div);
                    ret = predicate(div);
                    st.parentNode.removeChild(st);
                    div.parentNode.removeChild(div);
                    return !!ret;
                };
                var test_touch = function() {
                    return canTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch ||
                        (typeof(window.navigator.msMaxTouchPoints) !== "undefined" && window.navigator.msMaxTouchPoints > 0) ||
                        testMediaQuery(['@media (',prefixes.join('touch-enabled),('),mod,')','{#metromodernizr{top:9px;position:absolute}}'].join(''), function(div){
                            return div.offsetTop === 9;
                        });
                };
                this.canTransform = !!test_props(['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform']);
                this.canTransition = test_props_all('transitionProperty');
                this.canTransform3d = test_3d();
                this.canAnimate = test_props_all('animationName');
                this.canTouch = test_touch();
                window.MetroModernizr.canTransform = this.canTransform;
                window.MetroModernizr.canTransition = this.canTransition;
                window.MetroModernizr.canTransform3d = this.canTransform3d;
                window.MetroModernizr.canAnimate = this.canAnimate;
                window.MetroModernizr.canTouch = this.canTouch;
                docElement = null;
                docHead = null;
                modElem = null;
                m_style = null;
            }
        } else {
            this.canTransform = $("html").hasClass("csstransforms");
            this.canTransition = $("html").hasClass("csstransitions");
            this.canTransform3d = $("html").hasClass("csstransforms3d");
            this.canAnimate = $("html").hasClass("cssanimations");
            this.canTouch = $("html").hasClass("touch") || (typeof(window.navigator.msMaxTouchPoints) !== "undefined" && window.navigator.msMaxTouchPoints > 0);
        }
    }
    this.canFlip3d = this.canFlip3d && this.canAnimate && this.canTransform && this.canTransform3d;
};

})(jQuery);