<template>
	<view class="content">
		<view class="input_box">
			<textarea placeholder="请输入内容" auto-height v-model="content"/>
		</view>
		
		<view class="submit" @click="onSubmit">发送</view>
		
		<scroll-view scroll-y="true" id="scrollView">
			<view v-for="item in sseList">
				{{item}}
			</view>
		</scroll-view>
		
		
		<yao-SseChat
		ref="ssechat"
		@message="onMessage"
		@finishCore="onFinishCore"
		@streamError="onStreamError"
		></yao-SseChat>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sseList:[],
				content:"",
				model_id:"doubao-seed-1-6-250615",
				scrollIntoView:''
			}
		},
		onLoad() {

		},
		methods: {
			//响应
			onMessage(msg){
				//转换json格式
				console.log(JSON.parse(msg));
				this.sseList.push(msg)
				
				this.scrollIntoView=msg;
			},
			//请求完毕
			onFinishCore(){
				console.log('请求完毕');
			},
			//发生错误
			onStreamError(err){
				console.log(err)
			},
			//发送
			onSubmit(){
				
				this.$refs.ssechat.send({
					//url地址
					url: 'https://app.monoiseai.com/index.php?s=/api/aichat/streaming&wxapp_id=10001',
					// 请求头
					headers: {
					  'Accept':'text/event-stream',
					  'Content-Type':'application/json'
					},
					// 请求方法
					method: 'post',
					//请求参数
					data:{
						content:this.content,
						model:this.model_id,
						token:'a42de1f0cc067d8dd77c88f88fd4be19',
						wxapp_id:10001
					}
				});
				this.content="";
			}
		}
	}
</script>

<style>
.input_box{
	width:90%;
	margin:20rpx auto;
	border:2px solid #0565ff;
	padding:10rpx;
	border-radius: 20rpx;
}
.submit{
	width:90%;
	margin:20rpx auto;
	background:#0565ff;
	color:#fff;
	padding:20rpx;
	border-radius: 20rpx;
	text-align: center;
}
#scrollView{
	height:1000rpx;
}
</style>
