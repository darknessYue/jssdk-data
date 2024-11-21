import {upload} from "./upload";
import qs from "qs";


// 参数创建前
let beforeCreateParams;
// 上报日志前
let beforeUpload;
// 上报日志后
let afterUpload;
// 异常处理
let onError = (e) => {
    console.error(e);
};


export function collect(customData={}, eventType) {
    let appId, pageId, timestamp, ua, currentPageUrl;
    beforeCreateParams && beforeCreateParams();
    const metaList = document.querySelectorAll("meta"); 
    for(let i=0; i<metaList.length; i++) {
        const meta = metaList[i];
        if(meta.getAttribute("ac-app-id")) {
            appId = meta.getAttribute("ac-app-id");
        }
    }
    const body = document.body;
    pageId = body.getAttribute("ac-page-id");
    timestamp = Date.now();
    ua = navigator.userAgent;
    const params = {
        appId,
        pageId,
        timestamp,
        ua,
        currentPageUrl,
        ...customData
    }
    let data = qs.stringify(params);
    data = beforeUpload ? beforeUpload(data) ?? data : data;
    // 调用上报日志API
    let url, urlData;
    try {
        const ret = upload(data, { eventType });
        url = ret.url;
        urlData = ret.data;
    } catch (e) {
        onError(e);
    } finally {
        afterUpload && afterUpload(url, urlData);
    }
}

export function sendPV() {
    collect({}, 'PV');
}

export function sendExp(customData={}) {
    collect(customData, 'EXP');
}

export function sendClick(customData={}) {
    collect(customData, 'CLICK');
}


export function sendCustom(customData={}) {
    collect(customData, 'CUSTOM');
}

export function collectAppear() {
    const appearEvent = new CustomEvent('appear')
    const disappearEvent = new CustomEvent('disappear')

    let ob;
    const obList = window.acTrackerObList || [];
    if(window.acTrackerOb) {
        ob = window.acTrackerOb;
    } else {
        ob = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.dispatchEvent(appearEvent)
                } else {
                    entry.target.dispatchEvent(disappearEvent)
                }
            })
        }, { threshold: 0.5 })
    }

    document.querySelectorAll('[ac-exp]').forEach(node => {
        if(!obList.includes(node)) {
            obList.push(node)
            ob.observe(node)
            node.addEventListener('appear', () => {
                console.log(node.className, 'appear', node.getAttribute('ac-exp'))
                sendExp({
                    type: 'exp',
                    exp: node.getAttribute('ac-exp')
                })
            })
        }
    })
    window.acTrackerOb = ob;
    window.acTrackerObList = obList;
}

export function registerBeforeCreateParams(fn) {
    beforeCreateParams = fn;
}

export function registerBeforeUpload(fn) {
    beforeUpload = fn;
}

export function registerAfterUpload(fn) {
    afterUpload = fn;
}

export function registerOnError(fn) {
    onError = fn;
}
