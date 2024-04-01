// 简单封装document.querySelector
const getFirstEle = sign => document.querySelector(sign);

// 关键词
var KEYWORD = '';

// 总共找到多少处
var total = 0;  
const count_ele = getFirstEle('.count')
count_ele.innerText = '____'

const KEYWORD_CLASS_NAME = '__keyword_word__'
const __style = `color: #b60404; background-color: #f9f906; text-decoration: underline; text-decoration-style: double;`
var INDEX = null;               // 当前记录的关键词索引，用于跳转 [1 ~ total]

const find_btn = getFirstEle('.find-btn');
const clear_btn = getFirstEle('.clear');
const last_btn = getFirstEle('.last-btn');
const next_btn = getFirstEle('.next-btn');
const goto_keyword_inp = getFirstEle('.goto-keyword-inp')
const goto_btn = getFirstEle('.goto-btn')

// 控制关键词跳转是否可用
const usables = document.querySelectorAll('.usable');
const set_usable = (res)=>{ usables.forEach(e => { e.disabled = !res; }) }

// 默认不可用
set_usable(false);

// 点击查找关键词
find_btn.addEventListener('click', (e)=>{
    // 获取用户的输入
    let keyword = document.querySelector('.inp').value.trim()
    if(!keyword) return;

    // 获取上次的关键词
    let last_keyword = sessionStorage.getItem('_keyword_');

    // 如果上次查找的关键词存在并且与当前的关键词相等
    if(last_keyword && last_keyword === keyword){ return; }
    // 如果上次的关键词与当前的关键词不相等，那么页面的高亮没有被清理
    // 因为上次的关键词session中没有被清除。先清理页面残留
    else if(last_keyword && last_keyword !== keyword){
        clear_action(last_keyword, false, false, false)
    }

    // 更新关键词
    sessionStorage.setItem('_keyword_', keyword)
    KEYWORD = keyword;
    
    // 获取当前激活的标签页面 使用 tabs 需要权限 activeTab，在 manifest 中配置
    browser.tabs.query({active: true, currentWindow: true}).then((logTabs,onError)=>{
        // 然后往当前页面中注入内容脚本，document将是当前页面的 document
        browser.tabs.executeScript({
            code:`
(function action(keyword, nodes=document.body){
    let temp_nodes = Array.from(nodes.childNodes).filter((e)=>{
        return (
            e.textContent.includes(keyword) &&
            e.tagName !== 'META' &&
            e.tagName !== 'LINK' &&
            e.tagName !== 'SCRIPT' && 
            e.tagName !== 'TITLE'
        )
    })
    for(let node of temp_nodes){
        let type = node.nodeType
        if((type === 1 && node.textContent.includes(keyword)) && (node.tagName !== 'STRONG' || !node.className.includes('__keyword_word__'))){
            action(keyword, node);
        }else if(type === 3 && node.textContent.includes(keyword)){
            node.parentNode.innerHTML = 
                node.parentNode.innerHTML
                .replaceAll(keyword, "<strong style='${__style}' class='__keyword_word__'>" + keyword + "</strong>");
        }
    }
})('${keyword}')
document.querySelectorAll('.__keyword_word__').length
            `
        }).then((onExecuted, onError)=>{
            total = onExecuted[0]
            count_ele.innerText = total;
            // 开启跳转功能
            if(total > 0) set_usable(true);
        })
    })
})

// 点击清除按钮 回归页面原始的状态
clear_btn.addEventListener('click', ()=>{
    let keyword = sessionStorage.getItem('_keyword_');
    clear_action(keyword)
})

// 清除关键词标记
const clear_action = (keyword, clear_inp=true, clear_keyword_session=true, clear_count=true)=>{
    browser.tabs.query({active: true, currentWindow: true}).then(()=>{
        browser.tabs.executeScript({
            code:`
(function action(keyword, nodes=document.body){
    for(let node of Array.from(nodes.childNodes).filter(e=> parseInt(e.nodeType) === 1)){
        let type = node.nodeType
        if(node.textContent.includes(keyword) && (node.tagName !== 'STRONG' || !node.className.includes('__keyword_word__'))){
            action(keyword, node);
        }else if(node.textContent === keyword && node.tagName === 'STRONG' && node.className.includes('__keyword_word__')){
            let parent = node.parentNode;
            let textNode = document.createTextNode(keyword)
            parent.replaceChild(textNode, node)
        }
    }
})('${keyword}')
            `
        })
    })
    if(clear_inp) document.querySelector('.inp').value = '';
    if(clear_keyword_session) sessionStorage.setItem('_keyword_', '');
    if(clear_count) count_ele.innerText = '_____';
    set_usable(false)
    KEYWORD = ''
    goto_keyword_inp.value = ''
}

// 跳转到上一个关键词位置
last_btn.addEventListener('click', ()=>{
    if(!INDEX) INDEX = 1;
    else if(INDEX <= 1 ) INDEX = total;
    else if(INDEX >= total) INDEX = total - 1;
    else INDEX --;
    goto_keyword_site(INDEX - 1, KEYWORD);
})

// 跳转到下一个关键词位置
next_btn.addEventListener('click', ()=>{
    if(!INDEX) INDEX = 1;
    else if(INDEX <= 1) INDEX = 2;
    else if(INDEX >= total) INDEX = 1;
    else INDEX ++;
    goto_keyword_site(INDEX - 1, KEYWORD);
})

// 跳转到指定的位置
goto_btn.addEventListener('click', ()=>{
    let index = parseInt(goto_keyword_inp.value)
    if(!index) return;
    if(index > total) index = total;
    else if(index < 1) index = 1;
    goto_keyword_site(index - 1)
    INDEX = index;
})


// 跳转到具体的关键词位置
const goto_keyword_site = (index) =>{
    goto_keyword_inp.value = index + 1;
    browser.tabs.query({active: true, currentWindow: true}).then((logTabs,onError)=>{
        // 然后往当前页面中注入内容脚本，document将是当前页面的 document
        browser.tabs.executeScript({
            code:`
document.querySelectorAll(".${KEYWORD_CLASS_NAME}")[${index}].scrollIntoView({
        behavior:'smooth'
})            
            `
        })
    })
}









