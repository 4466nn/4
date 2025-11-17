<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=0.9721555559999999">
    <title>ColorOS 16虚拟按键导航</title>
    
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="background-layer" id="backgroundLayer"></div>
    <div class="glass-layer"></div>
    <div class="overlay" id="overlay"></div>
    <div class="app-launch-animation" id="appLaunchAnimation">
        <div class="app-launch-icon" id="appLaunchIcon"><i class="fas fa-rocket"></i></div>
        <div class="app-launch-text" id="appLaunchText">正在启动应用</div>
        <div class="app-launch-progress"><div class="app-launch-progress-bar" id="appLaunchProgressBar"></div></div>
    </div>
    <div class="window-mode-dialog" id="windowModeDialog">
        <div class="window-mode-content">
            <div class="window-mode-title">选择打开方式</div>
            <div class="window-mode-options">
                <div class="window-mode-option" data-mode="fullscreen"><div class="window-mode-icon"><i class="fas fa-expand"></i></div><div class="window-mode-name">全屏模式</div><div class="window-mode-desc">全屏显示应用</div></div>
                <div class="window-mode-option active" data-mode="window"><div class="window-mode-icon"><i class="fas fa-window-restore"></i></div><div class="window-mode-name">小窗模式</div><div class="window-mode-desc">可拖动和调整大小</div></div>
            </div>
            <div class="window-mode-actions">
                <button class="window-mode-btn window-mode-cancel" id="windowModeCancel">取消</button>
                <button class="window-mode-btn window-mode-confirm" id="windowModeConfirm">确认</button>
            </div>
        </div>
    </div>
    <div class="window-mode-container" id="windowModeContainer">
        <div class="window-mode-header" id="windowModeHeader">
            <div class="window-mode-icon-small" id="windowModeIcon"></div>
            <div class="window-mode-title-small" id="windowModeTitle">应用窗口</div>
            <div class="window-mode-controls">
                <button class="window-mode-btn-small" id="windowModeMinimize"><i class="fas fa-minus"></i></button>
                <button class="window-mode-btn-small" id="windowModeClose"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="window-mode-content"><iframe class="window-mode-iframe" id="windowModeIframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-downloads"></iframe></div>
    </div>
    <div class="multitask-panel" id="multitaskPanel">
        <div class="multitask-header">
            <div class="multitask-title">最近使用的应用</div>
            
            <div class="multitask-close" id="multitaskClose"><i class="fas fa-times"></i></div>
        </div>
        <div class="multitask-content"><div class="recent-apps" id="recentApps"></div>
                <!-- 快捷工具 -->
                <div class="content-group">
                    <h3 class="group-title">快捷工具</h3>
                    <div class="tool-list" id="toolList"></div>
                </div> </div>
    </div>
    <div class="multitask-button" id="multitaskButton"><i class="fas fa-layer-group"></i></div>
    <div class="browser-container" id="browserContainer">
        <div class="browser-header">
            <div class="browser-back-btn" id="browserBackBtn"><i class="fas fa-arrow-left"></i></div>
            <div class="browser-forward-btn" id="browserForwardBtn"><i class="fas fa-arrow-right"></i></div>
            <div class="browser-home-btn" id="browserHomeBtn"><i class="fas fa-home"></i></div>
            <div class="browser-url-bar"><i class="fas fa-lock" id="browserUrlIcon"></i><input type="text" class="browser-url-input" id="browserUrlInput" readonly></div>
            <div class="browser-actions">
                <div class="browser-action-btn" id="browserRefreshBtn"><i class="fas fa-redo"></i></div>
                <div class="browser-action-btn" id="browserCloseBtn"><i class="fas fa-times"></i></div>
            </div>
        </div>
        <div class="browser-tab-container" id="browserTabContainer"></div>
        <div class="bookmarks-container" id="bookmarksContainer"></div>
        <div class="browser-loading"><div class="browser-loading-bar" id="browserLoadingBar"></div></div>
        <div class="browser-content"><iframe class="browser-iframe" id="browserIframe" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-downloads"></iframe></div>
    </div>
    <div class="video-player-container" id="videoPlayerContainer">
        <div class="video-player">
            <video id="videoPlayer" controls></video>
            <div class="video-controls">
                <button id="playPauseBtn"><i class="fas fa-play"></i></button>
                <div class="video-progress" id="videoProgress"><div class="video-progress-filled" id="videoProgressFilled"></div></div>
                <div class="video-time" id="videoTime">0:00 / 0:00</div>
                <button id="muteBtn"><i class="fas fa-volume-up"></i></button>
                <input type="range" id="volumeSlider" class="volume-slider" min="0" max="1" step="0.1" value="1">
                <button id="fullscreenBtn"><i class="fas fa-expand"></i></button>
            </div>
            <button class="close-video" id="closeVideo"><i class="fas fa-times"></i></button>
        </div>
    </div>


    <!-- ColorOS 16 智能侧边栏 -->
    <div class="coloros-sidebar-container">
        
        
        <!-- 侧边栏主体 -->
        <div class="sidebar-main" id="sidebarMain">
            <!-- 顶部控制区 -->
            <div class="sidebar-top">
                 <div class="sidebar-hide" id="sidebarHide">。</div> <div class="float-window-clone" id="floatWindowClone">---</div>
                <div class="transfer-station" id="transferStation">中转站</div>

                                        <div class="quick-setting" id="nightModeBtn"><i class="fas fa-moon"></i><span>暗色</span></div>
            <!-- 应用与工具区 -->
            <div class="sidebar-content" id="sidebarContent" data-layout="single">

                

                
              
                </div>
            </div>
            
            <!-- 底部操作区 -->
            <div class="sidebar-bottom">
               
               <button class="nav-quick-action" onclick="ModalManager.showModal('settings')">
            <i class="fas fa-cog"></i> 完整设置
        </button>
        <button class="nav-quick-action" onclick="toggleDarkMode()">
            <i class="fas fa-moon"></i> 切换主题
        </button>
                            <div class="nav-setting-label">动画效果</div>
            <div class="nav-setting-toggle active" id="animationToggle"></div>
                <div class="modal-section" id="statusCustomizationSection">
        <div class="phone-status-bar">
            <div class="status-left"><i class="fas fa-arrow-left" id="backBtnStatusCustomization"></i><span id="status-customization-page-time">--:--</span></div>

            <div class="status-right"><i class="fas fa-wifi"></i><div class="battery"><div class="battery-level"></div></div></div>
        </div>
       
            <div class="form-group"><label for="statusBarColor">状态栏颜色</label><input type="color" id="statusBarColor" value="#000000"></div>
            <div class="form-group"><label>状态栏图标</label><div class="status-customization">
                <div class="status-item" data-icon="fas fa-wifi"><i class="fas fa-wifi"></i><span>Wi-Fi</span></div>
                <div class="status-item" data-icon="fas fa-signal"><i class="fas fa-signal"></i><span>信号</span></div>
                <div class="status-item" data-icon="fas fa-battery-full"><i class="fas fa-battery-full"></i><span>电池</span></div>
                <div class="status-item" data-icon="fas fa-bluetooth-b"><i class="fas fa-bluetooth-b"></i><span>蓝牙</span></div>
            </div></div>
            <div class="button-group">
                <button id="backToSettingsFromStatus" class="back-btn"><i class="fas fa-arrow-left"></i> 返回设置</button>
                <button id="saveStatusCustomization"><i class="fas fa-save"></i> 保存设置</button>
                
            </div>
        </div>
    </div>
                <!-- 添加系统设置按钮 -->
                   <div class="status-panel" id="statusPanel">
        <div class="status-panel-content">
            <div class="quick-settings">
                <div class="quick-setting" id="wifiSetting"><i class="fas fa-wifi"></i><span>Wi-Fi</span></div>
                <div class="quick-setting" id="bluetoothSetting"><i class="fas fa-bluetooth-b"></i><span>蓝牙</span></div>
                <div class="quick-setting active" id="mobileDataSetting"><i class="fas fa-mobile-alt"></i><span>移动数据</span></div>
                <div class="quick-setting" id="brightnessSetting"><i class="fas fa-sun"></i><span>亮度</span></div>
                <div class="quick-setting" id="volumeQuickSetting"><i class="fas fa-volume-up"></i><span>音量</span></div>
                <div class="quick-setting" id="airplaneSetting"><i class="fas fa-plane"></i><span>飞行模式</span></div>
                <div class="quick-setting" id="locationSetting"><i class="fas fa-map-marker-alt"></i><span>定位</span></div>

            </div>
            <div class="volume-control" id="volumeControl"><i class="fas fa-volume-up"></i><input type="range" id="volumeSliderPanel" class="volume-slider" min="0" max="1" step="0.1" value="1"></div>
            <div class="notifications-container">
                <div class="notifications-header">
                    <div class="notifications-title">通知</div>
                    <button class="clear-all">清除全部</button>
                </div>
                <div class="notifications">
                    <div class="notification-stack">
                        <div class="stacked-notifications" id="stackedNotifications">
                            <div class="stacked-notification">
                                <div class="notification-icon"><i class="fas fa-envelope"></i></div>
                                <div class="notification-content">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="notification-item unread">
                        <div class="notification-icon"><i class="fas fa-bell"></i></div>
                        <div class="notification-content">
                            <div class="notification-header"><div class="notification-title">系统更新</div><div class="notification-time">昨天</div></div>
                            <div class="notification-text">有新版本可用，点击查看详情</div>
                            <div class="notification-actions">
                                <button class="notification-action">稍后提醒</button>
                                <button class="notification-action">立即更新</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
               
            </div>
        </div>
        
        <!-- 浮窗容器 -->
        <div class="float-window-container" id="floatWindowContainer"></div>
    </div>
    
    <!-- 中转站面板 -->
    <div class="transfer-station-panel" id="transferStationPanel">
        <div class="transfer-station-header">
            <div class="transfer-station-title">中转站</div>
            <div class="transfer-station-close" id="transferStationClose">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <div class="transfer-station-content" id="transferStationContent">
            <!-- 中转站内容将动态生成 -->
        </div>
        <textarea class="transfer-station-input" id="transferStationInput" placeholder="输入文字或粘贴内容..."></textarea>
        <div class="transfer-station-actions">
            <button class="transfer-station-btn secondary" id="transferStationClear">清空</button>
            <button class="transfer-station-btn primary" id="transferStationSave">保存</button>
        </div>
    </div>

    <div class="sidebar-gesture-area" id="sidebarGestureArea"></div>
    <div class="virtual-navigation" id="virtualNavigation">
        <div class="nav-indicator" id="navIndicator"></div>
        <div class="nav-button" id="navBack" data-action="back"><div class="icon"><i class="fas fa-arrow-left"></i></div><div class="label">返回</div></div>
        <div class="nav-button" id="navHome" data-action="home"><div class="icon"><i class="fas fa-home"></i></div><div class="label">主页</div></div>
        <div class="nav-button" id="navRecent" data-action="recent"><div class="icon"><i class="fas fa-layer-group"></i></div><div class="label">多任务</div></div>
        <div class="nav-button" id="navSettings" data-action="settings"><div class="icon"><i class="fas fa-cog"></i></div><div class="label">设置</div></div>
    </div>
    <div class="nav-settings-panel" id="navSettingsPanel">
    
    <div class="nav-settings-panel" id="navSettingsPanel">
    <div class="nav-settings-title">系统设置</div>
    <div class="nav-settings-options">
        <!-- 原有的导航设置 -->
        <div class="nav-setting-item">
            <div class="nav-setting-label">显示虚拟导航栏</div>
            <div class="nav-setting-toggle active" id="navToggle"></div>
        </div>
        <div class="nav-setting-item">
            <div class="nav-setting-label">手势提示</div>
            <div class="nav-setting-toggle active" id="hintToggle"></div>
        </div>
        
        <!-- 新增系统设置选项 -->
        <div class="nav-setting-item">
            <div class="nav-setting-label">深色模式</div>
            <div class="nav-setting-toggle" id="darkModeToggle"></div>
        </div>
        <div class="nav-setting-item">

        </div>
        <div class="nav-setting-item">
            <div class="nav-setting-label">声音反馈</div>
            <div class="nav-setting-toggle" id="soundFeedbackToggle"></div>
        </div>
    </div>
    
    <!-- 添加快捷设置按钮 -->
    <div class="nav-settings-quick-actions">
        
    </div>
</div>

        <div class="nav-settings-title">导航栏设置</div>
        <div class="nav-settings-options">
            <div class="nav-setting-item"><div class="nav-setting-label">显示虚拟导航栏</div><div class="nav-setting-toggle active" id="navToggle"></div></div> <div class="system-settings" id="systemSettings">系统设置</div>

              <!-- 侧边栏浮标 -->
        <div class="sidebar-float-btn" id="sidebarFloatBtn">
            <i class="fas fa-chevron-left"></i>
        </div>
            <div class="nav-setting-item"><div class="nav-setting-label">自动隐藏</div><div class="nav-setting-toggle" id="autoHideToggle"></div></div>
        </div>
    </div>
    <div class="nav-toggle-button" id="navToggleButton"><i class="fas fa-bars"></i></div>
    
    <div cass="container">
        <div class="pone-status-bar" id="phoneStatusBar">
                                    <div class=<i class="f</i><div class<div class="</div></div></div>
        </div>
        <div class="status-bar-buttons">
            <div class="status-bar-button" id="statusBarButton"</span></div>
            <div class="status-bar-button" id="statusBarBackButton"</div>
        </div>
        <div class="page-container" id="pageContainer">
            <div class="page" id="mainPage">
                <div class="header-row">
                    <div class="header-left">
                        <div class="logo"><i class="fas fa-rocket"></i></div                                           <div>                      </div>
                <div class="category-tabs" id="categoryTabs"></div>
                <div class="search-container"><i class="fas fa-search"></i><input type="text" id="searchInput" placeholder="搜索应用..."></div>
                <div class="apps-container" id="appsContainer"></div>
                <div class="pagination" id="pagination"></div>
            </div>
        </div>
        
    </div>
    <div class="modal-section" id="addAppSection">
        <div class="phone-status-bar">
            <div class="status-left"><i class="fas fa-arrow-left" id="backBtnAdd"></i><span id="add-page-time">--:--</span></div>
            <div class="status-center">添加应用</div>
            <div class="status-right"><i class="fas fa-wifi"></i><div class="battery"><div class="battery-level"></div></div></div>
        </div>
        <div style="padding:20px;">
            <h2>添加新应用</h2>
            <div class="form-group"><label for="appName">应用名称</label><input type="text" id="appName" placeholder="例如：微信"></div>
            <div class="form-group"><label for="appUrl">应用链接</label><input type="text" id="appUrl" placeholder="例如：https://weixin.qq.com"></div>
            <div class="form-group"><label for="appColor">图标颜色</label><input type="color" id="appColor" value="#6C63FF"></div>
            <div class="form-group"><label for="appCategory">应用分类</label><select id="appCategory"><option value="工具">工具</option><option value="娱乐">娱乐</option><option value="社交">社交</option><option value="工作">工作</option><option value="其他">其他</option></select></div>
            <div class="button-group">
                <button id="backBtn" class="back-btn"><i class="fas fa-arrow-left"></i> 返回</button>
                <button id="addAppBtn"><i class="fas fa-plus"></i> 添加应用</button>
            </div>
        </div>
    </div>
    <div class="modal-section" id="settingsSection">
        <div class="phone-status-bar">
            <div class="status-left"><i class="fas fa-arrow-left" id="backBtnSettings"></i><span id="settings-page-time">--:--</span></div>            <div class="status-center">系统设置</div>
            <div class="status-right"><i class="fas fa-wifi"></i><div class="battery"><div class="battery-level"></div></div></div>
        </div>
        <div style="padding:20px;">
            <h2>系统设置</h2>
            <div class="settings-item"><label for="backgroundType">背景类型</label><select id="backgroundType"><option value="gradient">渐变背景</option><option value="image">自定义图片</option><option value="solid">纯色背景</option></select></div>
            <div class="settings-item" id="backgroundImageItem"><label for="backgroundImage">背景图片</label><input type="file" id="backgroundImage" accept="image/*"></div>
            
                         <div class="sidebar-edit" id="sidebarEdit">编辑</div>
            <div class="nav-setting-item"><div class="nav-setting-label">手势提示</div><div class="nav-setting-toggle active" id="hintToggle"></div></div>

            <div class="nav-setting-item"><div class="nav-setting-label">振动反馈</div><div class="nav-setting-toggle active" id="vibrationToggle"></div></div>
            <div class="nav-setting-item"><div class="nav-setting-label"><h>按键声音</h></div><div class="nav-setting-toggle" id="soundToggle"></div></div>
            <div class="settings-item" id="backgroundColorItem"><label for="backgroundColor">背景颜色</label><input type="color" id="backgroundColor" value="#1a2a6c"></div>
           <select id="statusBarStyle"><option value="dark">深色</option><option value="light">浅色</option><option value="auto">自动</option></select></div>
            <div class="settings-item"><label for="appLimit">每页应用数量</label><select id="appLimit"><option value="6">6个</option><option value="8">8个</option><option value="9" selected>9个</option> <option value="10" selected>10个</option><option value="12">12个</option><option value="16">16个</option><option value="20">20个</option></select></div>
            <div class="settings-item"><label for="animationSpeed">动画速度</label><select id="animationSpeed"><option value="slow">慢</option><option value="normal" selected>正常</option><option value="fast">快</option><option value="slowest">缓慢</option></select></div>
            <div class="settings-item"><label for="themeColor">主题颜色</label><input type="color" id="themeColor" value="#6C63FF"></div>
            <div class="settings-item"><label for="useBuiltInBrowser">使用内置浏览器</label><input type="checkbox" id="useBuiltInBrowser" checked></div>
            <div class="settings-item"><label for="defaultLaunchMode">默认打开方式</label><select id="defaultLaunchMode"><option value="ask">每次询问</option><option value="window">小窗模式</option><option value="fullscreen">全屏模式</option></select></div>
            <div class="settings-item"><label>应用管理</label><button id="appManagementBtn" class="action-btn"><i class="fas fa-cog"></i> 管理应用</button></div>
                            <!-- 最近应用 -->
                <div class="content-group">
                    <h3 class="group-title">最近应用</h3>
                    <div class="app-list" id="recentAppList"></div>
                </div>
                  <!-- 自定义应用 -->
                <div class="content-group">
                    <h3 class="group-title">我的应用</h3>
                    <div class="custom-app-list" id="customAppList"></div>
            <div class="settings-item"><label>状态栏自定义</label><button id="statusCustomizationBtn" class="action-btn"><i class="fas fa-palette"></i> 自定义状态栏</button></div>
            <div class="settings-item"><label>图片存储</label><button id="imageStorageBtn" class="action-btn"><i class="fas fa-images"></i> 图片管理</button></div>
            <div class="settings-item"><label>视频存储</label><button id="videoStorageBtn" class="action-btn"><i class="fas fa-video"></i> 视频管理</button></div>
            <div class="settings-item"><label>数据管理</label><div class="backup-actions"><button id="exportDataBtn" class="backup-btn"><i class="fas fa-download"></i> 导出数据</button><button id="importDataBtn" class="backup-btn"><i class="fas fa-upload"></i> 导入数据</button></div></div>
            <div class="button-group">
                <button id="resetSettings" class="back-btn"><i class="fas fa-undo"></i> 恢复默认</button>
                <button id="saveSettings"><i class="fas fa-save"></i> 保存设置</button> </div></div></div>
    <div class="modal-section" id="appManagementSection">
        <div class="phone-status-bar">
            <div class="status-left"><i class="fas fa-arrow-left" id="backBtnAppManagement"></i><span id="app-management-page-time">--:--</span></div>
            <div class="status-center">应用管理</div>
            <div class="status-right"><i class="fas fa-wifi"></i><div class="battery"><div class="battery-level"></div></div></div>
        </div>
        <div style="padding:20px;">
            <h2>应用管理</h2>
            <div class="app-management-list" id="appManagementList"></div>
            <div class="button-group"><button id="backToSettings" class="back-btn"><i class="fas fa-arrow-left"></i> 返回设置</button></div>
        </div>
    </div>
    
    <div class="modal-section" id="imageStorageSection">
        <div class="phone-status-bar">
            <div class="status-left"><i class="fas fa-arrow-left" id="backBtnImageStorage"></i><span id="image-storage-page-time">--:--</span></div>
            <div class="status-center">图片存储</div>
            <div class="status-right"><i class="fas fa-wifi"></i><div class="battery"><div class="battery-level"></div></div></div>
        </div>
        <div style="padding:20px;">
            <h2>图片存储</h2>
            <div class="form-group"><label for="imageUpload">上传图片</label><input type="file" id="imageUpload" accept="image/*" multiple></div>
            <div class="image-gallery" id="imageGallery"></div>
            <div class="button-group"><button id="backToSettingsFromImages" class="back-btn"><i class="fas fa-arrow-left"></i> 返回设置</button></div>
        </div>
    </div>
    <div class="modal-section" id="videoStorageSection">
        <div class="phone-status-bar">
            <div class="status-left"><i class="fas fa-arrow-left" id="backBtnVideoStorage"></i><span id="video-storage-page-time">--:--</span></div>
            <div class="status-center">视频存储</div>
            <div class="status-right"><i class="fas fa-wifi"></i><div class="battery"><div class="battery-level"></div></div></div>
        </div>
        <div style="padding:20px;">
            <h2>视频存储</h2>
            <div class="form-group"><label for="videoUpload">上传视频</label><input type="file" id="videoUpload" accept="video/*" multiple></div>
            <div class="video-gallery" id="videoGallery"></div>
            <div class="button-group"><button id="backToSettingsFromVideos" class="back-btn"><i class="fas fa-arrow-left"></i> 返回设置</button></div>
        </div>
    </div>
    
<script src="script.js"></script>

</body>
</html>
