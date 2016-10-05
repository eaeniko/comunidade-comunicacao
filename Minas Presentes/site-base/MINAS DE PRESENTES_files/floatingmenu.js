/**
 * IDEALIAGroup srl
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.idealiagroup.com/magento-ext-license.html
 *
 * @category   IG
 * @package    IG_FloatingMenu
 * @copyright  Copyright (c) 2011-2012 IDEALIAGroup srl (http://www.idealiagroup.com)
 * @license    http://www.idealiagroup.com/magento-ext-license.html
 */



/*function igFloatingMenuStart() {
	var igFloatingMenuStatus = false;

	// Make placeholders
	var igFloatingMenuNavPlaceholder = document.createElement('div');
	igFloatingMenuNavPlaceholder.setAttribute('id', 'ig-floatingmenu-nav-placeholder');
	$('nav').parentNode.insertBefore(igFloatingMenuNavPlaceholder, $('nav'));
	
	var igFloatingMenuSearchPlaceholder = document.createElement('div');
	igFloatingMenuSearchPlaceholder.setAttribute('id', 'ig-floatingmenu-search-placeholder');
	$('search_mini_form').parentNode.insertBefore(igFloatingMenuSearchPlaceholder, $('search_mini_form'));

	$$('.top-link-cart')[0].setAttribute('id', 'top-link-cart');	

	var igFloatingMenuCartPlaceholder = document.createElement('span');
	igFloatingMenuCartPlaceholder.setAttribute('id', 'ig-floatingmenu-cart-placeholder');
	$('top-link-cart').parentNode.insertBefore(igFloatingMenuCartPlaceholder, $('top-link-cart'));

	$$('.quick-access')[0].setAttribute('id', 'quick-access');
	var igFloatingMenuQuickPlaceholder = document.createElement('div');
	igFloatingMenuQuickPlaceholder.setAttribute('id', 'ig-floatingmenu-quick-placeholder');
	$('quick-access').parentNode.insertBefore(igFloatingMenuQuickPlaceholder, $('quick-access'));
	
	var navMenuPosition = $('nav').cumulativeOffset().top;
	
	function igFloatingMenuOnScroll()
	{

		var scrollTop = document.viewport.getScrollOffsets().top;
		
		if ((scrollTop > navMenuPosition) && !igFloatingMenuStatus) // Show
		{
			igFloatingMenuStatus = true;
			$('ig-floatingmenu-container').setStyle({display: 'block'});
			$('ig-floatingmenu-nav').insert($('nav'));
			$('ig-floatingmenu-search').insert($('search_mini_form'));
			$('ig-floatingmenu-cart').insert($('top-link-cart'));
			$('ig-floatingmenu-quick').insert($('quick-access'));
			
		}
		else if ((scrollTop <= navMenuPosition) && igFloatingMenuStatus) // Hide
		{
			igFloatingMenuStatus = false;
			$('ig-floatingmenu-container').setStyle({display: 'none'});
			$('ig-floatingmenu-nav-placeholder').parentNode.insertBefore($('nav'), $('ig-floatingmenu-nav-placeholder'));
			$('ig-floatingmenu-search-placeholder').parentNode.insertBefore($('search_mini_form'), $('ig-floatingmenu-search-placeholder'));
			$('ig-floatingmenu-quick-placeholder').parentNode.insertBefore($('quick-access'), $('ig-floatingmenu-quick-placeholder'));
		}
	}
	
	// Activate on window scroll
	Event.observe(document, 'scroll', function() {
		igFloatingMenuOnScroll();
	});
	igFloatingMenuOnScroll();
};*/
function igFloatingMenuStart() {
		var navi = $('ig-floatingmenu-container');
		var sear = $$('div.header-right div')[2];
		var carr = $$('ul.links li')[2];
	function igFloatingMenuOnScroll() {
		var navi = $('ig-floatingmenu-container');
		var sear = $$('div.header-right div')[2];
		var carr = $$('ul.links li')[2];
		var scrollTop = parseInt(document.viewport.getScrollOffsets().top);
		if (scrollTop > 100) { 
			navi.setStyle({display: 'block'});
			sear.setStyle({zIndex: '9999',position: 'fixed',top: '10px', left: '450px'});
			carr.setStyle({zIndex: '9999',position: 'fixed',top: '30px', left: '950px'});
		} else { 
			navi.setStyle({display: 'none'});
			sear.setStyle({zIndex: '1',position: 'static'});
			carr.setStyle({zIndex: '1',position: 'static'});
		} 
	}

		Event.observe(document, 'scroll', function() {
			igFloatingMenuOnScroll();
		});
	
/*	$(window).scroll(function () { 
	alert("oi");
		if ($(this).scrollTop() > 150) { 
			nav.addClass("menu-fixo"); 
		} else { 
			nav.removeClass("menu-fixo"); 
		} 
	});  */
};
