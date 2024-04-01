/*

var LAST_URL = ''

// 监听页面URL改变
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo)
    // 如果 URL 变化且是完全加载完成的状态
    if (changeInfo.url && changeInfo.status === 'complete') {
        // 发送消息到标签页内容脚本
        browser.tabs.sendMessage(tabId, {
            type: 'urlChanged',
            url: changeInfo.url
        });
    }
});

// 监听标签页切换事件
browser.tabs.onActivated.addListener((activeInfo) => {
    // 获取被激活的标签页信息
    browser.tabs.get(activeInfo.tabId)
        .then(tab => {
            // 输出被激活标签页的URL
            console.log('切换到标签页:', tab.url);
        })
        .catch(error => {
            console.error('获取标签页信息时出错:', error);
        });
});

*/
