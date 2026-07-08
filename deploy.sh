#!/bin/bash
set -e

echo "=== FreeLLMAPI 部署脚本 ==="

# 1. 安装 Node.js 20
if ! command -v node &> /dev/null; then
    echo ">>> 安装 Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash
    sudo apt install -y nodejs git
fi

echo "Node: $(node -v)"
echo "npm: $(npm -v)"

# 2. 拉取项目
if [ ! -d "$HOME/model-aggregator" ]; then
    echo ">>> 克隆项目..."
    git clone https://github.com/seraluce/model-aggregator.git "$HOME/model-aggregator"
fi

cd "$HOME/model-aggregator"

# 3. 安装依赖
echo ">>> npm install..."
npm install

# 4. 设置加密密钥
if [ ! -f .env ]; then
    echo ">>> 生成 .env..."
    echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" > .env
fi

# 5. 构建
echo ">>> 构建..."
npm run build

# 6. 安装 PM2 并启动
echo ">>> 启动服务..."
npm install -g pm2
pm2 start server/dist/index.js --name freellmapi
pm2 save
sudo env PATH=$PATH:$(npm bin -g) pm2 startup systemd -u $USER --hp $HOME

echo ""
echo "=== 部署完成 ==="
echo "访问: http://$(curl -s ifconfig.me):3001"
echo "首次打开会引导设置管理员密码"
echo ""
echo "如果需要迁移本地数据:"
echo "  1. 将本地的 server/data/freeapi.db 传到服务器"
echo "  2. 放在 $HOME/model-aggregator/server/data/ 下"
echo "  3. 将本地的 .env 也传过来覆盖"
echo "  4. pm2 restart freellmapi"
