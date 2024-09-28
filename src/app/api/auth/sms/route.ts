import { NextResponse } from 'next/server'
import coolsms from 'coolsms-node-sdk'
import { phoneNumberRegex } from '@/utils/regex'
import prisma from '@/lib/prisma'

const messageService = new coolsms(
  process.env.COOLSMS_API_KEY,
  process.env.COOLSMS_API_SECRET
)

interface PostRequestBody {
  phoneNumber: string
}

export async function POST(request: Request) {
  try {
    const { phoneNumber } = (await request.json()) as PostRequestBody
    if (!phoneNumberRegex.test(phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number',
        },
        { status: 400 }
      )
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.sMSAuthCode.create({
      data: {
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5m
      },
    })

    if (process.env.NODE_ENV === 'production') {
      await messageService.sendOne({
        autoTypeDetect: true,
        to: phoneNumber,
        from: process.env.W_CALL_CENTER,
        text: `[위드] 인증번호는 [${code}] 입니다.`,
      })
    }

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 }
    )
  } catch (err: any) {
    return (
      NextResponse.json({
        success: false,
        error: `Internal server error (${err.message})`,
      }),
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

interface PatchRequestBody {
  phoneNumber: string
  code: string
}
export async function PATCH(request: Request) {
  try {
    const { phoneNumber, code } = (await request.json()) as PatchRequestBody

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
        { status: 400 }
      )
    }

    const authCode = await prisma.sMSAuthCode.findFirst({
      where: {
        phoneNumber: phoneNumber,
        code: code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!authCode) {
      return NextResponse.json(
        { error: 'Invalid authentication code' },
        { status: 400 }
      )
    }

    await prisma.sMSAuthCode.delete({
      where: {
        id: authCode.id,
      },
    })

    await prisma.sMSAuthCode.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: `Internal server error (${err.message})`,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
