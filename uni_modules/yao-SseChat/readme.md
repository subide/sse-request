# yao-SseChat

### 示例代码

```javascript
<template>
	<view>
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
		@error="onError"
		></yao-SseChat>
	</view>
</template>

<script>
	export default {
		data() {
			return {
                sseList:[],
				content:"",
            }
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
					url: '',
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
					}
				});
				this.content="";
			}
		}
    }
</script>

```