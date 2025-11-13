export default function Features() {
  const features = [
    {
      title: '简单',
      description: '电报如此简单，您已经知道如何使用它',
      icon: '📱',
    },
    {
      title: '私密',
      description: '电报消息经过多重加密，保护隐私',
      icon: '🔒',
    },
    {
      title: '同步',
      description: '电报支持从所有平台设备对聊天记录访问',
      icon: '🔄',
    },
    {
      title: '快速',
      description: '电报比其他社交软件有着更快捷的消息传达',
      icon: '⚡',
    },
    {
      title: '强大',
      description: '电报对所有类型文件和消息大小无限制',
      icon: '💪',
    },
    {
      title: '开放',
      description: '电报免费开放API和源代码',
      icon: '🌐',
    },
    {
      title: '安全',
      description: '电报采用端到端加密技术保护信息安全',
      icon: '🛡️',
    },
    {
      title: '社交',
      description: '电报可以避免黑客攻击，保护信息安全',
      icon: '👥',
    },
    {
      title: '趣味',
      description: '电报可以发掘兴趣，加入开放、多元的平台',
      icon: '🎨',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            为什么选择Telegram中文版？
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
