
import {
    collect, 
    sendPV, 
    sendExp,
    sendClick,
    sendCustom,
    collectAppear,
    registerOnError,
    registerAfterUpload, 
    registerBeforeUpload, 
    registerBeforeCreateParams
} from "./collect";
import {upload} from "./upload";


collectAppear()

window.aeTracker = {
    collect,
    upload,
    sendPV,
    sendExp,
    sendClick,
    sendCustom,
    collectAppear,
    registerOnError,
    registerAfterUpload,
    registerBeforeUpload,
    registerBeforeCreateParams
}