<template>
  <div class="map">
    <div class="aside">
      <div class="device">
        <div class="title">设备列表</div>
        <div class="list">
          <el-date-picker
            style="width: 90%; margin: 10px"
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-input
            style="width: 90%"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            size="mini"
            clearable
          >
          </el-input>
          <el-scrollbar style="height: 90%">
          <el-tree
            :data="deviceList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            lazy
            ref="tree"
            highlight-current
            accordion
          >
            <div
              class="custom-tree-node"
              :class="data.OnlineFlag == 1 ? online : offline"
              slot-scope="{ node, data }"
            >
            <qx-icon
              v-if="data.type == 'device'"
              :icon="
                data.OnlineFlag == '1' ? 'device_online' : 'device_offline'
              "
              :size="20"
            ></qx-icon>
          
              <el-tooltip
                :content="node.label + ' (' + data.$ + ')'"
                placement="top"
                :open-delay="1000"
              >
                <div class="label">{{ node.label }}</div>
              </el-tooltip>
              <div>
                <el-tooltip
                  :content="getStatus(data).tooltip"
                  placement="top"
                  :open-delay="500"
                >
                  <i
                    :class="getStatus(data).status"
                    @click="showTrack(data)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  style="margin-left: 10px"
                  content="定位"
                  placement="top"
                  :open-delay="500"
                >
                  <i class="el-icon-aim" @click="locationPoint(data)"></i>
                </el-tooltip>
              </div>
            </div>
          </el-tree>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="topBar">
        <el-row type="flex">
          <el-col></el-col>
          <el-col>
            <el-autocomplete
              ref="searchBox"
              v-show="search"
              v-model="searchText"
              placeholder="搜索设备名称"
              :fetch-suggestions="fetchSuggestions"
              popper-class="autocomplete"
              @select="handleSelect"
              clearable
              size="small"
            >
              <i slot="suffix" class="el-input__icon el-icon-edit"></i>
              <template v-slot="{ item }">
                <div class="name">{{ item.name }}</div>
                <span class="address">{{ item.address }}</span>
              </template>
            </el-autocomplete>
          </el-col>
          <el-col>
            <i
              :class="[search ? searchShow : searchHide]"
              @click="handleSearch"
            ></i>
            <i
              :class="[traffic ? trafficShow : trafficHide]"
              @click="handleTraffic"
            ></i>
            <i
              :class="[roadNetwork ? roadNetworkShow : roadNetworkHide]"
              @click="handleRoadNetwork"
            ></i>
            <i
              :class="[statelliteMap ? statelliteMapShow : statelliteMapHide]"
              @click="handleStatelliteMap"
            ></i>
          </el-col>
        </el-row>
      </div>
      <div id="container"></div>
    </div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import moment from "moment";
import _ from "lodash";
import onPerson from "../../assets/icons/online.png";
import offPerson from "../../assets/icons/offline.png";
import bus from "../../utils/bus";
import GPS from "../../utils/gps";
import cf from "../../utils/config"  // 登录参数
import webcu2plugin from "../../utils/webcu2plugin"

let AMap;
export default {
  name: "elemap",
  data() {
    return {
      map: null,
      searchText: "",
      search: false,
      searchShow: "search-show",
      searchHide: "search-hide",
      traffic: false,
      trafficObj: null,
      trafficShow: "traffic-show",
      trafficHide: "traffic-hide",
      roadNetwork: false,
      roadNetworkObj: null,
      roadNetworkShow: "road-network-show",
      roadNetworkHide: "road-network-hide",
      statelliteMap: false,
      statelliteMapObj: null,
      statelliteMapShow: "statellite-map-show",
      statelliteMapHide: "statellite-map-hide",
      online: "online",
      offline: "offline",
      deviceList: [],
      markerClusterer: null,
      zIndex: 0,
      geocoder: null,
      infoWindow: null,
      filterText: "",
      icvsParam: null,
      isShowList: true,
      showIcon: "el-icon-caret-left",
      showList: {
        transform: "translate(0,0)",
      },
      hideList: {
        transform: "translate(-300px,0)",
      },
      dateRange: [moment().subtract(1, "days"), moment()],
      defaultProps: {
        label: "Name",
      },
    };
  },
  mounted() {
    let self = this;
    this.listenerSocket();
   
    setTimeout(() => {
       self.getDeviceList(0);
    }, 2000);
    this.icvsParam = cf.connParams;
    AMapLoader.load({
      key: "4e0bf6a732ebe335492b93f3400f314c",
      version: "1.4.15",
      plugins: ["AMap.MarkerClusterer", "AMap.Geocoder"],
    })
      .then((obj) => {
        AMap = obj;
        this.initData();
      })
      .catch(() => {});
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeEvent);
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    async initData() {
      this.map = new AMap.Map("container", {
        zoom: 12,
        zooms: [5, 18],
      });
      this.trafficObj = new AMap.TileLayer.Traffic({
        map: this.map,
      });
      this.trafficObj.hide();
      this.roadNetworkObj = new AMap.TileLayer.RoadNet({
        map: this.map,
      });
      this.roadNetworkObj.hide();
      this.statelliteMapObj = new AMap.TileLayer.Satellite({
        map: this.map,
      });
      this.statelliteMapObj.hide();
      this.geocoder = new AMap.Geocoder({
        radius: 1000,
      });
      this.infoWindow = new AMap.InfoWindow({
        autoMove: true,
        offset: new AMap.Pixel(6, -23),
      });
      this.markerClusterer = new AMap.MarkerClusterer(this.map, [], {
        averageCenter: true,
        maxZoom: 17,
        gridSize: 120,
      });
    },
    async listenerSocket() {
      let self = this;
      bus.$on("device_online", async(result) => {
        await webcu2plugin.subscriptionGps({
          epid: self.icvsParam.epid,
          puid: result,
        })
        if (this.markerClusterer) {
          this.markerClusterer.getMarkers().forEach((item) => {
            if (item.getExtData().$ == result) {
              item.getExtData().OnlineFlag = "1";
              item.setIcon(
                new AMap.Icon({
                  image: onPerson,
                  size: new AMap.Size(64, 64),
                })
              );
            }
          });
        }
      });
      bus.$on("device_offline", (result) => {
        if (this.markerClusterer) {
          this.markerClusterer.getMarkers().forEach((item) => {
            if (item.getExtData().$ == result) {
              item.getExtData().OnlineFlag = "0";
              item.setIcon(
                new AMap.Icon({
                  image: offPerson,
                  size: new AMap.Size(64, 64),
                })
              );
            }
          });
        }
      });
      bus.$on("device_update", (result) => {
        if (this.markerClusterer) {
          this.markerClusterer.getMarkers().forEach((item) => {
            let position = GPS.gcj_encrypt(
              parseFloat(result.gps.Latitude),
              parseFloat(result.gps.Longitude)
            );
            if (item.getExtData().$ == result.puid) {
              Object.assign(item.getExtData(), result.gps);
              item.setPosition(new AMap.LngLat(position.lon, position.lat));
            }
          });
        }
      });
    },
    async handleSearch() {
      this.search = !this.search;
      await this.$nextTick();
      if (this.search) {
        this.$refs.searchBox.$el.getElementsByTagName("input")[0].focus();
      } else {
        this.$refs.searchBox.$el.getElementsByTagName("input")[0].blur();
      }
    },
    handleTraffic() {
      this.traffic = !this.traffic;
      if (this.traffic) {
        this.trafficObj.show();
      } else {
        this.trafficObj.hide();
      }
    },
    handleRoadNetwork() {
      this.roadNetwork = !this.roadNetwork;
      if (this.roadNetwork) {
        this.roadNetworkObj.show();
      } else {
        this.roadNetworkObj.hide();
      }
    },
    handleStatelliteMap() {
      this.statelliteMap = !this.statelliteMap;
      if (this.statelliteMap) {
        this.statelliteMapObj.show();
      } else {
        this.statelliteMapObj.hide();
      }
    },
    fetchSuggestions(str, callback) {
      let list = [];
      if (this.markerClusterer) {
        this.markerClusterer.getMarkers().forEach((item) => {
          list.push({
            name: item.getExtData().Name,
            address: item.getExtData().address,
            lng: item.getExtData().Longitude,
            lat: item.getExtData().Latitude,
          });
        });
      }
      let result = str
        ? list.filter((item) =>
            item.name.toLowerCase().includes(str.toLowerCase())
          )
        : [];
      callback(result);
    },
    handleSelect(val) {
      let position = GPS.gcj_encrypt(parseFloat(val.lat), parseFloat(val.lng));
      this.searchText = val.name;
      this.map.setZoomAndCenter(
        18,
        new AMap.LngLat(position.lon, position.lat)
      );
    },
    getDirection(val) {
      let direction = [
        {
          name: "北",
          range: [0, 44],
        },
        {
          name: "东北",
          range: [45, 89],
        },
        {
          name: "东",
          range: [90, 134],
        },
        {
          name: "东南",
          range: [135, 179],
        },
        {
          name: "南",
          range: [180, 224],
        },
        {
          name: "西南",
          range: [225, 269],
        },
        {
          name: "西",
          range: [270, 314],
        },
        {
          name: "西北",
          range: [315, 359],
        },
      ];
      if (val && val >= 0 && val < 360) {
        return direction.filter((item) => {
          return _.inRange(val, item.range[0] - 22.5, item.range[1] - 22.5);
        })[0].name;
      } else {
        return "北";
      }
    },
    async getDeviceList(offset) {
      let self = this;
      let deviceList = await webcu2plugin.getDeviceList({
        offset,
        count: 100,
      });
      deviceList.forEach((item) => {
        item.track = null;
        item.path = [];
        item.status = 0;
        item.address = "";
        item.type = "device";
        self.deviceList.push(item);
      });

      this.deviceList.sort((a, b) => {
        return b.OnlineFlag - a.OnlineFlag;
      });
      if (deviceList.length == 100) {
        self.getDeviceList(offset + 100);
      } else {
        let list = [];
        this.deviceList.forEach(async(item) => {
          list.push({ puid: item.$ });
          if (item.OnlineFlag == 1) {
            let data = await webcu2plugin.subscriptionGps({
              epid: self.icvsParam.epid,
              puid: item.$,
            })
            let data1 = $.xml2json(data)
            console.log(data1);
          }
        });
        for(let i = 0 ; i < list.length ; i++){
          let gpslistXML = await webcu2plugin.getPuidLastGps(
            { 
              epid: self.icvsParam.epid,
              puid: list[i].puid , 
            });
          let gpslistJson = $.xml2json(gpslistXML)
          let gpslist = gpslistJson.C.Res && gpslistJson.C.Res.Param.Res
          if(!gpslist) continue
          self.deviceList.forEach((item) => {
            if(item.$ == gpslist.PUID){
               Object.assign(item, gpslist.GPS);
            }
           
          });
        }
        this.setMarkerList(this.deviceList);
      }
      // this.deviceList = this.deviceList.sort((a, b) => {
      //   return b["OnlineFlag"] - a["OnlineFlag"];
      // });
     
    },
    async showTrack(data) {
      if (data.status == 0) {
        data.status = 1;
        await this.getHistoryPoint({
          offset: 0,
          begin: Math.round(moment(this.dateRange[0]).valueOf() / 1000),
          end: Math.round(moment(this.dateRange[1]).valueOf() / 1000),
          data,
        });
      }
      if (data.status == 2) {
        this.map.remove(data.track);
        data.status = 0;
        data.path = [];
        data.track = null;
      }
    },
    locationPoint(data) {
      if (data.Longitude && data.Latitude) {
        let position = GPS.gcj_encrypt(
          parseFloat(data.Latitude),
          parseFloat(data.Longitude)
        );
        this.map.setZoomAndCenter(
          18,
          new AMap.LngLat(position.lon, position.lat)
        );
      } else {
        this.$message({
          message: "经纬度获取失败",
          type: "warning",
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.Name.indexOf(value) !== -1;
    },
    getStatus(data) {
      let status = "";
      let tooltip = "";
      if (data.status == 0) {
        status = "el-icon-map-location";
        tooltip = "查看轨迹";
      } else if (data.status == 1) {
        status = "el-icon-loading";
        tooltip = "加载中...";
      } else {
        status = "el-icon-close";
        tooltip = "清除轨迹";
      }
      return { status, tooltip };
    },
    async getHistoryPoint({ offset, begin, end, data }) {
      let self = this;
      let resultXML = await webcu2plugin.getPuidHistoryGps({
        offset,
        count: 100,
        begin,
        end,
        puid: data.$,
        epid:self.icvsParam.epid,
      })
      let result = $.xml2json(resultXML).C.Res.Param.Res
      if (result && result.GPS) {
        data.path.push(...result.GPS);
        if (result.GPS.length == 100) {
          this.getHistoryPoint({ offset: offset + 100, begin, end, data });
        } else {
          if (data.path.length) {
            data.status = 2;
            let path = [];
            this.filterTrack(data.path).forEach((item) => {
              let position = GPS.gcj_encrypt(
                parseFloat(item.Latitude),
                parseFloat(item.Longitude)
              );
              path.push([position.lon, position.lat]);
            });
            data.track = new AMap.Polyline({
              map: this.map,
              path: path,
              isOutline: true,
              outlineColor: "#ffeeff",
              borderWeight: 1,
              strokeColor: "#409EFF",
              strokeOpacity: 1,
              strokeWeight: 5,
              strokeStyle: "solid",
              lineJoin: "round",
              lineCap: "round",
              showDir: true,
            });
          } else {
            data.status = 0;
            this.$message({
              message: "轨迹获取失败",
              type: "warning",
            });
          }
        }
      }else{
        data.status = 0;
        this.$message({
          message: "轨迹获取失败",
          type: "warning",
        });
      }
    },
    filterTrack(data) {
      let obj = {};
      return data.reduce((item, next) => {
        let index =
          next.Longitude.toString().replace(/\./, "") +
          next.Latitude.toString().replace(/\./, "");
        if (!obj[index]) {
          item.push(next);
          obj[index] = true;
        }
        return item;
      }, []);
    },
    changeListStatus() {
      this.isShowList = !this.isShowList;
      if (this.isShowList) {
        this.showIcon = "el-icon-caret-left";
      } else {
        this.showIcon = "el-icon-caret-right";
      }
    },
    setMarkerList(data) {
      data.forEach((item) => {
        if (item.Longitude && item.Latitude) {
          let position = GPS.gcj_encrypt(
            parseFloat(item.Latitude),
            parseFloat(item.Longitude)
          );
          let marker = new AMap.Marker({
            position: new AMap.LngLat(position.lon, position.lat),
            icon: new AMap.Icon({
              image: item.OnlineFlag == 1 ? onPerson : offPerson,
              size: new AMap.Size(64, 64),
            }),
            extData: item,
          });
          marker.on("click", async (event) => {
            this.animationMarker(event.target);
            let data = event.target.getExtData();
            data.address = await this.getAddress(data.Longitude, data.Latitude);
            this.infoWindow.open(this.map, event.target.getPosition());
            this.infoWindow.setContent(
              this.createInfoContent({
                name: data.Name,
                direction: this.getDirection(parseInt(data.Bearing)),
                speed: parseInt(data.Speed),
                lng: data.Longitude,
                lat: data.Latitude,
                time: moment().utc(data.UTC).format("yyyy-MM-DD hh:mm:ss"),
                address: data.address,
              })
            );
          });
          this.markerClusterer.addMarker(marker);
        }
      });
    },
    animationMarker(mark) {
      mark.setAnimation("AMAP_ANIMATION_BOUNCE");
      mark.setzIndex(++this.zIndex);
      setTimeout(() => {
        mark.setAnimation("AMAP_ANIMATION_NONE");
      }, 3600);
    },
    getAddress(lng, lat) {
      return new Promise((resolve) => {
        if (lng && lat) {
          let position = new AMap.LngLat(lng, lat);
          this.geocoder.getAddress(position, (status, result) => {
            if (status == "complete") {
              resolve(result.regeocode.formattedAddress);
            } else {
              resolve("地址获取失败");
            }
          });
        } else {
          resolve("地址获取失败");
        }
      });
    },
    createInfoContent(data) {
      let content;
      let nameDiv;
      let nameImgWrapper;
      let nameImg;
      let name;
      let directionDiv;
      let directionImg;
      let direction;
      let locationDiv;
      let locationImg;
      let location;
      let speed;
      let lng;
      let lat;
      let time;
      let address;
      content = document.createElement("div");
      content.className = "custom-info-window";
      nameDiv = document.createElement("div");
      nameDiv.className = "name";
      nameImgWrapper = document.createElement("div");
      nameImg = document.createElement("div");
      nameImgWrapper.appendChild(nameImg);
      name = document.createElement("div");
      name.innerHTML = data.name;
      nameDiv.appendChild(nameImgWrapper);
      nameDiv.appendChild(name);
      directionDiv = document.createElement("div");
      directionDiv.className = "direction";
      directionImg = document.createElement("div");
      direction = document.createElement("div");
      direction.innerHTML = data.direction + "  " + data.speed + "km/h";
      directionDiv.appendChild(directionImg);
      directionDiv.appendChild(direction);
      locationDiv = document.createElement("div");
      locationDiv.className = "location";
      locationImg = document.createElement("div");
      location = document.createElement("div");
      location.innerHTML = data.lng + " / " + data.lat;
      locationDiv.appendChild(locationImg);
      locationDiv.appendChild(location);
      address = document.createElement("div");
      address.innerHTML = data.address;
      content.append(nameDiv, directionDiv, locationDiv, address);
      return content;
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  ::v-deep .el-tree-node__expand-icon {
    visibility: hidden;
    display: none;
  }
  .custom-tree-node {
    padding-left: 6px;
  }
}

.map {
  #container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  display: flex;
  .aside {
    width: 320px;
    background-color: #021132;
    border-top: 1px solid #021132;
    opacity: 1;
    .device {
      height: 100%;
      .title {
        width: 100px;
        height: 4%;
        margin-top: 20px;
        margin-bottom: 5px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 40px;
        text-indent: 5px;
        color: #f6f6ff;
        opacity: 1;
      }
      .list {
        width: 290px;
        height: 92%;
        margin: 0 15px;
        background: rgba(19, 85, 176, 0.2);
        .custom-tree-node {
          -ms-flex: 1;
          flex: 1;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
          -ms-flex-pack: justify;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
          position: relative;
          width: 100%;
          color: #f6f6ff;
          border-bottom: 1px solid #f6f6ff;

          .right {
            position: absolute;
            left: 0;
          }
        }
      }
    }
  }
  .main {
    width: 100%;
    .topBar {
      float: right;
      width: 100%;
      z-index: 99;
      > .el-row {
        padding-top: 15px;
        padding-bottom: 15px;
        z-index: 99;
        background-color: rgba(155, 155, 155, 0.6);

        > .el-col:nth-child(2) {
          > div {
            width: 100%;
          }
        }

        > .el-col:nth-child(3) {
          display: flex;
          justify-content: flex-end;

          > i {
            display: inline-block;
            width: 32px;
            height: 32px;
            margin-right: 20px;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 70%;
            cursor: pointer;
          }

          > .search-show {
            background-image: url("../../assets/icon/search-show.png");
          }

          > .search-hide {
            background-image: url("../../assets/icon/search-hide.png");
          }

          > .traffic-show {
            background-image: url("../../assets/icon/traffic-show.png");
          }

          > .traffic-hide {
            background-image: url("../../assets/icon/traffic-hide.png");
          }

          > .road-network-show {
            background-image: url("../../assets/icon/road-network-show.png");
          }

          > .road-network-hide {
            background-image: url("../../assets/icon/road-network-hide.png");
          }

          > .statellite-map-show {
            background-image: url("../../assets/icon/statellite-map-show.png");
          }

          > .statellite-map-hide {
            background-image: url("../../assets/icon/statellite-map-hide.png");
          }
        }
      }
      .autocomplete {
        li {
          .name {
            text-overflow: ellipsis;
            overflow: hidden;
            line-height: 24px;
          }

          .address {
            font-size: 12px;
            color: #b4b4b4;
          }
        }
      }
    }
  }
}
</style>

<style>
.list .el-tree {
  background-color: transparent;
}
.list .el-tree-node__content:hover {
  background-color: #4ea79f;
}
.el-tree-node__expand-icon.is-leaf {
  color: grey;
}
.list .el-tree-node__expand-icon.is-leaf:hover {
  color: darkcyan;
}
.list
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background: #3589fc;
}
.list input.el-input__inner {
  height: 30px;
  color: #fff;
  border-radius: 20px;
  background-color: rgba(255,255,255,0.1);
}

.list .el-input__inner::placeholder {
  color: #fff;
  text-align: center;
}
/* 谷歌 */
.list .el-input__inner::-webkit-input-placeholder {
  color: #fff;
  text-align: center;
}
/* 火狐 */
.list .el-input__inner:-moz-placeholder {
  color: #fff;
  text-align: center;
}
/*ie*/
.list .el-input__inner:-ms-input-placeholder {
  color: #fff;
  text-align: center;
}
.list .el-input__icon {
  color: #fff;
}
.amap-info-content {
  padding: 0;
  border-radius: 10px;
}
.custom-info-window {
  padding: 10px;
  border-radius: 10px;
  width: 320px;
  height: 160px;
  border: 2px solid #3589fc;
  color: #3589fc;
}
.custom-info-window .name,
.custom-info-window .direction,
.custom-info-window .location {
  display: flex;
  margin-bottom: 10px;
}
.custom-info-window .name > div:nth-child(1) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 3px solid #3589fc;
}
.custom-info-window .name > div:nth-child(1) > div {
  width: 30px;
  height: 30px;
  background-image: url("../../assets/icon/cameraIcon.png");
  background-size: 100% 100%;
}
.custom-info-window .name > div:nth-child(2) {
  height: 46px;
  line-height: 46px;
  margin-left: 20px;
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: 500;
}
.custom-info-window .direction > div:nth-child(1) {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-left: 40px;
  background-image: url("../../assets/icon/speed.png");
  background-size: 100% 100%;
}
.custom-info-window .location > div:nth-child(1) {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-left: 40px;
  background-image: url("../../assets/icon/location.png");
  background-size: 100% 100%;
}
.custom-info-window .direction > div:nth-child(2),
.custom-info-window .location > div:nth-child(2) {
  display: inline-block;
  height: 25px;
  line-height: 25px;
  margin-left: 20px;
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 500;
}
</style>