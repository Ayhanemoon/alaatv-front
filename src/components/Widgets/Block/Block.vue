<template>
  <div class="block-section">
    <div v-if="isThereData"
         class="block-header row q-pa-md q-mb-sm"
         :class="data.headerCustomClass"
    >
      <a :href="data?.url?.web"
         class="block-title"
      >
        {{ data.title }}
      </a>
      <q-btn v-if="!data.banners || data.banners.list.length === 0"
             round
             color="primary"
             :icon="isGridView ? 'sync_alt' : 'grid_view'"
             @click="isGridView = !isGridView"
      />
    </div>
    <div class="block-container">
      <slider v-if="data.banners && data.banners.list.length > 0"
              :options="bannerSlides"
      />
      <div v-if="data.products.list.length > 0"
           v-dragscroll
           class="item-container"
           :class="isGridView ? 'row' : 'scroll-view'"
      >
        <div v-for="product in this.data.products.list"
             :key="product.id"
             :class="{
               'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12': isGridView
             }"
             class="product-spacing"
        >
          <product-item :data="product" />
        </div>
        <div class="block-item-box">
          <a :href="data?.url?.web"
             class="show-more-title"
          >
            نمایش بیشتر
          </a>
        </div>
      </div>
      <div v-if="data.sets.list.length > 0"
           v-dragscroll
           class="item-container"
           :class="isGridView ? 'row' : 'scroll-view'"
      >
        <div v-for="set in this.data.sets.list"
             :key="set.id"
             :class="{
               'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12': isGridView
             }"
             class="set-spacing"
        >
          <set-item :data="set" />
        </div>
        <div class="block-item-box">
          <a :href="data?.url?.web"
             class="show-more-title"
          >
            نمایش بیشتر
          </a>
        </div>
      </div>
      <div v-if="data.contents.list.length > 0"
           v-dragscroll
           class="item-container"
           :class="isGridView ? 'row' : 'scroll-view'"
      >
        <div v-for="content in this.data.contents.list"
             :key="content.id"
             :class="{
               'col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12': isGridView
             }"
             class="content-spacing"
        >
          <content-item :data="content" />
        </div>
        <div class="block-item-box">
          <a :href="data?.url?.web"
             class="show-more-title"
          >
            نمایش بیشتر
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductItem from 'src/components/Widgets/Product/ProductItem/ProductItem'
import Slider from 'components/Widgets/Slider/Slider'
import SetItem from 'components/Widgets/SetItem/SetItem'
import ContentItem from 'components/Widgets/ContentItem/ContentItem'
import { Block } from 'src/models/Block'
import { dragscroll } from 'vue-dragscroll'
import { mixinWidget } from 'src/mixin/Mixins'

export default {
  name: 'Block',
  components: {
    ContentItem,
    SetItem,
    ProductItem,
    Slider
  },
  directives: {
    dragscroll
  },
  mixins: [mixinWidget],
  props: {
    data: {
      type: Block,
      default: new Block()
    }
  },
  data: () => ({
    isGridView: false
  }),
  computed: {
    isThereData() {
      return !!(
        this.data.banners.list.length ||
        this.data.products.list.length ||
        this.data.contents.list.length ||
        this.data.sets.list.length
      )
    },
    bannerSlides() {
      this.data.banners.list.forEach(element => {
        element.photo = {
          src: element.photo
        }
      })
      return this.data.banners
    }
  }
}
</script>

<style lang="scss" scoped>
.product-spacing {
  margin-right: 30px;
}
.set-spacing {
  margin-right: 30px;
}
.content-spacing {
  margin-right: 30px;
}

.block-section {
  margin-bottom: 30px;
  .block-header {
    border-radius: 10px;
    justify-content: space-between;

    .block-title {
      text-decoration: none;
      cursor: pointer;
      margin: 0;
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 31px;
      color: #333333;
      padding: 0 0 4px 0;
      border-bottom: 1px solid white;
      transition: 0.3s ease;
      &:hover {
        padding: 0 0 6px 0;
        border-color: #333333;
      }
    }
  }

  .block-container {
    display: flex;
    margin-bottom: 5px;
    .scroll-view {
      display: flex;
      width: 100%;
      overflow-x: scroll;
      /* this padding is needed due to move animation of card
      to avoid overflow behavior:
      https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
      */
      padding-top: 10px;
      padding-bottom: 10px;
    }

    .item-container {
      .block-item-box {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 200px;
        .show-more-title {
          color: blue;
          text-decoration: none;
          cursor: pointer;
          margin: 0;
          line-height: 24px;
          letter-spacing: -0.03em;
          padding: 4px;
          border: 1px solid blue;
          transition: 0.3s ease;
          &:hover {
            background-color: blue;
            color: #f1f1f1;
          }
        }
      }
    }
  }
}
</style>
