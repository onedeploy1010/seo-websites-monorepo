const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔧 开始重置管理员密码...\n')

    const adminEmail = 'admin@example.com'
    const newPassword = 'admin123'

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (!user) {
      console.log('❌ 未找到管理员账号')
      console.log('📧 邮箱:', adminEmail)
      console.log('\n请先运行: node create-admin-user.js')
      return
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 更新密码
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    })

    console.log('✅ 密码重置成功！\n')
    console.log('账号信息:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 邮箱:', adminEmail)
    console.log('🔑 新密码:', newPassword)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n⚠️  请立即登录并修改密码')
    console.log()

  } catch (error) {
    console.error('❌ 重置失败:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
