package com.beifengtz.vr360;

import com.alibaba.fastjson.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Iterator;

@RunWith(SpringRunner.class)
@SpringBootTest
public class Vr360ApplicationTests {

	@Test
	public void contextLoads(){
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("hah","15100");
		jsonObject.put("hahsad","1510sd 0");
		jsonObject.put("hahawe","1510 asd0");
		jsonObject.put("hahver","1s5sd100");
		Iterator<String> sIterator = jsonObject.keySet().iterator();
		while (sIterator.hasNext()){
			System.out.println(sIterator.next());
			System.out.println(jsonObject.getString(sIterator.next()));
		}
		}

}
