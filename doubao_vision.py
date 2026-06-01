"""
豆包视觉模型调用脚本
用法: python doubao_vision.py <图片路径> [问题] [模型ID]

默认模型: doubao-seed-1-6-vision-250815 (最快最便宜)
其他模型: doubao-1-5-vision-pro-32k-250115, doubao-seed-1-6-251015, doubao-seed-1-6-flash-250828
"""
import base64, json, urllib.request, urllib.error, sys, os

API_KEY = os.environ.get("ARK_API_KEY", "")
BASE = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"

def ask_doubao(image_path, question="请描述这张图片的内容", model_id="doubao-seed-1-6-vision-250815", max_tokens=1024):
    """调用豆包视觉模型分析图片"""
    with open(image_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode()

    body = json.dumps({
        "model": model_id,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": question},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_b64}"}}
        ]}],
        "stream": False,
        "max_tokens": max_tokens
    }).encode()

    req = urllib.request.Request(BASE, data=body,
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"})
    
    with urllib.request.urlopen(req, timeout=45) as resp:
        result = json.loads(resp.read())
        return {
            "answer": result["choices"][0]["message"]["content"],
            "tokens": result["usage"]["total_tokens"],
            "model": result["model"]
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python doubao_vision.py <图片路径> [问题] [模型ID]")
        print("示例: python doubao_vision.py screenshot.png '这是什么游戏？'")
        sys.exit(1)

    img = sys.argv[1]
    q = sys.argv[2] if len(sys.argv) > 2 else "请详细描述这张图片的内容"
    m = sys.argv[3] if len(sys.argv) > 3 else "doubao-seed-1-6-vision-250815"

    if not os.path.exists(img):
        print(f"❌ 文件不存在: {img}")
        sys.exit(1)

    print(f"📷 分析图片: {img}")
    print(f"🤖 模型: {m}")
    print(f"❓ 问题: {q}")
    print("-" * 50)

    try:
        result = ask_doubao(img, q, m)
        print(f"\n📝 {result['answer']}")
        print(f"\n📊 {result['tokens']} tokens | 模型: {result['model']}")
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"❌ HTTP {e.code}: {err[:200]}")
    except Exception as e:
        print(f"❌ 错误: {e}")
