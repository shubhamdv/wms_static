'use strict';

angular.module('wmsApp')
    .constant('langAR', {
        ar: {
            LANGUAGE_LIST: {
                LANG_SELECTED: 'الإنجليزية (الهند)',
                LANG1: 'الإنجليزية (الهند)',
                LANG2: 'العربية (دبي)',
                LANG3: 'لغة الملايو (ماليزيا)',
                LANG4: 'التاميل (سري لانكا)'
            },
            LOGIN_PAGE: {
                PAGE_TITLE: 'Godam | تسجيل الدخول',
                ERR1: 'اسم المستخدم أو كلمة المرور غير صالحة.',
            },
            HOME_PAGE: {
                PAGE_TITLE: 'Godam | الصفحة الرئيسية',
                P1: 'إذا كنت لا تملك هوية Delhivery،'
            },
            FORGOT_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | هل نسيت كلمة المرور',
                H1: 'الرجاء إدخال عنوان البريد الإلكتروني الخاص بك',
                P1: 'تم إرسال رابط لإعادة تعيين كلمة المرور الخاصة بك إلى البريد الخاص بك.',
                ERR2: 'عنوان البريد الإلكتروني طويل جدا.',
                ERR3: 'أدخل بريد إلكتروني صحيح. على سبيل المثال، xyz@xyz.com',
                ERR4: 'حدث خطأ، يرجى الاتصال المشرف'
            },
            RESET_PASSWORD_PAGE: {
                PAGE_TITLE: 'Godam | Reset Password',
                CONFIRM_PASSWORD_TEXT: 'Re-Enter Password',
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
                PAGE_TITLE: 'Godam | الخدمات وفاء',
                H1: 'أهلا',
                H2: 'مركز الوفاء التي أنت تعمل في؟',
                SELECT_FC_TEXT: 'Enter location,arbic'
            },
            SELECT_STATION_PAGE: {
                PAGE_TITLE: 'Godam | اختر محطة',
                P1: 'يرجى تفحص / دخول المحطة التي تعمل من؟',
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
            H1: 'Godam',
            BTN_LOGIN_TEXT: 'تسجيل الدخول',
            FORGOT_LINK_TEXT: 'هل نسيت كلمة المرور',
            BTN_CONTINUE_TEXT: 'Continue',
            BTN_NEXT: 'التالى',
            BTN_LOGIN_TEXT_D: 'تسجيل الدخول Delhivery ID',
            PLZ_TEXT: 'من فضلك',
            BTN_CLICK: 'اضغط هنا',
            BTN_SUBMIT: 'عرض',
            NO_RECORD: 'لا يوجد سجلات',
            LAUNCH_APP: 'بدء التطبيق',
            USER_NAME_TEXT: 'Username',
            PASSWORD_TEXT: 'Password',
            BTN_RESET_PASS: 'Reset Password',
            ERR1: 'إدخال 3 أحرف على الأقل.',
            ERR2: 'COMPANY_NAM',
            ERR3: 'Some error occured. Please try again later',
            COMPANY_NAME: 'SSN Logistics Pvt Ltd, 2014'
        }
    });
