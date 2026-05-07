export interface MuzzyLine {
  order: number;
  english: string;
  chinese: string;
  phonetic: string;
  audioSrc?: string;
  speaker?: 'muzzy' | 'king' | 'queen' | 'sylvia' | 'corvax' | 'bob';
  stage: 1 | 2 | 3 | 4 | 5;
  startTime?: number; // In seconds, for video sync
  endTime?: number;
}

export const STAGES = [
  { id: 1, title: "初识王室成员", icon: "👑", desc: "问候语 & 人物" },
  { id: 2, title: "谁最棒？", icon: "💪", desc: "性格 & 特质" },
  { id: 3, title: "大胃王 Muzzy", icon: "🍔", desc: "饮食 & 礼节" },
  { id: 4, title: "魔法背包", icon: "🎒", desc: "财产 & 物品" },
  { id: 5, title: "花园数学家", icon: "🌻", desc: "数字 & 计数" },
];

export const MUZZY_LINES: MuzzyLine[] = [
  // Stage 1: 初识王室成员
  { order: 1, stage: 1, english: "How do you do?", chinese: "你好！", phonetic: "haʊ duː juː duː", speaker: 'king', startTime: 10, endTime: 12 },
  { order: 2, stage: 1, english: "I'm the King.", chinese: "我是国王。", phonetic: "aɪm ðə kɪŋ", speaker: 'king', startTime: 13, endTime: 15 },
  { order: 3, stage: 1, english: "I'm the King of Gondoland.", chinese: "我是贡多兰的国王。", phonetic: "aɪm ðə kɪŋ ɒv ˈɡɒndəlænd", speaker: 'king', startTime: 16, endTime: 19 },
  { order: 4, stage: 1, english: "I'm the Queen.", chinese: "我是王后。", phonetic: "aɪm ðə kwiːn", speaker: 'queen', startTime: 20, endTime: 22 },
  { order: 5, stage: 1, english: "Good night.", chinese: "晚安。", phonetic: "ɡʊd nait", speaker: 'queen', startTime: 23, endTime: 25 },
  { order: 6, stage: 1, english: "Hello.", chinese: "你好。", phonetic: "həˈləʊ", speaker: 'bob', startTime: 26, endTime: 27 },
  { order: 7, stage: 1, english: "I'm Princess Sylvia.", chinese: "我是西尔维娅公主。", phonetic: "aɪm ˌprɪnˈses ˈsɪlviə", speaker: 'sylvia', startTime: 28, endTime: 30 },
  { order: 8, stage: 1, english: "I'm Bob.", chinese: "我是鲍勃。", phonetic: "aɪm bɒb", speaker: 'bob', startTime: 31, endTime: 32 },
  { order: 9, stage: 1, english: "I'm the gardener.", chinese: "我是园丁。", phonetic: "aɪm ðə ˈɡɑːdnə", speaker: 'bob', startTime: 33, endTime: 35 },
  { order: 10, stage: 1, english: "I'm Corvax.", chinese: "我是科瓦克斯。", phonetic: "aɪm ˈkɔːvæks", speaker: 'corvax', startTime: 36, endTime: 38 },
  { order: 11, stage: 1, english: "Thank you, Corvax.", chinese: "谢谢你，科瓦克斯。", phonetic: "θæŋk juː ˈkɔːvæks", speaker: 'queen', startTime: 39, endTime: 42 },
  { order: 12, stage: 1, english: "Hi!", chinese: "嗨！", phonetic: "haɪ", speaker: 'muzzy', startTime: 43, endTime: 44 },
  { order: 13, stage: 1, english: "I'm Muzzy.", chinese: "我是马齐。", phonetic: "aɪm ˈmʌzi", speaker: 'muzzy', startTime: 45, endTime: 47 },
  { order: 14, stage: 1, english: "Big Muzzy.", chinese: "大块头马齐。", phonetic: "bɪɡ ˈmʌzi", speaker: 'muzzy', startTime: 48, endTime: 50 },
  { order: 15, stage: 1, english: "Good morning.", chinese: "早上好。", phonetic: "ɡʊd ˈmɔːnɪŋ", startTime: 51, endTime: 53 },
  { order: 16, stage: 1, english: "Good afternoon.", chinese: "下午好。", phonetic: "ɡʊd ˌɑːftəˈnuːn", startTime: 54, endTime: 56 },
  { order: 17, stage: 1, english: "Good evening.", chinese: "晚上好。", phonetic: "ɡʊd ˈiːvnɪŋ", startTime: 57, endTime: 59 },

  // Stage 2: 谁最棒？
  { order: 18, stage: 2, english: "I'm strong.", chinese: "我很强壮。", phonetic: "aɪm strɒŋ", startTime: 60, endTime: 62 },
  { order: 19, stage: 2, english: "I'm fat.", chinese: "我胖胖的。", phonetic: "aɪm fæt", startTime: 63, endTime: 65 },
  { order: 20, stage: 2, english: "I'm beautiful.", chinese: "我很漂亮。", phonetic: "aɪm ˈbjuːtɪfl", startTime: 66, endTime: 68 },
  { order: 21, stage: 2, english: "I'm clever.", chinese: "我很聪明。", phonetic: "aɪm ˈklevə", startTime: 69, endTime: 71 },
  { order: 22, stage: 2, english: "I'm brave.", chinese: "我很勇敢。", phonetic: "aɪm breɪv", startTime: 72, endTime: 74 },
  { order: 23, stage: 2, english: "You're strong.", chinese: "你很强壮。", phonetic: "jʊə strɒŋ", startTime: 75, endTime: 77 },
  { order: 24, stage: 2, english: "Yes, I am.", chinese: "是的，我是。", phonetic: "jes aɪ æm", startTime: 78, endTime: 80 },
  { order: 25, stage: 2, english: "You're fat.", chinese: "你胖胖的。", phonetic: "jʊə fæt", startTime: 81, endTime: 83 },
  { order: 26, stage: 2, english: "She's beautiful.", chinese: "她很漂亮。", phonetic: "ʃiːz ˈbjuːtɪfl", startTime: 84, endTime: 86 },
  { order: 27, stage: 2, english: "He's brave.", chinese: "他很勇敢。", phonetic: "hiːz breɪv", startTime: 87, endTime: 89 },
  { order: 28, stage: 2, english: "He's clever.", chinese: "他很聪明。", phonetic: "hiːz ˈklevə", startTime: 90, endTime: 92 },
  { order: 29, stage: 2, english: "No, no!", chinese: "不，不！", phonetic: "nəʊ nəʊ", startTime: 93, endTime: 95 },
  { order: 30, stage: 2, english: "I'm big.", chinese: "很大。", phonetic: "aɪm bɪɡ", startTime: 96, endTime: 98 },
  { order: 31, stage: 2, english: "Big.", chinese: "大。", phonetic: "bɪɡ", startTime: 99, endTime: 100 },
  { order: 32, stage: 2, english: "Small.", chinese: "小。", phonetic: "smɔːl", startTime: 101, endTime: 103 },

  // Stage 3: 大胃王 Muzzy
  { order: 45, stage: 3, english: "I like plums.", chinese: "我喜欢李子。", phonetic: "aɪ laɪk plʌmz", startTime: 150, endTime: 152 },
  { order: 46, stage: 3, english: "I like peaches.", chinese: "我喜欢桃子。", phonetic: "aɪ laɪk ˈpiːtʃɪz", startTime: 153, endTime: 155 },
  { order: 47, stage: 3, english: "I like grapes.", chinese: "我喜欢葡萄。", phonetic: "aɪ laɪk ɡreɪps", startTime: 156, endTime: 158 },
  { order: 51, stage: 3, english: "Can I have a peach, please?", chinese: "请问我能吃一个桃子吗？", phonetic: "kæn aɪ hæv ə piːtʃ pliːz", startTime: 160, endTime: 163 },
  { order: 52, stage: 3, english: "I like hamburgers.", chinese: "我喜欢汉堡。", phonetic: "aɪ laɪk ˈhæmbɜːɡəz", startTime: 164, endTime: 166 },
  { order: 53, stage: 3, english: "Can I have a hamburger, please?", chinese: "请问我能吃一个汉堡吗？", phonetic: "kæn aɪ hæv ə ˈhæmbɜːɡə pliːz", startTime: 167, endTime: 170 },
  { order: 54, stage: 3, english: "Here you are.", chinese: "给你。", phonetic: "hɪə juː ɑː", startTime: 171, endTime: 173 },
  { order: 55, stage: 3, english: "Thank you.", chinese: "谢谢你。", phonetic: "θæŋk juː", startTime: 174, endTime: 176 },
  { order: 56, stage: 3, english: "Can I have a salad, please?", chinese: "请问我能吃一份沙拉吗？", phonetic: "kæn aɪ hæv ə ˈsæləd pliːz", startTime: 177, endTime: 180 },
  { order: 57, stage: 3, english: "Can I have a drink, please?", chinese: "请问我能喝一杯饮料吗？", phonetic: "kæn aɪ hæv ə drɪŋk pliːz", startTime: 181, endTime: 184 },
  { order: 58, stage: 3, english: "Can I have an ice-cream, please?", chinese: "请问我能吃一个冰淇淋吗？", phonetic: "kæn aɪ hæv ən ˈaɪskriːm pliːz", startTime: 185, endTime: 188 },
  { order: 67, stage: 3, english: "Plums!", chinese: "李子！", phonetic: "plʌmz", startTime: 189, endTime: 191 },

  // Stage 4: 魔法背包
  { order: 33, stage: 4, english: "I've got a bag.", chinese: "我有一个包。", phonetic: "aɪv ɡɒt ə bæɡ", startTime: 110, endTime: 112 },
  { order: 34, stage: 4, english: "A big bag.", chinese: "一个大包。", phonetic: "ə bɪɡ bæɡ", startTime: 113, endTime: 115 },
  { order: 35, stage: 4, english: "I've got a map.", chinese: "我有一张地图。", phonetic: "aɪv ɡɒt ə mæp", startTime: 116, endTime: 118 },
  { order: 36, stage: 4, english: "I've got a hamburger.", chinese: "我有一个汉堡。", phonetic: "aɪv ɡɒt ə ˈhæmbɜːɡə", startTime: 119, endTime: 121 },
  { order: 37, stage: 4, english: "I've got a bike.", chinese: "我有一辆自行车。", phonetic: "aɪv ɡɒt ə baɪk", startTime: 122, endTime: 124 },
  { order: 38, stage: 4, english: "A motorcycle.", chinese: "一辆摩托车。", phonetic: "ə ˈməʊtəsaɪkl", startTime: 125, endTime: 127 },
  { order: 39, stage: 4, english: "I've got a computer.", chinese: "我有一台电脑。", phonetic: "aɪv ɡɒt ə kəmˈpjuːtə", startTime: 128, endTime: 130 },
  { order: 89, stage: 4, english: "Can I have a rose, please?", chinese: "请问我能要一朵玫瑰吗？", phonetic: "kæn aɪ hæv ə rəʊz pliːz", startTime: 250, endTime: 253 },
  { order: 93, stage: 4, english: "I've got a rose.", chinese: "我有一朵玫瑰。", phonetic: "aɪv ɡɒt ə rəʊz", startTime: 254, endTime: 257 },
  { order: 94, stage: 4, english: "I love you.", chinese: "我爱你。", phonetic: "aɪ lʌv juː", startTime: 258, endTime: 260 },

  // Stage 5: 花园数学家
  { order: 72, stage: 5, english: "How many trees?", chinese: "有多少棵树？", phonetic: "haʊ ˈmeni triːz", startTime: 200, endTime: 202 },
  { order: 73, stage: 5, english: "Count!", chinese: "数一数！", phonetic: "kaʊnt", startTime: 203, endTime: 205 },
  { order: 74, stage: 5, english: "One, two, three, four, five, six, seven, eight, nine, ten.", chinese: "一、二、三、四、五、六、七、八、九、十。", phonetic: "wʌn tuː θriː fɔː faɪv sɪks ˈsevən eɪt naɪn ten", startTime: 206, endTime: 215 },
  { order: 75, stage: 5, english: "How many trees are there?", chinese: "这里有多少棵树？", phonetic: "haʊ ˈmeni triːz ɑː ðeə", startTime: 216, endTime: 219 },
  { order: 77, stage: 5, english: "How many bushes are there?", chinese: "这里有多少丛灌木？", phonetic: "haʊ ˈmeni ˈbʊʃɪz ɑː ðeə", startTime: 220, endTime: 223 },
  { order: 81, stage: 5, english: "A hundred?", chinese: "一百朵？", phonetic: "ə ˈhʌndrəd", startTime: 224, endTime: 226 },
  { order: 82, stage: 5, english: "Two hundred?", chinese: "两百朵？", phonetic: "tuː ˈhʌndrəd", startTime: 227, endTime: 229 },
  { order: 83, stage: 5, english: "Three hundred?", chinese: "三百朵？", phonetic: "θriː ˈhʌndrəd", startTime: 230, endTime: 232 },
  { order: 95, stage: 5, english: "Here we go!", chinese: "我们走吧！", phonetic: "hɪə wiː ɡəʊ", startTime: 233, endTime: 235 },
  { order: 105, stage: 5, english: "Follow me!", chinese: "跟我来！", phonetic: "ˈfɒləʊ miː", startTime: 236, endTime: 238 },
];
