<template>
	<view class="Mall4j container">
		<!-- 顶部分类图片 -->
		<view v-if="categoryImg" class="adver-map">
			<view class="item-a">
				<image :src="categoryImg" mode="widthFix" @error="handlePicError" />
			</view>
		</view>
		<!-- 滚动内容区 -->
		<view class="main">
			<!-- 左侧菜单start -->
			<scroll-view scroll-y="true" class="leftmenu">
				<block v-for="(item, index) in categoryList" :key="index">
					<view :class="'menu-item ' + (selIndex == index ? 'active' : '')" :data-index="index"
						:data-id="item.categoryId" @tap="onMenuTab">
						<text class="menu-text">{{ item.categoryName }}</text>
					</view>
				</block>
			</scroll-view>
			<!-- 左侧菜单end -->
			<!-- 右侧内容start -->
			<scroll-view scroll-y="true" class="rightcontent">
				<block v-for="(item, key) in prodList" :key="key">
					<prod :item="item" />
				</block>
				<!-- 空列表或加载全部提示 -->
				<EmptyAllTips v-if="isLoaded" :isEmpty="!prodList.length" :emptyTips="i18n.noCommodity"
					:isAll="current == pages" />

			</scroll-view>
			<!-- 右侧内容end -->
		</view>
	</view>

</template>

<script>
import http from '@/utils/http'
import prod from '../../components/production/index.vue'
export default {
	components: {
		prod
	},
	data() {
		return {
			selIndex: 0,
			categoryList: [],
			categoryImg: '',
			categoryId: 0,
			prodList: [],
			parentId: '',
			current: 1,
			pages: 0,
			intoView: '',
			isLoaded: false
		}
	},
	onShow() {
		// 加载导航标题
		uni.setNavigationBarTitle({
			title: '分类商品'
		})
		this.selIndex = 0
		this.getCategory()
	},
	methods: {
		// 获取商品分类
		getCategory() {
			var ths = this // 加载分类列表
			const params = {
				url: '/pub/goods/category/list',
				method: 'POST',
				data: {
					sign: 'qcsd'
				},
				callBack: function (res) {
					ths.categoryImg = res[0].categoryPic
					ths.categoryList = res
					ths.getProdList(res[0].categoryId)
				}
			}
			http.request(params)
		},
		/**
	* 分类点击事件，获取子分类 */
		onMenuTab: function (e) {
			var index = e.currentTarget.dataset.index // 
			this.getProdList(this.categoryList[index].categoryId)
			this.categoryImg = this.categoryList[index].pic
			this.selIndex = index
		},
		// 获取分类下的商品列表
		getProdList(categoryId) {
			this.categoryId = categoryId
			this.isLoaded = false
			let data = {
				categoryId: this.categoryId,
				pageNo: 1,
				pageSize: 40,
				loginToken: uni.getStorageSync('bbcToken')
			}
			const params = {
				url: '/pub/goods/list',
				method: 'POST',
				data: {
					sign: 'qcsd',
					data: JSON.stringify(data)
				},
				callBack: res => {
					this.isLoaded = true
					this.prodList = res
				}
			}
			http.request(params)
		},
		/**
	* 图片加载失败时，现实默认图片
	*/
		handlePicError() {
			this.categoryImg = '../../static/def.png'
		},

	}
}
</script>
<style>
@import "./category.css";
</style>
