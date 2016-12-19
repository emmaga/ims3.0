define(function (require, exports, module) {
    exports.JSON = {
        langName: "English(US)",
        iconUrl: "resources/img/national_flag/usa.png",
        first: "First",
        prev: "Prev",
        next: "Next",
        last: "Last",
        index: {
            title: "CLEAR Information Publishing System",
            resetPassword: "Reset password",
            logout: "Logout",
            dpUpl: "Open upload page",
            menu: {
                console: "Admin Console",
                termList: "Terminal",
                termLog: "Terminal Log",
                statistics: "Online Statistics",
                resource: "Resource Management",
                resourceList: "Resource Storage",
                releases: "Release Management",
                channelList: "Channel List",
                layoutList: "Program templates",
                layout: "Layout",
                administratorTools: "Administrtor Tool",
                userList: "User Management",
                roleList: "Role Privilege",
                oplog: "Operating Log",
                audit: "Channel audit, Resource audit",
            },
            errorRelogin: "Expired login, Please login again!",
            errorRelogin2: "Please Login again",
            errorNoPermissions: "No privilege, Please contact Administrator!"
        },
        termList: {
            termBoxTitle: "Terminal",
            termTreeTitle: "Terminal Category",
            allTerm: "All Terminals",
            uncategorizedTerm: "Uncategorized Terminals",
            uncategorizedTermCf: "Uncategorized",
            edit: "Edit",
            delete: "Delete",
            add: "Add",
            batchConfiguration: "Batch configuration terminals",
            search: "Search Terminal",
            termMove: "Remove",
            awaken: "Awaken",
            dormancy: "Hibernate",
            running: "Running",
            offline: "Offline",
            online: "Online",
            download: "Download",
            preDownload: "Pre-download",
            noTownloadTask: "No download task",
            downloaded: "Downloaded",
            notDownloaded: "Undownload",
            list_currentChannel: "Current channel",
            list_currentLayout: "Current program",
            list_currentVideo: "Current video",
            disk: "Disk",
            RAM: "RAM",
            list_done: "Complete(Successfully)",
            list_queryLog: "View log",
            list_querySreen: "Screen Shot",
            empty: "Null",
            cf_delete: "Delete seleted terminal？",
            cf_awaken: "Wake up seleted terminal？",
            cf_dormancy: "Hibernate selected terminal？",
            cf_deleteCf1: "Delete",
            cf_deleteCf2: "Please confirm again,sure to delete the terminal category? ",
            cf_deleteCf3: "The terminal under the category ",
            cf_deleteCf4: " will not be deleted",
            al_delError: "'Deleted Failure",
            al_comSuc: "Order has been sent",
            al_comFaild: "Failure",
            al_getListFaild: "Obtained Failure",
            al_ssFaild: "Screenshot failure, please try again",
            al_addCfFaild: "Add Failure",
            al_forbidUpdate: "Can't modify the category",
            al_forbidDelete: "Can't delete the category",
            al_deleteRoot: "Could not delete root directory",
            al_deleteRootF: "Deleted Failure",
            al_editRootF: "Edit Failure",
            conf_lbl_basicInfo: "Basic Information",
            conf_lbl_termName: "Terminal name",
            conf_lbl_currentCha: "Current channel",
            conf_lbl_preLssued: "Pre issuing channel",
            conf_lbl_termInfo: "Terminal information",
            conf_lbl_CFInfo: "Configuration Information",
            conf_lbl_updateServer: "Upgrade server",
            conf_lbl_updateServerADD: "Upgrade server address",
            conf_lbl_logServer: "Log server",
            conf_lbl_logServerADD: "Log server address",
            conf_lbl_volume: "Volume",
            conf_lbl_city: "City",
            conf_city_placeholder: "Click select (Decide the weather information)",
            conf_lbl_work: "Worktime",
            conf_lbl_download: "Download time",
            conf_lbl_timeRestart: "Restart",
            conf_lbl_rotate: "Screen rotation",
            conf_ddl_soft: "Software rotation mode",
            conf_ddl_hard: "Hardware rotation mode",
            conf_ddl_clockwise : "Clockwise",
            conf_ddl_counterclockwise: "Anticlockwise",
            conf_lbl_outputMode: "Screen resolution",
            conf_lbl_remoteADB: "Remote debugging ADB",
            conf_lbl_debug: "Print local log",
            conf_lbl_sync: "Sync",
            conf_lbl_syncID: "Terminal sync ID",
            conf_lbl_syncIP: "Sync multicast IP",
            conf_lbl_syncPort: "Sync port",
            conf_lbl_syncTimeout: "For order of time",
            gain: "Obtain",
            gain_wait: "Obtaining, please later",
            save: "Save",
            cancel: "Cancel",
            everyday: "Everyday",

            Monday: "Mon",               //要求缩写
            Tuesday: "Tue",
            Wednesday: "Wed",
            Thursday: "Thu",
            Friday: "Fri",
            Saturday: "Sat",
            Sunday: "Sun",

            ON: "ON",
            OFF: "OFF",
            nothing: "Null",
            al_dlLogFaild: "Download failure, please try again",
            al_gainLogFaild: "Obtain failure, please try again",
            al_selectWorkCycle: "Please select workspace repetition period",
            al_selectWorkStart: "Please input workspace start time",
            al_cfWorkStart: "Please input correct workspace start time",
            al_selectWorkEnd: "Please input workspace end time",
            al_cfWorkEnd: "Please input correct workspace end time",
            al_workStartEnd: "End time could not before start time",
            al_dlStart: "Please input download space start time",
            al_cfStart: "Please input correct download space start time",
            al_dlEnd: "Please input download space end time",
            al_cfEnd: "Please input correct download space start time",
            al_timing: "Please input restart time",
            al_cfTiming: "Please input correct restart time",
            al_syncID: "Please input the synchronous ID",
            al_cfSyncID: "Wrong format, please input again ",
            al_syncIP: "Please input the synchronous multicast IP address",
            al_cfSyncIP: "Wrong format, please input again",
            al_saveTermInfoFaild: "Saved failure",
            al_saveSuc: "Saved",
            al_saveTermConfFaild: "Saved failure",
            al_saveTermConfCFFaild: "Saved failure",
            al_gainCityInfoFaild: "Obtained failure",
            al_gainTermInfoFaild: "Obtained failure",
            al_gainTermInfoCFFaild: "Obtained failure",
            cap_title: "This page is the uniform configuration for terminals in this catagory",
            cap_foot: "Configuration is saving, mass terminals, please wait a moment...",
            al_selectTt: "Please select a terminal category",
            al_gainTtFaild: "Obtained failure",
            al_selectTtT: "Please select",
            all: "All",
            pl_searchTerm: "Search Terminal",
            screenshots: "Screen shot",
            screenshotting: "Screen shotting",
            screenshotsTimeout: "Screen shot timeout, please try again",
            statistics: "Online Statistics",
            termOnlineDur: "Terminals Online Duration",
            termLastOnlineTime: "Offline Terminal Online Last Time",
            lastOnlineTime: "Online Last Time",
            serverData: "Server Status",
            serverInfo: "Server Information",
            livaData: "CPU, RAM Live data",
            core: "Core",
            threads: "Threads",
            utilization: "Utilization",
            available: "Available",
            total: "Total",
            usage: "Usage",
            termName: "Terminal name",
            termMac: "Terminal MAC",
            status: "Status",
            yestOnlineTime: "Yesterday",
            todayOnlineTime: "Today",
            export: "Export",
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        termLog: {
            title: "Log",
            title_right: "You could find MAC in control panel terminal.",
            pl_search: "Terminal mac Search",
            termLog: "Terminal Log",
            termName: "Terminal name",
            termMac: "Terminal MAC",
            eventType: "Type",
            event: "Event",
            date: "Date",
            play: "play",
            pause: "pause",
            stop: "stop",
            startPlay: "start",
            stopPlay: "stop",
            empty: "Null",
        },
        channel: {
            title1: "Channels",
            title2: "Channels List",
            title3: "Publish to",
            prompt1: "Terminals play will change accordingly if channels change after publishing",
            pl_search: "Search",
            publish: "Publish",
            prePublish: "Pre-publish",
            copy: "Copy",
            delete: "Delete",
            importOffline: "Import offline",
            exportOffline: "Create offline",
            chn_submit: "Submit",
            chn_pass: "Pass",
            chn_unpass: "No pass",
            pendingAudit: "To be verified",
            pendingSubmit: "To be submitted",
            pass: "Passed",
            unpass: "No pass",
            addChannel: "Add Channels",
            copySuc: "Copied",
            copyFaild: "Failure",
            deleteSuc: "Deleted",
            deleteFaild: "Failure",
            checkStatus: "Audit status",
            channelName: "Channel",
            chn_portStatus: "Status",
            chn_create: "User",
            chn_createTime: "Date",
            chn_operation: "Operation",
            gainStatusFaild: "Failed to get state",
            pendingProd: "Waiting",
            producing: "In the process",
            prodSuc: "Succeed",
            prodFaild: "Failed",
            download: "Download",
            empty: "Null",
            al_sumbmit: "Submitted",
            al_sumbmitFaild: "Failure",
            al_check: "Audited",
            al_checkFaild: "Failure",
            al_checkFailInfo: "Feedback of unpassed check",
            al_publishSuc: "Published！",
            al_publishFaild: "Failure！",
            al_prePublishSuc: "Pre-published！",
            al_prePublishFaild: "Failure！",
            cf_delete: "Delete？",
            cf_exportOffline: "Create offline zip？",
            al_exportFaild: "Failure",
            title4: "Mass Edit",
            playDuration: "Play Time",
            pl_playDuration: "Input play time",
            playTime: "Play Times",
            pl_playTime: "Input play times",
            prompt2: "Video and audio, Office, PDF resources cannot be modified",
            submit: "Submit",
            al_batchDuration: "Please input correct play time",
            ctrTitle1: "Video Controls",
            ctrTitle2: "Image Controls",
            ctrTitle3: "Audio Controls",
            ctrTitle4: "Text Controls",
            ctrTitle5: "Clock Controls",
            ctrTitle6: "Weather Controls",
            ctrTitle7: "Office Controls",
            Normal: "Normal",
            Marquee: "Marquee",
            WebURL: "Web",
            flipInterval: "Flip interval",
            reflashInterval: "Refresh interval",
            pl_input: "Input",
            second: "Second",
            color: "Color",
            rightToleft: "Right-Left",
            downToup: "Down-Up",
            static: "Static",
            bgcolor: "Background Color",
            pl_bgcolor: "Please choose background color",
            fontColor: "Font Color",
            pl_fontColor: "Please choose clock text color",
            pl_weatherColor: "Please choose weather text color",
            switchingInterval: "Switch interval",
            None: "None",
            Random: "Random",
            batchOperation: "Edit",
            staDuration: "Count time",
            addResource: "Add resource",
            SequencePlay: "Sequence",
            RandomPlay: "Random",
            PercentPlay: "Percent",
            Monday: "Monday",
            Cloudy: "Cloud",
            wind: "No lasting wind dirction：breeze",
            today: "Today",
            Beijing: "Beijing",
            noControls: "Currently has no control",
            resourceName: "File name",
            duration: "Duration",
            times: "Times",
            transparentPrompt: "Comments：the most right side is transparency",
            left: "Left",
            top: "Top",
            size: "Size",
            size2: "Size",
            status: "Status",
            staDuration: "Count time",
            video: "Video",
            image: "Image",
            live: "Live",
            al_duration: "Please input resource duration ",
            al_durationEr: "Wrong resource duration",
            al_times: "Please input resource times",
            al_flipTime: "Please input the interval time",
            al_speed: "Please select the scroll speed",
            al_weaCutTime: "Please input the interval for weather switch",
            done: "Done",
            resourceList: "Resource list",
            pl_searchVideo: "Search Video",
            pl_searchImage: "Search Image",
            pl_searchAudio: "Search Audio",
            pl_searchText: "Search Text",
            pl_searchLive: "Search Live",
            pl_searchOffice: "Search Office/PDF",
            al_videoFormat: "This format does not support preview",
            al_audioFormat: "This format does not support audition",
            nolayout: "None",
            cancel: "Cancel",
            previewProgram: "Preview",
            cancelPreview: "Cancel",
            annually: "Each Year",
            monthly: "Each Month",
            everyDay: "Each Day",
            everyHour: "Each Time",
            everyMin: "Each Minute",
            everySecond: "Each Second",
            everyWeek: "Each Week",
            every: "Each",
            year: "Year",
            month: "Month",
            week: "Week",
            day: "Day",
            min: "Minute",
            hour: "Time",

            Monday: "Mon",           //要求缩写
            Tuesday: "Tue",
            Wednesday: "Wed",
            Thursday: "Thu",
            Friday: "Fri",
            Saturday: "Sat",
            Sunday: "Sun",
            Jan: "Jan",
            Feb: "Feb",
            Mar: "Mar",
            Apr: "Apr",
            May: "May",
            Jun: "Jun",
            Jul: "Jul",
            Aug: "Aug",
            Sep: "Sep",
            Oct: "Oct",
            Nov: "Nov",
            Dec: "Dec",

            termCf: "Terminal category",
            all: "All",
            publishInfo: "Publish information",
            prePublishInfo: "Pre-publish information",
            save: "Save",
            saveSubmit: "Save and submit",
            savePublish: "Save and publish",
            clickAddLayout: "Click it to add new template",
            timingProgram: "Timed program",
            regularProgram: "Regular program",
            add: "Add",
            sequence: "Sequence",
            ratio: "Percent",
            loading: "Loading",
            prompt1: "Note: The current preview is the last saved content",
            strarTime: "Strar time",
            endTime: "End time",
            timingTrigger: "Timing trigger",
            layout: "Layout",
            width: "Width",
            height: "Height",
            timer_annually: "Each year...",
            timer_monthly: "Each month...",
            timer_everyDay: "Each day...",
            timer_everyHour: "Each Hour...",
            timer_everyMin: "Each minute...",
            al_noLayout: "No selected programs",
            cf_deleteLayout: "Delete the program?",
            prompt2: "Note：saving,it will take several minutes",
            al_saveSuc: "Saved",
            al_saveFaild: "Failure",
            VideoBox: "Video Controls",
            AudioBox: "Audio Controls",
            WebBox: "Text Controls",
            ImageBox: "Image Controls",
            ClockBox: "Clock Controls",
            WeatherBox: "Weather Controls",
            OfficeBox: "Office Controls",
            al_chnSavePubSuc: "Saved and Published!",
            al_chnSavePubFaild: "Failure!",
            al_chnSaveSubSuc: "Saved and Submitted!",
            al_chnSaveSubFaild: "Failure！",
            al_startTime: "Please input correct effective time!",
            al_endTime: "Please input correct effective time!",
            al_resetTime: "Effective time earlier than expired time, please input again!",
            newChannel: "New channel",
            editLayout: "Edit Template",
            exitEdit: "Exit edit",
            saveExit: "Save and exit",
            toolbar: "Toolbar",
            text: "Text",
            clock: "Clock",
            weather: "Weather",
            music: "Music",
            canvasArea: "Canvas area",
            ctrlProperties: "Parameter",
            promptSteps1: "Please click the control you want to creat in the toolbar",
            promptSteps2: "Drag the size of control you want to creat",
            promptSteps3: "Drag to adjust the size and location or input the value in the parameter on the right",
            promptSteps4: "Music controls which do not take up the area can be added directly",
            edit: "Edit",
            bgColor: "Background color",
            addBgcolor: "Add background image",
            cancelBgcolor: "Move background image",
            currentCtrl: "Current ctrl",
            layer: "Layer",
            upLayer: "Move Up",
            downLayer: "Move Down",
            selectLayout: "Select Template",
            searchLayout: "Search Template",
            newLayout: "New Template",
            toastW: "Width is too small",
            toastH: "Height is too small",
            toastO: "Beyond the container control",
            titleLayout: "Program Template",
            prompt3: "Split screens could be made with templates,but they must be ready in advance",
            layoutList: "Template List",
            addLayout: "Add template",
            cf_delLayout: "Delete？",
            al_delLayoutFaild: "The channel is Unavilable!",
            layoutName: "Template",
            Default: "Default",
            SimSun: "SimSun",
            SimHei: "SimHei",
            FangSong: "FangSong",
            KaiTi: "KaiTi",
            LiSu: "LiSu",
            YouYuan: "YouYuan",
            YaHei: "Microsoft YaHei",
            Bold: "Bold",
            Italic: "Italic",
        },
        material: {
            resourceTitle: "Resource storage",
            video: "Video",
            image: "Image",
            audio: "Audio",
            text: "Text",
            live: "Live",
            download: "Download",
            edit: "Edit",
            delete: "Delete",
            save: "Save",
            empty: "Null",
            saveSubmit: "Save and submit",
            submitCheck: "Submit for review",
            addResource: "Add resource",
            upload: "Upload",
            addText: "Add text",
            addLive: "Add live",
            refrash: "Refrash",
            checkPass: "Pass",
            checkUnpass: "No pass",
            pendingAudit: "To be verified",
            pendingSubmit: "To be submitted",
            pass: "Passed",
            unpass: "No pass",
            pl_searchVideo: "Search resource",
            pl_searchImage: "Search picture",
            pl_searchAudio: "Search audio",
            pl_searchText: "Search text",
            pl_searchLive: "Search Live Channel",
            pl_searchOffice: "Search Office/PDF",
            checkStatus: "Review",
            resourceName: "Resource",
            size: "Size",
            duration: "Duration",
            transformStatus: "Change the status",
            createUser: "User",
            createTime: "Date",
            tfFaild: "Failure",
            pendingTf: "Waiting for switching",
            transforming: "In the process",
            tfSuc: "Done",
            al_videoFormat: "This format does not support preview",
            al_audioFormat: "This format does not support audition",
            cf_delResource: "Delete the resource will delete the responding resource under the channel, sure to delete？",
            al_submitted: "Submitted",
            al_submitFaild: "Failure",
            al_audited: "Reviewed",
            al_auditFaild: "Failure",
            al_saveSuc: "Saved",
            al_saveFaild: "Failure",
            liveName: "Name of Live resource",
            liveUrl: "Live resource address",
            submit: "Submit",
            editLiveUrl: "Edit Live resource",
            addLiveUrl: "Add Live resource",
            al_addSuc: "Done",
            al_addFaild: "Failure",
            al_editSuc: "Done",
            al_editFaild: "Failure",
            al_inLiveName: "Please input name of Live resource!",
            al_inLiveUrl: "Please input Live resource address",
            webName: "Resource name",
            webType: "Text type",
            normalText: "Text",
            webUrl: "Web url",
            queryCheck: "View audited content",
            exit: "Exit",
            editWeb: "Edit text",
            addWeb: "Add text",
            al_saveSubSuc: "Save and submit successfully",
            al_saveSubFaild: "Save and submit unseccessfully",
            checkedContent: "Approved content",
            al_inWebName: "Please input the text resource name",
            al_inWebUrl: "Please input URL address",
            al_inRiWebUrl: "Please input the correct name",
            name: "Name",
            al_editWebUrl: "Edit online web",
            al_addWebUrl: "Add online web",
            al_inName: "Please input name",
            al_inUrl: "Please input online address",
            resoureEdit: "Edit resource",
            al_inResourceName: "Please input resource name",
            cf_preview: "Picture takes up large memory which probably make broswer not smooth, sure to preview",
            uploadProgress: "Progress",
            speed: "Speed",
            status: "Status",
            cancelUpload: "Cancle",
            canceled: "Canceled",
            uploadFaild: "Failure",
            uploadSuc: "Done",
            al_editText: "In the process of edition, will you leave current page?",
            al_uploading: "In the process of uploading, will you leave current page?",
            al_rightBtn: "Click the cloud button at the top right to reoopen uploading page",
            al_cfCancelUpload: "In the process of uploading resource, sure to cancel the uploading",
            al_cannotUpload: "This resource in this format can not be uploaded",
            noContent: "Null",
            obtainFailure: "Obtain failure, please try again"
        },
        user: {
            administrator: "Administrator",
            userManagement: "User management",
            createNewUser: "Create user",
            username: "User name",
            role: "Role",
            email: "E-mail",
            description: "Description",
            operation: "Operation",
            resetPassword: "Reset password",
            undistributed: "Undistributed",
            cf_delUser: "Confirm to delete this user",
            al_delSuc: "Confirm to delete",
            al_delFaild: "Fail to delete",
            updatePsw: "Edit password",
            resetPsw: "Reset password",
            newPsw: "New password",
            cfPsw: "Confirm",
            submit: "Submit",
            al_noPsw: "Password can not be empty",
            al_pswNotConsistent: "Password is not consistent, please re-enter",
            al_pswUpdateSuc: "Password reset succeeded",
            al_pswUpdateFaild: "Password reset failed",
            al_resetPswSuc: "Password reset succeeded",
            al_resetPswFaild: "Password reset failed",
            editUser: "Edit user",
            addUser: "Create user",
            pl_enUsername: "Please enter user name",
            al_userName: "User name cannot be empty",
            al_mailNotCorrect: "Email format is not correct",
            al_userExisted: "User name already exists",
            al_addUserSuc: "User add succeeded",
            al_addUserFaild: "User add failed",
            al_updateUserSuc: "User update succeeded",
            al_updateUserFaild: "User update failed",
            rolePermission: "Role permission",
            createRole: "Create a new role",
            allRole: "All roles",
            user: "User",
            clickAssign: "Click to assign user",
            cf_delRole: "Confirm to delete this role",
            roleName: "Role name",
            termPermission: "Terminal authorization",
            funcPermission: "Functiona authorization",
            select: "Select",
            editRole: "Edit role",
            assignUser: "Assign user",
            al_assignSuc: "Assign succeeded",
            al_assignFaild: "Assign faild",
            pl_keyword: "Search keyword",
            operationLog: "Operation log",
            logList: "Log list",
            operationObject: "Object",
            operationTime: "Date",
            logContent: "Log content",
            empty: "Null",
            addRole: "Add role",
            pleaseSelect: "Please select",
            failedGetTerminalNodes: "Failed to get terminal nodes",
            al_noRoleName: "Role name cannot be empty",
            al_RoleNameExist: "Role name already exists",
            addSuc: "Added",
            addFaild: "Failure",
            editSuc: "Modified",
            editFaild: "Failure",
            allTerm: "All Terminals",
            administrator: "Administrator",
        }
    }
})