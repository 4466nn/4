    // 性能优化工具
const PerformanceUtils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 内存优化：清理未使用的资源
    cleanupUnusedResources() {
        // 强制垃圾回收（如果浏览器支持）
        if (window.gc) {
            window.gc();
        }
        
        // 清理过期的数据
        const now = Date.now();
        if (recentApps) {
            recentApps = recentApps.filter(app => 
                now - app.timestamp < 24 * 60 * 60 * 1000 // 保留24小时内的记录
            );
        }
    }
};

// 初始化性能监控
const PerformanceMonitor = {
    init() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.rafId = null;
        
        this.startMonitoring();
    },
    
    startMonitoring() {
        const measure = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                // 如果FPS过低，触发优化
                if (this.fps < 30) {
                    this.triggerOptimization();
                }
            }
            
            this.rafId = requestAnimationFrame(measure);
        };
        
        this.rafId = requestAnimationFrame(measure);
    },
    
    triggerOptimization() {
        console.warn('低FPS检测，正在优化...');
        PerformanceUtils.cleanupUnusedResources();
        
        // 减少动画复杂度
        document.querySelectorAll('.app-item').forEach(item => {
            item.style.willChange = 'auto';
        });
    },
    
    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
};
    
        // ColorOS 16 智能侧边栏功能实现
        class ColorOSSidebar {
            constructor() {
                this.isActive = false;
                this.isEditMode = false;
                this.floatWindows = [];
                this.transferItems = [];
                this.currentLayout = 'single';
                this.init();
            }
            
            init() {
                this.setupDOM();
                this.setupEventListeners();
                this.loadData();
                this.renderContent();
            }
            
            setupDOM() {
                this.elements = {
                    container: document.querySelector('.coloros-sidebar-container'),
                    floatBtn: document.getElementById('sidebarFloatBtn'),
                    main: document.getElementById('sidebarMain'),
                    content: document.getElementById('sidebarContent'),
                    recentAppList: document.getElementById('recentAppList'),
                    toolList: document.getElementById('toolList'),
                    customAppList: document.getElementById('customAppList'),
                    transferStation: document.getElementById('transferStation'),
                    transferStationPanel: document.getElementById('transferStationPanel'),
                    floatWindowClone: document.getElementById('floatWindowClone'),
                    sidebarEdit: document.getElementById('sidebarEdit'),
                    systemSettings: document.getElementById('systemSettings'),
                    sidebarHide: document.getElementById('sidebarHide'),
                    floatWindowContainer: document.getElementById('floatWindowContainer')
                };
            }
            
            setupEventListeners() {
                // 浮标点击事件
                this.elements.floatBtn.addEventListener('click', () => {
                    this.toggleSidebar();
                });
                
                // 手势呼出
                this.setupGestureEvents();
                
                // 侧边栏内部功能
                this.elements.sidebarHide.addEventListener('click', () => {
                    this.hideSidebar();
                });
                
                this.elements.sidebarEdit.addEventListener('click', () => {
                    this.toggleEditMode();
                });
                
                // 系统设置按钮事件
                this.elements.systemSettings.addEventListener('click', () => {
                    // 调用第一个文档中的设置面板打开功能
                    ModalManager.showModal('settings');
                    this.hideSidebar();
                });
                
                this.elements.floatWindowClone.addEventListener('click', () => {
                    this.createFloatWindow();
                });
                
                this.elements.transferStation.addEventListener('click', () => {
                    this.showTransferStation();
                });
                
                // 中转站面板事件
                document.getElementById('transferStationClose').addEventListener('click', () => {
                    this.hideTransferStation();
                });
                
                document.getElementById('transferStationSave').addEventListener('click', () => {
                    this.saveTransferItem();
                });
                
                document.getElementById('transferStationClear').addEventListener('click', () => {
                    this.clearTransferItems();
                });
                
                // 点击外部关闭侧边栏
                document.addEventListener('click', (e) => {
                    if (this.isActive && !this.elements.main.contains(e.target) && !this.elements.floatBtn.contains(e.target)) {
                        this.hideSidebar();
                    }
                });
            }
            
            setupGestureEvents() {
                let startX = 0;
                let startY = 0;
                let isSwiping = false;
                
                // 触摸事件
                document.addEventListener('touchstart', (e) => {
                    if (e.touches[0].clientX > window.innerWidth - 50) {
                        startX = e.touches[0].clientX;
                        startY = e.touches[0].clientY;
                        isSwiping = true;
                    }
                });
                
                document.addEventListener('touchmove', (e) => {
                    if (!isSwiping) return;
                    
                    const currentX = e.touches[0].clientX;
                    const deltaX = startX - currentX;
                    
                    if (deltaX > 50 && !this.isActive) {
                        this.showSidebar();
                        isSwiping = false;
                    }
                });
                
                document.addEventListener('touchend', () => {
                    isSwiping = false;
                });
                
                // 鼠标事件
                document.addEventListener('mousedown', (e) => {
                    if (e.clientX > window.innerWidth - 50) {
                        startX = e.clientX;
                        startY = e.clientY;
                        isSwiping = true;
                    }
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isSwiping) return;
                    
                    const currentX = e.clientX;
                    const deltaX = startX - currentX;
                    
                    if (deltaX > 50 && !this.isActive) {
                        this.showSidebar();
                        isSwiping = false;
                    }
                });
                
                document.addEventListener('mouseup', () => {
                    isSwiping = false;
                });
            }
            
            toggleSidebar() {
                if (this.isActive) {
                    this.hideSidebar();
                } else {
                    this.showSidebar();
                }
            }
            
            showSidebar() {
                this.elements.main.classList.add('active');
                this.isActive = true;
                
                // 更新浮标图标
                this.elements.floatBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            }
            
            hideSidebar() {
                this.elements.main.classList.remove('active');
                this.isActive = false;
                
                // 更新浮标图标
                this.elements.floatBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                
                // 退出编辑模式
                if (this.isEditMode) {
                    this.toggleEditMode(false);
                }
            }
            
            toggleEditMode(force) {
                this.isEditMode = force !== undefined ? force : !this.isEditMode;
                
                if (this.isEditMode) {
                    this.elements.main.classList.add('edit-mode');
                    this.elements.sidebarEdit.textContent = '完成';
                } else {
                    this.elements.main.classList.remove('edit-mode');
                    this.elements.sidebarEdit.textContent = '编辑';
                }
            }
            
            toggleLayout() {
                this.currentLayout = this.currentLayout === 'single' ? 'double' : 'single';
                this.elements.content.setAttribute('data-layout', this.currentLayout);
                this.elements.main.classList.toggle('double-column', this.currentLayout === 'double');
                
                this.saveSettings();
            }
            
            createFloatWindow(app = null) {
                const floatWindow = document.createElement('div');
                floatWindow.className = 'float-window';
                
                const windowId = 'float-window-' + Date.now();
                floatWindow.id = windowId;
                
                const appData = app || {
                    name: '浮窗应用',
                    url: '  https://m.baidu.com/ ',
                    color: '#0066FF'
                };
                
                floatWindow.innerHTML = `
                    <div class="float-window-header">
                        <div class="float-window-icon" style="background-color: ${appData.color}">
                            ${appData.name.charAt(0)}
                        </div>
                        <div class="float-window-title">${appData.name}</div>
                        <div class="float-window-controls">
                            <button class="float-window-btn" onclick="colorOSSidebar.minimizeFloatWindow('${windowId}')">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="float-window-btn" onclick="colorOSSidebar.closeFloatWindow('${windowId}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="float-window-content">
                        <iframe class="float-window-iframe" src="${appData.url}" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-downloads"></iframe>
                    </div>
                `;
                
                this.elements.floatWindowContainer.appendChild(floatWindow);
                
                // 设置初始位置
                const containerWidth = this.elements.floatWindowContainer.offsetWidth;
                const containerHeight = this.elements.floatWindowContainer.offsetHeight;
                const windowWidth = 300;
                const windowHeight = 400;
                
                floatWindow.style.left = `${(containerWidth - windowWidth) / 2}px`;
                floatWindow.style.top = `${(containerHeight - windowHeight) / 2}px`;
                
                // 添加拖拽功能
                this.makeFloatWindowDraggable(floatWindow);
                
                this.floatWindows.push({
                    id: windowId,
                    element: floatWindow,
                    app: appData
                });
                
                this.hideSidebar();
            }
            
            makeFloatWindowDraggable(element) {
                let isDragging = false;
                let dragOffsetX, dragOffsetY;
                
                const header = element.querySelector('.float-window-header');
                
                header.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    dragOffsetX = e.clientX - element.offsetLeft;
                    dragOffsetY = e.clientY - element.offsetTop;
                    
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', stopDrag);
                });
                
                header.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    const touch = e.touches[0];
                    dragOffsetX = touch.clientX - element.offsetLeft;
                    dragOffsetY = touch.clientY - element.offsetTop;
                    
                    document.addEventListener('touchmove', drag);
                    document.addEventListener('touchend', stopDrag);
                });
                
                const drag = (e) => {
                    if (!isDragging) return;
                    
                    let clientX, clientY;
                    
                    if (e.type === 'mousemove') {
                        clientX = e.clientX;
                        clientY = e.clientY;
                    } else {
                        clientX = e.touches[0].clientX;
                        clientY = e.touches[0].clientY;
                    }
                    
                    const newX = clientX - dragOffsetX;
                    const newY = clientY - dragOffsetY;
                    
                    const maxX = window.innerWidth - element.offsetWidth;
                    const maxY = window.innerHeight - element.offsetHeight;
                    
                    element.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
                    element.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
                };
                
                const stopDrag = () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', stopDrag);
                    document.removeEventListener('touchmove', drag);
                    document.removeEventListener('touchend', stopDrag);
                };
            }
            
            minimizeFloatWindow(windowId) {
                const floatWindow = this.floatWindows.find(w => w.id === windowId);
                if (floatWindow) {
                    floatWindow.element.style.transform = 'scale(0.8)';
                    floatWindow.element.style.opacity = '0.5';
                    
                    setTimeout(() => {
                        floatWindow.element.style.transform = 'scale(1)';
                        floatWindow.element.style.opacity = '1';
                    }, 300);
                }
            }
            
            closeFloatWindow(windowId) {
                const floatWindow = this.floatWindows.find(w => w.id === windowId);
                if (floatWindow) {
                    floatWindow.element.remove();
                    this.floatWindows = this.floatWindows.filter(w => w.id !== windowId);
                }
            }
            
            showTransferStation() {
                this.elements.transferStationPanel.classList.add('active');
                this.renderTransferItems();
            }
            
            hideTransferStation() {
                this.elements.transferStationPanel.classList.remove('active');
            }
            
            saveTransferItem() {
                const input = document.getElementById('transferStationInput');
                const content = input.value.trim();
                
                if (content) {
                    this.transferItems.push({
                        id: Date.now(),
                        content: content,
                        type: 'text',
                        timestamp: new Date().toISOString()
                    });
                    
                    input.value = '';
                    this.renderTransferItems();
                    this.saveData();
                }
            }
            
            clearTransferItems() {
                if (confirm('确定要清空中转站吗？')) {
                    this.transferItems = [];
                    this.renderTransferItems();
                    this.saveData();
                }
            }
            
            renderTransferItems() {
                const contentElement = document.getElementById('transferStationContent');
                contentElement.innerHTML = '';
                
                if (this.transferItems.length === 0) {
                    contentElement.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">中转站为空</p>';
                    return;
                }
                
                this.transferItems.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'transfer-item';
                    itemElement.innerHTML = `
                        <div class="transfer-item-icon">
                            <i class="fas fa-${item.type === 'text' ? 'file-alt' : 'image'}"></i>
                        </div>
                        <div class="transfer-item-content">${item.content}</div>
                    `;
                    
                    itemElement.addEventListener('click', () => {
                        this.useTransferItem(item);
                    });
                    
                    contentElement.appendChild(itemElement);
                });
            }
            
            useTransferItem(item) {
                // 在实际应用中，这里可以实现将中转站内容粘贴到当前活动应用
                alert(`已使用中转站内容: ${item.content}`);
                this.hideTransferStation();
            }
            
            renderContent() {
                this.renderRecentApps();
                this.renderTools();
                this.renderCustomApps();
            }
            
            renderRecentApps() {
                const recentApps = [
                    { name: '微信', url: 'https://weixin.qq.com', color: '#07C160' },
                    { name: '支付宝', url: 'https://www.alipay.com', color: '#1677FF' },
                    { name: '抖音', url: 'https://www.douyin.com', color: '#000000' },
                    { name: '淘宝', url: 'https://www.taobao.com', color: '#FF4400' },
                    { name: '微博', url: 'https://weibo.com', color: '#E6162D' },
                    { name: '腾讯云', url: 'https://start.qq.com/h5game/home?ADTAG=0', color: '#0084FF' }
                ];
                
                this.elements.recentAppList.innerHTML = '';
                
                recentApps.forEach((app, index) => {
                    const appElement = document.createElement('div');
                    appElement.className = 'sidebar-app';
                    appElement.innerHTML = `
                        <i class="fas fa-globe"></i>
                        <span>${app.name}</span>
                    `;
                    
                    appElement.addEventListener('click', () => {
                        this.launchApp(app);
                    });
                    
                    this.elements.recentAppList.appendChild(appElement);
                });
            }
            
            renderTools() {
                const tools = [
                  
                    { name: '计', icon: 'calculator', action: 'calculator' },
                 
                ];
                
                this.elements.toolList.innerHTML = '';
                
                tools.forEach(tool => {
                    const toolElement = document.createElement('div');
                    toolElement.className = 'sidebar-tool';
                    toolElement.innerHTML = `
                        <i class="fas fa-${tool.icon}"></i>
                        <span>${tool.name}</span>
                    `;
                    
                    toolElement.addEventListener('click', () => {
                        this.useTool(tool.action);
                    });
                    
                    this.elements.toolList.appendChild(toolElement);
                });
            }
            
            renderCustomApps() {
                // 使用前6个应用作为自定义应用
                const customApps = [
                    { name: '微信', url: 'https://weixin.qq.com', color: '#07C160' },
                    { name: '支付宝', url: 'https://www.alipay.com', color: '#1677FF' },
                    { name: '抖音', url: 'https://www.douyin.com', color: '#000000' },
                    { name: '淘宝', url: 'https://www.taobao.com', color: '#FF4400' },
                    { name: '微博', url: 'https://weibo.com', color: '#E6162D' },
                    { name: '腾讯云', url: 'https://start.qq.com/h5game/home?ADTAG=0', color: '#0084FF' }
                ];
                
                this.elements.customAppList.innerHTML = '';
                
                customApps.forEach((app, index) => {
                    const appElement = document.createElement('div');
                    appElement.className = 'sidebar-app';
                    appElement.innerHTML = `
                        <i class="fas fa-globe"></i>
                        <span>${app.name}</span>
                    `;
                    
                    appElement.addEventListener('click', () => {
                        this.launchApp(app);
                    });
                    
                    // 长按进入编辑模式
                    appElement.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        this.toggleEditMode(true);
                    });
                    
                    this.elements.customAppList.appendChild(appElement);
                });
            }
            
            launchApp(app) {
                if (this.isEditMode) {
                    // 编辑模式下显示删除选项
                    if (confirm(`确定要删除应用 "${app.name}" 吗？`)) {
                        // 在实际应用中，这里应该从应用中删除
                        this.renderContent();
                    }
                    return;
                }
                
                // 使用第一个文档的应用启动逻辑
                currentApp = app;
                if (settings.defaultLaunchMode === 'ask') {
                    showWindowModeDialog(app, { currentTarget: document.createElement('div') });
                } else {
                    showAppLaunchAnimation(app, { currentTarget: document.createElement('div') }, () => {
                        launchApp(settings.defaultLaunchMode);
                    });
                }
                
                this.hideSidebar();
            }
            
            useTool(action) {
                switch (action) {
                    case 'screenshot':
                        this.takeScreenshot();
                        break;
                    case 'record':
                        this.startRecording();
                        break;
                    case 'calculator':
                        this.openCalculator();
                        break;
                    case 'notes':
                        this.openNotes();
                        break;
                    case 'flashlight':
                        this.toggleFlashlight();
                        break;
                    case 'timer':
                        this.openTimer();
                        break;
                }
                
                this.hideSidebar();
            }
            
            takeScreenshot() {

                // 模拟截图效果
                document.body.style.filter = 'brightness(0.8)';
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 300);
            }
            
            startRecording() {

            }
            
            openCalculator() {
                const calculatorApp = { name: '计算器', url: 'https://www.calculator.net/', color: '#FF9800' };
                this.createFloatWindow(calculatorApp);
            }
            
            openNotes() {
                const notesApp = { name: '便签', url: 'https://keep.google.com/', color: '#4CAF50' };
                this.createFloatWindow(notesApp);
            }
            
            toggleFlashlight() {
               
            }
            
            openTimer() {
                const timerApp = { name: '计时器', url: 'https://www.online-stopwatch.com/', color: '#FF9800' };
                this.createFloatWindow(timerApp);
            }
            
            loadData() {
                // 从localStorage加载数据
                const savedSettings = localStorage.getItem('coloros-sidebar-settings');
                const savedTransferItems = localStorage.getItem('coloros-sidebar-transfer');
                
                if (savedSettings) {
                    const settings = JSON.parse(savedSettings);
                    this.currentLayout = settings.layout || 'single';
                }
                
                if (savedTransferItems) {
                    this.transferItems = JSON.parse(savedTransferItems);
                }
            }
            
            saveData() {
                // 保存设置到localStorage
                const settings = {
                    layout: this.currentLayout
                };
                
                localStorage.setItem('coloros-sidebar-settings', JSON.stringify(settings));
                localStorage.setItem('coloros-sidebar-transfer', JSON.stringify(this.transferItems));
            }
        }
        
        // 初始化ColorOS侧边栏
        const colorOSSidebar = new ColorOSSidebar();

        // 原有代码保持不变
        // 动画配置中心
        const ANIMATION_CONFIG = {
            'nav-transition': {
                duration: 0.25,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)' // ColorOS的缓动函数
            },
            'app-launch': {
                duration: 0.4,
                easing: 'linear'
            },
            'modal-transition': {
                duration: 0.3,
                easing: 'cubic-bezier(0.25,0.46,0.45,0.94)'
            },
            'app-launch': {
                duration: 0.35,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
        };

        // 原有代码保持不变
        // 全局动画控制器
        class AnimationController {
            constructor() {
                this.timeScale = 1;
                this.animations = new Map();
                this.activeAnimations = new Set();
            }

            register(animationName, element, duration) {
                this.animations.set(animationName, {
                    element,
                    duration: duration * this.timeScale,
                    originalDuration: duration
                });
            }

            setSpeed(speed) {
                // 根据设置的速度值调整时间缩放
                this.timeScale = speed === 'slow' ? 1.5 :
                               speed === 'fast' ? 0.8 :
                               speed === 'slowest' ? 2 : 1;
                
                this.animations.forEach((animation, name) => {
                    // 更新动画持续时间
                    animation.duration = animation.originalDuration * this.timeScale;
                    animation.element.style.transitionDuration = `${animation.duration}s`;
                    animation.element.style.animationDuration = `${animation.duration}s`;
                });
                
                // 更新CSS变量
                document.documentElement.style.setProperty('--animation-speed', `${0.4 * this.timeScale}s`);
            }

            startAnimation(animationName) {
                this.activeAnimations.add(animationName);
            }

            stopAnimation(animationName) {
                this.activeAnimations.delete(animationName);
            }

            isAnimating() {
                return this.activeAnimations.size > 0;
            }

            stopAllAnimations() {
                this.activeAnimations.forEach(animationName => {
                    const animation = this.animations.get(animationName);
                    if (animation) {
                        animation.element.style.transition = 'none';
                        // 强制重绘
                        animation.element.offsetHeight;
                        animation.element.style.transition = '';
                    }
                });
                this.activeAnimations.clear();
            }
        }

        const animController = new AnimationController();

        // 原有代码保持不变
        // 缓存频繁操作的DOM元素
        const DOMCache = {
            appLaunchAnimation: document.getElementById('appLaunchAnimation'),
            appLaunchProgressBar: document.getElementById('appLaunchProgressBar'),
            appLaunchIcon: document.getElementById('appLaunchIcon'),
            appLaunchText: document.getElementById('appLaunchText'),
            navButtons: document.querySelectorAll('.nav-button'),
            modalSections: document.querySelectorAll('.modal-section')
        };

        // 原有代码保持不变
        // 使用requestAnimationFrame优化动画
        const AnimationManager = {
            requestId: null,
            animate(callback) {
                if (this.requestId) cancelAnimationFrame(this.requestId);
                this.requestId = requestAnimationFrame(callback);
            },
            stop() {
                if (this.requestId) {
                    cancelAnimationFrame(this.requestId);
                    this.requestId = null;
                }
            }
        };

        // 原有代码保持不变
        const VirtualNavigation={
            settings:{visible:true,showHints:true,vibration:true,sound:false,autoHide:false},
            isAnimating: false, // 新增：动画状态
            launchInterval: null, // 新增：启动动画的定时器
            animationFrame: null, // 新增：动画帧ID
            
            init(){
                this.loadSettings();
                this.setupEventListeners();
                this.updateUI();
                if(this.settings.autoHide)this.hideNavigation();
                
                // 注册动画
                animController.register('nav-transition', document.querySelector('.virtual-navigation'), 0.3);
            },
            loadSettings(){
                const savedSettings=localStorage.getItem('virtualNavSettings');
                if(savedSettings)this.settings={...this.settings,...JSON.parse(savedSettings)};
            },
            saveSettings(){
                localStorage.setItem('virtualNavSettings',JSON.stringify(this.settings));
            },
            setupEventListeners(){
                DOMCache.navButtons.forEach(button=>{
                    button.addEventListener('click',e=>{
                        this.handleButtonClick(e.currentTarget);
                    });
                    button.addEventListener('mousedown',e=>{
                        this.createRipple(e,button);
                    });
                    button.addEventListener('touchstart',e=>{
                        this.createRipple(e.touches[0],button);
                    });
                    
                    // 添加导航按钮长按事件
                    let timer;
                    button.addEventListener('mousedown', e => {
                        timer = setTimeout(() => {
                            button.classList.add('long-press');
                        }, 500);
                    });
                    button.addEventListener('mouseup', () => {
                        clearTimeout(timer);
                        button.classList.remove('long-press');
                    });
                    button.addEventListener('mouseleave', () => {
                        clearTimeout(timer);
                        button.classList.remove('long-press');
                    });
                });
                
                document.getElementById('navToggle').addEventListener('click',()=>{this.toggleNavigation();});
                document.getElementById('hintToggle').addEventListener('click',()=>{this.toggleSetting('showHints');});
                document.getElementById('vibrationToggle').addEventListener('click',()=>{this.toggleSetting('vibration');});
                document.getElementById('soundToggle').addEventListener('click',()=>{this.toggleSetting('sound');});
                document.getElementById('autoHideToggle').addEventListener('click',()=>{this.toggleSetting('autoHide');});
                document.getElementById('navSettings').addEventListener('click',()=>{this.toggleSettingsPanel();});
                document.getElementById('navToggleButton').addEventListener('click',()=>{this.showNavigation();});
                this.setupGestureEvents();
                document.getElementById('overlay').addEventListener('click',()=>{this.hideSettingsPanel();});
                
                // 增加触控优化
                document.querySelectorAll('.nav-button').forEach(btn => {
                    btn.addEventListener('touchstart', e => e.stopPropagation());
                    btn.addEventListener('touchend', e => e.stopPropagation());
                });
            },
            handleButtonClick(button){
                // 新增：检测是否有正在进行的动画
                if (animController.isAnimating()) {
                    this.abortAppLaunch();
                    return;
                }
                
                const action=button.getAttribute('data-action');
                if(this.settings.vibration&&'vibrate'in navigator)navigator.vibrate(10);
                if(this.settings.sound)this.playClickSound();
                this.setActiveButton(button);
                switch(action){
                    case'back':this.handleBackAction();break;
                    case'home':this.handleHomeAction();break;
                    case'recent':this.handleRecentAction();break;
                }
                if(this.settings.autoHide)setTimeout(()=>{this.hideNavigation();},1000);
            },
            // 新增中断方法
            abortAppLaunch() {
                // 清除所有定时器和动画帧
                clearInterval(this.launchInterval);
                cancelAnimationFrame(this.animationFrame);
                this.launchInterval = null;
                this.animationFrame = null;

                // 强制移除动画类
                DOMCache.appLaunchAnimation.classList.remove('active');
                
                // 停止所有动画
                animController.stopAllAnimations();
                
                // 直接跳转主页
                this.showHome();
                
                // 防止重复触发
                this.isAnimating = false;
            },
            // 新增返回主页方法
            showHome() {
                updateNavActive('main');
                this.showHint('');
            },
            handleBackAction(){
                if(ModalManager.activeModal)ModalManager.hideModal(ModalManager.activeModal);
                else if(browserContainer.classList.contains('active'))closeBrowser();
                else if(windowModeContainer.classList.contains('active'))closeWindowMode();
                else if(statusPanel.classList.contains('active'))hideStatusPanel();
                else if(multitaskPanel.classList.contains('active'))hideMultitaskPanel();
                else if(colorOSSidebar.isActive)colorOSSidebar.hideSidebar();
                else this.showHint('');
            },
            handleHomeAction(){
                if(ModalManager.activeModal)ModalManager.hideModal(ModalManager.activeModal);
                if(browserContainer.classList.contains('active'))closeBrowser();
                if(windowModeContainer.classList.contains('active'))closeWindowMode();
                if(statusPanel.classList.contains('active'))hideStatusPanel();
                if(multitaskPanel.classList.contains('active'))hideMultitaskPanel();
                if(colorOSSidebar.isActive)colorOSSidebar.hideSidebar();
                updateNavActive('main');
                this.showHint('已返回主页');
            },
            handleRecentAction(){
                if(multitaskPanel.classList.contains('active'))hideMultitaskPanel();
                else showMultitaskPanel();
            },
            setActiveButton(button){
                DOMCache.navButtons.forEach(btn=>{
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                this.updateIndicator(button);
            },
            updateIndicator(button){
                const indicator=document.getElementById('navIndicator');
                const buttonRect=button.getBoundingClientRect();
                const navRect=document.getElementById('virtualNavigation').getBoundingClientRect();
                indicator.style.left=`${buttonRect.left-navRect.left}px`;
                indicator.style.width=`${buttonRect.width}px`;
            },
            createRipple(event,button){
                const ripple=document.createElement('span');
                ripple.classList.add('ripple');
                const rect=button.getBoundingClientRect();
                const size=Math.max(rect.width,rect.height);
                const x=event.clientX-rect.left-size/2;
                const y=event.clientY-rect.top-size/2;
                ripple.style.width=ripple.style.height=`${size}px`;
                ripple.style.left=`${x}px`;
                ripple.style.top=`${y}px`;
                button.appendChild(ripple);
                setTimeout(()=>{
                    ripple.remove();
                },600);
            },
            toggleNavigation(){
                this.settings.visible=!this.settings.visible;
                this.saveSettings();
                this.updateUI();
                if(this.settings.visible)this.showNavigation();
                else this.hideNavigation();
            },
            toggleSetting(settingName){
                this.settings[settingName]=!this.settings[settingName];
                this.saveSettings();
                this.updateUI();
                if(settingName==='autoHide'){
                    if(this.settings.autoHide)this.hideNavigation();
                    else this.showNavigation();
                }
            },
            toggleSettingsPanel(){
                const panel=document.getElementById('navSettingsPanel');
                const overlay=document.getElementById('overlay');
                if(panel.classList.contains('active'))this.hideSettingsPanel();
                else{
                    panel.classList.add('active');
                    overlay.classList.add('active');
                }
            },
            hideSettingsPanel(){
                const panel=document.getElementById('navSettingsPanel');
                const overlay=document.getElementById('overlay');
                panel.classList.remove('active');
                overlay.classList.remove('active');
            },
            showNavigation(){
                const nav=document.getElementById('virtualNavigation');
                const toggleBtn=document.getElementById('navToggleButton');
                nav.classList.remove('hidden');
                toggleBtn.classList.remove('active');
            },
            hideNavigation(){
                const nav=document.getElementById('virtualNavigation');
                const toggleBtn=document.getElementById('navToggleButton');
                nav.classList.add('hidden');
                toggleBtn.classList.add('active');
            },
            setupGestureEvents(){
                let startY=0,currentY=0,isSwiping=false;
                document.addEventListener('touchstart',e=>{
                    startY=e.touches[0].clientY;
                    isSwiping=true;
                });
                document.addEventListener('touchmove',e=>{
                    if(!isSwiping)return;
                    currentY=e.touches[0].clientY;
                    const diff=startY-currentY;
                    if(diff>50&&this.settings.autoHide&&document.getElementById('virtualNavigation').classList.contains('hidden')){
                        this.showNavigation();
                        if(this.settings.showHints)this.showGestureHint();
                        isSwiping=false;
                    }
                });
                document.addEventListener('touchend',()=>{
                    isSwiping=false;
                });
            },
            showGestureHint(){
                const hint=document.getElementById('navGestureHint');
                hint.classList.add('active');
                setTimeout(()=>{
                    hint.classList.remove('active');
                },2000);
            },
            showHint(message){
                const hint=document.createElement('div');
                hint.className='nav-gesture-hint';
                hint.textContent=message;
                document.body.appendChild(hint);
                hint.classList.add('active');
                setTimeout(()=>{
                    hint.classList.remove('active');
                    setTimeout(()=>{
                        document.body.removeChild(hint);
                    },300);
                },1500);
            },
            playClickSound(){
                const audioContext=new(window.AudioContext||window.webkitAudioContext)();
                const oscillator=audioContext.createOscillator();
                const gainNode=audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.value=800;
                oscillator.type='sine';
                gainNode.gain.setValueAtTime(0.3,audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01,audioContext.currentTime+0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime+0.1);
            },
            updateUI(){
                document.getElementById('navToggle').classList.toggle('active',this.settings.visible);
                document.getElementById('hintToggle').classList.toggle('active',this.settings.showHints);
                document.getElementById('vibrationToggle').classList.toggle('active',this.settings.vibration);
                document.getElementById('soundToggle').classList.toggle('active',this.settings.sound);
                document.getElementById('autoHideToggle').classList.toggle('active',this.settings.autoHide);
                if(this.settings.visible)this.showNavigation();
                else this.hideNavigation();
            }
        };

        // 原有代码保持不变
        const DragSortManager={init(){this.setupDragEvents();},setupDragEvents(){const appsContainer=document.getElementById('appsContainer');appsContainer.addEventListener('dragstart',e=>{if(!isEditMode)return;const appItem=e.target.closest('.app-item');if(appItem){appItem.classList.add('dragging');e.dataTransfer.setData('text/plain',appItem.getAttribute('data-app-index'));}});appsContainer.addEventListener('dragend',e=>{const appItem=e.target.closest('.app-item');if(appItem){appItem.classList.remove('dragging');document.querySelectorAll('.app-item').forEach(item=>{item.classList.remove('drag-over');});}});appsContainer.addEventListener('dragover',e=>{e.preventDefault();if(!isEditMode)return;const appItem=e.target.closest('.app-item');if(appItem){document.querySelectorAll('.app-item').forEach(item=>{item.classList.remove('drag-over');});appItem.classList.add('drag-over');}});appsContainer.addEventListener('drop',e=>{e.preventDefault();if(!isEditMode)return;const fromIndex=parseInt(e.dataTransfer.getData('text/plain'));const toItem=e.target.closest('.app-item');if(toItem){const toIndex=parseInt(toItem.getAttribute('data-app-index'));this.reorderApps(fromIndex,toIndex);}document.querySelectorAll('.app-item').forEach(item=>{item.classList.remove('drag-over');});});},reorderApps(fromIndex,toIndex){if(fromIndex===toIndex)return;const[movedApp]=apps.splice(fromIndex,1);apps.splice(toIndex,0,movedApp);StorageManager.set('apps',apps);filteredApps=apps;renderApps();colorOSSidebar.renderContent();}};
        const AppCategoryManager={categories:[''],currentCategory:'全部',init(){this.renderCategoryTabs();this.setupEventListeners();},renderCategoryTabs(){const categoryTabs=document.getElementById('categoryTabs');categoryTabs.innerHTML='';this.categories.forEach(category=>{const tab=document.createElement('div');tab.className=`category-tab ${category===this.currentCategory?'active':''}`;tab.textContent=category;tab.setAttribute('data-category',category);categoryTabs.appendChild(tab);});},setupEventListeners(){document.getElementById('categoryTabs').addEventListener('click',e=>{const tab=e.target.closest('.category-tab');if(tab){const category=tab.getAttribute('data-category');this.setCurrentCategory(category);}});},setCurrentCategory(category){this.currentCategory=category;document.querySelectorAll('.category-tab').forEach(tab=>{tab.classList.toggle('active',tab.getAttribute('data-category')===category);});if(category==='全部')filteredApps=apps;else filteredApps=apps.filter(app=>app.category===category);currentPage=1;renderApps();},addCategory(name){if(!this.categories.includes(name)){this.categories.push(name);this.renderCategoryTabs();return true;}return false;},getCategories(){return this.categories;}};
        const DataBackupManager={init(){this.setupEventListeners();},setupEventListeners(){document.getElementById('exportDataBtn').addEventListener('click',()=>{this.exportData();});document.getElementById('importDataBtn').addEventListener('click',()=>{this.importData();});},exportData(){const data={apps:apps,settings:settings,storedImages:storedImages,storedVideos:storedVideos,recentApps:recentApps,version:'1.0',exportDate:new Date().toISOString()};const dataStr=JSON.stringify(data,null,2);const dataBlob=new Blob([dataStr],{type:'application/json'});const url=URL.createObjectURL(dataBlob);const link=document.createElement('a');link.href=url;link.download=`app-system-backup-${new Date().toISOString().split('T')[0]}.json`;document.body.appendChild(link);link.click();document.body.removeChild(link);URL.revokeObjectURL(url);alert('数据导出成功！');},importData(){const input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=event=>{try{const data=JSON.parse(event.target.result);if(confirm('导入数据将覆盖当前所有数据，确定要继续吗？')){if(data.apps&&data.settings){apps=data.apps;settings=data.settings;storedImages=data.storedImages||[];storedVideos=data.storedVideos||[];recentApps=data.recentApps||[];StorageManager.batchSet({'apps':apps,'settings':settings,'images':storedImages,'videos':storedVideos,'recent':recentApps});filteredApps=apps;currentPage=1;renderApps();applySettings();alert('数据导入成功！');}else alert('数据格式不正确！');}}catch(error){alert('导入失败：文件格式不正确！');console.error('Import error:',error);}};reader.readAsText(file);};input.click();}};
        const BookmarkManager={bookmarks:[],init(){this.loadBookmarks();this.setupEventListeners();},loadBookmarks(){const savedBookmarks=localStorage.getItem('browserBookmarks');if(savedBookmarks)this.bookmarks=JSON.parse(savedBookmarks);else{this.bookmarks=[{name:'百度',url:'https://www.baidu.com'},{name:'谷歌',url:'https://www.google.com'},{name:'GitHub',url:'https://github.com'}];this.saveBookmarks();}this.renderBookmarks();},saveBookmarks(){localStorage.setItem('browserBookmarks',JSON.stringify(this.bookmarks));},setupEventListeners(){const addBookmarkBtn=document.createElement('div');addBookmarkBtn.className='browser-action-btn';addBookmarkBtn.innerHTML='<i class="fas fa-bookmark"></i>';addBookmarkBtn.title='添加书签';addBookmarkBtn.addEventListener('click',()=>{this.addCurrentPageToBookmarks();});document.querySelector('.browser-actions').appendChild(addBookmarkBtn);},addCurrentPageToBookmarks(){if(!browserIframe.src)return;const url=browserIframe.src;let title='';try{title=browserIframe.contentDocument.title||'未命名页面';}catch(e){title='未命名页面';}const existingIndex=this.bookmarks.findIndex(bookmark=>bookmark.url===url);if(existingIndex!==-1){alert('该页面已在书签中！');return;}this.bookmarks.push({name:title,url:url});this.saveBookmarks();this.renderBookmarks();alert('书签添加成功！');},renderBookmarks(){const bookmarksContainer=document.getElementById('bookmarksContainer');bookmarksContainer.innerHTML='';this.bookmarks.forEach((bookmark,index)=>{const bookmarkItem=document.createElement('div');bookmarkItem.className='bookmark-item';bookmarkItem.setAttribute('data-index',index);bookmarkItem.innerHTML=`<i class="fas fa-bookmark bookmark-icon"></i><span>${bookmark.name}</span>`;bookmarkItem.addEventListener('click',()=>{browserIframe.src=bookmark.url;browserUrlInput.value=bookmark.url;});bookmarksContainer.appendChild(bookmarkItem);});}};
        const initialApps=[{name:"快手",url:"https://www.kuaishou.com",color:"#FF5000",category:"娱乐"},{name:"抖音",url:"https://www.douyin.com",color:"#000000",category:"娱乐"},{name:"QQ音乐",url:"https://y.qq.com",color:"#31C27C",category:"娱乐"},{name:"微信",url:"https://weixin.qq.com",color:"#07C160",category:"社交"},{name:"支付宝",url:"https://www.alipay.com",color:"#1677FF",category:"工具"},{name:"淘宝",url:"https://www.taobao.com",color:"#FF4400",category:"工具"},{name:"微博",url:"https://weibo.com",color:"#E6162D",category:"社交"},{name:"知乎",url:"https://www.zhihu.com",color:"#0084FF",category:"社交"},{name:"百度",url:"https://www.baidu.com",color:"#2932E1",category:"工具"},{name:"京东",url:"https://www.jd.com",color:"#E33333",category:"工具"}];
        const defaultSettings={backgroundType:'gradient',backgroundImage:null,backgroundColor:'#1a2a6c',statusBarStyle:'dark',appLimit:10,animationSpeed:'normal',themeColor:'#6C63FF',statusBarText:'应用系统',statusBarColor:'#000000',statusBarIcons:['fas fa-signal','fas fa-wifi','fas fa-battery-full'],volume:1,darkMode:false,useBuiltInBrowser:true,defaultLaunchMode:'ask',wifiEnabled:true,bluetoothEnabled:false,mobileDataEnabled:true,airplaneMode:false,locationEnabled:true,brightness:0.8};
        const StorageManager={prefixes:{apps:'myApps',settings:'appSettings',images:'storedImages',videos:'storedVideos',recent:'recentApps'},get(key,defaultValue=null){try{const data=localStorage.getItem(this.prefixes[key]||key);return data?JSON.parse(data):defaultValue;}catch{return defaultValue;}},set(key,value){try{localStorage.setItem(this.prefixes[key]||key,JSON.stringify(value));return true;}catch{return false;}},batchSet(updates){Object.entries(updates).forEach(([key,value])=>{this.set(key,value);});}};
        let apps=StorageManager.get('apps',initialApps),settings=StorageManager.get('settings',defaultSettings),storedImages=StorageManager.get('images',[]),storedVideos=StorageManager.get('videos',[]),recentApps=StorageManager.get('recent',[]);
        const TimeManager={timeElements:new Set(),registerTimeElement(element){this.timeElements.add(element);},updateAllTimes(){const now=new Date();const timeString=`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;this.timeElements.forEach(element=>{element.textContent=timeString;});},init(){this.updateAllTimes();setInterval(()=>this.updateAllTimes(),1000);}};
        const ModalManager={activeModal:null,modals:new Map(),activeTransitions:new Set(),registerModal(id,element,showCallback=null,hideCallback=null){this.modals.set(id,{element,showCallback,hideCallback});},showModal(id){if(this.activeModal)this.hideModal(this.activeModal);const modal=this.modals.get(id);if(modal){this.interruptTransitions();modal.element.classList.add('active-section');overlay.classList.add('active');document.body.style.overflow='hidden';this.activeTransitions.add(modal.element);this.activeTransitions.add(overlay);if(modal.showCallback)modal.showCallback();this.activeModal=id;}},hideModal(id){const modal=this.modals.get(id);if(modal){this.interruptTransitions();modal.element.classList.remove('active-section');overlay.classList.remove('active');document.body.style.overflow='auto';if(modal.hideCallback)modal.hideCallback();this.activeModal=null;}},interruptTransitions(){this.activeTransitions.forEach(element=>{element.style.transition='none';element.offsetHeight;element.style.transition='';});this.activeTransitions.clear();}};
        const EventManager={handlers:new Map(),addDelegateListener(selector,event,handler){if(!this.handlers.has(selector))this.handlers.set(selector,new Map());this.handlers.get(selector).set(event,handler);document.addEventListener(event,e=>{if(e.target.matches(selector)||e.target.closest(selector))handler(e);});},batchAddEvents(eventMap){for(const[selector,events]of Object.entries(eventMap))for(const[event,handler]of Object.entries(events))this.addDelegateListener(selector,event,handler);}};
        const getElement=id=>document.getElementById(id);
        const appsContainer=getElement('appsContainer'),addAppBtn=getElement('addAppBtn'),backBtn=getElement('backBtn'),backBtnAdd=getElement('backBtnAdd'),backBtnSettings=getElement('backBtnSettings'),backBtnAppManagement=getElement('backBtnAppManagement'),backBtnStatusCustomization=getElement('backBtnStatusCustomization'),backBtnImageStorage=getElement('backBtnImageStorage'),backBtnVideoStorage=getElement('backBtnVideoStorage'),backToSettings=getElement('backToSettings'),backToSettingsFromStatus=getElement('backToSettingsFromStatus'),backToSettingsFromImages=getElement('backToSettingsFromImages'),backToSettingsFromVideos=getElement('backToSettingsFromVideos'),searchInput=getElement('searchInput'),currentTime=getElement('current-time'),addPageTime=getElement('add-page-time'),settingsPageTime=getElement('settings-page-time'),appManagementPageTime=getElement('app-management-page-time'),statusCustomizationPageTime=getElement('status-customization-page-time'),imageStoragePageTime=getElement('image-storage-page-time'),videoStoragePageTime=getElement('video-storage-page-time'),mainPage=getElement('mainPage'),addAppSection=getElement('addAppSection'),settingsSection=getElement('settingsSection'),appManagementSection=getElement('appManagementSection'),statusCustomizationSection=getElement('statusCustomizationSection'),imageStorageSection=getElement('imageStorageSection'),videoStorageSection=getElement('videoStorageSection'),statusPanel=getElement('statusPanel'),statusBarButton=getElement('statusBarButton'),statusBarBackButton=getElement('statusBarBackButton'),nightModeBtn=getElement('nightModeBtn'),stackedNotifications=getElement('stackedNotifications'),overlay=getElement('overlay'),appManagementBtn=getElement('appManagementBtn'),statusCustomizationBtn=getElement('statusCustomizationBtn'),imageStorageBtn=getElement('imageStorageBtn'),videoStorageBtn=getElement('videoStorageBtn'),backgroundLayer=getElement('backgroundLayer'),phoneStatusBar=getElement('phoneStatusBar'),pagination=getElement('pagination'),appManagementList=getElement('appManagementList'),imageGallery=getElement('imageGallery'),imageUpload=getElement('imageUpload'),videoGallery=getElement('videoGallery'),videoUpload=getElement('videoUpload'),browserContainer=getElement('browserContainer'),browserBackBtn=getElement('browserBackBtn'),browserForwardBtn=getElement('browserForwardBtn'),browserHomeBtn=getElement('browserHomeBtn'),browserUrlInput=getElement('browserUrlInput'),browserUrlIcon=getElement('browserUrlIcon'),browserRefreshBtn=getElement('browserRefreshBtn'),browserCloseBtn=getElement('browserCloseBtn'),browserIframe=getElement('browserIframe'),browserLoadingBar=getElement('browserLoadingBar'),browserTabContainer=getElement('browserTabContainer'),videoPlayerContainer=getElement('videoPlayerContainer'),videoPlayer=getElement('videoPlayer'),playPauseBtn=getElement('playPauseBtn'),videoProgress=getElement('videoProgress'),videoProgressFilled=getElement('videoProgressFilled'),videoTime=getElement('videoTime'),muteBtn=getElement('muteBtn'),volumeSlider=getElement('volumeSlider'),fullscreenBtn=getElement('fullscreenBtn'),closeVideo=getElement('closeVideo'),volumeQuickSetting=getElement('volumeQuickSetting'),volumeControl=getElement('volumeControl'),volumeSliderPanel=getElement('volumeSliderPanel'),backgroundType=getElement('backgroundType'),backgroundImage=getElement('backgroundImage'),backgroundColor=getElement('backgroundColor'),statusBarStyle=getElement('statusBarStyle'),appLimit=getElement('appLimit'),animationSpeed=getElement('animationSpeed'),themeColor=getElement('themeColor'),useBuiltInBrowser=getElement('useBuiltInBrowser'),defaultLaunchMode=getElement('defaultLaunchMode'),statusBarText=getElement('statusBarText'),statusBarColor=getElement('statusBarColor'),resetSettingsBtn=getElement('resetSettings'),saveSettingsBtn=getElement('saveSettings'),saveStatusCustomizationBtn=getElement('saveStatusCustomization'),backgroundImageItem=getElement('backgroundImageItem'),backgroundColorItem=getElement('backgroundColorItem'),appCategory=getElement('appCategory'),exportDataBtn=getElement('exportDataBtn'),importDataBtn=getElement('importDataBtn'),windowModeDialog=getElement('windowModeDialog'),windowModeContainer=getElement('windowModeContainer'),windowModeHeader=getElement('windowModeHeader'),windowModeIcon=getElement('windowModeIcon'),windowModeTitle=getElement('windowModeTitle'),windowModeIframe=getElement('windowModeIframe'),windowModeMinimize=getElement('windowModeMinimize'),windowModeClose=getElement('windowModeClose'),windowModeCancel=getElement('windowModeCancel'),windowModeConfirm=getElement('windowModeConfirm'),multitaskPanel=getElement('multitaskPanel'),multitaskButton=getElement('multitaskButton'),multitaskClose=getElement('multitaskClose'),recentAppsContainer=getElement('recentApps'),wifiSetting=getElement('wifiSetting'),bluetoothSetting=getElement('bluetoothSetting'),mobileDataSetting=getElement('mobileDataSetting'),brightnessSetting=getElement('brightnessSetting'),airplaneSetting=getElement('airplaneSetting'),locationSetting=getElement('locationSetting'),categoryTabs=getElement('categoryTabs');
        let currentPage=1,appsPerPage=parseInt(settings.appLimit),filteredApps=apps,isStatusPanelOpen=false,currentVideo=null,currentApp=null,browserTabs=[],activeTabId=null,isEditMode=false,selectedWindowMode='window',currentWindowApp=null,isDragging=false,dragOffsetX,dragOffsetY;
        TimeManager.registerTimeElement(currentTime);TimeManager.registerTimeElement(addPageTime);TimeManager.registerTimeElement(settingsPageTime);TimeManager.registerTimeElement(appManagementPageTime);TimeManager.registerTimeElement(statusCustomizationPageTime);TimeManager.registerTimeElement(imageStoragePageTime);TimeManager.registerTimeElement(videoStoragePageTime);
        ModalManager.registerModal('addApp',addAppSection,()=>{colorOSSidebar.setActiveNavItem('add');},()=>{document.getElementById('addAppBtn').removeAttribute('data-editing-index');document.getElementById('addAppBtn').innerHTML='<i class="fas fa-plus"></i> 添加应用';});ModalManager.registerModal('settings',settingsSection,()=>{colorOSSidebar.setActiveNavItem('settings');});ModalManager.registerModal('appManagement',appManagementSection,()=>renderAppManagement());ModalManager.registerModal('statusCustomization',statusCustomizationSection,()=>{statusBarText.value=settings.statusBarText;statusBarColor.value=settings.statusBarColor;document.querySelectorAll('.status-item').forEach(item=>{const iconClass=item.getAttribute('data-icon');if(settings.statusBarIcons.includes(iconClass))item.classList.add('active');else item.classList.remove('active');});});ModalManager.registerModal('imageStorage',imageStorageSection,()=>renderImageGallery());ModalManager.registerModal('videoStorage',videoStorageSection,()=>renderVideoGallery());
        
        // 注册更多动画
        function registerAllAnimations() {
            animController.register('app-launch', document.querySelector('.app-launch-animation'), 0.4);
            animController.register('status-panel', document.querySelector('.status-panel'), 0.45);
            animController.register('multitask-panel', document.querySelector('.multitask-panel'), 0.45);
            animController.register('browser-container', document.querySelector('.browser-container'), 0.4);
            animController.register('modal-section', document.querySelector('.modal-section'), 0.3);
            
            // 应用动画速度设置
            animController.setSpeed(settings.animationSpeed);
        }
        
        function applySettings(){
            if(settings.darkMode){
                document.body.classList.add('dark-mode');
                nightModeBtn.classList.add('active');
            }else{
                document.body.classList.remove('dark-mode');
                nightModeBtn.classList.remove('active');
            }
            if(settings.backgroundType==='gradient'){
                backgroundLayer.style.background='linear-gradient(135deg, rgba(26,42,108,0.7), rgba(74,68,181,0.7), rgba(108,99,255,0.7))';
                backgroundImageItem.style.display='none';
                backgroundColorItem.style.display='none';
            }else if(settings.backgroundType==='image'&&settings.backgroundImage){
                backgroundLayer.style.background=`url(${settings.backgroundImage}) center/cover no-repeat`;
                backgroundImageItem.style.display='flex';
                backgroundColorItem.style.display='none';
            }else if(settings.backgroundType==='solid'){
                backgroundLayer.style.background=settings.backgroundColor;
                backgroundImageItem.style.display='none';
                backgroundColorItem.style.display='flex';
            }
            if(settings.statusBarStyle==='light'){
                phoneStatusBar.style.color='#000';
                phoneStatusBar.style.background='rgba(255,255,255,0.7)';
            }else if(settings.statusBarStyle==='dark'){
                phoneStatusBar.style.color='#fff';
                phoneStatusBar.style.background='rgba(0,0,0,0.3)';
            }else{
                const bgColor=settings.backgroundColor||'#1a2a6c';
                const rgb=parseInt(bgColor.substring(1),16);
                const r=(rgb>>16)&0xff;
                const g=(rgb>>8)&0xff;
                const b=(rgb>>0)&0xff;
                const brightness=(r*299+g*587+b*114)/1000;
                if(brightness>128){
                    phoneStatusBar.style.color='#000';
                    phoneStatusBar.style.background='rgba(255,255,255,0.7)';
                }else{
                    phoneStatusBar.style.color='#fff';
                    phoneStatusBar.style.background='rgba(0,0,0,0.3)';
                }
            }
            
            // 更新全局动画速度
            animController.setSpeed(settings.animationSpeed);
            
            if(settings.themeColor){
                document.documentElement.style.setProperty('--primary',settings.themeColor);
                document.documentElement.style.setProperty('--secondary',adjustColor(settings.themeColor,-15));
            }
            if(settings.statusBarText)document.querySelector('.status-center').textContent=settings.statusBarText;
            if(settings.statusBarColor)phoneStatusBar.style.background=settings.statusBarColor;
            if(settings.volume!==undefined){
                volumeSlider.value=settings.volume;
                volumeSliderPanel.value=settings.volume;
                videoPlayer.volume=settings.volume;
            }
            if(useBuiltInBrowser)useBuiltInBrowser.checked=settings.useBuiltInBrowser;
            if(defaultLaunchMode)defaultLaunchMode.value=settings.defaultLaunchMode;
            appsPerPage=parseInt(settings.appLimit);
            renderApps();
        }
        function adjustColor(color,amount){return'#'+color.replace(/^#/,'').replace(/../g,color=>('0'+Math.min(255,Math.max(0,parseInt(color,16)+amount)).toString(16)).substr(-2));}
        function saveSettings(){
            StorageManager.set('settings',settings);
            applySettings();
        }
        function renderPagination(){const totalPages=Math.ceil(filteredApps.length/appsPerPage);pagination.innerHTML='';if(totalPages<=1)return;for(let i=1;i<=totalPages;i++){const pageBtn=document.createElement('button');pageBtn.className=`page-btn ${i===currentPage?'active':''}`;pageBtn.textContent=i;pageBtn.addEventListener('click',()=>{appsContainer.classList.add('fade-out');setTimeout(()=>{currentPage=i;renderApps();appsContainer.classList.remove('fade-out');appsContainer.classList.add('fade-in');setTimeout(()=>{appsContainer.classList.remove('fade-in');},300);},300);});pagination.appendChild(pageBtn);}}
        function renderApps(){appsContainer.innerHTML='';if(isEditMode){appsContainer.classList.add('edit-mode');document.querySelectorAll('.app-item:not(.add-app-item)').forEach(item=>{item.setAttribute('draggable','true');});}else{appsContainer.classList.remove('edit-mode');document.querySelectorAll('.app-item').forEach(item=>{item.removeAttribute('draggable');});}const startIndex=(currentPage-1)*appsPerPage;const endIndex=Math.min(startIndex+appsPerPage,filteredApps.length);const currentApps=filteredApps.slice(startIndex,endIndex);currentApps.forEach((app,index)=>{const appElement=document.createElement('div');appElement.className='app-item';appElement.setAttribute('data-app-index',(currentPage-1)*appsPerPage+index);const iconChar=app.name.charAt(0);appElement.innerHTML=`<div class="app-icon" style="background-color:${app.color}">${iconChar}</div><div class="app-name">${app.name}</div>`;if(isEditMode)appElement.onclick=()=>deleteAppInEditMode((currentPage-1)*appsPerPage+index);else appElement.onclick=e=>handleAppClick(app,e);appsContainer.appendChild(appElement);});if(currentApps.length<appsPerPage&&filteredApps.length===apps.length){const addAppElement=document.createElement('div');addAppElement.className='app-item add-app-item';addAppElement.onclick=()=>ModalManager.showModal('addApp');addAppElement.innerHTML=`<div class="add-icon"><i class="fas fa-plus"></i></div><div class="app-name">添加应用</div>`;appsContainer.appendChild(addAppElement);}renderPagination();}
        function handleAppClick(app,event){
            currentApp=app;
            if(settings.defaultLaunchMode==='ask')showWindowModeDialog(app,event);
            else showAppLaunchAnimation(app,event,()=>{launchApp(settings.defaultLaunchMode);});
        }
        function showAppLaunchAnimation(app,event,callback){
            animController.startAnimation('app-launch');
            
            const appElement=event.currentTarget;
            const rect=appElement.getBoundingClientRect();
            DOMCache.appLaunchIcon.style.position='fixed';
            DOMCache.appLaunchIcon.style.left=`${rect.left}px`;
            DOMCache.appLaunchIcon.style.top=`${rect.top}px`;
            DOMCache.appLaunchIcon.style.width=`${rect.width}px`;
            DOMCache.appLaunchIcon.style.height=`${rect.height}px`;
            DOMCache.appLaunchIcon.style.backgroundColor=app.color;
            const iconChar=app.name.charAt(0);
            DOMCache.appLaunchIcon.innerHTML=`<span style="color:white;font-size:${rect.width*0.4}px;font-weight:bold;">${iconChar}</span>`;
            DOMCache.appLaunchText.textContent=`启动 ${app.name}`;
            DOMCache.appLaunchAnimation.classList.add('active');
            let progress=0;
            const progressInterval=setInterval(()=>{
                progress+=Math.random()*15;
                if(progress>=100){
                    progress=100;
                    clearInterval(progressInterval);
                    setTimeout(()=>{
                        DOMCache.appLaunchAnimation.classList.remove('active');
                        animController.stopAnimation('app-launch');
                        if(callback)callback();
                    },500);
                }
                DOMCache.appLaunchProgressBar.style.width=`${progress}%`;
            },100);
            
            // 存储interval以便中断
            VirtualNavigation.launchInterval = progressInterval;
        }
        function showWindowModeDialog(app,event){
            currentApp=app;
            const appElement=event.currentTarget;
            const rect=appElement.getBoundingClientRect();
            DOMCache.appLaunchIcon.style.position='fixed';
            DOMCache.appLaunchIcon.style.left=`${rect.left}px`;
            DOMCache.appLaunchIcon.style.top=`${rect.top}px`;
            DOMCache.appLaunchIcon.style.width=`${rect.width}px`;
            DOMCache.appLaunchIcon.style.height=`${rect.height}px`;
            DOMCache.appLaunchIcon.style.backgroundColor=app.color;
            const iconChar=app.name.charAt(0);
            DOMCache.appLaunchIcon.innerHTML=`<span style="color:white;font-size:${rect.width*0.4}px;font-weight:bold;">${iconChar}</span>`;
            DOMCache.appLaunchText.textContent=`启动 ${app.name}`;
            DOMCache.appLaunchAnimation.classList.add('active');
            let progress=0;
            const progressInterval=setInterval(()=>{
                progress+=Math.random()*15;
                if(progress>=100){
                    progress=100;
                    clearInterval(progressInterval);
                    setTimeout(()=>{
                        DOMCache.appLaunchAnimation.classList.remove('active');
                        windowModeDialog.classList.add('active');
                    },500);
                }
                DOMCache.appLaunchProgressBar.style.width=`${progress}%`;
            },100);
            
            // 存储interval以便中断
            VirtualNavigation.launchInterval = progressInterval;
        }
        function launchApp(mode){
            if(mode==='fullscreen'){
                if(settings.useBuiltInBrowser)openBrowser(currentApp.url,currentApp.name);
                else window.open(currentApp.url,'_blank');
            }else openWindowMode(currentApp);
            addToRecentApps(currentApp);
        }
        function openWindowMode(app){
            currentWindowApp=app;
            windowModeTitle.textContent=app.name;
            windowModeIcon.style.backgroundColor=app.color;
            windowModeIcon.textContent=app.name.charAt(0);
            const containerWidth=windowModeContainer.offsetWidth;
            const containerHeight=windowModeContainer.offsetHeight;
            const windowWidth=window.innerWidth;
            const windowHeight=window.innerHeight;
            windowModeContainer.style.left=`${(windowWidth-containerWidth)/2}px`;
            windowModeContainer.style.top=`${(windowHeight-containerHeight)/2}px`;
            windowModeIframe.src=app.url;
            windowModeContainer.classList.add('active');
            addToRecentApps(app);
        }
        function closeWindowMode(){
            windowModeContainer.classList.remove('active');
            windowModeIframe.src='';
            currentWindowApp=null;
        }
        function addToRecentApps(app){
            const existingIndex=recentApps.findIndex(item=>item.name===app.name);
            if(existingIndex!==-1)recentApps.splice(existingIndex,1);
            recentApps.unshift({name:app.name,url:app.url,color:app.color,timestamp:Date.now()});
            if(recentApps.length>12)recentApps.pop();
            StorageManager.set('recent',recentApps);
            renderRecentApps();
        }
        function renderRecentApps(){
            recentAppsContainer.innerHTML='';
            if(recentApps.length===0){
                recentAppsContainer.innerHTML='<p style="text-align:center;width:100%;grid-column:1/-1;">暂无</p>';
                return;
            }
            recentApps.forEach((app,index)=>{
                const appElement=document.createElement('div');
                appElement.className='recent-app-item';
                appElement.setAttribute('data-app-index',index);
                appElement.innerHTML=`<div class="recent-app-screenshot"><i class="fas fa-globe"></i><span>${app.name}</span></div><div class="recent-app-info"><div class="recent-app-icon" style="background-color:${app.color}">${app.name.charAt(0)}</div><div class="recent-app-name">${app.name}</div></div><div class="recent-app-close"><i class="fas fa-times"></i></div>`;
                appElement.addEventListener('click',e=>{
                    if(!e.target.classList.contains('recent-app-close')){
                        openWindowMode(app);
                        hideMultitaskPanel();
                    }
                });
                appElement.querySelector('.recent-app-close').addEventListener('click',e=>{
                    e.stopPropagation();
                    removeFromRecentApps(index);
                });
                recentAppsContainer.appendChild(appElement);
            });
        }
        function removeFromRecentApps(index){
            recentApps.splice(index,1);
            StorageManager.set('recent',recentApps);
            renderRecentApps();
        }
        function showMultitaskPanel(){
            multitaskPanel.classList.add('active');
            renderRecentApps();
        }
        function hideMultitaskPanel(){
            multitaskPanel.classList.remove('active');
        }
        function openBrowser(url,name){
            const tabId=Date.now().toString();
            const newTab={id:tabId,url:url,title:name,canGoBack:false,canGoForward:false};
            browserTabs.push(newTab);
            activeTabId=tabId;
            renderBrowserTabs();
            browserUrlInput.value=url;
            browserIframe.src=url;
            browserContainer.classList.add('active');
            let progress=0;
            const progressInterval=setInterval(()=>{
                progress+=Math.random()*20;
                if(progress>=100){
                    progress=100;
                    clearInterval(progressInterval);
                }
                browserLoadingBar.style.width=`${progress}%`;
            },100);
            browserIframe.onload=function(){
                clearInterval(progressInterval);
                browserLoadingBar.style.width='100%';
                setTimeout(()=>{
                    browserLoadingBar.style.width='0%';
                },500);
                try{
                    const tabIndex=browserTabs.findIndex(tab=>tab.id===activeTabId);
                    if(tabIndex!==-1){
                        browserTabs[tabIndex].title=browserIframe.contentDocument.title||browserTabs[tabIndex].title;
                        renderBrowserTabs();
                    }
                }catch(e){}
                updateBrowserNavigationButtons();
            };
            browserIframe.onerror=function(){
                clearInterval(progressInterval);
                browserLoadingBar.style.width='0%';
                try{
                    browserIframe.srcdoc=`<!DOCTYPE html><html><head><title>加载失败</title><style>body{font-family:Arial,sans-serif;padding:20px;text-align:center;}h1{color:#ff4444;}</style></head><body><h1>页面加载失败</h1><p>无法加载 ${url}</p><p>请检查网络连接或网址是否正确</p><button onclick="window.location.href='${url}'">重试</button></body></html>`;
                }catch(e){console.error("无法设置备用内容:",e);}
            };
        }
        function renderBrowserTabs(){
            browserTabContainer.innerHTML='';
            browserTabs.forEach(tab=>{
                const tabElement=document.createElement('div');
                tabElement.className=`browser-tab ${tab.id===activeTabId?'active':''}`;
                tabElement.setAttribute('data-tab-id',tab.id);
                tabElement.innerHTML=`<div class="browser-tab-title">${tab.title}</div><div class="browser-tab-close" data-tab-id="${tab.id}"><i class="fas fa-times"></i></div>`;
                tabElement.addEventListener('click',e=>{
                    if(!e.target.classList.contains('browser-tab-close'))switchToTab(tab.id);
                });
                tabElement.querySelector('.browser-tab-close').addEventListener('click',e=>{
                    e.stopPropagation();
                    closeTab(tab.id);
                });
                browserTabContainer.appendChild(tabElement);
            });
        }
        function switchToTab(tabId){
            const tab=browserTabs.find(t=>t.id===tabId);
            if(tab){
                activeTabId=tabId;
                browserIframe.src=tab.url;
                browserUrlInput.value=tab.url;
                renderBrowserTabs();
                updateBrowserNavigationButtons();
            }
        }
        function closeTab(tabId){
            const tabIndex=browserTabs.findIndex(tab=>tab.id===tabId);
            if(tabIndex!==-1){
                browserTabs.splice(tabIndex,1);
                if(tabId===activeTabId){
                    if(browserTabs.length>0){
                        activeTabId=browserTabs[Math.min(tabIndex,browserTabs.length-1)].id;
                        switchToTab(activeTabId);
                    }else closeBrowser();
                }else renderBrowserTabs();
            }
        }
        function updateBrowserNavigationButtons(){
            try{
                const tab=browserTabs.find(t=>t.id===activeTabId);
                if(tab){
                    browserBackBtn.disabled=!browserIframe.contentWindow.history.length||browserIframe.contentWindow.history.length<=1;
                    browserForwardBtn.disabled=true;
                }
            }catch(e){
                browserBackBtn.disabled=true;
                browserForwardBtn.disabled=true;
            }
        }
        function closeBrowser(){
            browserContainer.classList.remove('active');
            browserIframe.src='';
            browserTabs=[];
            activeTabId=null;
            currentApp=null;
            renderBrowserTabs();
        }
        function refreshBrowser(){
            if(browserIframe.src){
                browserIframe.src=browserIframe.src;
                let progress=0;
                const progressInterval=setInterval(()=>{
                    progress+=Math.random()*30;
                    if(progress>=100){
                        progress=100;
                        clearInterval(progressInterval);
                    }
                    browserLoadingBar.style.width=`${progress}%`;
                },100);
                browserIframe.onload=function(){
                    clearInterval(progressInterval);
                    browserLoadingBar.style.width='100%';
                    setTimeout(()=>{
                        browserLoadingBar.style.width='0%';
                    },500);
                };
            }
        }
        function browserForward(){
            try{
                browserIframe.contentWindow.history.forward();
                updateBrowserNavigationButtons();
            }catch(e){
                console.log("无法前进");
            }
        }
        function browserHome(){
            if(currentApp)browserIframe.src=currentApp.url;
        }
        function renderAppManagement(){
            appManagementList.innerHTML='';
            apps.forEach((app,index)=>{
                const appItem=document.createElement('div');
                appItem.className='app-management-item';
                appItem.innerHTML=`<div class="app-management-info"><div class="app-management-icon" style="background-color:${app.color}">${app.name.charAt(0)}</div><div><div class="app-name">${app.name}</div><div style="font-size:0.8rem;opacity:0.7;">${app.url}</div><div style="font-size:0.7rem;opacity:0.5;">分类:${app.category||'未分类'}</div></div></div><div class="app-management-actions"><button class="action-btn edit-btn" data-index="${index}"><i class="fas fa-edit"></i> 编辑</button><button class="action-btn delete-btn" data-index="${index}"><i class="fas fa-trash"></i> 删除</button></div></div>`;
                appManagementList.appendChild(appItem);
            });
            document.querySelectorAll('.delete-btn').forEach(btn=>{
                btn.addEventListener('click',function(){
                    const index=parseInt(this.getAttribute('data-index'));
                    deleteApp(index);
                });
            });
            document.querySelectorAll('.edit-btn').forEach(btn=>{
                btn.addEventListener('click',function(){
                    const index=parseInt(this.getAttribute('data-index'));
                    editApp(index);
                });
            });
        }
        function renderImageGallery(){
            imageGallery.innerHTML='';
            if(storedImages.length===0){
                imageGallery.innerHTML='<p style="text-align:center;width:100%;">暂无图片</p>';
                return;
            }
            storedImages.forEach((image,index)=>{
                const imageItem=document.createElement('div');
                imageItem.className='image-item';
                imageItem.innerHTML=`<img src="${image}" alt="存储的图片"><button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>`;
                imageGallery.appendChild(imageItem);
            });
            document.querySelectorAll('.image-item .delete-btn').forEach(btn=>{
                btn.addEventListener('click',function(e){
                    e.stopPropagation();
                    const index=parseInt(this.getAttribute('data-index'));
                    deleteImage(index);
                });
            });
        }
        function renderVideoGallery(){
            videoGallery.innerHTML='';
            if(storedVideos.length===0){
                videoGallery.innerHTML='<p style="text-align:center;width:100%;">暂无视频</p>';
                return;
            }
            storedVideos.forEach((video,index)=>{
                const videoItem=document.createElement('div');
                videoItem.className='video-item';
                videoItem.innerHTML=`<video><source src="${video.url}" type="video/mp4">您的浏览器不支持视频播放</video><div class="video-play-btn"><i class="fas fa-play"></i></div><div class="video-title">${video.name}</div><button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>`;
                videoGallery.appendChild(videoItem);
                videoItem.querySelector('.video-play-btn').addEventListener('click',function(){
                    playVideo(video.url,video.name);
                });
                videoItem.querySelector('.delete-btn').addEventListener('click',function(e){
                    e.stopPropagation();
                    const index=parseInt(this.getAttribute('data-index'));
                    deleteVideo(index);
                });
            });
        }
        function deleteApp(index){
            if(confirm(`确定要删除应用 "${apps[index].name}" 吗？`)){
                apps.splice(index,1);
                StorageManager.set('apps',apps);
                filteredApps=apps;
                currentPage=1;
                renderApps();
                renderAppManagement();
                alert('应用已删除！');
            }
        }
        function deleteAppInEditMode(index){
            if(confirm(`确定要删除应用 "${apps[index].name}" 吗？`)){
                apps.splice(index,1);
                StorageManager.set('apps',apps);
                filteredApps=apps;
                currentPage=1;
                renderApps();
                alert('应用已删除！');
            }
        }
        function deleteImage(index){
            if(confirm('确定要删除这张图片吗？')){
                storedImages.splice(index,1);
                StorageManager.set('images',storedImages);
                renderImageGallery();
                alert('图片已删除！');
            }
        }
        function deleteVideo(index){
            if(confirm('确定要删除这个视频吗？')){
                storedVideos.splice(index,1);
                StorageManager.set('videos',storedVideos);
                renderVideoGallery();
                alert('视频已删除！');
            }
        }
        function editApp(index){
            const app=apps[index];
            document.getElementById('appName').value=app.name;
            document.getElementById('appUrl').value=app.url;
            document.getElementById('appColor').value=app.color;
            document.getElementById('appCategory').value=app.category||'其他';
            document.getElementById('addAppBtn').setAttribute('data-editing-index',index);
            document.getElementById('addAppBtn').innerHTML='<i class="fas fa-save"></i> 保存修改';
            ModalManager.showModal('addApp');
        }
        function playVideo(url,name){
            videoPlayer.src=url;
            videoPlayer.load();
            videoPlayer.play();
            videoPlayerContainer.classList.add('active');
            currentVideo={url,name};
            playPauseBtn.innerHTML='<i class="fas fa-pause"></i>';
        }
        function initializeStatusPanel(){
            if(settings.wifiEnabled)wifiSetting.classList.add('active');
            if(settings.bluetoothEnabled)bluetoothSetting.classList.add('active');
            if(settings.mobileDataEnabled)mobileDataSetting.classList.add('active');
            if(settings.airplaneMode)airplaneSetting.classList.add('active');
            if(settings.locationEnabled)locationSetting.classList.add('active');
            wifiSetting.addEventListener('click',function(){
                this.classList.toggle('active');
                settings.wifiEnabled=this.classList.contains('active');
                saveSettings();
                alert(`Wi-Fi ${settings.wifiEnabled?'已开启':'已关闭'}`);
            });
            bluetoothSetting.addEventListener('click',function(){
                this.classList.toggle('active');
                settings.bluetoothEnabled=this.classList.contains('active');
                saveSettings();
                alert(`蓝牙 ${settings.bluetoothEnabled?'已开启':'已关闭'}`);
            });
            mobileDataSetting.addEventListener('click',function(){
                this.classList.toggle('active');
                settings.mobileDataEnabled=this.classList.contains('active');
                saveSettings();
                alert(`移动数据 ${settings.mobileDataEnabled?'已开启':'已关闭'}`);
            });
            airplaneSetting.addEventListener('click',function(){
                this.classList.toggle('active');
                settings.airplaneMode=this.classList.contains('active');
                if(settings.airplaneMode){
                    wifiSetting.classList.remove('active');
                    bluetoothSetting.classList.remove('active');
                    mobileDataSetting.classList.remove('active');
                    settings.wifiEnabled=false;
                    settings.bluetoothEnabled=false;
                    settings.mobileDataEnabled=false;
                }
                saveSettings();
                alert(`飞行模式 ${settings.airplaneMode?'已开启':'已关闭'}`);
            });
            locationSetting.addEventListener('click',function(){
                this.classList.toggle('active');
                settings.locationEnabled=this.classList.contains('active');
                saveSettings();
                alert(`定位服务 ${settings.locationEnabled?'已开启':'已关闭'}`);
            });
            brightnessSetting.addEventListener('click',function(){
                alert('亮度调节功能 - 在实际应用中，这里可以添加亮度滑块控制');
            });
        }
        function showStatusPanel(){
            ModalManager.interruptTransitions();
            statusPanel.classList.add('active');
            isStatusPanelOpen=true;
            ModalManager.activeTransitions.add(statusPanel);
        }
        function hideStatusPanel(){
            ModalManager.interruptTransitions();
            statusPanel.classList.remove('active');
            isStatusPanelOpen=false;
        }
        function toggleDarkMode(){
            settings.darkMode=!settings.darkMode;
            saveSettings();
            if(settings.darkMode)nightModeBtn.classList.add('active');
            else nightModeBtn.classList.remove('active');
        }
        function performSearch(){
            const searchTerm=searchInput.value.toLowerCase();
            if(searchTerm)filteredApps=apps.filter(app=>app.name.toLowerCase().includes(searchTerm));
            else filteredApps=apps;
            currentPage=1;
            renderApps();
        }
        addAppBtn.addEventListener('click',function(){
            const appName=document.getElementById('appName').value.trim();
            const appUrl=document.getElementById('appUrl').value.trim();
            const appColor=document.getElementById('appColor').value;
            const appCategory=document.getElementById('appCategory').value;
            const editingIndex=this.getAttribute('data-editing-index');
            if(!appName||!appUrl){
                alert('请填写应用名称和链接！');
                return;
            }
            let formattedUrl=appUrl;
            if(!formattedUrl.startsWith('http://')&&!formattedUrl.startsWith('https://'))formattedUrl='https://'+formattedUrl;
            if(editingIndex!==null)apps[editingIndex]={name:appName,url:formattedUrl,color:appColor,category:appCategory};
            else apps.push({name:appName,url:formattedUrl,color:appColor,category:appCategory});
            StorageManager.set('apps',apps);
            filteredApps=apps;
            currentPage=Math.ceil(apps.length/appsPerPage);
            renderApps();
            colorOSSidebar.renderContent();
            document.getElementById('appName').value='';
            document.getElementById('appUrl').value='';
            ModalManager.hideModal('addApp');
            alert(editingIndex!==null?'应用修改成功！':'应用添加成功！');
        });
        backBtn.addEventListener('click',()=>ModalManager.hideModal('addApp'));backBtnAdd.addEventListener('click',()=>ModalManager.hideModal('addApp'));backBtnSettings.addEventListener('click',()=>ModalManager.hideModal('settings'));backBtnAppManagement.addEventListener('click',()=>ModalManager.hideModal('appManagement'));backBtnStatusCustomization.addEventListener('click',()=>ModalManager.hideModal('statusCustomization'));backBtnImageStorage.addEventListener('click',()=>ModalManager.hideModal('imageStorage'));backBtnVideoStorage.addEventListener('click',()=>ModalManager.hideModal('videoStorage'));backToSettings.addEventListener('click',()=>{ModalManager.hideModal('appManagement');ModalManager.showModal('settings');});backToSettingsFromStatus.addEventListener('click',()=>{ModalManager.hideModal('statusCustomization');ModalManager.showModal('settings');});backToSettingsFromImages.addEventListener('click',()=>{ModalManager.hideModal('imageStorage');ModalManager.showModal('settings');});backToSettingsFromVideos.addEventListener('click',()=>{ModalManager.hideModal('videoStorage');ModalManager.showModal('settings');});
        statusBarButton.addEventListener('click',showStatusPanel);statusBarBackButton.addEventListener('click',hideStatusPanel);nightModeBtn.addEventListener('click',toggleDarkMode);searchInput.addEventListener('input',performSearch);overlay.addEventListener('click',()=>{if(ModalManager.activeModal)ModalManager.hideModal(ModalManager.activeModal);});
        document.querySelectorAll('.status-item').forEach(item=>{
            item.addEventListener('click',function(){
                this.classList.toggle('active');
            });
        });
        imageUpload.addEventListener('change',function(e){
            const files=e.target.files;
            if(files.length>0){
                for(let i=0;i<files.length;i++){
                    const file=files[i];
                    if(file.type.startsWith('image/')){
                        const reader=new FileReader();
                        reader.onload=function(e){
                            storedImages.push(e.target.result);
                            StorageManager.set('images',storedImages);
                            renderImageGallery();
                        };
                        reader.readAsDataURL(file);
                    }
                }
                alert('图片上传成功！');
                this.value='';
            }
        });
        videoUpload.addEventListener('change',function(e){
            const files=e.target.files;
            if(files.length>0){
                for(let i=0;i<files.length;i++){
                    const file=files[i];
                    if(file.type.startsWith('video/')){
                        const reader=new FileReader();
                        reader.onload=function(e){
                            storedVideos.push({name:file.name,url:e.target.result});
                            StorageManager.set('videos',storedVideos);
                            renderVideoGallery();
                        };
                        reader.readAsDataURL(file);
                    }
                }
                alert('视频上传成功！');
                this.value='';
            }
        });
        stackedNotifications.addEventListener('click',function(){
            this.classList.toggle('expanded');
        });
        document.querySelector('.clear-all').addEventListener('click',function(){
            if(confirm('确定要清除所有通知吗？')){
                document.querySelectorAll('.notification-item').forEach(item=>{
                    item.remove();
                });
                document.querySelector('.notification-stack').remove();
                alert('所有通知已清除！');
            }
        });
        backgroundType.addEventListener('change',function(){
            settings.backgroundType=this.value;
            if(this.value==='image'){
                backgroundImageItem.style.display='flex';
                backgroundColorItem.style.display='none';
            }else if(this.value==='solid'){
                backgroundImageItem.style.display='none';
                backgroundColorItem.style.display='flex';
            }else{
                backgroundImageItem.style.display='none';
                backgroundColorItem.style.display='none';
            }
            applySettings();
        });
        backgroundImage.addEventListener('change',function(e){
            const file=e.target.files[0];
            if(file){
                const reader=new FileReader();
                reader.onload=function(e){
                    settings.backgroundImage=e.target.result;
                    applySettings();
                };
                reader.readAsDataURL(file);
            }
        });
        backgroundColor.addEventListener('change',function(){
            settings.backgroundColor=this.value;
            applySettings();
        });
        statusBarStyle.addEventListener('change',function(){
            settings.statusBarStyle=this.value;
            applySettings();
        });
        appLimit.addEventListener('change',function(){
            settings.appLimit=this.value;
            appsPerPage=parseInt(this.value);
            currentPage=1;
            renderApps();
        });
        animationSpeed.addEventListener('change',function(){
            settings.animationSpeed=this.value;
            applySettings();
        });
        themeColor.addEventListener('change',function(){
            settings.themeColor=this.value;
            applySettings();
        });
        useBuiltInBrowser.addEventListener('change',function(){
            settings.useBuiltInBrowser=this.checked;
            saveSettings();
        });
        defaultLaunchMode.addEventListener('change',function(){
            settings.defaultLaunchMode=this.value;
            saveSettings();
        });
        volumeSlider.addEventListener('input',function(){
            settings.volume=parseFloat(this.value);
            videoPlayer.volume=settings.volume;
            volumeSliderPanel.value=settings.volume;
            saveSettings();
        });
        volumeSliderPanel.addEventListener('input',function(){
            settings.volume=parseFloat(this.value);
            videoPlayer.volume=settings.volume;
            volumeSlider.value=settings.volume;
            saveSettings();
        });
        volumeQuickSetting.addEventListener('click',function(){
            volumeControl.style.display=volumeControl.style.display==='none'?'flex':'none';
        });
        saveStatusCustomizationBtn.addEventListener('click',function(){
            settings.statusBarText=statusBarText.value;
            settings.statusBarColor=statusBarColor.value;
            settings.statusBarIcons=[];
            document.querySelectorAll('.status-item.active').forEach(item=>{
                settings.statusBarIcons.push(item.getAttribute('data-icon'));
            });
            saveSettings();
            alert('状态栏设置已保存！');
            ModalManager.hideModal('statusCustomization');
        });
        resetSettingsBtn.addEventListener('click',function(){
            if(confirm('确定要恢复默认设置吗？')){
                settings={...defaultSettings};
                backgroundType.value=settings.backgroundType;
                backgroundColor.value=settings.backgroundColor;
                statusBarStyle.value=settings.statusBarStyle;
                appLimit.value=settings.appLimit;
                animationSpeed.value=settings.animationSpeed;
                themeColor.value=settings.themeColor;
                useBuiltInBrowser.checked=settings.useBuiltInBrowser;
                defaultLaunchMode.value=settings.defaultLaunchMode;
                saveSettings();
                alert('设置已恢复为默认值！');
            }
        });
        saveSettingsBtn.addEventListener('click',function(){
            saveSettings();
            alert('设置已保存！');
            ModalManager.hideModal('settings');
        });
        playPauseBtn.addEventListener('click',function(){
            if(videoPlayer.paused){
                videoPlayer.play();
                this.innerHTML='<i class="fas fa-pause"></i>';
            }else{
                videoPlayer.pause();
                this.innerHTML='<i class="fas fa-play"></i>';
            }
        });
        videoPlayer.addEventListener('play',function(){
            playPauseBtn.innerHTML='<i class="fas fa-pause"></i>';
        });
        videoPlayer.addEventListener('pause',function(){
            playPauseBtn.innerHTML='<i class="fas fa-play"></i>';
        });
        videoPlayer.addEventListener('timeupdate',function(){
            const progress=(videoPlayer.currentTime/videoPlayer.duration)*100;
            videoProgressFilled.style.width=`${progress}%`;
            const currentTime=formatTime(videoPlayer.currentTime);
            const duration=formatTime(videoPlayer.duration);
            videoTime.textContent=`${currentTime}/${duration}`;
        });
        videoProgress.addEventListener('click',function(e){
            const rect=videoProgress.getBoundingClientRect();
            const percent=(e.clientX-rect.left)/rect.width;
            videoPlayer.currentTime=percent*videoPlayer.duration;
        });
        muteBtn.addEventListener('click',function(){
            videoPlayer.muted=!videoPlayer.muted;
            this.innerHTML=videoPlayer.muted?'<i class="fas fa-volume-mute"></i>':'<i class="fas fa-volume-up"></i>';
        });
        fullscreenBtn.addEventListener('click',function(){
            if(videoPlayer.requestFullscreen)videoPlayer.requestFullscreen();
            else if(videoPlayer.webkitRequestFullscreen)videoPlayer.webkitRequestFullscreen();
            else if(videoPlayer.mozRequestFullScreen)videoPlayer.mozRequestFullScreen();
            else if(videoPlayer.msRequestFullscreen)videoPlayer.msRequestFullscreen();
        });
        closeVideo.addEventListener('click',function(){
            videoPlayer.pause();
            videoPlayerContainer.classList.remove('active');
        });
        browserBackBtn.addEventListener('click',function(){
            try{
                browserIframe.contentWindow.history.back();
                updateBrowserNavigationButtons();
            }catch(e){
                closeBrowser();
            }
        });
        browserForwardBtn.addEventListener('click',browserForward);browserHomeBtn.addEventListener('click',browserHome);browserRefreshBtn.addEventListener('click',refreshBrowser);browserCloseBtn.addEventListener('click',closeBrowser);
        document.querySelectorAll('.window-mode-option').forEach(option=>{
            option.addEventListener('click',function(){
                document.querySelectorAll('.window-mode-option').forEach(opt=>{
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                selectedWindowMode=this.getAttribute('data-mode');
            });
        });
        windowModeConfirm.addEventListener('click',function(){
            windowModeDialog.classList.remove('active');
            launchApp(selectedWindowMode);
        });
        windowModeCancel.addEventListener('click',function(){
            windowModeDialog.classList.remove('active');
            currentApp=null;
        });
        windowModeClose.addEventListener('click',closeWindowMode);
        windowModeMinimize.addEventListener('click',function(){
            windowModeContainer.style.transform='scale(0.8)';
            windowModeContainer.style.opacity='0.5';
            setTimeout(()=>{
                windowModeContainer.style.transform='scale(1)';
                windowModeContainer.style.opacity='1';
            },300);
        });
        windowModeHeader.addEventListener('mousedown',startDrag);windowModeHeader.addEventListener('touchstart',startDrag);function startDrag(e){
            isDragging=true;
            const clientX=e.type==='mousedown'?e.clientX:e.touches[0].clientX;
            const clientY=e.type==='mousedown'?e.clientY:e.touches[0].clientY;
            const rect=windowModeContainer.getBoundingClientRect();
            dragOffsetX=clientX-rect.left;
            dragOffsetY=clientY-rect.top;
            document.addEventListener('mousemove',drag);
            document.addEventListener('touchmove',drag);
            document.addEventListener('mouseup',stopDrag);
            document.addEventListener('touchend',stopDrag);
        }function drag(e){
            if(!isDragging)return;
            const clientX=e.type==='mousemove'?e.clientX:e.touches[0].clientX;
            const clientY=e.type==='mousemove'?e.clientY:e.touches[0].clientY;
            const newX=clientX-dragOffsetX;
            const newY=clientY-dragOffsetY;
            const maxX=window.innerWidth-windowModeContainer.offsetWidth;
            const maxY=window.innerHeight-windowModeContainer.offsetHeight;
            windowModeContainer.style.left=`${Math.max(0,Math.min(newX,maxX))}px`;
            windowModeContainer.style.top=`${Math.max(0,Math.min(newY,maxY))}px`;
        }function stopDrag(){
            isDragging=false;
            document.removeEventListener('mousemove',drag);
            document.removeEventListener('touchmove',drag);
            document.removeEventListener('mouseup',stopDrag);
            document.removeEventListener('touchend',stopDrag);
        }
        multitaskButton.addEventListener('click',showMultitaskPanel);multitaskClose.addEventListener('click',hideMultitaskPanel);
        function formatTime(seconds){
            const mins=Math.floor(seconds/60);
            const secs=Math.floor(seconds%60);
            return`${mins}:${secs<10?'0':''}${secs}`;
        }
        function updateNavActive(page){
            // 不再需要更新侧边栏导航项
        }
        function initializeSettingsUI(){
            backgroundType.value=settings.backgroundType;
            backgroundColor.value=settings.backgroundColor;
            statusBarStyle.value=settings.statusBarStyle;
            appLimit.value=settings.appLimit;
            animationSpeed.value=settings.animationSpeed;
            themeColor.value=settings.themeColor;
            useBuiltInBrowser.checked=settings.useBuiltInBrowser;
            defaultLaunchMode.value=settings.defaultLaunchMode;
            if(settings.backgroundType==='image'){
                backgroundImageItem.style.display='flex';
                backgroundColorItem.style.display='none';
            }else if(settings.backgroundType==='solid'){
                backgroundImageItem.style.display='none';
                backgroundColorItem.style.display='flex';
            }else{
                backgroundImageItem.style.display='none';
                backgroundColorItem.style.display='none';
            }
        }

        // 添加防抖函数减少频繁操作
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // 优化搜索功能
        searchInput.addEventListener('input', debounce(performSearch, 300));               
        
        function initializePage(){
        function initializePage(){
    // 启用性能监控
    PerformanceMonitor.init();
    
    // 启用错误处理
    ErrorHandler.init();
    
    // 初始内存优化
    ResourceManager.optimizeMemory();
    
    // 设置定期清理
    setInterval(() => {
        PerformanceUtils.cleanupUnusedResources();
        ResourceManager.optimizeMemory();
    }, 60000); // 每分钟清理一次
    
    // 原有初始化代码...
    initializeSettingsUI();
    applySettings();
    // ... 其余原有代码
}
            initializeSettingsUI();
            applySettings();
            AppCategoryManager.init();
            DragSortManager.init();
            DataBackupManager.init();
            BookmarkManager.init();
            renderApps();
            renderRecentApps();
            initializeStatusPanel();
            VirtualNavigation.init();
                        // 防止双击放大
            document.documentElement.addEventListener('touchstart', e => {
            // 注册所有动画
            registerAllAnimations();
            
            
            let longPressTimer;
            appsContainer.addEventListener('mousedown',function(e){
                if(e.target.closest('.app-item')&&!isEditMode){
                    longPressTimer=setTimeout(()=>{
                        isEditMode=true;
                        renderApps();
                    },1000);
                }
            });
            appsContainer.addEventListener('mouseup',function(){
                clearTimeout(longPressTimer);
            });
            appsContainer.addEventListener('mouseleave',function(){
                clearTimeout(longPressTimer);
            });
            document.addEventListener('click',function(e){
                if(isEditMode&&!e.target.closest('.app-item')){
                    isEditMode=false;
                    renderApps();
                }
            });
            appsContainer.addEventListener('touchstart',function(e){
                if(e.target.closest('.app-item')&&!isEditMode){
                    longPressTimer=setTimeout(()=>{
                        isEditMode=true;
                        renderApps();
                    },1000);
                }
            });
            appsContainer.addEventListener('touchend',function(){
                clearTimeout(longPressTimer);
            });
            

                if (e.touches.length > 1) {
                    e.preventDefault();
                }
            }, {passive: false});
        }
        // 错误处理系统
const ErrorHandler = {
    init() {
        // 捕获未处理的Promise错误
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise错误:', event.reason);
            this.showError('应用发生错误，请重试');
        });
        
        // 捕获JavaScript运行时错误
        window.addEventListener('error', (event) => {
            console.error('JavaScript错误:', event.error);
            this.showError('系统发生错误，部分功能可能不可用');
        });
    },
    
    showError(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
};

// 资源管理器
const ResourceManager = {
    // 图片预加载
    preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    },
    
    // 清理未使用的iframe
    cleanupIframes() {
        document.querySelectorAll('iframe').forEach(iframe => {
            if (!iframe.src || iframe.style.display === 'none') {
                iframe.src = 'about:blank';
            }
        });
    },
    
    // 优化内存使用
    optimizeMemory() {
        // 清理过期的localStorage数据
        const now = Date.now();
        const keysToRemove = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.expiry && data.expiry < now) {
                        keysToRemove.push(key);
                    }
                } catch (e) {
                    keysToRemove.push(key);
                }
            }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
};
        initializePage();TimeManager.init();
        EventManager.batchAddEvents({'.back-btn':{'click':e=>{if(ModalManager.activeModal)ModalManager.hideModal(ModalManager.activeModal);}},'.app-item:not(.add-app-item)':{'click':e=>{const index=parseInt(e.currentTarget.getAttribute('data-app-index'));const app=apps[index];handleAppClick(app,e);}}});
