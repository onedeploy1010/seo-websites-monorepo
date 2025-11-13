const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🔧 开始创建管理员账号...\n')

    // 默认管理员信息
    const adminEmail = 'admin@example.com'
    const adminPassword = 'admin123'
    const adminName = 'Admin User'

    // 检查是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingUser) {
      console.log('⚠️  管理员账号已存在')
      console.log('📧 邮箱:', adminEmail)
      console.log('\n如需重置密码，请使用: node reset-admin-password.js')
      return
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ 管理员账号创建成功！\n')
    console.log('账号信息:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 邮箱:', adminEmail)
    console.log('🔑 密码:', adminPassword)
    console.log('👤 角色: ADMIN')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n⚠️  重要提示:')
    console.log('1. 请立即登录并修改密码')
    console.log('2. 登录地址: https://admin.telegram1688.com')
    console.log('3. 首次登录后建议创建新的管理员账号')
    console.log()

  } catch (error) {
    console.error('❌ 创建失败:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
