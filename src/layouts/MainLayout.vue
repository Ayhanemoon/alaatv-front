<template>
  <div class="main-layout">
    <quasar-template-builder
      @onResize="resize">
      <template #header>
        <template-header  v-if="getTemplateHeaderType === 'main'" />
        <q-linear-progress
          v-if="$store.getters['loading/loading']"
          color="primary"
          reverse
          class="q-mt-sm"
          indeterminate
        />
      </template>
      <template #left-drawer>
        <side-menu-dashboard />
      </template>
      <template #content>
        <div ref="contentInside"
             v-scroll="onContentInsideScroll"
             class="content-inside"
        >
          <q-dialog v-model="confirmDialogData.show"
                    persistent>
            <q-card class="q-pa-md q-pb-none">
              <q-card-section>
                <q-icon name="warning"
                        color="warning"
                        size="2rem" />
                {{confirmDialogData.message}}
              </q-card-section>
              <q-separator />
              <q-card-actions align="right"
                              class="q-pb-none">
                <q-btn v-close-popup
                       color="green"
                       flat
                       @click="confirmDialogAction(true)">بله</q-btn>
                <q-btn v-close-popup
                       color="red"
                       flat
                       @click="confirmDialogAction(false)">خیر</q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
          <Router :include="keepAliveComponents" />
        </div>
      </template>
      <template v-slot:footer>
        <alaa-footer />
      </template>
    </quasar-template-builder>
  </div>
</template>
<script>
import SideMenuDashboard from 'components/Menu/SideMenu/SideMenu-dashboard'
import QuasarTemplateBuilder from 'quasar-template-builder/src/quasar-template-builder.vue'
import templateHeader from 'components/Template/templateHeader'
import Router from 'src/router/Router'
import KeepAliveComponents from 'assets/js/KeepAliveComponents'
// import { setHeight } from 'src/boot/page-builder'
import AlaaFooter from 'components/Widgets/Footer/Footer'

export default {
  components: {
    Router,
    AlaaFooter,
    SideMenuDashboard,
    QuasarTemplateBuilder,
    templateHeader
  },
  data () {
    return {
      contentVerticalScrollPosition: 0,
      keepAliveComponents: KeepAliveComponents
    }
  },
  computed: {
    confirmDialogData () {
      return this.$store.getters['AppLayout/confirmDialog']
    },
    getTemplateHeaderType() {
      return this.$store.getters['AppLayout/templateHeaderType']
    },
    calculateHeightStyle() {
      return this.$store.getters['AppLayout/calculateContainerFullHeight']
    }
  },
  // created() {
  //   setHeight(this.calculateHeightStyle)
  // },
  methods: {
    onContentInsideScroll (data) {
      this.$store.commit('AppLayout/updateLayoutHeaderElevated', data > 0)
    },
    confirmDialogAction (data) {
      if (this.confirmDialogData) {
        this.confirmDialogData.callback(data)
      } else {
        this.$store.commit('AppLayout/showConfirmDialog', {
          show: false
        })
      }
    },
    resize (val) {
      this.$store.commit('AppLayout/updateWindowSize', val)
      if (val.width > 1439) {
        this.$store.commit('AppLayout/updateLayoutLeftDrawerWidth', 314)
        this.$store.commit('AppLayout/updateLayoutLeftDrawerBehavior', 'mobile') && this.$store.commit('AppLayout/updateLayoutRightDrawerBehavior', 'mobile')
      } else if (val.width > 599) {
        this.$store.commit('AppLayout/updateLayoutLeftDrawerWidth', 280)
        this.$store.commit('AppLayout/updateLayoutLeftDrawerBehavior', 'mobile') && this.$store.commit('AppLayout/updateLayoutRightDrawerBehavior', 'mobile')
      } else {
        this.$store.commit('AppLayout/updateLayoutLeftDrawerWidth', 242)
        this.$store.commit('AppLayout/updateLayoutLeftDrawerBehavior', 'mobile') && this.$store.commit('AppLayout/updateLayoutRightDrawerBehavior', 'mobile')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  :deep(.main-layout-container) {
    background-color: #f1f1f1;
  }
  .content-inside {
    //padding-top: 20px;
  }
}
</style>
