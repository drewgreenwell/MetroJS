jQuery.fn.metrojs.theme = {
    loadDefaultTheme: function (stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            jQuery.extend(stg, stgs);
            stgs = stg;
        }
        //get theme from local storage or set base theme
        var hasLocalStorage = typeof (window.localStorage) !== "undefined";
        var hasKeyAndValue = function (key) {
            return (typeof (window.localStorage[key]) !== "undefined" && window.localStorage[key] != null);
        };
        if (hasLocalStorage && (!hasKeyAndValue("Metro.JS.AccentColor") || !hasKeyAndValue("Metro.JS.BaseAccentColor"))) {
            //base theme
            window.localStorage["Metro.JS.AccentColor"] = stgs.accentColor;
            window.localStorage["Metro.JS.BaseAccentColor"] = stgs.baseTheme;
            jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
            jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
            if (typeof (stgs.loaded) === "function")
                stgs.loaded(stgs.baseTheme, stgs.accentColor);
            //preload light theme image
            if (typeof (stgs.preloadAltBaseTheme) !== "undefined" && stgs.preloadAltBaseTheme)
                jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
        } else {
            if (hasLocalStorage) {
                stgs.accentColor = window.localStorage["Metro.JS.AccentColor"];
                stgs.baseTheme = window.localStorage["Metro.JS.BaseAccentColor"];
                jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
                jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
                if (typeof (stgs.loaded) === "function")
                    stgs.loaded(stgs.baseTheme, stgs.accentColor);
            } else {
                jQuery(stgs.accentCssSelector).addClass(stgs.accentColor).data("accent", stgs.accentColor);
                jQuery(stgs.baseThemeCssSelector).addClass(stgs.baseTheme);
                if (typeof (stgs.loaded) === "function")
                    stgs.loaded(stgs.baseTheme, stgs.accentColor);
                //preload light theme image
                if (typeof (stgs.preloadAltBaseTheme) !== "undefined" && stgs.preloadAltBaseTheme)
                    jQuery([(stgs.baseTheme == 'dark') ? stgs.metroLightUrl : stgs.metroDarkUrl]).metrojs.preloadImages(function () { });
            }
        }        
    },
    applyTheme: function (tColor, aColor, stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            stgs = jQuery.extend({}, stg, stgs);
        }

        if (typeof (tColor) !== "undefined" && tColor != null) {
            if (typeof (window.localStorage) !== "undefined") {
                window.localStorage["Metro.JS.BaseAccentColor"] = tColor;
            }
            var $theme = jQuery(stgs.baseThemeCssSelector);
            if ($theme.length > 0) {
                if (tColor == "dark")
                    $theme.addClass("dark").removeClass("light");
                else if (tColor == "light")
                    $theme.addClass("light").removeClass("dark");
            }
        }
        if (typeof (aColor) !== "undefined" && aColor != null) {
            if (typeof (window.localStorage) !== "undefined") {
                window.localStorage["Metro.JS.AccentColor"] = aColor;
            }
            var $accent = jQuery(stgs.accentCssSelector);
            if ($accent.length > 0) {
                var themeset = false;
                $accent.each(function () {
                    jQuery(this).addClass(aColor);
                    var dAccent = jQuery(this).data("accent");
                    if (dAccent != aColor) {
                        var cleanClass = jQuery(this).attr("class").replace(dAccent, "");
                        cleanClass = cleanClass.replace(/(\s)+/, ' ');
                        jQuery(this).attr("class", cleanClass);
                        jQuery(this).data("accent", aColor);
                        themeset = true;
                    }
                });
                if (themeset && typeof (stgs.accentPicked) === "function")
                    stgs.accentPicked(aColor);
            }
        }
    },
    appendAccentColors: function (stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            stgs = jQuery.extend({}, stg, stgs);
        }
        var themeList = "";
        var themes = stgs.accentColors;
        var template = stgs.accentListTemplate;
        for (var i = 0; i < themes.length; i++) {
            themeList += template.replace(/\{0\}/g, themes[i]);
        }
        $(themeList).appendTo(stgs.accentListContainer);
    },
    appendBaseThemes: function (stgs) {
        if (typeof (stgs) === "undefined" || stgs == null) {
            stgs = jQuery.fn.metrojs.theme.defaults;
        } else {
            var stg = jQuery.fn.metrojs.theme.defaults;
            stgs = jQuery.extend({}, stg, stgs);
        }
        var themeList = "",
            themes = stgs.baseThemes,
            template = stgs.baseThemeListTemplate;
        for (var i = 0; i < themes.length; i++) {
            themeList += template.replace(/\{0\}/g, themes[i]);
        }
        $(themeList).appendTo(stgs.baseThemeListContainer);
    },
    // default options for theme
    defaults: {
        baseThemeCssSelector: 'body',                           // selector to place dark or light class after load or selection
        accentCssSelector: '.tiles',                            // selector to place accent color class after load or selection
        accentColor: 'blue',                                    // the default accent color. options are blue, brown, green, lime, magenta, mango, pink, purple, red, teal
        baseTheme: 'dark',                                      // the default theme color. options are dark, light
        accentColors: [
             'amber', 'blue', 'brown', 'cobalt', 'crimson', 'cyan',
             'magenta', 'lime', 'indigo', 'green', 'emerald',
             'mango', 'mauve', 'olive', 'orange', 'pink', 'red',
             'sienna', 'steel', 'teal', 'violet', 'yellow'
        ],
        baseThemes: [
            'light',
            'dark'
        ],
        accentListTemplate: "<li><a href='javascript:;' title='{0}' class='accent {0}'></a></li>", // template to generate accent options
        accentListContainer: "ul.theme-options,.theme-options>ul",                   // selector of container to append accents
        baseThemeListTemplate: "<li><a href='javascript:;' title='{0}' class='accent {0}'></a></li>", // template to generate accent options
        baseThemeListContainer: "ul.base-theme-options,.base-theme-options>ul"                    // selector of container to append accents
    }
};
