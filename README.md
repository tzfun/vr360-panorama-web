<h1 align="center">VR360 全景共享平台</h1>
<p align="center">
<a href="https://github.com/tzfun/vr360-panorama-web" target="_blank">
	<img src="https://vr360-beifengtz.oss-cn-beijing.aliyuncs.com/vrphoto/vr360.png" width="200"/>
</a>
</p>

<p align="center">
  <a href="http://vr.beifengtz.com/"><img src="https://img.shields.io/badge/view-预览效果-brightgreen.svg" alt="首页"></a>
  <a href="#联系我"><img src="https://img.shields.io/badge/contact-联系作者-blue.svg" alt="微信群"></a>
  <a href="#关于"><img src="https://img.shields.io/badge/about-关于平台-critical.svg" alt="关于平台"></a>

VR360是本人大二时搭建的全景制作网站，具有全景制作、浏览、分享的功能，因个人时间原因此项目暂未完全开放完成（仅管理员部分），但不影响用户使用。

此项目是作者java学习路上第一个相对成型的项目，结构相对简单，有逻辑不够清晰、注释不完整、耦合度高等不足之处，请各位大佬轻喷。
</p>

## 技术栈
* 前端
    * jQuery
    * bootstrap
    * three.js
    * photo-sphere-viewer.min.js
* 后台
    * java
    * SpringBoot
* 安全
    * MD5
    * AES
    * OAuth 2
* 存储
    * OSS
    * MySQL

## 安装
项目后台由SpringBoot搭建，无需单独配置Tomcat，用idea或eclipse打开项目,然后配置相关参数，打包成jar文件即可运行。
### 需配置的文件
- sql文件：<a href="https://github.com/tzfun/vr360-panorama-web/blob/master/sql/vr360.sql"><img src="https://img.shields.io/badge/vr360.sql-数据库文件-blue.svg" alt="vr360.sql"></a> 
- yml文件：<a href="https://github.com/tzfun/vr360-panorama-web/tree/master/src/main/resources/application.yml"><img src="https://img.shields.io/badge/application.yml-运行环境配置-yellow.svg" alt="application.yml"></a> <a href="https://github.com/tzfun/vr360-panorama-web/tree/master/src/main/resources/application-test.yml"><img src="https://img.shields.io/badge/application--test.yml-测试环境配置-pink.svg" alt="application-test.yml"></a> <a href="https://github.com/tzfun/vr360-panorama-web/tree/master/src/main/resources/application-dev.yml"><img src="https://img.shields.io/badge/application--dev.yml-生产环境配置-blue.svg" alt="application-dev.yml"></a>
- OSS仓库：<a href="https://github.com/tzfun/vr360-panorama-web/blob/master/src/main/java/com/beifengtz/vr360/util/OssUtil.java"><img src="https://img.shields.io/badge/OssUtil.java-OSS工具类-red.svg" alt="OssUtil.java"></a> 
- QQ、微博三方登录：<a href="https://github.com/tzfun/vr360-panorama-web/blob/master/src/main/java/com/beifengtz/vr360/util/ThirdAuthorUtil.java"><img src="https://img.shields.io/badge/ThirdAuthorUtil.java-三方登录工具类-purple.svg" alt="ThirdAuthorUtil.java"></a> 

## 联系我
 <a href="http://www.beifengtz.com"><img src="https://img.shields.io/badge/个人网站-www.beifengtz.com-olive--green.svg" alt="www.beifengtz.com"></a> 
 <a href="#"><img src="https://img.shields.io/badge/QQ-联系我-red.svg" alt="www.beifengtz.com"></a>
 <a href="https://vr.beifengtz.com/p/mywechat.html"><img src="https://img.shields.io/badge/微信-beifengtz-blue.svg" alt="www.beifengtz.com"></a>

## 关于
本平台不使用与商用，如果站内使用图片或资源涉及到侵权及他人利益，请联系作者及时处理。

如果您需使用此开源项目，请注明出处或添加友链或联系作者本人。

## 感谢
- photo-sphere-viewer.js
