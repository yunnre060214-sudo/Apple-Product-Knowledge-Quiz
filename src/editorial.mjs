const newsroom = path => `https://www.apple.com/newsroom/${path}/`;
const support = ref => `https://support.apple.com/${ref.startsWith('SP') ? 'kb/' : 'en-us/'}${ref}`;
const chipSources = {
  m1: newsroom('2020/11/apple-unleashes-m1'),
  m1pro: newsroom('2021/10/apple-unleashes-m1-pro-and-m1-max-the-most-powerful-chips-for-a-personal-computer'),
  m1ultra: newsroom('2022/03/apple-unveils-m1-ultra-the-worlds-most-powerful-chip-for-a-personal-computer'),
  m2: newsroom('2022/06/apple-unveils-m2-with-breakthrough-performance-and-capabilities'),
  m2pro: newsroom('2023/01/apple-unveils-m2-pro-and-m2-max-next-generation-chips-for-next-level-workflows'),
  m2ultra: newsroom('2023/06/apple-introduces-m2-ultra'),
  m3: newsroom('2023/10/apple-unveils-m3-m3-pro-and-m3-max-the-most-advanced-chips-for-a-personal-computer'),
  m3ultra: newsroom('2025/03/apple-reveals-m3-ultra-taking-apple-silicon-to-a-new-extreme'),
  m4: newsroom('2024/05/apple-introduces-m4-chip'),
  m4pro: newsroom('2024/10/apple-introduces-m4-pro-m4-max'),
  m5: newsroom('2025/10/apple-unleashes-m5-the-next-big-leap-in-ai-performance-for-apple-silicon'),
};
// Maximal chip configurations, not a promise that every device offers every configuration.
export const silicon = [
  ['M1',2020,8,8,16,16,68.25,16,5,'m1'],
  ['M1 Pro',2021,10,16,16,32,200,33.7,5,'m1pro'],
  ['M1 Max',2021,10,32,16,64,400,57,5,'m1pro'],
  ['M1 Ultra',2022,20,64,32,128,800,114,5,'m1ultra'],
  ['M2',2022,8,10,16,24,100,20,5,'m2'],
  ['M2 Pro',2023,12,19,16,32,200,40,5,'m2pro'],
  ['M2 Max',2023,12,38,16,96,400,67,5,'m2pro'],
  ['M2 Ultra',2023,24,76,32,192,800,134,5,'m2ultra'],
  ['M3',2023,8,10,16,24,100,25,3,'m3'],
  ['M3 Pro',2023,12,18,16,36,150,37,3,'m3'],
  ['M3 Max',2023,16,40,16,128,400,92,3,'m3'],
  ['M3 Ultra',2025,32,80,32,512,819,184,3,'m3ultra'],
  ['M4',2024,10,10,16,32,120,28,3,'m4'],
  ['M4 Pro',2024,14,20,16,64,273,null,3,'m4pro'],
  ['M4 Max',2024,16,40,16,128,546,null,3,'m4pro'],
  ['M5',2025,10,10,16,32,153,null,3,'m5'],
].map(([model,year,cpu,gpu,neural,memory,bandwidth,transistors,process,source])=>({
  id:model.toLowerCase().replaceAll(' ','-'),model,source:chipSources[source],
  facts:Object.fromEntries(Object.entries({year,cpu,gpu,neural,memory,bandwidth,transistors,process}).filter(([,v])=>v!==null)),
}));

export const extraProducts = [
  {id:'watch-s6',model:'Apple Watch Series 6',category:'watch',source:support('SP826'),facts:{year:2020,chip:'S6 SiP',caseSize:'40 / 44',brightness:1000,battery:18,water:50,storage:32,bluetooth:'5.0'}},
  {id:'watch-s7',model:'Apple Watch Series 7',category:'watch',source:support('SP860'),facts:{year:2021,chip:'S7 SiP',caseSize:'41 / 45',brightness:1000,battery:18,water:50,storage:32,bluetooth:'5.0'}},
  {id:'watch-s8',model:'Apple Watch Series 8',category:'watch',source:support('SP878'),facts:{year:2022,chip:'S8 SiP',caseSize:'41 / 45',brightness:1000,battery:18,water:50,storage:32,bluetooth:'5.3'}},
  {id:'watch-s9',model:'Apple Watch Series 9',category:'watch',source:support('111833'),facts:{year:2023,chip:'S9 SiP',caseSize:'41 / 45',brightness:2000,battery:18,water:50,storage:64,bluetooth:'5.3'}},
  {id:'watch-s10',model:'Apple Watch Series 10',category:'watch',source:support('121202'),facts:{year:2024,chip:'S10 SiP',caseSize:'42 / 46',brightness:2000,battery:18,water:50,storage:64,bluetooth:'5.3'}},
  {id:'watch-s11',model:'Apple Watch Series 11',category:'watch',source:support('125093'),facts:{year:2025,chip:'S10 SiP',caseSize:'42 / 46',brightness:2000,battery:24,water:50,storage:64,bluetooth:'5.3'}},
  {id:'watch-se2',model:'Apple Watch SE（第 2 代）',category:'watch',source:support('111853'),facts:{year:2022,chip:'S8 SiP',caseSize:'40 / 44',brightness:1000,battery:18,water:50,storage:32,bluetooth:'5.3'}},
  {id:'watch-u1',model:'Apple Watch Ultra（第 1 代）',category:'watch',source:support('111852'),facts:{year:2022,chip:'S8 SiP',caseSize:'49',brightness:2000,battery:36,water:100,storage:32,bluetooth:'5.3'}},
  {id:'watch-u2',model:'Apple Watch Ultra 2',category:'watch',source:support('111832'),facts:{chip:'S9 SiP',caseSize:'49',brightness:3000,battery:36,water:100,storage:64,bluetooth:'5.3'}},
  {id:'ap4',model:'AirPods 4',category:'audio',source:support('121203'),facts:{year:2024,chip:'H2',bluetooth:'5.3'}},
  {id:'ap4anc',model:'AirPods 4（主动降噪款）',category:'audio',source:support('121204'),facts:{year:2024,chip:'H2',bluetooth:'5.3'}},
  {id:'pro2usb',model:'AirPods Pro 2（USB-C 充电盒）',category:'audio',source:support('111834'),facts:{year:2023,chip:'H2',bluetooth:'5.3'}},
  {id:'pro3',model:'AirPods Pro 3',category:'audio',source:support('125135'),facts:{year:2025,chip:'H2',bluetooth:'5.3'}},
];
export const editorialQuestions = [];
function add(category,difficulty,source,rows,tag) {
  for (const [prompt,answer,a,b,c,explanation] of rows) editorialQuestions.push({category,difficulty,prompt,answer,wrong:[a,b,c],explanation,sources:Array.isArray(source)?source:[source],tag});
}

add('iphone','easy',support('121031'),[
  ['iPhone 的 Face ID 主要使用哪种信息进行身份认证？','面部特征','指纹纹路','声纹','手掌静脉','Face ID 利用原深感摄像头系统识别面部特征。'],
  ['iPhone 上的「相机控制」主要围绕哪类任务设计？','快速访问与操作相机','增加实体 SIM 卡位','扩展内置存储','改变屏幕物理分辨率','相机控制是访问和调整相机功能的专用交互部件。'],
  ['iPhone 16 Pro 的「灵动岛」主要位于屏幕哪个位置？','屏幕顶部区域','屏幕底部 Home 键内','机身背面的镜头内','屏幕右侧边框外','灵动岛位于显示屏顶部，结合硬件开孔与软件交互呈现状态和活动。'],
  ['iPhone 规格中 48MP 的 MP 表示什么？','百万像素','兆瓦功率','每秒兆字节','毫米焦距','MP 是 megapixel 的缩写。48MP 即约 4800 万像素。'],
]);
add('iphone','expert',[support('121031'),support('121029')],[
  ['用相同的 10Gb/s USB 线连接电脑，iPhone 16 与 iPhone 16 Pro 的理论有线数据上限分别是多少？','480Mb/s 与 10Gb/s','两者都是 10Gb/s','两者都是 480Mb/s','10Gb/s 与 40Gb/s','iPhone 16 的 USB-C 接口使用 USB 2 数据速率；iPhone 16 Pro 支持最高 10Gb/s 的 USB 3。接口外形相同，协议能力仍需分别核对。'],
  ['iPhone 16 Pro 的 USB 3 标称 10Gb/s。忽略所有开销，换算后的理论字节速率是多少？','1.25GB/s','10GB/s','80GB/s','0.125GB/s','1 字节等于 8 比特，因此 10÷8=1.25。实际文件传输还会受到协议、存储与设备性能限制。'],
]);
add('iphone','hard',[support('121031'),support('121032')],[
  ['iPhone 16 Pro 与 16 Pro Max 的独立长焦相机都提供哪一档光学变焦放大？','5 倍','2 倍','3 倍','10 倍','这一代的两款 Pro 型号均配备 5 倍长焦相机；10 倍光学变焦范围把放大与缩小两端合并计算，口径不同。'],
  ['iPhone 16 Pro 规格中的「10 倍光学变焦范围」应如何理解？','从 0.5 倍端到 5 倍端的比值','配备一颗独立 10 倍长焦镜头','任何倍率都没有裁切','数字变焦上限只有 10 倍','范围比值为 5÷0.5=10；独立长焦镜头的放大倍率仍为 5 倍。'],
]);
add('ipad','hard',support('108937'),[
  ['iPad（第 10 代）连接 Apple Pencil（第 1 代）配对和充电时，需要哪种专用转接器？','USB-C 转 Apple Pencil 转接器','仅 Lightning 转 3.5 毫米转接器','Thunderbolt 2 转 VGA 转接器','Apple Watch 磁力充电器','这一组合使用 USB-C 转 Apple Pencil 转接器和 USB-C 线缆完成配对与充电。'],
  ['Apple Pencil（第 2 代）能否直接用于 iPad Pro（M4）？','不能，应选择兼容的 Pencil Pro 或 USB-C 型号','可以，所有磁吸笔都通用','可以，但只允许 60Hz 屏幕','可以，把蓝牙版本调为 4.0 即可','iPad Pro（M4）支持 Apple Pencil Pro 和 Apple Pencil（USB-C），不兼容第二代 Apple Pencil。'],
  ['一支 Apple Pencil 能磁吸在 iPad 边缘，是否足以证明它支持在该设备上充电？','不能，磁吸收纳与充电兼容需要分别核对','能，所有磁吸连接都传输电能','能，所有 Apple Pencil 都无线充电','只要屏幕是 OLED 就一定能','Apple Pencil（USB-C）可磁吸收纳，但通过 USB-C 配对和充电。兼容性应依据具体型号核对。'],
]);
add('ipad','expert',[support('119892'),support('SP883')],[
  ['为 iPad Pro（M4）选购具有压感的手写笔，同时希望以后还能查找笔的位置，下列哪款合适？','Apple Pencil Pro','Apple Pencil（第 2 代）','Apple Pencil（USB-C）','Apple Pencil（第 1 代）','Apple Pencil Pro 兼容 M4 iPad Pro，具备压感和查找支持；其余三个选项无法同时满足这些条件。'],
  ['对比 12.9 英寸 iPad Pro（第 6 代）和 13 英寸 iPad Pro（M4），显示技术的变化是哪一项？','从 Mini-LED 背光 LCD 变为双层串联 OLED','从 OLED 变为电子墨水','从双层 OLED 变为普通 LCD','两者始终都是 MicroLED','第六代 12.9 英寸 Pro 使用 Mini-LED 背光的 Liquid Retina XDR；M4 Pro 使用双层串联 OLED 的 Ultra Retina XDR。'],
]);
add('ipad','hard',support('119892'),[
  ['iPad Pro（M4）256GB／512GB 与 1TB／2TB 配置的 CPU 核心数有何不同？','前者 9 核，后者 10 核','前者 8 核，后者 16 核','所有容量均为 12 核','前者 10 核，后者 9 核','M4 iPad Pro 的 256GB、512GB 版本为 9 核 CPU，1TB、2TB 版本为 10 核 CPU。'],
  ['iPad Pro（M4）提供纳米纹理显示屏玻璃选项的存储档位是哪一组？','1TB 与 2TB','256GB 与 512GB','仅 128GB','所有存储档位','M4 iPad Pro 的纳米纹理玻璃选项限于 1TB 和 2TB 配置。'],
  ['iPad Pro（M4）的前置摄像头位于哪条边？','横向使用时的长边','竖向使用时的顶部短边','机身底部接口内部','Apple Pencil 笔身内','这一代采用横向前置摄像头布局，适合横屏视频通话。'],
  ['11 英寸 iPad Pro（M4）与 13 英寸版的核心显示技术有何关系？','两者均采用双层串联 OLED','只有 13 英寸采用 OLED','只有 11 英寸采用 OLED','两者都采用 Mini-LED LCD','M4 iPad Pro 的两种尺寸均采用 Ultra Retina XDR 双层串联 OLED。'],
]);
add('mac','easy',support('111883'),[
  ['Apple 的 MacBook Air 属于哪种产品形态？','笔记本电脑','无线入耳式耳机','蜂窝智能手表','电视遥控器','MacBook Air 是 Mac 笔记本产品线。'],
  ['MacBook 的触控板主要用于哪类交互？','移动指针与多点触控手势','充当蜂窝 SIM 卡','更换图形处理器','扩大物理内存','多点触控板用于指针、点击与系统支持的触控手势。'],
]);
add('mac','medium',newsroom('2026/03/say-hello-to-macbook-neo'),[
  ['2026 年首次推出的 MacBook Neo 使用哪款主芯片？','A18 Pro','M4 Ultra','A12 Bionic','Intel Core i9','MacBook Neo 使用 A18 Pro。它将 A 系列 Apple 芯片带入了这一 Mac 产品线。'],
  ['MacBook Neo 在散热结构上采用哪种设计？','无风扇设计','两只独立鼓风机','机身外置液冷泵','必须连接桌面散热底座','官方介绍明确说明 MacBook Neo 采用无风扇设计。'],
  ['MacBook Neo 首发显示屏的标称尺寸是多少？','13 英寸','11 英寸','15.3 英寸','16.2 英寸','MacBook Neo 使用 13 英寸 Liquid Retina 显示屏。'],
]);
add('mac','expert',newsroom('2026/03/say-hello-to-macbook-neo'),[
  ['MacBook Neo 两个 USB-C 端口外形相同。需要通过原生有线方式连接外部显示器，应选择哪一个？','左侧 USB 3 端口','右侧 USB 2 端口','任意端口都支持显示输出','两个端口均不支持充电','发布说明的脚注明确指出：左侧为 USB 3，右侧为 USB 2，外接显示器仅由左侧 USB 3 端口支持。'],
]);
add('mac','hard',[support('121555'),support('111837')],[
  ['2024 年 Mac mini 的 M4 Pro 版后部 USB-C 端口采用哪种雷雳标准？','Thunderbolt 5','Thunderbolt 2','仅 USB 2','Thunderbolt 1','M4 Pro Mac mini 的后部端口支持 Thunderbolt 5；同代标准 M4 版采用 Thunderbolt 4。'],
  ['2024 年 Mac mini 的前部两个 USB-C 端口，官方列出的 USB 数据速率上限是多少？','10Gb/s','480Mb/s','40Gb/s','120Gb/s','前部端口使用 USB 3，最高 10Gb/s。它们与后部的雷雳端口能力不同。'],
  ['Mac mini（2023）的 Apple 芯片可选系列是哪一组？','M2 与 M2 Pro','M3 与 M3 Max','M1 Ultra 与 M2 Ultra','仅 A17 Pro','2023 年 Mac mini 提供 M2 和 M2 Pro 配置。'],
]);
add('silicon','medium',chipSources.m1,[
  ['Apple 芯片所说的「统一内存架构」主要描述什么？','多个处理单元共享统一的内存资源','把 SSD 容量自动变为相同大小的 RAM','让所有 Mac 的内存容量都一样','只允许一个程序访问内存','统一内存架构允许 CPU、GPU 等单元使用共享的内存池，减少在不同内存池之间搬移数据的需求。'],
  ['SoC 一词在 Apple 芯片语境中通常指什么？','片上系统','独立显示器接口','机械键盘结构','云端存储订阅','System on a Chip 把多种计算与控制功能整合到芯片上。'],
]);
add('silicon','hard',chipSources.m1ultra,[
  ['M1 Ultra 的 UltraFusion 主要连接哪两颗裸晶？','两颗 M1 Max','两颗 M1 Pro','一颗 M2 与一颗 A15','两颗 Intel Xeon','M1 Ultra 通过 UltraFusion 连接两颗 M1 Max 裸晶，对软件呈现为统一芯片。'],
  ['M1 Ultra 公布的 2.5TB/s 指哪一类带宽？','UltraFusion 裸晶互连带宽','SSD 连续写入带宽','USB-C 文件传输带宽','Wi-Fi 无线带宽','2.5TB/s 指 UltraFusion 的处理器间互连；M1 Ultra 的统一内存带宽为 800GB/s，二者口径不同。'],
]);
add('silicon','expert',[chipSources.m3,chipSources.m2pro],[
  ['M3 Pro 的 150GB/s 内存带宽相对 M2 Pro 的 200GB/s，数值变化是多少？','减少 25%','增加 25%','减少 50%','完全相同','(150−200)÷200=−25%。代际名称较新并不意味着每项规格数值都更大。'],
  ['只比较最高 GPU 核心数，M3 Pro 与 M2 Pro 分别为多少？','18 核与 19 核','19 核与 18 核','两者都为 20 核','40 核与 38 核','M3 Pro 最高 18 核 GPU，M2 Pro 最高 19 核；核心数不能脱离架构和实际任务直接等同于性能。'],
]);

add('watch','easy',support('121202'),[
  ['Apple Watch 的 Digital Crown 是什么？','可旋转、可按压的数码表冠','专用于装入 SIM 卡的托盘','表带上的供电插头','手表内置摄像头','数码表冠是 Apple Watch 的交互部件，可旋转和按压。'],
  ['Apple Watch 的活动圆环一般用来呈现哪三类目标？','活动、锻炼、站立','下载、上传、缓存','亮度、对比度、饱和度','温度、湿度、气压','活动圆环用于呈现活动、锻炼与站立目标的完成情况。'],
  ['Apple Watch 日常使用的系统名称是什么？','watchOS','tvOS','visionOS','macOS','Apple Watch 使用 watchOS。'],
]);
add('watch','hard',support('111832'),[
  ['Apple Watch Ultra 2 的精确双频 GPS 使用哪两组信号频段？','L1 与 L5','2.4GHz 与 5GHz','L2 与 L6','仅 L1','Ultra 2 的定位系统使用 L1 与 L5 双频 GPS；Wi-Fi 频段属于另一类无线技术。'],
  ['Apple Watch Ultra 2 的 100 米防水等级，是否等同于支持 100 米休闲水肺潜水？','不等同，官方休闲水肺潜水范围为 40 米','等同，防水数字就是允许潜水深度','等同，只要开启低电量模式','不等同，它不支持任何水上活动','Ultra 2 的 100 米防水等级与最高 40 米休闲水肺潜水使用范围应分别理解，并遵循配套应用与潜水规范。'],
  ['Apple Watch Ultra 2 的可自定义操作按钮位于哪一侧？','表壳左侧','数码表冠正中央','表带内部','表壳背面传感器中央','Ultra 2 的操作按钮位于左侧，可设置用于锻炼等功能。'],
]);
add('watch','expert',[support('121202'),support('111853')],[
  ['在 Apple Watch Series 10 和 SE（第 2 代）之间选择，要求常亮显示屏，应选择哪款？','Series 10','SE（第 2 代）','两者均不支持','只有 SE 的蜂窝版支持','Series 10 支持全天候显示，SE（第 2 代）不支持常亮显示屏。'],
  ['在 Series 10 与 SE（第 2 代）之间选择，要求内置电极式心率传感器以使用受支持地区的 ECG 功能，应选哪款？','Series 10','SE（第 2 代）','两款都只有摄像头测量心率','只有 SE 的 44 毫米版支持','Series 10 配备电极式心率传感器，SE（第 2 代）没有 ECG 所需的这项硬件；ECG 可用性仍依地区而定。'],
]);
add('watch','medium',support('121202'),[
  ['Apple Watch Series 10 的深度计主要针对哪种场景？','浅水活动中的深度信息','100 米专业饱和潜水','测量手机内存深度','拍摄微距照片','Series 10 提供用于浅水活动的深度计与水温传感器，不能据此推断具备 Ultra 的所有潜水能力。'],
  ['Apple Watch 规格里「GPS + Cellular」的 Cellular 主要表示什么？','支持蜂窝网络连接能力','仅支持有线以太网','表壳使用蜂窝形状','内置容量翻倍','Cellular 指蜂窝网络能力，服务是否可用取决于运营商、地区与套餐。'],
]);
add('audio','easy',support('121204'),[
  ['AirPods 的主动降噪主要用于什么？','减少传入耳中的部分环境噪声','提升手机存储容量','屏蔽所有无线电信号','把任何录音变成无损原始文件','主动降噪通过采集噪声并进行音频处理，降低部分外界噪声的听感。'],
  ['AirPods 的通透模式主要让用户获得什么体验？','佩戴耳机时仍可听见周围环境','完全关闭所有麦克风','强制使用最大音量','把蓝牙改为有线传输','通透模式帮助用户在佩戴耳机时感知环境声音。'],
  ['AirPods 充电盒的主要作用是什么？','收纳耳机并为耳机补充电量','让 iPhone 增加一个摄像头','替代 Wi-Fi 路由器','读取电脑内存条','充电盒兼具收纳和给耳机充电的作用。'],
  ['AirPods 4 的普通款与主动降噪款是否为同一个配置？','是两个不同的配置','只有包装印刷不同','只有耳机颜色不同','只有系统语言不同','AirPods 4 分为普通款与主动降噪款，音频功能和充电盒能力有所不同。'],
]);
add('audio','hard',[support('121203'),support('121204')],[
  ['AirPods 4 的哪一种配置支持自适应音频？','主动降噪款','普通款','只有配 Lightning 盒的款式','两款均不支持','自适应音频是 AirPods 4 主动降噪款提供的功能。'],
  ['AirPods 4 主动降噪款的充电盒支持哪一组充电方式？','USB-C、Apple Watch 充电器和 Qi 认证无线充电器','仅 Lightning','仅 MagSafe 专用触点，不支持 USB-C','仅太阳能充电','主动降噪款配备可无线充电的充电盒，也支持 USB-C。普通 AirPods 4 的充电盒仅通过 USB-C 充电。'],
  ['AirPods 4 主动降噪款充电盒配备的扬声器，主要可为哪项功能发声？','查找充电盒','充当家庭影院主声道','直接替代耳机播放全部音乐','读取电子书','充电盒扬声器可配合查找功能发出提示音，帮助定位。'],
  ['AirPods 4 规格中的 H2 是哪一类部件？','耳机芯片','耳塞的螺纹规格','电池化学元素','蓝牙频段名称','H2 是 Apple 的耳机芯片，用于处理音频与相关功能。'],
]);
add('audio','expert',[support('121203'),support('121204')],[
  ['想要不使用硅胶入耳耳塞的 AirPods，同时需要主动降噪，在下列选项中应选择哪款？','AirPods 4（主动降噪款）','AirPods 4 普通款','AirPods 2','EarPods（USB-C）','AirPods 4 主动降噪款采用开放式佩戴设计并提供主动降噪；其他列出的型号不同时满足两项要求。'],
  ['朋友的 AirPods 4 充电盒无法放在 Qi 充电板上充电。确认设备正常后，哪种产品差异可以解释这一点？','普通款充电盒不支持无线充电','所有 AirPods 4 都只支持 Lightning','AirPods 4 必须在 Mac 上解锁后才能充电','Qi 只能给 Apple Watch 充电','AirPods 4 普通款的充电盒采用 USB-C 有线充电，主动降噪款充电盒增加无线充电支持。'],
]);
add('audio','medium',support('125135'),[
  ['AirPods Pro 3 新增用于锻炼场景的一项硬件感测能力是什么？','心率感测','有创血糖采样','拍摄 8K 视频','测量眼球视力','AirPods Pro 3 引入心率感测以配合受支持的锻炼体验。'],
  ['AirPods Pro 3 采用哪种耳塞佩戴形态？','可更换耳塞的入耳式','完全不进入耳道的骨传导式','头戴式开放平板振膜','仅单耳挂式','AirPods Pro 3 使用可更换耳塞的入耳式设计。'],
  ['AirPods Pro 3 的充电盒机身有线接口是哪一种？','USB-C','Lightning','30 针 Dock','Micro-USB','第三代 AirPods Pro 的充电盒使用 USB-C。'],
]);
add('audio','hard',support('111834'),[
  ['AirPods Pro 2 配 USB-C 盒，在与 Apple Vision Pro 的指定连接中支持哪项特殊音频能力？','无损音频与超低延迟连接','任何蓝牙设备都无条件获得 192kHz 无损','无需任何无线连接即可跨房间播放','把 USB 2 自动升级为雷雳 5','该版本支持与兼容 Apple Vision Pro 的 H2 对 H2 无损音频和超低延迟连接；不能泛化为所有蓝牙设备的能力。'],
  ['AirPods Pro 2（USB-C）耳机和充电盒的防尘防汗抗水等级是什么？','IP54','IP68','IPX8','完全不具备等级','这一版本耳机与充电盒的标示等级为 IP54，仍须遵循官方的使用和干燥说明。'],
]);
const homepod='https://www.apple.com/homepod-mini/specs/';
add('audio','easy',homepod,[
  ['HomePod mini 主要属于哪种设备？','智能音箱','蜂窝手机','头戴式显示器','手写笔','HomePod mini 是 Apple 的智能音箱产品。'],
  ['在 HomePod mini 顶部点按加号或减号，通常用于什么？','调整音量','改变 Wi-Fi 频段','更换电池','切换 Apple Account 国家','顶部的加减控制用于调节音量。'],
]);
add('audio','medium',homepod,[
  ['HomePod mini 内置了哪组环境传感器？','温度与湿度传感器','核辐射与 X 射线传感器','血糖与血压传感器','眼球追踪与虹膜扫描器','HomePod mini 可提供温度和湿度感测，具体工作条件以官方规格为准。'],
  ['HomePod mini 使用的 Thread 主要是哪类技术？','低功耗智能家居网络技术','雷雳光纤技术','视频剪辑编码','手机电池材料','Thread 用于智能家居设备的低功耗网络连接，不等于蓝牙音频传输。'],
  ['使用 HomePod mini 的 AirPlay 功能，通常可完成什么？','从兼容 Apple 设备发送音频内容','把音箱变成外置显卡','给任意手机无线反向充电','直接拍摄空间视频','AirPlay 可将兼容设备的音频内容发送到 HomePod mini。'],
  ['HomePod mini 顶部连点两下，通常执行什么播放控制？','跳到下一首','回到上一首','恢复出厂设置','关闭家中所有电源','其触控操作规定：点按播放／暂停，双击跳到下一首，三击返回。'],
]);

const continuity=support('108046');
add('ecosystem','easy',continuity,[
  ['想在 iPhone 复制文字，随后直接在 Mac 粘贴，应使用哪项功能？','通用剪贴板','台前调度','屏幕使用时间','FileVault','通用剪贴板把兼容 Apple 设备之间的复制与粘贴连接起来。'],
  ['想把 iPad 作为 Mac 的第二块显示屏，应使用哪项功能？','随航（Sidecar）','Time Machine','专注模式','快速备忘录','随航可以将 Mac 桌面扩展或镜像到兼容 iPad。'],
  ['希望一套 Mac 键盘和鼠标同时操作独立运行的 Mac 与 iPad，应选择哪项功能？','通用控制','随航镜像','聚焦搜索','低电量模式','通用控制让同一套输入设备跨 Mac 与 iPad 操作，各设备仍运行自己的系统。'],
  ['在 Mac 开始写一封邮件，随后在附近 iPhone 继续同一任务，相关功能叫什么？','接力（Handoff）','优化存储空间','抹掉所有内容','色彩滤镜','接力把受支持应用中的任务衔接到另一台兼容 Apple 设备。'],
  ['通过 Apple 设备之间的 AirDrop，最典型的任务是什么？','近距离无线发送文件','更换设备的主芯片','购买实体 SIM 卡','修复屏幕裂纹','AirDrop（隔空投送）用于兼容设备之间无线传送文档、照片等内容。'],
]);
add('ecosystem','medium',continuity,[
  ['随航与通用控制的核心区别是哪一项？','随航把 iPad 用作 Mac 显示屏；通用控制让两台设备各自运行并共用输入','两者都要求 iPad 改装 macOS','通用控制只用于调音量','随航只支持控制智能灯泡','随航扩展或镜像 Mac 桌面；通用控制跨设备移动指针并输入，不把 iPad 变为 Mac 桌面。'],
  ['通用剪贴板的典型前提包含哪一组条件？','兼容设备、同一 Apple Account，以及开启所需的蓝牙、Wi-Fi 和接力','任何品牌设备，只要屏幕同尺寸','必须插入两张相同号码的 SIM 卡','必须购买两份 Apple Music','通用剪贴板依赖兼容设备与连续互通的配置条件，包括同一账户和相应无线功能。'],
  ['连续互通相机的一个典型用途是什么？','把兼容 iPhone 用作 Mac 的摄像头','把摄像头变为内存扩展卡','把 Mac 显示器变成太阳能电池','取消所有视频通话权限','连续互通相机让兼容 iPhone 为 Mac 提供相机能力。'],
]);
add('ecosystem','expert',continuity,[
  ['桌面上 Mac 正在运行 Xcode，iPad 正在运行自己的绘画 App。要让鼠标在二者之间移动而保留各自应用，应选择什么？','通用控制','把 iPad 随航镜像为 Mac 主屏幕','格式化 iPad 并安装 macOS','将两台设备加入同一备忘录','该需求要求两台设备分别运行各自应用，同时共用输入设备，符合通用控制的用途。'],
  ['只想增加 Mac 的桌面工作区，把一个 Mac 窗口拖到 iPad 上继续操作，应优先选择哪种功能？','随航扩展显示','通用控制的独立 iPad 应用','屏幕使用时间限额','iCloud 共享相簿','窗口仍属于 Mac 应用，需要把 iPad 用作扩展显示器，因此使用随航。'],
]);
const rosetta=support('102527');
add('ecosystem','medium',rosetta,[
  ['Rosetta 在 Apple 芯片 Mac 上的主要作用是什么？','翻译执行兼容的 Intel Mac 应用','给系统安装 Android 内核','把蓝牙耳机改为雷雳设备','提高显示器的物理分辨率','Rosetta 为 Apple 芯片 Mac 提供兼容 Intel 应用的转换执行环境；适用范围应以对应 macOS 版本为准。'],
  ['一款 Mac App 标注为 Universal，通常意味着什么？','包含针对 Intel 与 Apple 芯片的代码','能在所有手机系统上运行','无需任何操作系统','占用的内存永久为零','通用 Mac 应用包含适用于两种 Mac 架构的代码，可在相应平台上使用。'],
]);
add('ecosystem','expert',rosetta,[
  ['Apple 芯片 Mac 上，一个应用有原生 Apple silicon 版本和 Intel 版本。为获得更好的长期兼容性应优先选什么？','原生 Apple silicon 版本','Intel 版本，因为翻译永远更快','随意改文件扩展名为 .arm','只安装 iPhone 截图','Apple 建议更新到 Apple silicon 或 Universal 版本，减少对架构翻译的依赖。'],
]);
const backup=support('102307');
add('ecosystem','easy',backup,[
  ['Mac 内置的 Time Machine 主要用于什么？','备份与恢复文件','更改现实中的时间','提高手机相机像素','为 Apple Watch 充电','Time Machine 是 macOS 内置的备份工具，可用于恢复文件与迁移数据。'],
  ['iCloud 最典型的作用之一是什么？','在设备之间同步和保存支持的数据','把旧设备芯片升级成新一代','提高电池实际容量','把所有应用变成免费','iCloud 为支持的照片、文件等提供云端同步与存储能力。'],
]);
add('ecosystem','hard',backup,[
  ['云端同步与独立备份的关系，哪一种理解更合适？','同步有助于保持一致，独立备份还可保留恢复路径','同步后永远不需要任何备份','开启同步就能免疫误删除','备份只能复制空文件夹','同步服务会传播数据变化；为重要数据建立独立备份，可提供额外恢复途径。'],
  ['换一台 Mac 时，已有 Time Machine 备份可以用来做什么？','协助恢复文件和迁移数据','把屏幕从 60Hz 升为 120Hz','把内存条容量物理加倍','把任何 Intel 芯片变成 M 系列','Time Machine 备份可用于迁移和恢复数据，不会改变硬件规格。'],
]);
add('ecosystem','easy','https://www.apple.com/accessibility/vision/',[
  ['Apple 的 VoiceOver（旁白）主要帮助用户做什么？','通过语音了解屏幕内容并操作设备','把手机屏幕变为扬声器振膜','增加实体接口数量','给路由器自动换天线','旁白是屏幕阅读辅助功能，帮助用户理解界面与进行操作。'],
  ['Apple 辅助功能中的「缩放」主要解决哪类需求？','放大屏幕内容便于观看','改变摄像头物理焦距','缩小设备电池','减少内置存储容量','辅助功能缩放可以放大显示内容，与相机镜头变焦属于不同功能。'],
]);
add('ecosystem','easy','https://support.apple.com/guide/shortcuts/welcome/ios',[
  ['快捷指令（Shortcuts）的主要用途是什么？','把多个操作组合为可执行流程','更换手机的主摄像头','提高显示屏硬件刷新率','让无网络设备永久联网','快捷指令通过动作与条件组合，自动执行受系统和应用支持的任务。'],
  ['需要一键执行多个受支持的日常操作，Apple 生态中哪种工具最贴近需求？','快捷指令','磁盘工具的分区按钮','屏幕坏点检测图','SIM 卡针','快捷指令适合把重复执行的操作组织成可重复运行的流程。'],
]);
add('ecosystem','medium',support('102600'),[
  ['AirTag 使用哪一种可自行更换的电池？','CR2032 纽扣电池','不可更换的 AAAA 电池','两节 18650 电池','Lightning 电池模块','AirTag 使用 CR2032 纽扣电池，更换时应核对与 AirTag 的兼容性。'],
]);
add('ecosystem','hard',support('111847'),[
  ['第一代 AirTag 本身是否是一台独立蜂窝 GPS 定位器？','它通过蓝牙、查找网络等协助定位，不具备独立蜂窝 GPS 结构','是，它必须插入 nano-SIM','是，它内置每月付费的 eSIM 套餐','它只能通过 30 针 Dock 发送位置','第一代 AirTag 依靠蓝牙与查找网络协助物品定位，超宽带用于受支持设备的精确查找。'],
  ['第一代 AirTag 用于受支持 iPhone 精确查找的关键近距离技术是什么？','超宽带（UWB）','仅红外遥控码','FM 广播','有线雷雳 5','AirTag 的 U1 芯片提供超宽带能力，支持兼容 iPhone 的精确查找。'],
]);

const iphone2007=newsroom('2007/01/09Apple-Reinvents-the-Phone-with-iPhone');
add('history','easy',iphone2007,[
  ['第一代 iPhone 最初发布于哪一年？','2007 年','2001 年','2010 年','2015 年','Apple 于 2007 年 1 月首次发布 iPhone。'],
  ['第一代 iPhone 发布时，Apple 将它概括为手机、互联网通信设备与哪一种产品体验的结合？','宽屏触控 iPod','激光打印机','家庭游戏主机','数码单反取景器','发布介绍把 iPhone 描述为手机、宽屏触控 iPod 与互联网通信设备的结合。'],
]);
add('history','medium',iphone2007,[
  ['第一代 iPhone 发布时的显示交互重点是什么？','大尺寸多点触控屏幕','必须使用电阻式手写笔','全尺寸实体字母键盘','仅通过电视遥控器操纵','第一代 iPhone 采用面向手指操作的多点触控界面。'],
]);
add('history','easy',newsroom('2010/01/27Apple-Launches-iPad'),[
  ['第一代 iPad 首次发布于哪一年？','2010 年','2007 年','2013 年','2018 年','Apple 于 2010 年 1 月发布第一代 iPad。'],
  ['第一代 iPad 的产品形态是哪一种？','平板电脑','无线智能音箱','腕戴式手表','头戴式空间计算设备','初代 iPad 建立了 Apple 的平板电脑产品线。'],
]);
add('history','medium',newsroom('2010/01/27Apple-Launches-iPad'),[
  ['第一代 iPad 使用哪款 Apple 芯片？','A4','A7','M1','A12X Bionic','初代 iPad 配备 Apple A4 芯片。'],
]);
add('history','easy',newsroom('2001/10/23Apple-Presents-iPod'),[
  ['第一代 iPod 主要围绕哪类内容体验设计？','便携音乐播放','4K 视频剪辑','电子墨水笔记','卫星电话通话','最初的 iPod 以便携音乐播放和音乐资料管理为核心。'],
  ['第一代 iPod 推出于哪一年？','2001 年','1984 年','2007 年','2016 年','Apple 于 2001 年发布初代 iPod。'],
]);
add('history','medium',newsroom('2001/10/23Apple-Presents-iPod'),[
  ['第一代 iPod 与 Mac 同步音乐，主要使用哪种接口？','FireWire','USB-C','Lightning','Thunderbolt 4','初代 iPod 使用 FireWire 连接，与后来 iPod 的连接方式不同。'],
]);
add('history','medium',newsroom('2013/09/10Apple-Announces-iPhone-5s-The-Most-Forward-Thinking-Smartphone-in-the-World'),[
  ['哪一代 iPhone 首次搭载 Touch ID？','iPhone 5s','iPhone 4s','iPhone 5','iPhone 6s','iPhone 5s 引入 Touch ID 指纹认证。'],
  ['iPhone 5s 的 A7 芯片带来了哪项关键架构变化？','64 位架构','从 64 位退回 8 位','引入 M 系列命名','首次搭载独立 Intel 显卡','A7 为 iPhone 带来 64 位架构，是这一代的关键变化。'],
]);
add('history','medium',newsroom('2017/09/the-future-is-here-iphone-x'),[
  ['哪一款 iPhone 首次引入 Face ID？','iPhone X','iPhone 8','iPhone 7 Plus','iPhone SE（第 1 代）','2017 年的 iPhone X 首次引入 Face ID。'],
  ['iPhone X 的屏幕技术与同年 iPhone 8 相比，关键差别是什么？','X 使用 OLED，8 使用 LCD','X 使用电子墨水，8 使用 OLED','X 与 8 都使用 Mini-LED','X 使用阴极射线管','iPhone X 使用 Super Retina OLED 显示屏，iPhone 8 使用 LCD。'],
]);
add('history','medium',chipSources.m1,[
  ['2020 年开启 Mac 自研 Apple 芯片转型的首款 M 系列芯片叫什么？','M1','A14X','M0 Ultra','T2 Max','M1 于 2020 年发布，用于首批由 Intel 转向 Apple 芯片的 Mac。'],
  ['M1 最初采用的制程节点是哪一项？','5 纳米','14 纳米','28 纳米','3 纳米','M1 使用 5 纳米制程，与后来的 M3 首批 3 纳米 M 系列不同。'],
]);
add('history','hard',newsroom('2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro'),[
  ['M4 芯片最先在哪一条产品线上正式亮相？','iPad Pro','Mac Pro','Apple Watch Ultra','AirPods Max','M4 最先随 2024 年 5 月的 iPad Pro 发布，之后才进入 Mac。'],
  ['2024 年 M4 iPad Pro 发布时，同时推出的新款压感笔叫什么？','Apple Pencil Pro','Apple Pencil Max','Apple Pencil Ultra','Apple Pencil 4','Apple Pencil Pro 随 M4 iPad Pro 一同发布。'],
]);
add('history','expert',[iphone2007,newsroom('2010/01/27Apple-Launches-iPad'),chipSources.m1],[
  ['按首次发布的年份排序，下面哪条顺序正确？','iPhone → iPad → M1','iPad → iPhone → M1','M1 → iPhone → iPad','iPhone → M1 → iPad','iPhone 于 2007 年发布，iPad 于 2010 年发布，M1 于 2020 年发布。'],
  ['第一代 iPhone 与 M1 芯片的首次发布年份相差多少年？','13 年','10 年','15 年','17 年','2020−2007=13，这里比较首次发布的自然年份。'],
]);
add('history','expert',[chipSources.m3,chipSources.m4],[
  ['按芯片首次发布年份比较，M3 与 M4 相隔多少个自然年？','1 年','2 年','3 年','同一年','M3 首次发布于 2023 年，M4 于 2024 年首次发布，两者的自然年份相差 1。'],
]);

