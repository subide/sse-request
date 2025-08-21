<template>
	<view
	:start="start"
	:change:start="requests.sendStart">
	</view>
</template>
<script>
	export default{
		data(){
			return{
				start:null
			}
		},
		methods:{
			send(option){
				
				this.start=option;
				
			},
			onMessage(msg){
				this.$emit('message',msg)
			},
			onFinishCore(){
				this.$emit('finishCore')
			},
			onStreamError(err){
				this.$emit('streamError',err)
			},
			onProgress(){
				
			}
		}
	}
</script>


<script module="requests" lang="renderjs">
	import StreamFetcher from './js/streaming.js';
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			
			sendStart(value){
				if(value==null) return;
				// 使用示例
				const streamFetcher = new StreamFetcher({
				  url: value.url,
				  method: value.method,
				  headers: value.headers,
				  body: value.data,
				  onMessage: (data) => {
				    // 调用uni-app方法
				    this.$ownerInstance.callMethod('onMessage', data);
				  },
				  onFinish: () => {
				    this.$ownerInstance.callMethod('onFinishCore');
				  },
				  onError: (error) => {
				   
				    this.$ownerInstance.callMethod('onStreamError', error.message);
				  },
				  onProgress: ({ received, total, percent }) => {
				    this.$ownerInstance.callMethod('onProgress', { received, total, percent });
				  }
				});
				
				// 开始请求
				streamFetcher.fetch();
			},
			fff(){
				console.log('fff')
			}
		},
		mounted(){
			
		}
	}
	
</script>

<style>
	
</style>
