<?php
/**
 * 宝塔面板批量创建站点脚本
 *
 * 使用方法：
 * 1. 修改下面的配置信息
 * 2. 上传到宝塔服务器
 * 3. 运行: php baota-batch-create-sites.php
 */

// ==================== 配置区 ====================

// 宝塔面板地址和 API 密钥
$bt_panel = 'http://your-server-ip:8888';  // 你的宝塔面板地址
$bt_key = 'your_api_key_here';              // API 密钥（面板设置→API接口→密钥）

// 要创建的域名列表
$domains = [
    'telegramcny28.com',
    'telegramfuwu.com',
    'telegramjiaoyu.com',
    'telegramrmb28.com',
    'telegram1688.com',
    'telegram2688.com',
    'telegramcnfw.com',
];

// 站点配置
$config = [
    'php_version' => '81',      // PHP 版本：74, 80, 81, 82
    'webname' => '',            // 网站名称（空则使用域名）
    'path' => '/www/wwwroot/',  // 网站根目录前缀
    'type_id' => '0',           // 分类ID（0=默认）
    'type' => 'PHP',            // 站点类型
    'version' => '00',          // PHP版本（00=纯静态）
    'port' => '80',             // 端口
    'ps' => '',                 // 备注
    'ftp' => false,             // 是否创建FTP
    'sql' => false,             // 是否创建数据库
];

// ==================== 函数定义 ====================

/**
 * 调用宝塔 API
 */
function call_bt_api($bt_panel, $bt_key, $endpoint, $data = []) {
    $url = $bt_panel . $endpoint;

    // 添加时间戳和签名
    $data['request_time'] = time();
    $data['request_token'] = md5($data['request_time'] . '' . md5($bt_key));

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $result = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ['status' => false, 'msg' => 'CURL错误: ' . $error];
    }

    return json_decode($result, true);
}

/**
 * 创建站点
 */
function create_site($bt_panel, $bt_key, $domain, $config) {
    echo "正在创建站点: {$domain}\n";

    $data = [
        'webname' => json_encode([
            'domain' => $domain,
            'domainlist' => [],
            'count' => 0,
        ]),
        'path' => $config['path'] . $domain,
        'type_id' => $config['type_id'],
        'type' => $config['type'],
        'version' => $config['version'],
        'port' => $config['port'],
        'ps' => $config['ps'] ?: $domain,
        'ftp' => $config['ftp'] ? 'true' : 'false',
        'sql' => $config['sql'] ? 'true' : 'false',
    ];

    $result = call_bt_api($bt_panel, $bt_key, '/site?action=AddSite', $data);

    if ($result && isset($result['status']) && $result['status']) {
        echo "✓ 成功创建: {$domain}\n";
        return true;
    } else {
        $msg = isset($result['msg']) ? $result['msg'] : '未知错误';
        echo "✗ 创建失败: {$domain} - {$msg}\n";
        return false;
    }
}

/**
 * 设置 SSL 证书（Let's Encrypt）
 */
function setup_ssl($bt_panel, $bt_key, $domain) {
    echo "正在为 {$domain} 申请 SSL 证书...\n";

    $data = [
        'siteName' => $domain,
        'domains' => json_encode([$domain]),
        'email' => 'admin@' . $domain,
        'auto_wildcard' => '0',
    ];

    $result = call_bt_api($bt_panel, $bt_key, '/site?action=ApplySSL', $data);

    if ($result && isset($result['status']) && $result['status']) {
        echo "✓ SSL 证书申请成功: {$domain}\n";
        return true;
    } else {
        echo "⚠ SSL 证书申请失败（可稍后手动申请）\n";
        return false;
    }
}

// ==================== 主程序 ====================

echo "========================================\n";
echo "宝塔面板批量创建站点工具\n";
echo "========================================\n\n";

// 验证配置
if ($bt_panel === 'http://your-server-ip:8888' || $bt_key === 'your_api_key_here') {
    die("错误：请先修改脚本中的宝塔面板地址和 API 密钥！\n");
}

echo "准备创建 " . count($domains) . " 个站点...\n\n";

$success_count = 0;
$fail_count = 0;

foreach ($domains as $domain) {
    if (create_site($bt_panel, $bt_key, $domain, $config)) {
        $success_count++;

        // 可选：自动申请 SSL 证书
        // setup_ssl($bt_panel, $bt_key, $domain);

        sleep(2); // 避免频繁请求
    } else {
        $fail_count++;
    }
    echo "\n";
}

echo "========================================\n";
echo "批量创建完成！\n";
echo "成功: {$success_count} 个\n";
echo "失败: {$fail_count} 个\n";
echo "========================================\n";

// ==================== 后续步骤提示 ====================
echo "\n后续步骤：\n";
echo "1. 将 Next.js 构建文件部署到各站点目录\n";
echo "2. 配置 Nginx 反向代理到 Next.js 端口\n";
echo "3. 为每个站点申请 SSL 证书\n";
echo "4. 在 DNS 提供商处添加 A 记录指向服务器 IP\n";
?>
