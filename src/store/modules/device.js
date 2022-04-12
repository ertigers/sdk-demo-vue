const state = {
  deviceList: [],  // 设备列表
  deviceResList: [], // 设备列表 + 子资源
};

const getters = {
  getDeviceOnlyIv: (state) => (params) => {
    let deviceList = state.deviceList;
    return deviceList;
  },
};

const mutations = {
  loopSetDevice(state, payload) {
    let { deviceList } = payload;
    state.deviceList = state.deviceList.concat(deviceList);
    state.deviceResList = state.deviceResList.concat(deviceList);

    state.deviceList.sort((a, b) => {  // 排序，在线的在前面
      return b.OnlineFlag - a.OnlineFlag;
    });
  },
  addRes(state, payload) {
    let { puid, res } = payload;
    for (let device of state.deviceResList) {
      if (device.$ == puid) {
        device.children = res;
        break;
      }
    }
  },
};

const actions = {
  async startFetchDevice({ commit, dispatch, state, rootState }) {
    let parmas = {
      offset: 0,
      count: 200,
    };
    state.deviceList = [];
    dispatch("loopFetchDevice", parmas);
  },
  async loopFetchDevice({ commit, dispatch }, params) {
    this._vm.$webcu2plugin.getDeviceList(params).then(async (rv) => {
      if (!rv.errcode) {
        rv.forEach((dv) => {
          dv.treeType = "device";
          return dv;
        });
        commit("loopSetDevice", {
          deviceList: rv,
        });
        if (rv.length == params.count) {
          params.offset += params.count;
          await dispatch("loopFetchDevice", params);
        }
      } else {
        console.log(rv);
      }
    }).catch((ex) => {
      console.log(ex);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
