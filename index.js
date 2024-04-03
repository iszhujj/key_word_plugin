document.body.style.border = "5px solid red";

let __href = location.href;

if(__href.indexOf(`https://www.baidu.com/s?`) === 0){
    let eles = Array.from(document.querySelector('#content_left').childNodes)
        .filter((e) => parseInt(e.nodeType) === 1 )
    eles.forEach(e => {
        if(e.querySelector('.ec-tuiguang')){
            e.style.display = 'none'
        }
    })
}

window.addEventListener('hashchange', function() {
    // 在哈希部分变化时执行的操作
    console.log('Hash changed:', location.hash, location.href);
});
document.addEventListener("DOMContentLoaded", function(event) {
    // 在页面重新渲染时执行的操作
    console.log('Page re-rendered');
});
window.onload = ()=>{
    console.log('abcdefg')
}


