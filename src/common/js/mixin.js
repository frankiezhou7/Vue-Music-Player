import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() { // DOM ready
    this.handlePlayList(this.playList)
  },
  activated() { // keep-alive中
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() { // 切换播放模式
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list) // 切换模式保证当前播放歌曲Index
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput() {
      this.$refs.searchBox.blur() // 搜索框在数据滚动时失焦
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
