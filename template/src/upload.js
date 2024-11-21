export function upload(data, opstions = {}) {
    let img = new Image();
    const { eventType = 'pv' } = opstions;
    let params = `${data}&eventType=${eventType}`
    const src = `https://www.imooc.com?${data}&eventType=${eventType}`;
    console.log(data, src, eventType)
    img.src = src;
    img = null;
    return {
        url: src,
        data: {
            params
        }
    };
}


export function expUpload(data, opstions = {}) {
    const { eventType = 'exp' } = opstions;
    return upload(data, { eventType });
}