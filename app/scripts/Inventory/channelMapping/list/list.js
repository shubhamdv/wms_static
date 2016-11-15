'use strict';
/* jshint camelcase: false */

angular.module('wmsApp').config(function($routeProvider ) {
	$routeProvider
		.when('/product-channel-mapping', {
			templateUrl: 'scripts/Inventory/channelMapping/list/list.html',
			controller: 'productChnlMapListCtrl',
			title: 'PAGE_TITLE.TITLE15',
            activeParent: 'INVENTORY',
            activeMenu: 'PROD-CHNL-MAPPING',
            activeParentName: 'LEFT_MENU.INVENTORY.PRODUCT_TEXT',
            activeMenuName: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT2',
            access: {
                requiredLogin: true,
                requiredPrecondition: true,
            }
		});
});