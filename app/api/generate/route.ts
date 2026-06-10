import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const GENERATE_PROMPT = (additionalInfo: string) => `
당신은 유기견 입양 홍보 전문가입니다. 이 강아지 사진을 분석하고 아래 JSON 형식으로 홍보 콘텐츠를 생성해주세요.

${additionalInfo ? `추가 정보: ${additionalInfo}` : ''}

아래 JSON만 응답하세요. 다른 텍스트나 마크다운 코드블록 없이 순수 JSON만 출력하세요:

{
  "dogProfile": {
    "name": "강아지 추정 이름 또는 별칭 (귀엽고 기억하기 쉬운 이름)",
    "breed": "추정 견종",
    "age": "추정 나이 (예: 약 1세, 2-3살 추정)",
    "gender": "성별 (수컷/암컷/알 수 없음)",
    "size": "크기 (소형/중형/대형)",
    "color": "털 색상 및 패턴 설명",
    "personality": "사진에서 보이는 성격 특성 (2-3가지)"
  },
  "poster": {
    "title": "감동적인 홍보 포스터 제목 (15자 이내)",
    "subtitle": "부제목 (20자 이내)",
    "story": "강아지의 이야기 (100-150자, 감동적으로)",
    "appealPoints": ["매력 포인트 1", "매력 포인트 2", "매력 포인트 3"],
    "callToAction": "행동 촉구 문구 (15자 이내)",
    "tagline": "기억에 남는 슬로건 (20자 이내)"
  },
  "cardNews": [
    {
      "title": "카드 1 제목",
      "content": "카드 1 내용 (50자 이내)",
      "emoji": "관련 이모지",
      "backgroundColor": "#FFF3E0"
    },
    {
      "title": "카드 2 제목",
      "content": "카드 2 내용 (50자 이내)",
      "emoji": "관련 이모지",
      "backgroundColor": "#FCE4EC"
    },
    {
      "title": "카드 3 제목",
      "content": "카드 3 내용 (50자 이내)",
      "emoji": "관련 이모지",
      "backgroundColor": "#E8F5E9"
    },
    {
      "title": "카드 4 제목",
      "content": "카드 4 내용 (50자 이내)",
      "emoji": "관련 이모지",
      "backgroundColor": "#E3F2FD"
    },
    {
      "title": "카드 5 제목",
      "content": "카드 5 내용 (50자 이내)",
      "emoji": "관련 이모지",
      "backgroundColor": "#F3E5F5"
    }
  ],
  "adoptionPage": {
    "headline": "입양 페이지 헤드라인 (30자 이내)",
    "description": "강아지 소개 및 입양 권유 문구 (150-200자)",
    "requirements": ["입양 조건 1", "입양 조건 2", "입양 조건 3", "입양 조건 4"],
    "process": ["입양 절차 1단계", "입양 절차 2단계", "입양 절차 3단계", "입양 절차 4단계"],
    "contactInfo": "연락처 안내 문구",
    "specialNotes": "특이사항 또는 특별 주의사항"
  }
}
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const additionalInfo = (formData.get('additionalInfo') as string) || '';
    const userApiKey = (formData.get('apiKey') as string) || '';

    const apiKey = userApiKey.trim() || process.env.ANTHROPIC_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키를 입력해주세요. Anthropic 콘솔(console.anthropic.com)에서 발급받을 수 있습니다.' },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: '이미지를 업로드해주세요.' },
        { status: 400 }
      );
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'JPEG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: 'text',
              text: GENERATE_PROMPT(additionalInfo),
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }

    const data = JSON.parse(jsonText.trim());
    return NextResponse.json(data);
  } catch (error) {
    console.error('Generate error:', error);
    const message =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
