'use strict';

angular.module('wmsApp')
    .constant('langTM', {
        tm: {
            LANGUAGE_LIST: {
                LANG_SELECTED: 'ఇంగ్లీష్ (భారతదేశం)',
                LANG1: 'ఇంగ్లీష్ (భారతదేశం)',
                LANG2: 'అరబిక్ (దుబాయ్)',
                LANG3: 'Malay (మలేషియా)',
                LANG4: 'తమిళం (శ్రీలంక)'
            },
            LOGIN_PAGE: {
                PAGE_TITLE: 'గోడం | లాగిన్',
                ERR1: 'செல்லாத பயனர்பெயர் அல்லது கடவுச்சொல்.',
            },
            HOME_PAGE: {
                PAGE_TITLE: 'Godam | முகப்பு',
                P1: 'நீங்கள் ஒரு Delhivery ஐடி சொந்தமாக இல்லை என்றால்,'
            },
            FORGOT_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | கடவுச்சொல்லை மறந்துவிட்டீர்களா',
                H1: 'உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்',
                P1: 'உங்கள் கடவுச்சொல்லை மீட்டமைக்க ஒரு இணைப்பு உங்கள் மின்னஞ்சல் அனுப்பப்பட்டுள்ளது.',
                ERR2: 'மின்னஞ்சல் முகவரி மிகவும் நீளமாக.',
                ERR3: 'ஒரு செல்லுபடியாகும் மின்னஞ்சல் உள்ளிடவும். உதாரணமாக, xyz@xyz.com',
                ERR4: 'பிழை நிர்வாகம் தொடர்பு கொள்ளவும், ஏற்பட்டது'
            },
            RESET_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | Reset Password',
                CONFIRM_PASSWORD_TEXT: 'Re enter Password',
                NEW_PASSWORD_TEXT: 'New Password'
            },
            CHANGE_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | Change Password',
                CHANGE_PASSWORD_TEXT: 'Change Password',
                CURRENT_PASSWORD_TEXT: 'New Password',
                P1: 'Your Password has been changed successfully!',
                P2: 'Taking you to the login page in <time> seconds',
                ERR1: 'New password and confirm password do not match.'
            },
            FC_PAGE: {
                PAGE_TITLE: 'Godam | நிறைவேற்றுதல் சேவைகள்',
                H1: 'హలో',
                H2: 'ఏ కోరికలను నెరవేర్చే సెంటర్ మీరు పని?',
                SELECT_FC_TEXT: 'Enter location'
            },
            SELECT_STATION_PAGE: {
                PAGE_TITLE: 'Godam | ஸ்டேஷன் தேர்ந்தெடுக்கவும்',
                P1: 'ஸ்கேன் செய்யவும் / நீங்கள் பணிபுரிந்தால் நிலையம் நுழைய?',
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
                    SUB_MENU_TEXT1: 'Get',
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
            H1: 'గోడం',
            BTN_LOGIN_TEXT: 'లాగిన్',
            FORGOT_LINK_TEXT: 'పాస్వర్డ్ మర్చిపోయారా',
            BTN_CONTINUE_TEXT: 'Continue',
            BTN_NEXT: 'తదుపరి',
            BTN_LOGIN_TEXT_D: 'Delhivery ஐடி உள்நுழைய',
            PLZ_TEXT: 'தயவு செய்து',
            BTN_CLICK: 'இங்கே கிளிக் செய்யவும்',
            BTN_SUBMIT: 'சமர்ப்பிக்கவும்',
            NO_RECORD: 'எதுவும் இல்லை சாதனை',
            LAUNCH_APP: 'பயன்பாட்டைத் தொடங்கு',
            USER_NAME_TEXT: 'Username',
            PASSWORD_TEXT: 'Password',
            BTN_RESET_PASS: 'Reset Password',
            ERR1: 'குறைந்தது 3 எழுத்துக்கள் உள்ளிடவும்.',
            ERR2: '20 க்கும் மேற்பட்ட எழுத்துகள் இருக்க முடியாது.',
            ERR3: 'Some error occured. Please try again later',
            COMPANY_NAME: 'SSN Logistics Pvt Ltd, 2014',
        }
    });
