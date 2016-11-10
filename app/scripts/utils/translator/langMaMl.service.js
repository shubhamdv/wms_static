'use strict';

angular.module('wmsApp')
    .constant('langML', {
        ml: {
            LANGUAGE_LIST: {
                LANG_SELECTED: 'ഇംഗ്ലീഷ് (ഇന്ത്യ)',
                LANG1: 'ഇംഗ്ലീഷ് (ഇന്ത്യ)',
                LANG2: 'അറബി (ദുബായ്)',
                LANG3: 'മലായ് (മലേഷ്യ)',
                LANG4: 'തമിഴ് (ശ്രീലങ്ക)'
            },
            LOGIN_PAGE: {
                PAGE_TITLE: 'മാൽഗോഡമിലും | ലോഗിൻ',
                ERR1: 'Nama pengguna atau kata laluan tidak sah.',
            },
            HOME_PAGE: {
                PAGE_TITLE: 'Godam | Laman',
                P1: 'Jika anda tidak memiliki ID Delhivery,'
            },
            FORGOT_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | Lupa kata laluan',
                H1: 'Sila masukkan alamat E-mel anda',
                P1: 'Pautan ke menetapkan semula kata laluan anda telah dihantar ke mel anda.',
                ERR2: 'Alamat e-mel terlalu lama.',
                ERR3: 'Masukkan e-mel yang sah. Sebagai contoh, xyz@xyz.com',
                ERR4: 'Ralat berlaku, sila hubungi admin'
            },
            RESET_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | Reset Password',
                CONFIRM_PASSWORD_TEXT: 'Old Password',
                NEW_PASSWORD_TEXT: 'New Password'
            },
            CHANGE_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | Change Password',
                CHANGE_PASSWORD_TEXT: 'Change Password',
                CURRENT_PASSWORD_TEXT: 'Current Password',
                P1: 'Your Password has been changed successfully!',
                P2: 'Taking you to the login page in <time> seconds',
                ERR1: 'New password and confirm password do not match.'
            },
            FC_PAGE: {
                PAGE_TITLE: 'Godam | Perkhidmatan Fulfillment',
                H1: 'ഹലോ',
                H2: 'ഏത് Fulfilment സെന്റർ ജോലിചെയ്യുന്നു',
                SELECT_FC_TEXT: 'Enter location'
            },
            SELECT_STATION_PAGE: {
                PAGE_TITLE: 'Godam | pilih Station',
                P1: 'Sila imbas / masukkan stesen anda bekerja dari?',
                STATION_SCAN_TEXT: 'Enter/Scan your desk location'
            },
            LEFT_MENU: {
                PO: {
                    PO_TEXT: 'Procurement',
                    SUB_MENU_TEXT1: 'Shipment Received',
                    SUB_MENU_TEXT2: 'Shipment Listing'
                },
                RO: {
                    RO_TEXT: 'Receiving',
                    SUB_MENU_TEXT1: 'Listing'
                },
                QC: {
                    QC_TEXT: 'Quality Check',
                    SUB_MENU_TEXT1: 'Listing'
                },
                PICK: {
                    PICK_TEXT: 'Pick',
                    SUB_MENU_TEXT1: 'GET',
                    SUB_MENU_TEXT2: 'Create',
                    SUB_MENU_TEXT3: 'Listing'
                },
                PACK: {
                    PACK_TEXT: 'Pack',
                    SUB_MENU_TEXT1: 'Create',
                    SUB_MENU_TEXT2: 'Listing'
                },
                RTS: {
                    RTS_TEXT: 'Ready To Ship',
                    SUB_MENU_TEXT1: 'Create',
                    SUB_MENU_TEXT2: 'Listing'
                },
                DISPATCH: {
                    DISPATCH_TEXT: 'Dispatch',
                    SUB_MENU_TEXT1: 'Create',
                    SUB_MENU_TEXT2: 'Listing'
                }
            },
            PO_PAGE: {
                SHIPMENT: {
                    PAGE_TITLE: 'Godam | Procurement | Shipment Received',
                    SHP_NO: 'Shipment number',
                    BATCH_NO: 'Batch number',
                    NO_OF_BOX_TEXT: 'Enter no. of boxes',
                    SEARCH_CLIENT_SHP_TEXT: 'Search by Client/ Shipment number'
                }
            },
            HOME_TEXT: 'Home',
            BTN_REPRINT: 'Reprint',
            BTN_PRINT: 'Print',
            BTN_ACCEPT_SHP: 'Accept Shipment',
            CLIENT_TEXT: 'Client',
            H1: 'മാൽഗോഡമിലും',
            BTN_LOGIN_TEXT: 'ലോഗിൻ',
            FORGOT_LINK_TEXT: 'പാസ്വേഡ് മറന്നോ',
            BTN_CONTINUE_TEXT: 'Continue',
            BTN_NEXT: 'അടുത്തത്',
            BTN_LOGIN_TEXT_D: 'Log masuk dengan Delhivery ID',
            PLZ_TEXT: 'sila',
            BTN_CLICK: 'Klik di sini',
            BTN_SUBMIT: 'hantar',
            NO_RECORD: 'Rekod tidak dijumpai',
            LAUNCH_APP: 'Permohonan pelancaran',
            USER_NAME_TEXT: 'Username',
            PASSWORD_TEXT: 'Password',
            BTN_RESET_PASS: 'Reset Password',
            ERR1: 'Masukkan sekurang-kurangnya 3 watak.',
            ERR2: 'Tidak boleh lebih daripada 20 aksara.',
            ERR3: 'Some error occured. Please try again later',
            COMPANY_NAME: 'SSN Logistics Pvt Ltd, 2014',
        }
    });
