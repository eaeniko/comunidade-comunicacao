var minicartUpdate = false;
var cancelTimeOut = 0;
var redirect_status;
var redirect_timeout;
var cart_url;
var show_pop_up;
var win;
var getUrl = window.location;
var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

console.log(baseUrl);

var ajaxLoader = "<div id='loader' style='border: 1px #999999 solid; position: fixed; text-align: center; background-color: #ffffff; z-index: 9999; color: black; overflow: auto; min-height: 50px; min-width: 260px; display:none; margin: 50px; left: 43%; top: 40%; padding: 25px; width: auto; height: auto; margin-left: auto; margin-right: auto;'>" +
    "<img id='loaderGif' src='"+getBaseUrl()+"/skin/frontend/base/default/images/ajaxcart/ajax-loader-black.gif'><p style='font: 12px/1.55 Arial, Helvetica, sans-serif;'>Carregando...</p></div>" +
    "<div id='acoverlay' style='display:none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #000;-moz-opacity: 0.3;opacity: .30;filter: alpha(opacity=30);z-index: 9990;'></div>";
var addButton = "<a title='Add to Cart' class='button button-product'>Add to Cart</a>";
var updateButton = "<a title='Update Cart' class='button btn-cart'>Update Cart</a>";
var wishlist = "<a href class='link-wishlist'>Add to Wishlist</a>";

jQuery(document).ready(function () {
    jQuery("body").append(ajaxLoader);
    jQuery(".button.btn-update").remove();
    jQuery(".button2.btn-update").remove();

    //Changed all buttons with onclick attribute
    jQuery('.product-view .link-wishlist').replaceWith(wishlist);
    jQuery('.sidebar .btn-remove').attr('onclick', '');
    jQuery('.sidebar .actions a').attr('onclick', '');
    if (!jQuery('.catalog-product-view').hasClass('checkout-cart-configure')) {
        jQuery('.catalog-product-view .page .add-to-cart-buttons').empty().append(addButton);
    } else {
        jQuery('.catalog-product-view .page .add-to-cart-buttons').empty().append(updateButton);
    }

    win = new Window({
        id: "alphacube",
        className: "alphacube",
        title: "Por favor, escolha as opções do produto",
        minwidth: 500,
        minheight: 490,
        maxHeight: 1200,
        maxWidth: 1200,
        closable: true,
        minimizable: false,
        maximizable: false,
        resizable: false,
        draggable: false,
        onClose: closeAc,
        showEffect: Element.show,
        hideEffect: Element.hide
    });

    //Disable enter click event (when update qty - cleared all)
    jQuery("body.checkout-cart-index").keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });

    //change view button to cart button
    jQuery(".category-products a.button").prop("title", "Add to Cart");
    jQuery(".category-products a.button").text("Add to Cart");

    //remove onclick attribute, save value
    jQuery.each(jQuery(".category-products .btn-cart"), function (k, v) {
        //var onclick = v.onclick.toString();
        //var url = onclick.substring(onclick.lastIndexOf('\''), onclick.indexOf('\'') + 1);
        //var url = jQuery(v).attr( "data-url" );
        //v.value = url;
        //jQuery(v).attr('onclick','');
    });

    //for theme rwd
    jQuery(document).on('click', "#header-cart a.close.skip-link-close", function (event) {
        event.preventDefault();
        hideShowMiniCart();
    });

    //for theme rwd
    jQuery(document).on('click', ".header-minicart a.skip-link.skip-cart", function (event) {
        event.preventDefault();
        hideShowMiniCart();
    });

    /**
     * Details show in minicart
     * work only when jQuery update minicart (for rwd theme)
     */
    jQuery(document).on('mouseenter', "#cart-sidebar .truncated", function () {
        if (minicartUpdate) {
            if (jQuery(this).children(".truncated_full_value").hasClass('show')) {
                jQuery(this).children(".truncated_full_value").removeClass('show');
            } else {
                jQuery(this).children(".truncated_full_value").addClass('show');
            }
        }
    });

    /**
     * Details hide in minicart
     * work only when jQuery update minicart (for rwd theme)
     */
    jQuery(document).on('mouseleave', "#cart-sidebar .truncated", function () {
        if (minicartUpdate) {
            if (jQuery(this).children(".truncated_full_value").hasClass('show')) {
                jQuery(this).children(".truncated_full_value").removeClass('show');
            } else {
                jQuery(this).children(".truncated_full_value").addClass('show');
            }
        }
    });

    /**
     * work only when jQuery update minicart (for rwd theme)
     */
    function hideShowMiniCart() {
        if (minicartUpdate) {
            if (jQuery(".header-minicart a.skip-link.skip-cart").hasClass('skip-active')) {
                jQuery(".header-minicart a.skip-link.skip-cart").removeClass('skip-active');
                jQuery("#header-cart").removeClass('skip-active');
            } else {
                jQuery(".header-minicart a.skip-link.skip-cart").addClass('skip-active');
                jQuery("#header-cart").addClass('skip-active');
            }
        }
    }

    //add to cart from category
    jQuery(document).on('click', ".category-products .btn-cart", function () {
        //addToCart(this.value);
    });

    //add to cart from category
    jQuery(document).on('click', ".checkout-cart-configure .btn-cart", function () {
        var dataForm = new VarienForm('product_addtocart_form', true);
        if (dataForm.validator.validate()) {
            var params = decodeURIComponent(jQuery('#product_addtocart_form').serialize());
            var url = document.URL.replace('checkout/cart/configure/id/', 'ajaxcart/index/update?id=');
            addToCart(url.substring(0, url.length - 1) + "&" + params);
        }
    });

    //view button (change on add to cart label)
    jQuery(document).on('click', ".category-products a.button", function (event) {
        event.preventDefault();
        addToCart(this.href);
    });

    jQuery(document).on('click', ".page .button-product", function (event) {
        event.preventDefault();
        var dataForm = new VarienForm('product_addtocart_form', true);
        if (dataForm.validator.validate()) {
            addToCartProduct(jQuery('#product_addtocart_form').serialize());
        }
    });

    //wishlist link
    jQuery(document).on('click', ".category-products .link-wishlist", function (event) {
        event.preventDefault();
        ajaxWishlist(this.href);
    });

    //wishlist link in product view
    jQuery(document).on('click', ".product-view .link-wishlist", function (event) {
        event.preventDefault();
        (this.href.indexOf(document.URL) == -1) ? ajaxWishlist(this.href) : ajaxWishlist(jQuery('#product_addtocart_form').serialize());
    });

    //wishlist block remove button
    jQuery(document).on('click', ".block-wishlist .btn-remove", function (event) {
        event.preventDefault();
        ajaxWishlistRemove(this.href);
    });

    //wishlist block add to cart
    jQuery(document).on('click', ".block-wishlist .link-cart", function (event) {
        event.preventDefault();
        addToCart(this.href.replace("wishlist/index/cart", "ajaxcart/index/add"));
    });

    //compare link
    jQuery(document).on('click', ".category-products .link-compare", function (event) {
        event.preventDefault();
        ajaxCompare(this.href);
    });

    //compare link in product view
    jQuery(document).on('click', ".product-view .link-compare", function (event) {
        event.preventDefault();
        ajaxCompare(this.href);
    });

    //compare block remove button
    jQuery(document).on('click', ".block-compare .btn-remove", function (event) {
        event.preventDefault();
        ajaxCompareRemove(this.href.replace("catalog/product_compare/remove/product/", "ajaxcart/index/compareremove/id/"));
    });

    //compare block clear all
    jQuery(document).on('click', ".block-compare .actions a", function (event) {
        event.preventDefault();
        ajaxCompareRemove(this.href.replace("catalog/product_compare/clear/", "ajaxcart/index/compareremove/id/all"));
    });

    //Delete item from cart in sidebar
    jQuery(document).on('click', ".sidebar .block-cart .btn-remove", function (event) {
        event.preventDefault();
        updateCart(this.href.replace("checkout/cart", "ajaxcart/index"));
    });

    //Delete item from cart page
    jQuery(document).on('click', ".checkout-cart-index a.btn-remove.btn-remove2", function (event) {
        event.preventDefault();
        updateCart(this.href.replace("checkout/cart/delete", "ajaxcart/index/deleteCheckout"));
    });

    //Delete all items from cart page
    jQuery(document).on('click', "#shopping-cart-table .btn-empty", function (event) {
        event.preventDefault();
        updateCart(getBaseUrl() + '/ajaxcart/index/deleteall');
    });

    //Update item on cart page
    jQuery(document).on('change', "#shopping-cart-table .input-text.qty", function (event) {
        event.preventDefault();
        var id = this.name.replace(/[^\d.]/g, '');
        updateCart(getBaseUrl() + '/ajaxcart/index/update?id=' + id + '&qty=' + this.value);
    });

    //fix bug top window
    jQuery("#alphacube_row1").removeClass('top');
});

function updateCart(url) {
    showLoading();
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            setAjaxData(data);
        }
    });
}

function ajaxWishlist(url) {
    if (url.indexOf("wishlist/index/add/") != -1) {
        url = url.replace("wishlist/index/add/", "ajaxcart/index/addwishlist/");
    } else {
        url = getBaseUrl() + "/ajaxcart/index/addwishlist?" + url;
    }

    showLoading();
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            updateWishlist(data);
        }
    });
};

function ajaxWishlistRemove(url) {
    url = url.replace("wishlist/index/remove/", "ajaxcart/index/wishlistremove/");
    showLoading();
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            updateWishlist(data);
        }
    });
};

/**
 * Function update wishlist block
 * @param data
 */
function updateWishlist(data) {
    if (data.status == 'ERROR') {
        Dialog.alert(data.message, {
            width: 300, height: 90, okLabel: "close", buttonClass: "button", className: "acalertwindow", showEffect: Element.show, hideEffect: Element.hide,
            ok: function (win) {
                return true;
            }
        });
    } else {
        if (jQuery('.block-wishlist').length) {
            jQuery('.block-wishlist').replaceWith(data.wishlist);
        } else {
            if (jQuery('.col-right').length) {
                jQuery('.col-right').prepend(data.wishlist);
            }
        }
    }
}

function ajaxCompare(url) {
    url = url.replace("catalog/product_compare/add", "ajaxcart/index/compare");
    showLoading();
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.status == 'ERROR') {
                alert(data.message);
            } else if (jQuery('.block-compare').length) {
                jQuery('.block-compare').replaceWith(data.sidebar);
            } else if (jQuery('.col-right').length) {
                jQuery('.col-right').prepend(data.sidebar);
            }

        }
    });
};

function ajaxCompareRemove(url) {
    showLoading();
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.status == 'ERROR') {
                alert(data.message);
            } else {
                if (jQuery('.block-compare').length) {
                    jQuery('.block-compare').replaceWith(data.sidebar);
                } else {
                    if (jQuery('.col-right').length) {
                        jQuery('.col-right').prepend(data.sidebar);
                    }
                }
            }
        }
    });
};

function showLoading() {
    jQuery('#acoverlay').show();
    jQuery('#loader').show();
};

function hideLoading() {
    jQuery('#acoverlay').hide();
    jQuery('#loader').hide();
};

function addToCart(url) {
    showLoading();
    url = url.replace("checkout/cart", "ajaxcart/index");
    if (url.indexOf('ajaxcart/index') == -1) {
        url = getBaseUrl() + "/ajaxcart/index/add?url=" + url;
    }

    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            setAjaxData(data);
        }
    });
};

function addToCartProduct(form) {
    showLoading();
    var url = getBaseUrl() + "/ajaxcart/index/add?" + form;
    console.log(url);
    jQuery.ajax({
        url: url,
        dataType: 'json',
        success: function (data) {
            hideLoading();
            setAjaxData(data);
        }
    });
};

function setAjaxData(data) {
    //fill all global variables
    redirect_status = data.redirect_status;
    redirect_timeout = data.redirect_timeout;
    cart_url = data.cart_url;
    show_pop_up = data.show_pop_up;

    if (data.status == 'ERROR') {
        alert(data.message);
    } else {
        jQuery('#acoverlay').show();
        //if response with option
        if (data.options_url) {
            win.setURL(data.options_url);
            jQuery("#alphacube iframe").attr('scrolling', 'no');
        }
        //if show product info enable
        if (data.productinfo) {
            if (jQuery('#choice').length) {
                jQuery('#choice').remove();
            }
            jQuery('.col-main').append(data.productinfo);
            ajaxshow();
        }
        //update top links for cart
        if (data.toplink) {
            jQuery('.header .links').replaceWith(data.toplink);
        }
        //update sidebar cart
        if (data.sidebar) {
            if (jQuery('.block-cart')) {
                jQuery('.block-cart').replaceWith(data.sidebar);
            }
            ajaxshow();
        }
        //update minicart for rwd theme
        if (data.minicart) {
            if (jQuery('.header-minicart')) {
                jQuery('.header-minicart').empty().append(data.minicart);
            }
            ajaxshow();
        }
        //update cart
        if (data.checkout) {
            if (jQuery('.cart').length) {
                jQuery('.cart').replaceWith(data.checkout);
            }
            ajaxshow();
            jQuery(".button.btn-update").remove();
            jQuery(".button2.btn-update").remove();
        }
        //if response contains wishlist block
        if (data.wishlist) {
            updateWishlist(data);
        }
    }
    minicartUpdate = true;
};

function closeAc() {
    cancelTimeOut = 1;
    jQuery('#ajaxcart').hide();
    hideLoading();
    win.setHTMLContent("");
};

function respondToClick() {
    cancelTimeOut = 1;
    if (!redirect_timeout > 0) {
        cancelTimeOut = 1;
    }
    closeAc();
    win.close();
};

function acLoad() {
    var frame = document.getElementById(win.getId());
    frame.style.zIndex = "9995";
    win.showCenter();
    Event.observe("#acoverlay", 'click', respondToClick);
    hideLoading();
};

function ajaxshow() {
    if (redirect_status == 1) {
        win.hide();
        var acoverlay = document.getElementById("acoverlay");
        if (redirect_timeout > 0) {
            showChoice();
        } else {
            jQuery('#loader').show();
            window.location.replace(cart_url);
        }
    } else {
        win.hide();
        showChoice();
    }
};

function showChoice() {
    if (show_pop_up > 0) {
        cancelTimeOut = 0;
        Event.observe("acoverlay", 'click', respondToClick);
        jQuery('#loader').hide();
        jQuery('#choice').show();
        jQuery('#acoverlay').show();
        if (redirect_timeout > 0) {
            countdown(redirect_timeout);
        }
    } else {
        closeAc();
    }
};

function countdown(seconds) {
    function tick() {
        var counter = document.getElementById("timeout");
        if (counter) {
            counter.innerHTML = String(seconds);
            if (seconds > 0) {
                seconds--;
                if (cancelTimeOut == 0) {
                    setTimeout(tick, 1000);
                }
            } else {
                if (cancelTimeOut == 0) {
                    showLoading();
                    jQuery('#choice').hide();
                    window.location.replace(cart_url);
                }
            }
        }
    }

    if (cancelTimeOut == 0 || seconds > 0) {
        tick();
    }
};

function getBaseUrl() {
    return (!window.location.origin) ? window.location.protocol + "//" + window.location.host : window.location.origin;
};