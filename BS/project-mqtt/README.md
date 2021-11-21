# BS-mqtt
big project in BS course

+ 前端使用react + antd
+ 后端使用spring boot



实现的功能：

（1）服务器接收指定的mqtt设备发送的数据；

（2）用户登陆/注册，修改密码；

（3）用户注册时有信息验证，用户名和密码需至少6位数，邮箱需符合格式，

（4）用户名和邮箱都不能重复；

（5）访问控制，未登陆自动跳转到登陆页；

（6）主页显示统计信息（包括在线统计，告警统计，接收统计）；

（6）查看设备详情（包括当前数据，状态，id）；

（7）查看设备历史数据（折线图）；

（8）查看设备历史轨迹（地图）；

（9）可以对设备信息进行修改，对设备重命名；



##### folders

front：前端

backend：后端

iotclient：模拟mqtt设备



##### build & run

见各文件夹内



##### notices

+ iotclient中iot.properties的topic需要设置为test（默认只接收topic为test的消息）
