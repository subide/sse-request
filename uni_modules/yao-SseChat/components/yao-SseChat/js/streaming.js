/**
 * 高级流式请求封装
 * @param {Object} options 请求配置
 * @param {string} options.url 请求URL
 * @param {string} [options.method='GET'] 请求方法
 * @param {Object} [options.headers={}] 请求头
 * @param {Object} [options.body=null] 请求体
 * @param {number} [options.timeout=30000] 超时时间(ms)
 * @param {function} [options.onMessage] 数据接收回调
 * @param {function} [options.onFinish] 完成回调
 * @param {function} [options.onError] 错误回调
 * @param {function} [options.onProgress] 进度回调(如果有content-length)
 * @returns {Object} 包含abort方法的对象
 */
class StreamFetcher {
  constructor(options) {
    this.options = {
      method: 'GET',
      headers: {},
      timeout: 30000,
      ...options
    };
    this.controller = new AbortController();
    this.reader = null;
    this.isAborted = false;
    this.totalBytes = 0;
    this.receivedBytes = 0;
  }

  async fetch() {
    const { 
      url, 
      method, 
      headers, 
      body, 
      timeout,
      onMessage, 
      onFinish, 
      onError,
      onProgress
    } = this.options;

    // 超时处理
    const timeoutId = setTimeout(() => {
      this.abort(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
        signal: this.controller.signal
      });

      // 检查响应是否成功
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 获取内容长度(如果可用)
      const contentLength = response.headers.get('content-length');
      this.totalBytes = contentLength ? parseInt(contentLength) : 0;

      // 获取reader
      this.reader = response.body.getReader();
      const textDecoder = new TextDecoder();

      // 处理流数据
      while (true) {
        if (this.isAborted) break;

        const { done, value } = await this.reader.read();
        
        if (done) {
          if (onFinish) onFinish();
          break;
        }

        // 更新接收字节数
        this.receivedBytes += value.byteLength;
        if (onProgress && this.totalBytes > 0) {
          onProgress({
            received: this.receivedBytes,
            total: this.totalBytes,
            percent: (this.receivedBytes / this.totalBytes * 100).toFixed(2)
          });
        }

        // 处理数据
        const str = textDecoder.decode(value);
        const lines = str.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (this.isAborted) break;
          if (onMessage) onMessage(line);
        }
      }
    } catch (error) {
      if (!this.isAborted && onError) {
        onError(error);
      }
    } finally {
      clearTimeout(timeoutId);
      if (this.reader) {
        this.reader.releaseLock();
      }
    }
  }

  abort(reason) {
    if (!this.isAborted) {
      this.isAborted = true;
      this.controller.abort(reason || 'Request aborted by user');
    }
  }
}

export default StreamFetcher;