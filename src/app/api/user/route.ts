import { NextResponse } from 'next/server'
import { User } from '@prisma/client'
import { phoneNumberRegex } from '@/utils/regex'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, phoneNumber } = await request.json()

    if (!phoneNumberRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    const isExist = await prisma.user.findUnique({
      where: { phoneNumber },
    })

    if (isExist) {
      return NextResponse.json({ error: 'Exist phone number' }, { status: 400 })
    }

    const newUser: User = await prisma.user.create({
      data: { name, phoneNumber },
    })
    return NextResponse.json(newUser, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server error (${err.message})` },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
