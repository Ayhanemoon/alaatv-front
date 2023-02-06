import APIRepository from '../classes/APIRepository'
import { apiV2 } from 'src/boot/axios'
import { Content } from 'src/models/Content'
const APIAdresses = {
  admin: '/admin/contents/',
  show: (id) => '/c/' + id,
  showAdmin: (id) => '/admin/contents/' + id,
  update: (id) => `/admin/contents/${id}/`,
  search: '/search',
  delete: '/admin/contents/destroy',
  bulkEditText: '/admin/contents/bulk-edit-text',
  bulkUpdate: '/admin/contents/bulk-update',
  bulkEditTags: '/admin/contents/bulk-edit-tags',
  timestampSet: 'timepoint',
  timestampGet: (id) => `timepoint/${id}`
}
export default class ContentAPI extends APIRepository {
  constructor() {
    super('content', apiV2, '/c/', new Content(), APIAdresses)
    this.CacheList = {
      admin: this.name + this.APIAdresses.admin,
      show: id => this.name + this.APIAdresses.show(id),
      showAdmin: id => this.name + this.APIAdresses.showAdmin(id),
      update: id => this.name + this.APIAdresses.update(id),
      search: this.name + this.APIAdresses.search,
      delete: this.name + this.APIAdresses.delete,
      timestampSet: this.name + this.APIAdresses.timestampSet,
      bulkEditText: this.name + this.APIAdresses.bulkEditText,
      bulkUpdate: this.name + this.APIAdresses.bulkUpdate,
      bulkEditTags: this.name + this.APIAdresses.bulkEditTags,
      timestampGet: id => this.name + this.APIAdresses.timestampGet(id)
    }
  }

  show(data) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.show(data),
      cacheKey: this.CacheList.show(data),
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return new Content(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  showAdmin(data) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.showAdmin(data),
      cacheKey: this.CacheList.showAdmin(data),
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return new Content(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  update(data = {}) {
    return this.sendRequest({
      apiMethod: 'post',
      api: this.api,
      request: this.APIAdresses.update(data.data.id),
      cacheKey: this.CacheList.update(data.data.id),
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return new Content(response.data.data)
      },
      rejectCallback: (error) => {
        return error
      },
      data: this.getNormalizedSendData({
        contentset_id: null, // contentSet Id
        isFree: null, // contentSet Id
        name: null, // Title for content,
        description: null, // Description for content
        thumbnail: null, // thumbnail for contentfd
        validSinceDate: null, // time for publish content
        forrest_tree: null, // tree for content
        order: null, // order of content
        enable: null, // content status
        display: null // content display status
      }, data.data)
    })
  }

  bulkEditText(data) {
    return this.sendRequest({
      apiMethod: 'put',
      api: this.api,
      request: this.APIAdresses.bulkEditText,
      cacheKey: this.CacheList.bulkEditText,
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return response
      },
      rejectCallback: (error) => {
        return error
      },
      data
    })
  }

  bulkUpdate(data) {
    return this.sendRequest({
      apiMethod: 'put',
      api: this.api,
      request: this.APIAdresses.bulkUpdate,
      cacheKey: this.CacheList.bulkUpdate,
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return response
      },
      rejectCallback: (error) => {
        return error
      },
      data
    })
  }

  bulkEditTags(data) {
    return this.sendRequest({
      apiMethod: 'put',
      api: this.api,
      request: this.APIAdresses.bulkEditTags,
      cacheKey: this.CacheList.bulkEditTags,
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return response
      },
      rejectCallback: (error) => {
        return error
      },
      data
    })
  }

  deleteContents(data) {
    return this.sendRequest({
      apiMethod: 'delete',
      api: this.api,
      request: this.APIAdresses.delete,
      cacheKey: this.CacheList.delete,
      ...(data?.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return response
      },
      rejectCallback: (error) => {
        return error
      },
      data
    })
  }

  search(data = {}) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.search,
      cacheKey: this.CacheList.orderProduct,
      ...(data.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return {
          sets: response.data.data.sets,
          products: response.data.data.products,
          videos: response.data.data.videos
        }
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }

  SetTimestamp(data = {}) {
    return this.sendRequest({
      apiMethod: 'post',
      api: this.api,
      request: this.APIAdresses.timestampSet,
      cacheKey: this.CacheList.timestampSet,
      ...(data.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return {
          timestamp: response.data
        }
      },
      rejectCallback: (error) => {
        return error
      },
      data: this.getNormalizedSendData({
        content_id: null, // content Id
        title: null, // Title for Timestamp
        time: null // time of Video for timestamp in seconds
      }, data.data)
    })
  }

  GetTimestamp(data = {}) {
    return this.sendRequest({
      apiMethod: 'get',
      api: this.api,
      request: this.APIAdresses.timestampGet('131107'),
      cacheKey: this.CacheList.timestampGet('131107'),
      ...(data.cache && { cache: data.cache }),
      resolveCallback: (response) => {
        return {
          timestamp: response.data
        }
      },
      rejectCallback: (error) => {
        return error
      }
    })
  }
}
