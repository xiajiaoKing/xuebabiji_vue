<template>
  <div class="container">
    <div class="player pm">
      <div ref="slotModal" v-if="modalVisible" class="modal flex-center video-player">
        <slot></slot>
      </div>
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :events="events"
                    :playsinline="false"
                    :options="playerOptions"
                    @play="onPlayerPlay($event)"
                    @pause="onPlayerPause($event)"
                    @timeupdate="onPlayerTimeupdate($event)"
                    @statechanged="playerStateChanged($event)"
                    @fullscreenchange="fullscreenchange($event)"
                    @ended="ended($event)"
                    @change="monitor"
      >
      </video-player>
    </div>
  </div>
</template>
<script>
// 引入样式
import {videoPlayer} from 'vue-video-player'
import '../../node_modules/video.js/dist/video-js.css'
import '../../node_modules/vue-video-player/src/custom-theme.css'
import Serve_StudyCentre from '../services/study/StudyCentre'

export default {
  props: {
    videoUrl: String,
    state: Boolean,
    stub: Number,
    modalVisible: Boolean,
    VideoName: String,
    credit: '',
    id: String,
    studyTaskId: String
  },
  data () {
    return {
      events: ['fullscreenchange'],
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4',
          src: this.videoUrl// 你的m3u8地址（必填）
        }],
        // poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-3.jpg', // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试'// 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      modalObj: null
    }
  },
  watch: {
    // 更改视频源 videoUrl从弹出框组件传值
    videoUrl: function (val) {
      if (val !== '') {
        this.$refs.videoPlayer.player.src(val)
      }
    },
    // 弹出框关闭后暂停 否则一直在播放 state从弹出框组件传值
    state: function (val) {
      if (val) {
        this.$refs.videoPlayer.player.pause()
      }
    },
    stub: function (val) {
      if (!val) {
        if (this.modalObj) {
          this.modalObj.close()
          this.modalObj = null
        }
      }
    }
  },
  components: {
    videoPlayer
  },
  mounted () {
    this.monitor()
  },
  methods: {
    fullscreenchange () {

    },
    monitor () {
      let vd = document.getElementsByTagName('video')[0]
      let last = 0
      vd.ontimeupdate = function () {
        let current = vd.currentTime
        if (current - last > 1) {
          vd.currentTime = last
        } else {
          last = current
        }
      }
    },
    onPlayerTimeupdate (e) {
      if (this.stub && !this.modalObj) {
        var self = this
        var beginStub = self.stub - 2
        var endStub = self.stub + 2
        if (beginStub < e.currentTime() && e.currentTime() < endStub) {
          self.state = false
          self.modalVisible = true
          self.modalObj = self.$refs.videoPlayer.player.createModal(self.$refs.slotModal, {uncloseable: true})
          if (self.$refs.videoPlayer.player.isFullscreen() && self.modalVisible) {
            self.$refs.videoPlayer.player.exitFullscreen()
          }
          // self.$refs.videoPlayer.player.pause();
          self.$emit('stubEffect')
        }
      }
    },
    ended (e) {
      this.$notify({
        title: '完成',
        message: '恭喜您完成了' + '"' + this.VideoName + '"' + '视频学习，获得' + this.credit + '学分',
        type: 'success'
      })
      Serve_StudyCentre.serve_amendVideoStatus(this.id, this.studyTaskId).then(res => {

      })
    },
    onPlayerPlay (player) {

    },
    onPlayerPause (player) {

    },
    playerStateChanged (player) {

    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
  .container {
    background-color: #efefef;
    min-height: 100%;
  }

  .pm {
    position: relative;
  }

  .modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
  }
</style>
