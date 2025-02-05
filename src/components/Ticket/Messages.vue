<template>
  <q-card class="q-mt-xl msg-box "
          :class="{ 'private-message-card' : data.is_private}">
    <div class="user-img"
         :class="userIsCustomer? 'left-side' :  'right-side'"
    >
      <q-img width="85px"
             height="85px"
             class="user-photo"
             :src="data.user.photo">
        <template v-slot:error>
          <div class="flex  bg-white full-height full-width items-center justify-center">
            <q-icon color="primary"
                    size="lg"
                    name="isax:user"></q-icon>
          </div>
        </template>
      </q-img>

    </div>
    <q-card-section class="flex"
                    :class="userIsCustomer ?  'user-info' : 'admin-info' ">
      <div class="flex items-center info-section">
        <q-img v-if="!userIsCustomer"
               class="q-mr-md"
               width="20px"
               height="25px"
               src="https://nodes.alaatv.com/upload/favicon.ico" />
        <span
          class="q-mr-xs">
          {{ this.data.user.role }} : {{userIsCustomer ?'ماه'  : getAdminName()}}
        </span>
        <q-icon v-if="!isAdmin"
                size="16px"
                name="isax:user"
                class="user-icon" />
      </div>
      <div v-if="data.is_private"
           class="q-ml-xl">
        <q-icon name="isax:info-circle"
                size="sm"
                class="q-mb-xs"
                color="grey" />
        این پیام به صورت خصوصی میباشد
      </div>
    </q-card-section>
    <q-card-section class="message-body"

    >
      <div class="body ">
        <div v-html="data.body" />
        <div v-if="data.files.voice"
             dir="ltr">
          <div class="flex voice-player-section">
            <q-btn v-if="!showVoicePlayerIsPlaying"
                   size="30px"
                   unelevated
                   icon="isax:play"
                   class="play-btn"
                   @click="playRecordedVoice">
            </q-btn>
            <q-btn v-else
                   size="30px"
                   unelevated
                   @click="pauseRecordedVoice">
              <q-icon name="isax:pause"></q-icon>
            </q-btn>
            <av-waveform ref="waveform"
                         class="av-waveform"
                         :audio-src="data.files.voice"
                         :playtime-font-family="'IRANSans'"
                         :audio-controls="false"
                         :canv-width="900"
                         :canv-height="64"
            ></av-waveform>
          </div>
        </div>
        <q-img v-if="data.files.photo"
               :src="data.files.photo"
               class="q-my-lg"
        />
      </div>
      <q-separator class="q-my-md"></q-separator>
      <div class="flex">
        <q-chip color="blue"
                class="dateTime-chip"
                square>
          {{ convertToShamsi(data.created_at) }}
        </q-chip>
        <q-expansion-item
          v-if="!userIsCustomer"
          class="report-panel"
          icon="isax:ticket"
          label="گزارش پاسخ نامناسب"
        >
          <q-card>
            <p v-if="data.report.has_reported === 1">
              پیش از این گزارش ارسال شده
            </p>
            <template v-else>
              <q-card-section>
                <q-input v-model="userReportDescription"
                         outlined
                         type="textarea"></q-input>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  flat
                  color="blue"
                  @click="sendReport">
                  ارسال گزارش
                </q-btn>
              </q-card-actions>
            </template>

          </q-card>
        </q-expansion-item>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { mixinDateOptions, mixinTicket } from 'src/mixin/Mixins'
import API_ADDRESS from 'src/api/Addresses'
import AvWaveform from 'vue-audio-visual/src/components/AvWaveform'

export default {
  name: 'Messages',
  components: {
    AvWaveform
  },
  mixins: [mixinDateOptions, mixinTicket],

  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      showVoicePlayerIsPlaying: false,
      audioPlayerLastPlayedTime: 0,
      userReportDescription: ''
    }
  },
  computed: {
    userIsCustomer() {
      return (this.data.user.role === 'کاربر')
    }

  },
  watch: {
  },
  methods: {
    getAdminName() {
      const name = this.data.user.first_name || '-'
      const lastName = this.data.user.last_name || ''
      return name + ' ' + lastName
    },
    playRecordedVoice () {
      const audioPlayer = this.$refs.waveform.$el.children[0].children[0],
        that = this
      audioPlayer.src = this.data.files.voice
      audioPlayer.currentTime = this.audioPlayerLastPlayedTime
      audioPlayer.onended = function () {
        // console.log('audioPlayer.onended');
        audioPlayer.pause()
        audioPlayer.currentTime = 0
        that.audioPlayerLastPlayedTime = 0
        that.showVoicePlayerIsPlaying = false
      }
      audioPlayer.play()
      this.showVoicePlayerIsPlaying = true
    },
    pauseRecordedVoice () {
      const audioPlayer = this.$refs.waveform.$el.children[0].children[0]
      audioPlayer.pause()
      this.audioPlayerLastPlayedTime = audioPlayer.currentTime
      this.showVoicePlayerIsPlaying = false
    },
    sendReport () {
      this.$axios.post(API_ADDRESS.ticket.show.reportMessage(this.data.id), {
        report_description: this.userReportDescription
      })
        .then((res) => {
          this.$q.notify({
            message: res.data.message,
            type: 'positive'
          })
        })
    }
  }
}
</script>

<style scoped>
.user-photo {
  border-radius: 50%;
}
.dateTime-chip {
  color: #FFFFFF;
  height: 30px;
}
.user-icon{
  margin-right: 5px;
  margin-top: 2px;
}
.info-section {
  margin-top: 34px;
}
.private-message-card{
  background: #fff9f0;
}
.av-waveform {
  width: calc( 100% - 76px);
  padding-top: 9px;
}

 .user-info {
   justify-content: end;
 }
.admin-info {
  justify-content: start;

 }
 .message-body {
   padding-top: 0;
 }
 .report-panel {
   width: 100%;
   margin-left: 30px;
 }
</style>
<style scoped lang="scss">
.msg-box{
  position: relative;
  padding: 15px;
  border-radius: 15px;
  color: #575962;
  font-size: 16px;
  box-shadow: 2px -4px 10px rgba(255, 255, 255, 0.6), -2px 4px 10px rgba(46, 56, 112, 0.05);
  .user-img {
    position: absolute;
    margin:0 30px;
    top: -40px;
    border-radius: 50%;
    border: 1px solid #ffc107;
    background: #fff;
    z-index: 3;
    box-shadow: 2px -4px 10px rgba(255, 255, 255, 0.6), -2px 4px 10px rgba(46, 56, 112, 0.05);
    &.right-side{
      left: 0;
    }
    &.left-side{
      right: 0;
    }
  }
}
.voice-player-section {
  margin-top: 10px;
  margin-bottom: 10px;
  .q-btn {
    margin-bottom: 5px;
    background: #34bfa3;
    color: #FFF;
    &:deep(.q-btn__content) {
      margin: 15px;
    }
  }
}
</style>
