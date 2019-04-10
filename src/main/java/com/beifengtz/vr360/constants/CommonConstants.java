package com.beifengtz.vr360.constants;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 19:08 2018/5/7
 * @Modified By:
 */
public interface CommonConstants {
    String API_VERSION = "v1";//api版本号

    String NONPUBLIC_PREFIX = API_VERSION + "/nonpub";//非公共api的前缀

    String PUB_PREFIX = API_VERSION + "/pub";//公共api前缀

    String OSS_BUCKET = "vr360-beifengtz";//oss bucket名称

    String OSS_VRPHOTO_LIBRARY= "vrphoto";//vr图片存储空间名

    String OSS_ARTICLE_LIBRARY = "article-photo";//教程文章图片资源存储空间名称

    String OSS_PHOTOURL = "https://"+OSS_BUCKET+".oss-cn-beijing.aliyuncs.com/";//oss图片资源访问地址

    String OSS_THUMBNAIL = "?x-oss-process=style/vr-thumbnail"; //oss 压缩链接
}
