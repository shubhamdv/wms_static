(function() {

  'use strict';

  angular.module('wmsApp')
  .constant('settings', {

      /*Language Dropdown Settings*/
      DEFAULT_LANGUAGE: {
          'name': 'English (India)',
          'locale': 'en',
          'flagURL': 'assets/images/india.png'
      },
      LANGUAGES: [{
          'name': 'English (India)',
          'locale': 'en',
          'flagURL': ''
      }],
      // LANGUAGES: [{
      //     'name': 'Arabic (Dubai)',
      //     'locale': 'ar',
      //     'flagURL': ''
      // }, {
      //     'name': 'English (India)',
      //     'locale': 'en',
      //     'flagURL': ''
      // }, {
      //     'name': 'Malay (Malaysia)',
      //     'locale': 'ml',
      //     'flagURL': ''
      // }, {
      //     'name': 'Tamil (Srilanka)',
      //     'locale': 'tm',
      //     'flagURL': 'assets/images/india.png'
      // }],

      /*pdf file name*/
      SERIAL_PDF_FILE_NAME: 'Serial.pdf',
      BATCH_PDF_FILE_NAME: 'Batch.pdf',
      // csv file name
      ASN_CSV_FILE_NAME: 'ASN',
      BATCH_CSV_FILE_NAME: 'Batch',
      ITEM_CSV_FILE_NAME: 'Item',
      PRODUCT_CSV_FILE_NAME: 'Product',
      CHANNEL_CSV_FILE_NAME: 'Channel',
      /*API's setting to get data for different Pages*/
      API_URI: {
          LOGIN: '/api/login',
          LOGIN_GID: '/api/login-gid',
          FORGOT_PASSWORD: '/api/forgotpassword',
          RESET_PASSWORD: '/api/resetpassword',
          VALIDATE_TOKEN: '/api/resetpassword/validateToken',
          VERIFY_SESSION: '/api/verifySession',
          GET_AUTOCOMPLETE_DATA: '/api/getAutoCompleteData',
          LOGOUT: '/api/logout',
          GET_PUT_LOCATION: '/api/getPutLocation',
          ITEM_PUT_ACTION: '/api/getPutLocation/putAction',
          PUT_AWAY_HISTORY: '/api/putAway/history',
          GET_FC_STATION: '/api/getAllStation',
          USER_PROFILE: '/api/user-profile',
          GET_USER_PERMISSION: '/api/user-profile/getUserpermission',
          GET_PROD_LIST: '/api/product',
          EDIT_PROD_DETAIL: '/api/product/edit',
          GET_PROD_DOWNLOAD_CSV: '/api/product/downloadCsv',
          GET_BATCH_DETAIL: '/api/getBatchDetail',
          BATCH_PRODUCT_LIST: '/api/getBatchDetail/productList',
          BATCH_ITEM_SERIALIZE: '/api/getItemBatchDetail/itemSerialize',
          BATCH_ITEM_RECEIVE: '/api/getItemBatchDetail/receiveItem',
          PRINT_PRODUCT_BARCODE: '/api/getItemBatchDetail/printBarCode',
          REPRINT_RECEIVED_ITEM: '/api/getItemBatchDetail/reprintBarCode',
          BATCH_COMPLETE: '/api/getItemBatchDetail/complateBatch',
          GET_SHIPMENT_DATA: '/api/getShipmentDetail',
          CHANGE_PASSWORD: '/api/changePassword',
          PRINT_ASN_BAR_CODE: '/api/getShipmentDetail/printASNBarCode',
          REPRINT_ASN_BAR_CODE : '/api/getShipmentDetail/rePrintBarCode',
          ACCEPT_ASN_SHIPMENT: '/api/getShipmentDetail/acceptShipment',
          CREATE_ASN: '/api/createASN',
          CREATE_UNEXP_BATCH: '/api/createUnExpectedBatch',
          MANAGE_ASN_DETAIL: 'api/getAsnList',
          RULE_SEARCH_LIST: 'api/getRuleList',
          ASN_CSV_DOWNLOAD: 'api/getAsnList/printASNDefault',
          CANCEL_ASN: 'api/getAsnList/cancelASN',
          REVERT_EXPECT_STATUS: 'api/getAsnList/revertExpectedStatus',
          ASN_DETAIL: 'api/getAsnDetail',
          ASN_PRODUCT_LIST: 'api/getAsnDetail/getProdctList',
          CANCEL_ASN_DETAIL: 'api/getAsnDetail/cancelASN',
          RES_ASN_DETAIL: 'api/getAsnDetail/revertExpectedStatus',
          PRINT_PRODUCT: 'api/getBatchAsnDetail/printProduct',
          ASN_BATCH_DETAIL: 'api/getAsnBatchDetail',
          ASN_BATCH_HISTORY: 'api/getAsnBatchDetail/getAsnBatchHistory',
          MANAGE_BATCH_LIST: 'api/getBatchList',
          BATCH_CSV_DOWNLOAD: 'api/getBatchList/csvDownload',
          GET_QC_ITEM: 'api/getQCItem',
          GET_QC_PROD_DETAIL: 'api/getQCItem/productDetail',
          GET_QC_PCMS_DETAIL: 'api/getQCItem/pcmsDetail',
          GET_QC_ML_DETAIL: 'api/getQCItem/mlDetail',
          GET_QC_ITEM_RULES: 'api/getQCItem/rules',
          ACCEPT_QC_ITEM: 'api/getQCItem/acceptItem',
          ITEM_ACTION: 'api/getQCItem/itemAction',
          GET_MANAGEMENT_LOOKUP: 'api/getManagementLookup',
          GET_FC_DETAIL : '/api/getManagementLookup/getFcDetail',
          GET_SS_DETAIL : '/api/getManagementLookup/getSuplierStoreDetail',
          GET_PCMSAUTOCOMPLETE_DATA: '/api/getManagementLookup/pcmsAutocomplete',
          MANAGE_ITEM_LIST: 'api/getProductItemList',
          MANAGE_ITEM_CSV_DOWNLOAD: 'api/getProductItemList/csvDownload',
          UPDATE_ITEM_ATTR: 'api/updateItemAttribute',
          ITEM_CHANGE_LOG: 'api/getItemChangeLogList',
          PROD_CHANGE_LOG: 'api/getProductChangeLogList',
          PROD_CHANNEL_MAPPING: 'api/getProductChannelMappingList',
          GET_CHANNEL_DOWNLOAD_CSV: 'api/getProductChannelMappingList/csvDownload',
          UPDATE_PROD_CHANNEL_MAPPING: 'api/updateProductChannelMapping',
          GET_PROD_INV_LIST: '/api/product/getProductInvList',
          PCM_ATTRIBUTE_LISTING: '/api/pcmsAttributesListings',
          GODAM_INSTRUCTIONS: '/api/godam/activityInstructions',
          RULE_CREATE: '/api/rule/create',
          RULE_UPDATE: '/api/rule/update'
      },

      /*Url to define some conditions in navbar*/
      ROUTES: {
          SELECT_STATION_URL: '/select/station',
          CHANGE_PASSWORD_URL: '/password/change',
          SELECT_FC_URL: '/select/fc',
          GOOGLE_OAUTH_URL: '/account/google-oauth2'
      },
      AGN_STATUS: ['CRT', 'GIN', 'CMP', 'CAN'],
      BATCH_STATUS: ['CRT', 'POR', 'PIK', 'BRCV', 'RCV', 'ITR', 'CMP', 'EXR'],
      ITEM_STATUS: ['RCV', 'ACC', 'REJ', 'TBQ', 'STK', 'TBP', 'PIK', 'PAK', 'RTS', 'SHP', 'OUT', 'RTV', 'RTO', 'HLD', 'DIS', 'LST', 'JNK', 'EXP', 'PFP', 'RWR', 'RPO', 'ALC'],
      BATCH_ITR_QCD : ['ITR', 'QCD'],
      QC_STATUS : {'HLD': true,'TBQ': true,'RCV': true,'REJ': false,'ACC': false},
      PUT_AWAY_STATUS : {'HLD': false, 'TBQ': true,'RCV': false,'REJ': true,'ACC': true,'STK': true},
      MEASURE_INDEX : ['length', 'width', 'height', 'weight'],
      MODAL_URL : {
        QC_PAGE : 'components/modal/qcModal.html',
        PUT_AWAY : 'components/modal/putAwayModal.html',
        RULE_DETAIL : 'components/modal/viewRuleDetails.html',
        RULE_CREATE_CONFIRM : 'components/modal/createRuleConfirmation.html'
      },
      MODAL_SIZE : { MD : 'md', LG : 'lg',SM : 'sm' },

      /*Pagination default Settings*/
      PAGINATION: {
          resultPerPage: 10,
          startCount: 0,
          pageNo: 1,
          lastCount: 10,
          totalCount: 0
      },
      ACTIVITY_LIST: ['ACC', 'PACK', 'PIK', 'QC', 'REJ', 'RF', 'TBQ'],
      RULE_CREATE: {
        MODAL_NAMES: {0:'masterChannel', 1:'clientParty', 2:'clientStore', 3:'supplierParty', 4:'supplierStore', 5:'fulfillmentCenter', 6:'productCategory', 7:'productType', 8:'productName'}
      },
      /*permissions map settings and user role mapping to decide navbar*/
      LEFT_MENU: [{
          title: 'LEFT_MENU.RCV.MAIN_MENU',
          iconClass: 'icon-receiving',
          submenu: [{
              title: 'LEFT_MENU.RCV.SUB_MENU_TEXT2',
              link: '/asn',
              permission: ['po.can_list_agn'],
              submodule: 'ASN-LIST'
          }, {
              title: 'LEFT_MENU.RCV.SUB_MENU_TEXT3',
              link: '/batches',
              permission: ['po.can_list_po'],
              submodule: 'BATCH-MNG'
          }, {
              title: 'LEFT_MENU.RCV.SUB_MENU_TEXT4',
              link: '/receiving/shipment',
              permission: ['po.can_accept_shipment'],
              submodule: 'SHP-RECEIVING'
          }, {
              title: 'LEFT_MENU.RCV.SUB_MENU_TEXT5',
              link: '/receiving/item',
              permission: ['po.can_receive_po'],
              submodule: 'ITEM-RECEIVING'
          }],
          permissions: ['po.can_list_po', 'po.can_list_agn', 'po.can_accept_shipment', 'po.can_receive_po'],
          module: 'Receiving',
          id: 0
      },{
          title: 'LEFT_MENU.INVENTORY.PRODUCT_TEXT',
          iconClass: 'icon-product',
          submenu: [{
              title: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT1',
              link: '/product',
              permission: ['pcm.can_list_products'],
              submodule: 'PROD'
          }, {
              title: 'LEFT_MENU.INVENTORY.SUB_MENU_TEXT3',
              link: '/item',
              permission: ['ims.can_scan_items'],
              submodule: 'PROD-ITEM'
          }],
          permissions: ['pcm.can_list_products', 'ims.can_scan_items'],
          module: 'INVENTORY',
          id: 2
      },{
          title: 'LEFT_MENU.QC.QC_TEXT',
          iconClass: 'icon-qualitycheck',
          link: '/inbound/qc/item',
          submenu: [],
          permissions: ['ims.can_qc_item'],
          module: 'QC',
          id: 3
      },{
          title: 'LEFT_MENU.PUT.PUT_TEXT',
          iconClass: 'icon-put',
          link: '/inbound/put-away/item',
          submenu: [],
          permissions: ['ims.can_put_item'],
          module: 'PUT',
          id: 4
      },{
          title: 'LEFT_MENU.RULE.RULE_TEXT',
          iconClass: 'fa fa-cog',
          link: '/rules',
          submenu: [],
          permissions: ['pcm.can_add_rules'],
          module: 'RULE',
          id: 6
      }, {
          title: 'LEFT_MENU.RTS.RTS_TEXT',
          iconClass: 'icon-readytoShip',
          submenu: [{
              title: 'LEFT_MENU.RTS.SUB_MENU_TEXT1',
              link: '/rts/get',
              permission: ['P9'],
              submodule: 'PKL'
          }, {
              title: 'LEFT_MENU.RTS.SUB_MENU_TEXT2',
              link: '/rts/list',
              permission: ['P10'],
              submodule: 'PKL'
          }],
          permissions: ['P9', 'P10'],
          module: 'RTS',
          id: 7
      },{
          title: 'LEFT_MENU.DISPATCH.DISPATCH_TEXT',
          iconClass: 'icon-dispatch',
          submenu: [{
              title: 'LEFT_MENU.DISPATCH.SUB_MENU_TEXT2',
              link: '/dispatch/get',
              permission: ['P11'],
              submodule: 'KL'
          }, {
              title: 'LEFT_MENU.DISPATCH.SUB_MENU_TEXT2',
              link: '/dispatch/et',
              permission: ['P12'],
              submodule: 'PKL'
          }],
          permissions: ['P11', 'P12'],
          module: 'DISPATCH',
          id: 8
      }],

      /*To check whether station is required for default landing url or not*/
      DEFAULT_LANDING_URL_MAP: {
          '/receiving/shipment': true,
          '/receiving/item': true,
          '/asn': false,
          '/asn/create': false,
          '/inbound/qc/item': true,
          '/inbound/put-away/item': false
      },

      POST_LOGOUT_LOCATION: '/login',
      // Session key name to fetch from browser cookie/session
      SESSION_KEY_NAME: 'sessionkey',
      FC_NUM: 'fcNum',
      FC_SK: 'fcSk',
      // Prefix for session values
      SESSION_VALUE_PREFIX: 'WMS',
      NON_RESTRICTED_URLS: [
          '/login',
          '/account/google-oauth2',
          '/password/recovery',
          '/password/reset'
      ],
      PASS_CHANGE_SUCCESS_TIMEOUT: 5, //in seconds
      QC_MAX_LIMIT: 20
  });
})();
