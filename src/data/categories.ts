import { Category } from '../types/category';

export const categories: Category[] = [
  {
    id: 1,
    name: '운동/스포츠',
    icon: 'lucide:dumbbell',
    subCategories: [
      { id: 101, name: '자전거' },
      { id: 102, name: '배드민턴' },
      { id: 103, name: '볼링' },
      { id: 104, name: '테니스/스쿼시' },
      { id: 105, name: '스키/보드' },
      { id: 106, name: '골프' },
      { id: 107, name: '클라이밍' },
      { id: 108, name: '다이어트' },
      { id: 109, name: '헬스/크로스핏' },
      { id: 110, name: '요가/필라테스' },
      { id: 111, name: '탁구' },
      { id: 112, name: '당구/포켓볼' },
      { id: 113, name: '러닝/마라톤' },
      { id: 114, name: '수영/스쿠버다이빙' },
      { id: 115, name: '서핑/웨이크보드/요트' },
      { id: 116, name: '축구/풋살' },
      { id: 117, name: '농구' },
      { id: 118, name: '야구' },
      { id: 119, name: '배구' },
      { id: 120, name: '승마' },
      { id: 121, name: '펜싱' },
      { id: 122, name: '복싱' },
      { id: 123, name: '태권도/유도' },
      { id: 124, name: '검도' },
      { id: 125, name: '무술/주짓수' },
      { id: 126, name: '스케이트/인라인' },
      { id: 127, name: '크루즈보드' },
      { id: 128, name: '족구' },
      { id: 129, name: '사격/양궁' }
    ]
  },
  {
    id: 2,
    name: '아웃도어/여행',
    icon: 'lucide:mountain',
    subCategories: [
      { id: 201, name: '등산' },
      { id: 202, name: '산책/트래킹' },
      { id: 203, name: '캠핑/백패킹' },
      { id: 204, name: '국내여행' },
      { id: 205, name: '해외여행' },
      { id: 206, name: '낚시' },
      { id: 207, name: '패러글라이딩' }
    ]
  },
  {
    id: 3,
    name: '음악/악기',
    icon: 'lucide:music',
    subCategories: [
      { id: 301, name: '노래/보컬' },
      { id: 302, name: '기타/베이스' },
      { id: 303, name: '우쿨렐레' },
      { id: 304, name: '드럼' },
      { id: 305, name: '피아노' },
      { id: 306, name: '바이올린' },
      { id: 307, name: '플룻' },
      { id: 308, name: '오카리나' },
      { id: 309, name: '밴드/합주' },
      { id: 310, name: '작사/작곡' },
      { id: 311, name: '인디음악' },
      { id: 312, name: '랩/힙합/DJ' },
      { id: 313, name: '클래식' },
      { id: 314, name: '재즈' },
      { id: 315, name: '락/메탈' },
      { id: 316, name: '일렉트로닉' },
      { id: 317, name: '국악/사물놀이' },
      { id: 318, name: '찬양/CCM' },
      { id: 319, name: '뉴에이지' }
    ]
  },
  {
    id: 4,
    name: '공예/만들기',
    icon: 'lucide:palette',
    subCategories: [
      { id: 401, name: '미술/그림' },
      { id: 402, name: '캘리그라피' },
      { id: 403, name: '플라워아트' },
      { id: 404, name: '캔들/디퓨저/석고' },
      { id: 405, name: '천연비누/화장품' },
      { id: 406, name: '소품공예' },
      { id: 407, name: '가죽공예' },
      { id: 408, name: '가구/목공예' },
      { id: 409, name: '설탕/앙금공예' },
      { id: 410, name: '도자/점토공예' },
      { id: 411, name: '자수/뜨개질' },
      { id: 412, name: '키덜트/프라모델' },
      { id: 413, name: '메이크업/네일' }
    ]
  },
  {
    id: 5,
    name: '사진/영상',
    icon: 'lucide:camera',
    subCategories: [
      { id: 501, name: 'DSLR' },
      { id: 502, name: '필름카메라' },
      { id: 503, name: '영상제작' },
      { id: 504, name: '디지털카메라' }
    ]
  },
  {
    id: 6,
    name: '요리/제조',
    icon: 'lucide:utensils',
    subCategories: [
      { id: 601, name: '한식' },
      { id: 602, name: '양식' },
      { id: 603, name: '중식' },
      { id: 604, name: '일식' },
      { id: 605, name: '베이킹/제과' },
      { id: 606, name: '핸드드립' },
      { id: 607, name: '소믈리에/와인' },
      { id: 608, name: '주류제조/칵테일' }
    ]
  },
  {
    id: 7,
    name: '댄스/무용',
    icon: 'lucide:music-4',
    subCategories: [
      { id: 701, name: '라틴댄스' },
      { id: 702, name: '사교댄스' },
      { id: 703, name: '방송/힙합' },
      { id: 704, name: '스트릿댄스' },
      { id: 705, name: '발레' },
      { id: 706, name: '재즈댄스' },
      { id: 707, name: '한국무용' },
      { id: 708, name: '밸리댄스' },
      { id: 709, name: '현대무용' },
      { id: 710, name: '스윙댄스' }
    ]
  },
  {
    id: 8,
    name: '인문학/책/글',
    icon: 'lucide:book-open',
    subCategories: [
      { id: 801, name: '책/독서' },
      { id: 802, name: '인문학' },
      { id: 803, name: '심리학' },
      { id: 804, name: '철학' },
      { id: 805, name: '역사' },
      { id: 806, name: '시사/경제' },
      { id: 807, name: '작문/글쓰기' }
    ]
  },
  {
    id: 9,
    name: '외국/언어',
    icon: 'lucide:languages',
    subCategories: [
      { id: 901, name: '영어' },
      { id: 902, name: '일본어' },
      { id: 903, name: '중국어' },
      { id: 904, name: '프랑스어' },
      { id: 905, name: '스페인어' },
      { id: 906, name: '러시아어' },
      { id: 907, name: '독일어' }
    ]
  },
  {
    id: 10,
    name: '게임/오락',
    icon: 'lucide:gamepad-2',
    subCategories: [
      { id: 1001, name: '다트' },
      { id: 1002, name: '보드게임' },
      { id: 1003, name: '두뇌심리게임' },
      { id: 1004, name: '온라인게임' },
      { id: 1005, name: '콘솔게임' },
      { id: 1006, name: '단체놀이' },
      { id: 1007, name: '타로카드' },
      { id: 1008, name: '마술' },
      { id: 1009, name: '바둑' }
    ]
  },
  {
    id: 11,
    name: '문화/공연/축제',
    icon: 'lucide:ticket',
    subCategories: [
      { id: 1101, name: '뮤지컬/오페라' },
      { id: 1102, name: '공연/연극' },
      { id: 1103, name: '영화' },
      { id: 1104, name: '전시회' },
      { id: 1105, name: '연기/공연제작' },
      { id: 1106, name: '고궁/문화재탐방' },
      { id: 1107, name: '파티/페스티벌' }
    ]
  },
  {
    id: 12,
    name: '자기계발',
    icon: 'lucide:lightbulb',
    subCategories: [
      { id: 1201, name: '스피치/발성' },
      { id: 1202, name: '시험/자격증' },
      { id: 1203, name: '스터디' },
      { id: 1204, name: '투자/금융' },
      { id: 1205, name: '기타(etc)' }
    ]
  },
  {
    id: 13,
    name: '봉사활동',
    icon: 'lucide:heart-handshake',
    subCategories: [
      { id: 1301, name: '양로원' },
      { id: 1302, name: '보육원' },
      { id: 1303, name: '환경봉사' },
      { id: 1304, name: '사회봉사' },
      { id: 1305, name: '교육/재능나눔' },
      { id: 1306, name: '유기동물보호' }
    ]
  },
  {
    id: 14,
    name: '사교/인맥',
    icon: 'lucide:users',
    subCategories: [
      { id: 1401, name: '지역' },
      { id: 1402, name: '나이' },
      { id: 1403, name: '여성' },
      { id: 1404, name: '파티' },
      { id: 1405, name: '결혼' },
      { id: 1406, name: '돌싱' },
      { id: 1407, name: '와인/커피/차' },
      { id: 1408, name: '맛집/미식회' }
    ]
  },
  {
    id: 15,
    name: '반려동물',
    icon: 'lucide:dog',
    subCategories: [
      { id: 1501, name: '강아지' },
      { id: 1502, name: '고양이' },
      { id: 1503, name: '물고기' },
      { id: 1504, name: '파충류' },
      { id: 1505, name: '설치류/중치류' }
    ]
  },
  {
    id: 16,
    name: '자동차/바이크',
    icon: 'lucide:car',
    subCategories: [
      { id: 1601, name: '현대기아' },
      { id: 1602, name: '르노GM' },
      { id: 1603, name: '쌍용' },
      { id: 1604, name: '일본차' },
      { id: 1605, name: '미국차' },
      { id: 1606, name: '유럽차' },
      { id: 1607, name: '바이크' }
    ]
  },
  {
    id: 17,
    name: '업종/직무',
    icon: 'lucide:briefcase',
    subCategories: [
      { id: 1701, name: '의료/건강/제약' },
      { id: 1702, name: 'IT/포털/인터넷' },
      { id: 1703, name: '교육업' },
      { id: 1704, name: '광고/마케팅업계' },
      { id: 1705, name: '디자인업계' },
      { id: 1706, name: '무역/상사' },
      { id: 1707, name: '금융업' },
      { id: 1708, name: '세무/회계' },
      { id: 1709, name: '법률/법무/법조계' },
      { id: 1710, name: '컨설팅' },
      { id: 1711, name: '전자/기계/전기' },
      { id: 1712, name: '자동차' },
      { id: 1713, name: '에너지/화학' },
      { id: 1714, name: '조선/중공업' },
      { id: 1715, name: '패션/의류/뷰티' },
      { id: 1716, name: '건축/건설/인테리어' },
      { id: 1717, name: '물류/항공/운수' },
      { id: 1718, name: '백화점/유통/소비재' },
      { id: 1719, name: '문화/예술' },
      { id: 1720, name: '방송/언론/출판' },
      { id: 1721, name: '여행/호텔/레저' },
      { id: 1722, name: '부동산/중개업' },
      { id: 1723, name: '식음료/외식업' },
      { id: 1724, name: '서비스업' },
      { id: 1725, name: '창업/스타트업' }
    ]
  },
  {
    id: 18,
    name: '스포츠관람',
    icon: 'lucide:trophy',
    subCategories: [
      { id: 1801, name: '야구KBO' },
      { id: 1802, name: '축구K리그' },
      { id: 1803, name: '농구KBL' },
      { id: 1804, name: '배구V리그' },
      { id: 1805, name: 'e스포츠' },
      { id: 1806, name: '해외축구' }
    ]
  }
];
