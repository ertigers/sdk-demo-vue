const cf = {
	ver:'debug',
	q2http_url: 'http://127.0.0.1:9585/icvs2/',
	flv_url:'http://127.0.0.1:9585/',
  websocket_url: 'ws://127.0.0.1:9585/',
	
	connParams : {
		// - 登录平台IP
		address: "47.96.224.81",
    // - 端口
		port : "9988",
		// - 登录平台用户名
		user : "admin",
		// - 登录平台密码
		password :"",
		// - 登录平台企业ID
		epid : "system",
		// - 登录平台是否通过网闸模式
		fixaddr :0
	},

	// 服务端
	server_host: '172.22.87.1:9581',
}

export default cf