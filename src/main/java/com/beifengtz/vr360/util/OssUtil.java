package com.beifengtz.vr360.util;

import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.BucketInfo;
import com.aliyun.oss.model.DeleteObjectsRequest;
import com.aliyun.oss.model.DeleteObjectsResult;
import com.aliyun.oss.model.GetObjectRequest;
import net.sf.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * @Author: beifengtz
 * @Desciption:
 * @Date: Created in 14:14 2018/5/20
 * @Modified By:
 */
public class OssUtil {

    private static String endpoint = "OSS仓库终端地址";
    private static String accessKeyId = "你的OSS仓库accessKeyId";
    private static String accessKeySecret = "你的OSS仓库accessKeySecret";
    private static String bucketName = "你的仓库名（子桶名）";

    /**
     * @Author:beifengtz
     * @Desciption: 上传文件工具
     * @param authId 用户认证id
     * @param file 文件
     * @param libName 目录名称
     * @Date: Created in 18:09 2018/3/5
     */
    public String uploadFileWithVR(String authId,String photoType, MultipartFile file, String libName) {
        String res = null;
        // 生成OSSClient
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        try {
            //获取文件后缀
            String fileName = file.getOriginalFilename();
            String suffix = fileName.substring(fileName.lastIndexOf("."));
            //生成文件id，唯一识别文件
            String uuid = String.valueOf(UUID.randomUUID());
            uuid = uuid.replace("-","");
            String fileKey = libName+"/"+uuid+"-"+authId+"-"+photoType.concat(suffix);
            InputStream inputStream = file.getInputStream();

            //存入oss
            ossClient.putObject(bucketName, fileKey, inputStream);
            System.out.println("Object：" + fileKey + "存入OSS成功。");
            res = fileKey;
        } catch (OSSException oe) {
            oe.printStackTrace();
        } catch (ClientException ce) {
            ce.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ossClient.shutdown();
        }
        return res;
    }
    /**
     * @Author:beifengtz
     * @Desciption: 下载文件工具
     * @param keys 文件对象的名字（存储时返回）
     * @param file 接收文件的容器（file类型）
     * @Date: Created in 19:13 2018/3/5
     */
    public int downloadFile(String keys,File file){
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        try {
            // 下载object到文件
            ossClient.getObject(new GetObjectRequest(bucketName, keys), file);
        } catch (OSSException oe) {
            oe.printStackTrace();
        } catch (ClientException ce) {
            ce.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ossClient.shutdown();
        }
        return 0;
    }
    /**
     * @Author:beifengtz
     * @Desciption: 获取临时授权并返回url
     * @param keys 授权文件的名字（上传时返回）
     * @param validTime 授权有效时间，单位秒s
     * @Date: Created in 18:25 2018/5/4
     */
    public URL getTempUrl(String keys,int validTime){
        URL url=null;
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        try {
            // 设置URL过期时间
            Date expiration = new Date(new Date().getTime() + validTime * 1000);
            // 生成URL
            url = ossClient.generatePresignedUrl(bucketName, keys, expiration);
        } catch (OSSException oe) {
            oe.printStackTrace();
        } catch (ClientException ce) {
            ce.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ossClient.shutdown();
        }
        return url;
    }
    /**
     * @Author:beifengtz
     * @Desciption: 删除对象
     * @param keys 所删除对象的名字
     * @Date: Created in 12:11 2018/3/5
     */
    public boolean deleteObject(ArrayList keys){
        boolean isSuccess = false;
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);

        try {
            DeleteObjectsResult deleteObjectsResult = ossClient.deleteObjects(
                    new DeleteObjectsRequest(bucketName).withKeys(keys));
            List<String> deletedObjects = deleteObjectsResult.getDeletedObjects();
            for (String object : deletedObjects) {
                System.out.println("删除OSS成功==》" + object);
            }
            isSuccess=true;
        } catch (OSSException oe) {
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message: " + oe.getErrorCode());
            System.out.println("Error Code:       " + oe.getErrorCode());
            System.out.println("Request ID:      " + oe.getRequestId());
            System.out.println("Host ID:           " + oe.getHostId());
        } catch (ClientException ce) {
            System.out.println("Caught an ClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with OSS, "
                    + "such as not being able to access the network.");
            System.out.println("Error Message: " + ce.getMessage());
        } finally {
            ossClient.shutdown();
        }
        return isSuccess;
    }
    /**
     * @Author:beifengtz
     * @Desciption: 创建对象存储空间工具
     * @Date: Created in 18:11 2018/3/5
     */
    public boolean createObject(String objectName){
        boolean isSuccess = false;
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        return isSuccess;
    }
    /**
     * @Author:beifengtz
     * @Desciption: 查询bucket的相关信息
     * @param bucketName bucket名字
     * @Date: Created in 12:10 2018/3/2
     */
    public String getBucketInfo(String bucketName){
        String resContent;
        JSONObject bucketInfo = new JSONObject();
        OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
        try{
            // 判断Bucket是否存在
            if (ossClient.doesBucketExist(bucketName)) {
                BucketInfo info = ossClient.getBucketInfo(bucketName);
                bucketInfo.put("msg","success");
                bucketInfo.put("Bucket",bucketName);
                bucketInfo.put("数据中心",info.getBucket().getLocation());
                bucketInfo.put("创建时间",info.getBucket().getCreationDate());
                bucketInfo.put("用户标志",info.getBucket().getOwner());
            } else {
                bucketInfo.put("msg","Not bucket");
            }
        }catch (OSSException oe) {
            oe.printStackTrace();
        } catch (ClientException ce) {
            ce.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ossClient.shutdown();
        }
        resContent = bucketInfo.toString();
        return resContent;
    }
}
