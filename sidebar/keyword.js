var total = 0


document.querySelector('.find_btn').addEventListener('click', (e)=>{
    // 获取用户的输入
    let keyword = document.querySelector('.inp').value
    if(!keyword.trim()) return
    sessionStorage.setItem('_keyword_', keyword)
    
    // 获取当前激活的标签页面 使用 tabs 需要权限 activeTab，在 manifest 中配置
    browser.tabs.query({active: true, currentWindow: true}).then((logTabs,onError)=>{
        // 然后往当前页面中注入内容脚本，document将是当前页面的 document
        browser.tabs.executeScript({
            code:`
(function action(keyword, nodes=document.body){
    for(let node of nodes.childNodes){
        let type = node.nodeType
        if((type === 1 && node.textContent.includes(keyword)) && (node.tagName !== 'STRONG' || !node.className.includes('red'))){
            action(keyword, node);
        }else if(type === 3 && node.textContent.includes(keyword)){
            node.parentNode.innerHTML = 
                node.parentNode.innerHTML
                .replaceAll(keyword, "<strong style='color:red;' class='red'>" + keyword + "</strong>");
        }
    }
})('${keyword}')
            `
        }).then((onExecuted, onError)=>{
            total = onExecuted
            console.log('total:',total)
        })
    })
})

// 回归页面原始的状态
document.querySelector('.clear').addEventListener('click', ()=>{
    let keyword = sessionStorage.getItem('_keyword_')
    browser.tabs.query({active: true, currentWindow: true}).then(()=>{
        browser.tabs.executeScript({
            code:`
(function action(keyword, nodes=document.body){
    for(let node of Array.from(nodes.childNodes).filter(e=> parseInt(e.nodeType) === 1)){
        let type = node.nodeType
        if(node.textContent.includes(keyword) && (node.tagName !== 'STRONG' || !node.className.includes('red'))){
            action(keyword, node);
        }else if(node.textContent === keyword && node.tagName === 'STRONG' && node.className.includes('red')){
            let parent = node.parentNode;
            let textNode = document.createTextNode(keyword)
            parent.replaceChild(textNode, node)
        }
    }
})('${keyword}')
            `
        })
    })
    document.querySelector('.inp').value = ''
    sessionStorage.setItem('_keyword_', '')
})
    








