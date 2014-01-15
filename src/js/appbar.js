jQuery.fn.applicationBar = function (options) {    
    /* Setup the public options for the applicationBar  */
    var stgs = typeof (jQuery.fn.metrojs.theme) !== "undefined" ? jQuery.fn.metrojs.theme.defaults : {};
    jQuery.extend(stgs, jQuery.fn.applicationBar.defaults, options);
    if (typeof (jQuery.fn.metrojs.theme) != "undefined") {
        var theme = jQuery.fn.metrojs.theme;
        if (stgs.shouldApplyTheme) {         
            theme.loadDefaultTheme(stgs);
        }
        var themeContainer = stgs.accentListContainer.replace(",", " a,") + " a";
        var themeContainerClick = function () {
            var accent = jQuery(this).attr("class").replace("accent", "").replace(" ", "");
            theme.applyTheme(null, accent, stgs);
            if (typeof (stgs.accentPicked) == "function")
                stgs.accentPicked(accent);
        };
        var baseContainer = stgs.baseThemeListContainer.replace(","," a,") + " a";
        var baseContainerClick = function () {
            var accent = jQuery(this).attr("class").replace("accent", '').replace(' ', '');
            theme.applyTheme(accent, null, stgs);
            if (typeof (stgs.themePicked) == "function")
                stgs.themePicked(accent);
        };
        if (typeof ($.fn.on) === "function") {
            $(this).on("click.appBar", themeContainer, themeContainerClick);
            $(this).on("click.appBar", baseContainer, baseContainerClick);
        } else {
            $(themeContainer).live("click.appBar", themeContainerClick);
            $(baseContainer).live("click.appBar", baseContainerClick);
        }
    }
    //this should really only run once but we can support multiple application bars
    return $(this).each(function (idx, ele) {
    	var $this = $(ele),
            data = $.extend({}, stgs);
    	if(data.collapseHeight == "auto")
        	data.collapseHeight = $(this).height();

        //unfortunately we have to sniff out mobile browsers because of the inconsistent implementation of position:fixed
        //most desktop methods return false positives on a mobile
        //todo: find/come up with a better fixed position test
        if (navigator.userAgent.match(/(Android|webOS|iPhone|iPod|BlackBerry|PIE|IEMobile)/i)) {
            // IEMobile10 supports position:fixed. This should cover up to IE20 or at least until fixed positioning gets sorted            
            // let iOS 5+ pass as well, hopefully by iOS 9 fixed pos will be standard :/
            if (!navigator.userAgent.match(/(IEMobile\/1)/i) && !navigator.userAgent.match(/(iPhone OS [56789])/i)) {
                $this.css({ position: 'absolute', bottom: '0px' });
            }
        }
        data.slideOpen = function () {
            if (!$this.hasClass("expanded"))
                data.animateAppBar(false);
        };
        data.slideClosed = function () {
            if ($this.hasClass("expanded"))
                data.animateAppBar(true);
        };
        data.animateAppBar = function (isExpanded) {
            var hgt = isExpanded ? data.collapseHeight : data.expandHeight;
            if (isExpanded)
                $this.removeClass("expanded");
            else
                if (!$this.hasClass("expanded"))
                    $this.addClass("expanded");
            $this.stop().animate({ height: hgt }, { duration: data.duration });
        };
        $this.data("ApplicationBar", data)

        $this.find(stgs.handleSelector).click(function () {
            data.animateAppBar($this.hasClass("expanded"));
        });

        if (data.bindKeyboard == true) {
            jQuery(document.documentElement).keyup(function (event) {
                // handle cursor keys
                if (event.keyCode == 38) {
                    // expand
                    if (event.target && event.target.tagName.match(/INPUT|TEXTAREA|SELECT/i) == null) {
                        if (!$this.hasClass("expanded")) {
                            data.animateAppBar(false);
                        }
                    }
                    
                } else if (event.keyCode == 40) {
                    // collapse
                    if (event.target && event.target.tagName.match(/INPUT|TEXTAREA|SELECT/i) == null) {
                        if ($this.hasClass("expanded")) {
                            data.animateAppBar(true);
                        }
                    }
                }
            });            
        }
    });
};

// default options for applicationBar, the theme defaults are merged with this object when the applicationBar function is called
jQuery.fn.applicationBar.defaults = {
    applyTheme: true,                                       // should the theme be loaded from local storage and applied to the page
    themePicked: function (tColor) { },                     // called when a new theme is chosen. the chosen theme (dark | light)
    accentPicked: function (aColor) { },                    // called when a new accent is chosen. the chosen theme (blue, mango, purple, etc.)
    loaded: function (tColor, aColor) { },                  // called if applyTheme is true onload when a theme has been loaded from local storage or overridden by options
    duration: 300,                                          // how fast should animation be performed, in milliseconds
    expandHeight: "320px",                                  // height the application bar to expand to when opened
    collapseHeight: "auto",                                 // height the application bar will collapse back to when closed
    bindKeyboard: true,                                     // should up and down keys on keyborad be bound to the application bar
    handleSelector: "a.etc",
    metroLightUrl: 'images/metroIcons_light.jpg',  // the url for the metro light icons (only needed if preload 'preloadAltBaseTheme' is true)
    metroDarkUrl: 'images/metroIcons.jpg',         // the url for the metro dark icons (only needed if preload 'preloadAltBaseTheme' is true)
    preloadAltBaseTheme: false                             // should the applicationBar icons be pre loaded for the alternate theme to enable fast theme switching    
};