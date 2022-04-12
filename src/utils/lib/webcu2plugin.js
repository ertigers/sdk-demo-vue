import { eleMap } from "./webcu/webcu-map.js"
import { preset } from "./webcu/webcu-preset.js"
import { ptz } from "./webcu/webcu-ptz.js"
import { videoCloud } from "./webcu/webcu-video-cloud.js"
import { videoFront } from "./webcu/webcu-video-front.js"
import { videoLocal } from "./webcu/webcu-video-local.js"
import { historyPlay } from "./webcu/webcu-history-play.js"
import { common } from "./webcu/webcu-common.js"
import { sound } from "./webcu/webcu-sound.js"
import { plugin } from "./webcu/webcu-plugin.js"
import { playvideo } from "./webcu/webcu-playvideo.js"
import { downloadfile } from "./webcu/webcu-downloadfile.js"

const webcu2plugin = Object.assign(sound, common, eleMap, preset, ptz, videoCloud, videoFront,
    videoLocal, historyPlay, plugin, playvideo, downloadfile)

export default webcu2plugin