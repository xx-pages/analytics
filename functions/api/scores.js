// GET 请求：获取存放在 KV 中的成绩数据
export async function onRequestGet(context) {
  const { env } = context;
  
  // 从绑定名为 KV 的数据库里读取 scores_data
  const data = await env.KV.get("scores_data");
  
  return new Response(data || "[]", {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

// POST 请求：保存最新的成绩数据到 KV
export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const newScores = await request.json();
    
    // 把新成绩写入 KV 空间
    await env.KV.put("scores_data", JSON.stringify(newScores));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
