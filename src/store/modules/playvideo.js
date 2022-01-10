import { api } from "../../api";

const state = {
    currentWindow: 1,
    playList: [],
    windowDomMap: null,
}

const getters = {
    /**
     * 通过窗口id、摄像头判断窗口是否在播放视频
     * @param {*} windowIndex  窗口索引 
     * @param {*} camera       摄像头信息 
     * @returns {Boolean} playing  是否在播放  true：在播放
     * @returns {Object}  playInfo 在播放时的播放信息
     */
    checkPlayState: state => params => {
        let playList = state.playList;
        let {
            windowIndex,
            camera
        } = params;
        let result = {
            playing: false,
            playInfo: null,
        }
        for (let play of playList) {
            if (
                (windowIndex && windowIndex == play.playWindow) ||
                (camera && camera.puid == play.puid && camera.Idx == play.idx)
            ) {
                result.playing = true;
                result.playInfo = play;
                break;
            }
        }
        return result
    },
    // 获取当前选中窗口的状态
    getCurrentWindowState: (state, getters) => {
        return getters.checkPlayState({
            windowIndex: state.currentWindow
        });
    },
    // 获取当前选中窗口的dom
    getCurrentEle: state => {
        let windowIndex = state.currentWindow;
        let currentDom = state.windowDomMap.get(windowIndex);
        return currentDom;
    }
}

const mutations = {
    // 当前选中的窗口索引
    setCurrentWindow(state, payload) {
        let {
            index
        } = payload;
        state.currentWindow = index;
    },
    addPlayInfo(state, payload) {
        let {
            play
        } = payload;
        state.playList.push(play);
    },
    delPlayInfo(state, payload) {
        let {
            play
        } = payload;
        for (let i = 0; i < state.playList.length; i++) {
            let pl = state.playList[i];
            if (pl.playID == play.playID) {
                state.playList.splice(i, 1)
                break
            }
        }
    },
    setWindowDomMap(state, payload) {
        if (!state.windowDomMap) state.windowDomMap = new Map();
        let {
            windowIndex,
            windowDom
        } = payload;
        state.windowDomMap.set(windowIndex, windowDom)
    },
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}