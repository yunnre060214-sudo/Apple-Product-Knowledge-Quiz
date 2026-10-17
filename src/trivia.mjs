import {hash,seeded,shuffle} from './engine.mjs';
const news=p=>`https://www.apple.com/newsroom/${p}/`;
export const iosReleases = [
 [1,2007,'2007/01/09Apple-Reinvents-the-Phone-with-iPhone'],
 [2,2008,'2008/06/09Apple-Introduces-the-New-iPhone-3G'],
 [3,2009,'2009/03/17Apple-Previews-Developer-Beta-of-iPhone-OS-3-0'],
 [4,2010,'2010/06/07Apple-Presents-iPhone-4'],
 [5,2011,'2011/06/06New-Version-of-iOS-Includes-Notification-Center-iMessage-Newsstand-Twitter-Integration-Among-200-New-Features'],
 [6,2012,'2012/06/11Apple-Previews-iOS-6-With-All-New-Maps-Siri-Features-Facebook-Integration-Shared-Photo-Streams-New-Passbook-App'],
 [7,2013,'2013/06/10Apple-Unveils-iOS-7'],
 [8,2014,'2014/06/02Apple-Unveils-iOS-8-the-Biggest-Release-Since-the-Launch-of-the-App-Store'],
 [9,2015,'2015/06/08Apple-Previews-iOS-9'],
 [10,2016,'2016/06/apple-previews-ios-10-biggest-ios-release-ever'],
 [11,2017,'2017/06/ios-11-brings-new-features-to-iphone-and-ipad-this-fall'],
 [12,2018,'2018/06/apple-previews-ios-12'],
 [13,2019,'2019/06/apple-previews-ios-13'],
 [14,2020,'2020/06/apple-reimagines-the-iphone-experience-with-ios-14'],
 [15,2021,'2021/06/ios-15-brings-powerful-new-features-to-stay-connected-focus-explore-and-more'],
 [16,2022,'2022/06/apple-unveils-new-ways-to-share-and-communicate-in-ios-16'],
 [17,2023,'2023/06/ios-17-makes-iphone-more-personal-and-intuitive'],
 [18,2024,'2024/06/ios-18-makes-iphone-more-personal-capable-and-intelligent-than-ever'],
 [26,2025,'2025/06/apple-elevates-the-iphone-experience-with-ios-26'],
].map(([n,year,path])=>({id:`ios-${n}`,model:n<4?`iPhone OS ${n}`:`iOS ${n}`,year,source:news(path),category:'ecosystem'}));
const S={
 original:news('2007/01/09Apple-Reinvents-the-Phone-with-iPhone'),
 ipod:news('2001/10/23Apple-Presents-iPod'),
 hifi:news('2006/02/28Apple-Announces-iPod-Hi-Fi'),
 u2:news('2014/09/09Apple-U2-Release-Songs-of-Innocence-Exclusively-for-iTunes-Store-Customers'),
 antenna:'https://www.apple.com/in/newsroom/2010/07/02Letter-from-Apple-Regarding-iPhone-4/',
 x:news('2017/09/the-future-is-here-iphone-x'),
 mini:news('2012/10/23Apple-Introduces-iPad-mini'),
 ipad:news('2010/01/27Apple-Launches-iPad'),
 ipad2:news('2011/03/02Apple-Launches-iPad-2'),
 ipad3:news('2012/03/07Apple-Launches-New-iPad'),
 air:news('2013/10/23Apple-Announces-iPad-Air-Dramatically-Thinner-Lighter-More-Powerful-iPad'),
 pencil:'https://support.apple.com/en-us/108937',
 pencilusb:'https://www.apple.com/newsroom/2023/10/apple-introduces-new-apple-pencil-bringing-more-value-and-choice-to-the-lineup/',
 m4ipad:news('2024/05/apple-unveils-stunning-new-ipad-pro-with-m4-chip-and-apple-pencil-pro'),
 ipados:news('2019/06/the-new-ipados-powers-unique-experiences-designed-for-ipad'),
 ipados18:news('2024/06/ipados-18-introduces-powerful-intelligence-features-and-apps-for-apple-pencil'),
 airpods:news('2016/09/apple-reinvents-the-wireless-headphones-with-airpods'),
 airpodspro:news('2019/10/apple-reveals-new-airpods-pro-available-october-30'),
 airpodsmax:news('2020/12/apple-introduces-airpods-max-the-magic-of-airpods-in-a-stunning-over-ear-design'),
 homepod:news('2017/06/homepod-reinvents-music-in-the-home'),
 homepodmini:news('2020/10/apple-introduces-homepod-mini-a-powerful-smart-speaker-with-amazing-sound'),
 airtag:news('2021/04/apple-introduces-airtag'),
 watch:news('2014/09/09Apple-Unveils-Apple-Watch-Apples-Most-Personal-Device-Ever'),
 watchgold:news('2015/03/09Apple-Watch-Available-in-Nine-Countries-on-April-24'),
 watchs5:news('2019/09/apple-unveils-apple-watch-series-5'),
 ultra:news('2022/09/introducing-apple-watch-ultra'),
 imac:news('1998/05/06Apple-Unveils-iMac'),
 imacm1:news('2021/04/imac-features-all-new-design-in-vibrant-colors-m1-chip-and-45k-retina-display'),
 macair:news('2008/01/15Apple-Introduces-MacBook-Air-The-Worlds-Thinnest-Notebook'),
 mac2015:news('2015/03/09Apple-Unveils-All-New-MacBook'),
 mbp2016:news('2016/10/apple-unveils-groundbreaking-new-macbook-pro'),
 mbp2021:news('2021/10/apple-unveils-game-changing-macbook-pro'),
 mini2024:news('2024/10/apples-new-mac-mini-is-more-mighty-more-mini-and-built-for-apple-intelligence'),
 m1:news('2020/11/apple-unleashes-m1'),
 m4:news('2024/05/apple-introduces-m4-chip'),
 intel:news('2005/06/06Apple-to-Use-Intel-Microprocessors-Beginning-in-2006'),
 silicon:news('2020/06/apple-announces-mac-transition-to-apple-silicon'),
 touch:'https://support.apple.com/guide/iphone/welcome/ios',
 guideipad:'https://support.apple.com/guide/ipad/welcome/ipados',
 guidewatch:'https://support.apple.com/guide/watch/welcome/watchos',
 guidemac:'https://support.apple.com/guide/mac-help/welcome/mac',
 iphone7:news('2016/09/apple-introduces-iphone-7-iphone-7-plus'),
 iphone5s:news('2013/09/10Apple-Announces-iPhone-5s-The-Most-Forward-Thinking-Smartphone-in-the-World'),
 iphone4:news('2010/06/07Apple-Presents-iPhone-4'),
 iphone4s:news('2011/10/04Apple-Launches-iPhone-4S-iOS-5-iCloud'),
 iphone6:news('2014/09/09Apple-Announces-iPhone-6-iPhone-6-Plus-The-Biggest-Advancements-in-iPhone-History'),
 iphone6s:news('2015/09/09Apple-Introduces-iPhone-6s-iPhone-6s-Plus'),
 iphone12:news('2020/10/apple-announces-iphone-12-and-iphone-12-mini-a-new-era-for-iphone-with-5g'),
 iphone14:news('2022/09/apple-debuts-iphone-14-pro-and-iphone-14-pro-max'),
 iphone15:news('2023/09/apple-debuts-iphone-15-and-iphone-15-plus'),
 iphone15pro:news('2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max'),
 keyboard:'https://www.apple.com/support/assets/docs/products/keyboard-service-program-for-mac-notebooks/Keyboard-Service-Program-for-MacBook-MacBook-Air-and-MacBook-Pro-ar_AE.pdf',
 battery:'https://support.apple.com/en-us/101575',
 mouse:'https://support.apple.com/en-ie/102292',
 studio:news('2022/03/apple-unveils-all-new-mac-studio-and-studio-display'),
 appstore:news('2018/07/app-store-turns-10'),
 ipodbye:news('2022/05/the-music-lives-on'),
 vision:news('2023/06/introducing-apple-vision-pro'),
 sf:'https://developer.apple.com/sf-symbols/',
 swift:news('2014/06/02Apple-Releases-iOS-8-SDK-With-Over-4-000-New-APIs'),
 magsafe:'https://support.apple.com/en-us/HT212755',
};
const rows=[];
// Each row is one authored question, with a distinct claim and an explicit explanation.
function add(source,category,topic,family,text){for(const line of text.trim().split('\n')){const cells=line.split('|');if(cells.length!==6)throw new Error('Bad trivia row: '+line);rows.push({source,category,topic,family,cells});}}
add('original','iphone','stories','first-iphone',`
初代 iPhone 发布时，乔布斯先说要介绍三种产品，最后揭晓了什么？|三种功能装进同一台 iPhone|三个不同品牌的手机|一台手机加两台 iPod|三种独立的操作系统|2007 年的演示把宽屏 iPod、手机和互联网通信设备串在一起，最后揭晓它们是同一台产品。
刚买到初代 iPhone，想去 App Store 下载游戏，会碰上什么情况？|当时还没有 App Store|必须先开通 5G|只能用 Face ID 登录|需要连接 Apple Watch|初代 iPhone 在 2007 年上市，App Store 到 2008 年才正式登场。
初代 iPhone 上市时，给它拍一段视频会遇到什么限制？|系统相机尚不支持录制视频|没有后置摄像头|只能拍摄 8K 视频|只能用前置相机|初代配有后置相机，但系统相机的视频录制功能后来才来到 iPhone。
初代 iPhone 连上移动网络时，实际使用的是哪一代蜂窝数据技术？|2G EDGE|3G|4G LTE|5G|初代 iPhone 支持 GSM 和 EDGE，名字中的 Phone 并不意味着它一开始就支持 3G。
拿初代 iPhone 自拍，哪种操作更符合当时硬件？|把后置相机转向自己|打开原深感前置相机|用灵动岛里的摄像头|打开屏下摄像头|初代 iPhone 没有前置摄像头，前置相机在 iPhone 4 上登场。
初代 iPhone 的屏幕交互，主打哪一种方式？|用手指多点触控|用内置电阻式手写笔|用方向键逐格移动|用折叠式鼠标|初代 iPhone 把手指多点触控作为核心交互，发布演示特别强调无需触控笔。
`);
add('ipod','history','stories','ipod-origin',`
第一代 iPod 最初想让你把什么装进口袋？|约一千首歌|一千部 4K 电影|一整套桌面显示器|一台拨号传真机|第一代 iPod 用 5GB 硬盘装载音乐，发布宣传围绕口袋里的一千首歌展开。
第一代 iPod 的滚轮是什么感觉？|滚轮本身会机械转动|只是一块静止的触摸屏|带有 Face ID 解锁|必须使用 Apple Pencil|初代 iPod 使用可机械转动的滚轮，后来才发展到触控滚轮与 Click Wheel。
2001 年的第一代 iPod，最初主要为哪类电脑用户准备？|Mac 用户|只能使用 iPad 的用户|只能使用 Android 的用户|只能使用 Apple Watch 的用户|初代 iPod 与 Mac 和 iTunes 配合使用，Windows 兼容后来才加入产品线。
第一代 iPod 与电脑同步歌曲时，依靠哪种接口？|FireWire|Lightning|USB-C|HDMI|初代 iPod 通过 FireWire 同步音乐，Lightning 和 USB-C 都属于更晚的时代。
第一代 iPod 的存储，和今天常见的闪存播放器有何不同？|里面有微型硬盘|靠光盘旋转播放|只靠云端在线播放|每首歌用一张实体卡|初代 iPod 内置 1.8 英寸硬盘，微型机械结构也是当年产品的一部分。
`);
add('hifi','audio','stories','ipod-hifi',`
Apple 真的做过一款叫 iPod Hi-Fi 的产品，它是什么？|带 iPod 底座的音箱|给 iPod 用的显卡|一种 iPod 会员服务|可以打电话的 iPod|2006 年的 iPod Hi-Fi 是一体式音箱，顶部可连接 iPod。
iPod Hi-Fi 离开墙上的电源插座，还能靠什么供电？|六节 D 型电池|两节纽扣电池|太阳能手表表盘|iPod 的耳机线取电|这款大音箱既能接交流电，也能使用六节 D 型电池。
2006 年 iPod Hi-Fi 在美国发布时，售价是多少？|349 美元|29 美元|99 美元|3499 美元|Apple 当年给 iPod Hi-Fi 定下 349 美元的美国建议零售价。
iPod Hi-Fi 这个名字里虽然有 Hi-Fi，它主要围绕哪种设备设计？|iPod|Apple Vision Pro|iPhone 15|Apple Watch Ultra|iPod Hi-Fi 面向当时的 iPod 音乐体验，时间早于 iPhone 正式发布。
`);
add('u2','history','stories','u2-album',`
2014 年 Apple 免费送到海量 iTunes 用户面前的专辑，来自哪支乐队？|U2|Queen|Coldplay|The Beatles|Apple 与 U2 合作发布 Songs of Innocence，向超过五亿 iTunes 用户提供这张专辑。
Apple 与 U2 在 2014 年合作送出的专辑叫什么？|Songs of Innocence|Abbey Road|A Night at the Opera|Random Access Memories|这次合作的专辑是 Songs of Innocence，中文常译作纯真之歌。
U2 免费专辑的大规模赠送，和哪一代 iPhone 的发布会发生在同一天？|iPhone 6|iPhone X|iPhone 12|初代 iPhone|2014 年 9 月 9 日，iPhone 6 系列与初代 Apple Watch 亮相，U2 也参加了同一场活动。
在免费专辑之前，Apple 还曾和 U2 合作做过哪种硬件？|特别版 iPod|特别版 AirTag|特别版 Vision Pro|特别版 HomePod mini|Apple 与 U2 的合作包含 iPod U2 Special Edition，时间早于 2014 年的专辑合作。
`);
add('antenna','iphone','stories','antenna-letter',`
iPhone 4 信号争议期间，Apple 在 2010 年 7 月 2 日的信里承认了哪件事？|信号格数的计算显示存在问题|手机从未装过天线|所有手机都只能使用 Wi-Fi|电池其实不能充电|这封信承认了显示信号强度的方法有误。这是当时的官方说明，不能据此概括整个天线争议的全部原因。
2010 年 Apple 为信号格数问题写信时，处在舆论中心的是哪款手机？|iPhone 4|iPhone 8|iPhone 13|iPhone 15|这封信的标题直接写明 iPhone 4，属于那代产品的历史争议。
按 Apple 当时的信，某些地方显示四五格信号，实际可能怎样？|真实信号比显示的更弱|必定是满速 5G|说明没有装 SIM 卡|说明屏幕亮度太高|官方信件解释，错误的算法可能把较弱信号显示成四或五格。
`);
add('keyboard','mac','stories','butterfly-service',`
Apple 曾为部分 MacBook 键盘推出专项服务计划，覆盖哪种现象？|字符意外重复或按键无响应|屏幕自动折叠|鼠标变成扬声器|充电口长出网线|键盘服务计划列出的症状包括字符意外重复、字符不出现，以及按键发粘或响应不一致。
遇到受服务计划覆盖的 MacBook 键盘问题，当年的计划提供哪种处理？|符合条件时免费检修|必须购买一台 iPad|只赠送壁纸|关闭键盘就算修好|该计划为符合条件的键盘问题提供免费服务。这里问的是当年的计划内容，并不表示今天仍可申请。
键盘服务计划当时的覆盖时间，主要从哪个节点起算？|设备首次零售之日|用户第一次打开浏览器|每次升级 macOS 之日|每次换壁纸之日|计划按设备首次零售后的四年计算覆盖期，并不延长整机的标准保修。
`);
add('x','iphone','stories','airpower',`
2017 年和 iPhone X 一起被预告、计划同时给三类设备充电的配件叫什么？|AirPower|AirPort Express|AirPrint|AirPlay|Apple 在 iPhone X 的发布资料里预告了 AirPower，设想让 iPhone、Apple Watch 和 AirPods 同时充电。
翻看 2017 年 iPhone X 的新闻稿，AirPower 当时写的是预计哪年到来？|2018 年|2008 年|2012 年|2022 年|当年的新闻稿写着 2018 年推出，这是发布时的计划，不能当成实际上市记录。
AirPower 当年的设想，主要想减少哪种麻烦？|同一块垫子上为多类设备摆放充电|给每个按键单独充电|用光盘安装音乐|给手机安装机械硬盘|它被预告为一块具有较大有效区域、能同时给三类设备无线充电的充电垫。
iPhone X 名字里的 X，官方发布语境对应哪个数字？|10|字母表第 24 位的意思|5|20|iPhone X 在 iPhone 十周年之际发布，X 以罗马数字 ten 的方式使用。
iPhone X 与 iPhone 8 系列，发布时间是什么关系？|在同一年的同一场发布会亮相|相隔十年|iPhone 8 晚了三年|iPhone X 早了五年|两条产品线都在 2017 年 9 月 12 日的发布活动中亮相，上市日期则有所不同。
`);
add('ipad','ipad','stories','ipad-original',`
第一代 iPad 刚发布时，想用它拍照片，会遇到什么情况？|机身没有摄像头|只有三颗后置镜头|必须先展开键盘摄像头|只有激光雷达能拍照|2010 年的第一代 iPad 没有前后摄像头，iPad 2 才加入摄像头。
第一代 iPad 用的芯片，叫什么？|A4|M1|A17 Pro|S9|A4 随第一代 iPad 在 2010 年亮相，远早于 M 系列 Mac 芯片。
第一代 iPad 发布时，有没有 Apple Pencil 可选？|没有，Apple Pencil 后来才出现|有，而且就是 Pencil Pro|有两支随机附送|只在键盘里藏了一支|iPad 诞生于 2010 年，第一代 Apple Pencil 与 iPad Pro 在 2015 年推出。
第一代 iPad 连接充电线，机身使用哪种接口？|30 针 Dock 接口|Lightning|USB-C|Micro-USB|第一代 iPad 使用 30 针接口，Lightning 随后才进入 iPad 家族。
`);
add('ipad2','ipad','stories','ipad-two',`
哪一代 iPad 让前置和后置摄像头一起加入了产品线？|iPad 2|第一代 iPad|iPad Air 2|iPad mini 4|2011 年的 iPad 2 加入了前后摄像头，也带来了 FaceTime 视频通话。
Smart Cover 最初与哪一代 iPad 一起登场？|iPad 2|iPad Pro M4|第一代 iPad mini|iPad Air M2|Smart Cover 于 2011 年随 iPad 2 推出，通过磁力连接并可折叠支撑。
早年的 Smart Cover，最经典的唤醒方式是什么？|翻开盖子唤醒，合上进入睡眠|对着盖子喊 Siri|把盖子插入耳机孔|给盖子单独充电|Smart Cover 的磁性设计可配合设备的开合检测，实现自动唤醒和睡眠。
`);
add('ipad3','ipad','stories','ipad-three',`
2012 年 3 月登场的第三代 iPad，最出名的屏幕升级是什么？|Retina 显示屏|黑白电子墨水|可卷曲屏幕|裸眼三维投影|第三代 iPad 首次把 Retina 显示屏带入 iPad 产品线。
第三代 iPad 和第四代 iPad 的首次发布年份，是什么关系？|同为 2012 年|相隔三年|相隔五年|第四代更早两年|第三代在 2012 年 3 月亮相，第四代在同年 10 月发布，更新间隔很短。
`);
add('mini','ipad','stories','ipad-mini-original',`
第一代 iPad mini 亮相时，标准 iPad 家族也发生了什么？|第四代 iPad 同场发布|第一代 iPad 才刚诞生|Apple 停掉全部大屏 iPad|iPad 全面改成折叠屏|2012 年 10 月的发布活动同时介绍了 iPad mini 和第四代 iPad。
初代 iPad mini 的屏幕分辨率，和哪两款老 iPad 相同？|初代 iPad 与 iPad 2|iPad Pro M4 两种尺寸|所有 Retina iPad|第三代与第四代 iPad|初代 mini 使用 1024×768 像素，与初代 iPad 和 iPad 2 相同，屏幕尺寸更小。
第一代 iPad mini 到来时，机身接口已经是哪一种？|Lightning|USB-C|30 针 Dock|Micro-HDMI|iPad mini 从第一代就使用 Lightning，同场的第四代 iPad 也换上了这个接口。
`);
add('air','ipad','stories','ipad-air-original',`
iPad Air 这个名字，最初主要想突出什么？|更薄更轻的机身|必须用空气充电|内置风扇数量更多|只能在飞机上用|2013 年的 iPad Air 以显著变薄变轻为主打，Air 并不代表空气充电。
第一代 iPad Air，与哪一代 iPhone 共享 A7 时代？|iPhone 5s|iPhone 3G|iPhone 11|iPhone 15 Pro|2013 年的 iPad Air 和 iPhone 5s 都采用 A7，64 位芯片开始进入移动设备。
`);
add('pencilusb','ipad','surprise','pencil-usbc',`
Apple Pencil（USB-C）能画画，但缺少哪种容易想当然的能力？|压感|倾斜感应|像素级精度|低延迟书写|USB-C 型号支持倾斜感应、精确书写与低延迟，但不支持压感。
把 Apple Pencil（USB-C）吸在兼容 iPad 的侧边，主要能做什么？|收纳笔身|自动无线充电|自动装入墨水|让屏幕变成 OLED|USB-C 型号的磁吸用于收纳，充电仍通过 USB-C 线缆完成。
Apple Pencil（USB-C）的充电接口，藏在哪里？|滑动笔帽下方|笔尖内部|笔身正中间的圆孔|磁吸边缘的金属触点|滑动式笔帽下面藏着 USB-C 接口，用于配对和充电。
`);
add('m4ipad','ipad','surprise','ipad-m4',`
M4 首次来到大众面前时，最先搭载它的是哪类产品？|iPad Pro|MacBook Air|Mac mini|Apple TV|M4 在 2024 年 5 月随 iPad Pro 首发，比采用 M4 的 Mac 更早。
M4 iPad Pro 的 OLED 为了提升亮度，用了什么特别结构？|双层串联 OLED|两块外置屏幕|屏幕背后装投影仪|叠加电子墨水层|Ultra Retina XDR 采用双层串联 OLED，把两层 OLED 的光线结合起来。
2024 年最薄的 M4 iPad Pro，出现在两种尺寸中的哪一个？|13 英寸版|11 英寸版|两款一样厚|两款都厚于初代 iPad|13 英寸 M4 iPad Pro 厚约 5.1 毫米，11 英寸版约 5.3 毫米。
Apple Pencil Pro 的挤压操作，主要带来什么？|呼出工具调色板|把笔芯弹射出去|给 iPad 强制关机|让笔变成激光笔|Pencil Pro 能检测手指挤压，呼出包含工具、线条和颜色选项的调色板。
Apple Pencil Pro 里的陀螺仪，可以帮助感知什么？|笔杆旋转角度|用户银行卡余额|室外空气质量|机身存储余量|侧旋功能通过感知笔杆旋转，让特定笔刷的方向随之变化。
Apple Pencil Pro 的轻微震动，主要用来做什么？|提供触觉反馈|让笔自己爬回笔盒|替代 iPad 扬声器|清理屏幕灰尘|触觉引擎可在挤压等交互时提供轻微反馈，让操作更有确认感。
`);
add('ipados','ipad','stories','ipados-name',`
iPadOS 在 2019 年首次作为独立名称登场时，版本号从哪里开始？|13|1|7|20|首个独立命名的 iPadOS 延续 iOS 的版本序列，使用 iPadOS 13。
iPadOS 刚独立命名时，Safari 针对 iPad 主打哪种浏览体验？|桌面级网页浏览|只能打开纯文字页面|只能打开手机短信|移除了网页下载|Apple 在首代 iPadOS 介绍了桌面级 Safari 浏览和下载管理等能力。
首代 iPadOS 的文件 App，终于能更直接地读取什么？|兼容的 USB 存储设备|实体音乐磁带|未插入的光盘|纸质文件的重量|iPadOS 为文件 App 加入 USB 驱动器和 SD 卡等外置存储访问支持，连接方式受设备接口影响。
`);
add('ipados18','ipad','surprise','ipad-calculator',`
iPad 直到 2024 年的哪一代系统，才迎来 Apple 自带的计算器 App？|iPadOS 18|iPadOS 3|iPadOS 10|iPadOS 13|Apple 在 iPadOS 18 把计算器带到 iPad，并加入适配 Apple Pencil 的数学笔记。
iPadOS 18 的数学笔记里，写下算式后可以怎样出结果？|手写等号后计算|必须拍照发给客服|只能按实体计算器|只能使用英文键盘|数学笔记支持手写表达式，输入等号即可获得结果，并可随表达式变化更新。
数学笔记中的变量，能做什么有意思的事？|修改变量后相关结果跟着更新|给屏幕扩容|让 Apple Pencil 长出按键|把数字永久锁住|数学笔记支持声明变量并在表达式中使用，改变变量值可以更新相关计算。
`);
add('iphone4','iphone','stories','iphone-four',`
Retina 显示屏第一次来到 iPhone 家族，伴随的是哪一代？|iPhone 4|iPhone 3G|iPhone 5c|iPhone 6s|iPhone 4 在 2010 年把 Retina 显示屏引入 iPhone。
FaceTime 刚登场时，哪一代 iPhone 带着它一起亮相？|iPhone 4|初代 iPhone|iPhone 3G|iPhone 6 Plus|iPhone 4 加入前置摄像头，FaceTime 也成为它的重要功能。
iPhone 4 的 A4 芯片，之前已经在哪类产品上亮相？|iPad|Apple Watch|HomePod|AirTag|A4 先随 2010 年的第一代 iPad 亮相，随后进入 iPhone 4。
`);
add('iphone4s','iphone','stories','iphone-four-s',`
Siri 第一次作为 iPhone 内置助手登场时，搭档是哪款手机？|iPhone 4s|iPhone 4|iPhone 5c|iPhone 6|Siri 随 2011 年的 iPhone 4s 进入 iPhone 产品线。
iPhone 4s 的外观延续了 iPhone 4，但它的新招牌功能是什么？|Siri 语音助手|灵动岛|Face ID|USB-C|iPhone 4s 的发布重点包括 Siri、A5 芯片和相机升级。
`);
add('iphone5s','iphone','stories','iphone-five-s',`
iPhone 第一次用指纹来解锁，主角是哪一款？|iPhone 5s|iPhone 5|iPhone 4s|iPhone 6s|iPhone 5s 在 2013 年推出 Touch ID，把指纹识别整合进主屏幕按钮。
iPhone 5s 的 A7 芯片，最具代表性的架构变化是什么？|64 位|首次使用真空管|改用机械计算齿轮|只能运行 8 位程序|A7 把 64 位架构带入 iPhone，属于那代产品的重要转折。
第一代 Touch ID 的指纹传感器，装在什么位置？|主屏幕按钮里|音量加键里|后置闪光灯里|耳机插孔里|iPhone 5s 把 Touch ID 集成到圆形主屏幕按钮，按键上方使用蓝宝石水晶。
`);
add('iphone6','iphone','stories','iphone-six',`
第一款名字里有 Plus 的 iPhone，属于哪一代？|iPhone 6|iPhone 4|iPhone 5|iPhone 3G|2014 年的 iPhone 6 与 iPhone 6 Plus 开始提供两个明显不同尺寸的选择。
Apple Pay 随 iPhone 6 时代亮相时，主要借助哪种近距离通信技术？|NFC|红外遥控|FM 广播|卫星电视|iPhone 6 系列加入 NFC，与安全隔区等技术配合完成 Apple Pay 支付。
`);
add('iphone6s','iphone','surprise','iphone-six-s',`
Live Photos 刚随 iPhone 6s 出现时，照片多了什么？|快门前后的短暂动态和声音|必须联网才能看|每张照片都强制变成黑白|只能拍正方形|实况照片会记录按下快门前后的片段，让静态画面多出一小段动态。
iPhone 6s 的 3D Touch，主要多识别了哪一项输入？|按压力度|手指温度|指甲颜色|用户体重|3D Touch 可感知按压力度，带来 Peek、Pop 等交互，后来 iPhone 的 Haptic Touch 采用不同方式。
玫瑰金最初进入 iPhone 主线，随哪一代一同到来？|iPhone 6s|iPhone 4|iPhone X|iPhone 12|iPhone 6s 系列在原有配色外加入玫瑰金。
`);
add('iphone7','iphone','surprise','iphone-seven',`
iPhone 7 的圆形 Home 键，看起来像按键，实际上怎样响应？|固态结构配合触觉反馈|靠机械行程上下移动|根本不能识别手指|必须用笔尖按压|iPhone 7 的固态主屏幕按钮通过 Taptic Engine 提供按压感觉。
iPhone 7 系列让一个常见老接口离开机身，它是哪一个？|3.5 毫米耳机孔|Lightning|SIM 卡槽|后置摄像头|iPhone 7 系列取消机身上的 3.5 毫米耳机孔，同时发布了 AirPods。
iPhone 7 与 iPhone 7 Plus，哪款首先带来后置双摄？|iPhone 7 Plus|只有 iPhone 7|两款都没有|两款都是三摄|iPhone 7 Plus 配备广角和长焦两颗后置相机，标准版仍为单摄。
iPhone 7 Plus 发布时大力展示的人像模式，主要想模拟什么效果？|主体清晰、背景虚化|把照片变成全景地图|让所有人都闭眼|把彩色照片强制转黑白|双摄与算法配合产生景深效果，突出主体并虚化背景。
`);
add('iphone12','iphone','surprise','iphone-twelve',`
2020 年的 iPhone 12 系列，让哪个老名字以磁吸配件的形式回归手机？|MagSafe|FireWire|iDisk|SuperDrive|MagSafe 早年用于 Mac 磁吸电源接口，2020 年以磁吸充电和配件系统进入 iPhone。
iPhone 12 mini 的 mini，主要缩小了什么？|机身与屏幕尺寸|把 iOS 换成精简版|只保留一半 App Store|取消所有摄像头|mini 提供更紧凑的机身，仍属于完整的 iPhone 产品线。
iPhone 家族首次进入 5G 时代，对应哪一代主线？|iPhone 12|iPhone X|iPhone 8|iPhone 6|2020 年 iPhone 12 系列支持 5G，具体频段和能力因地区型号而异。
`);
add('iphone14','iphone','surprise','iphone-fourteen-pro',`
灵动岛初次亮相，是哪两款 iPhone 先用上？|iPhone 14 Pro 与 Pro Max|iPhone 14 与 14 Plus|iPhone 13 与 13 mini|iPhone SE 与 iPhone 8|2022 年灵动岛先出现在 iPhone 14 Pro 系列，次年扩展到标准 iPhone 15 系列。
灵动岛有趣的地方，主要在于把什么变成了交互区域？|屏幕顶部的传感器开孔周围|机身背面的标志|底部充电接口|侧边 SIM 卡托|系统界面围绕顶部开孔展开活动提示，让硬件开孔参与交互。
常亮显示第一次来到 iPhone 主线，先出现在什么系列？|iPhone 14 Pro 系列|iPhone 7 系列|iPhone 11 标准版|iPhone 12 mini|iPhone 14 Pro 系列通过自适应刷新率等技术提供常亮显示。
`);
add('iphone15','iphone','surprise','iphone-fifteen',`
标准版 iPhone 15 在 2023 年换上哪种充电接口？|USB-C|Micro-USB|30 针 Dock|MagSafe 1|iPhone 15 系列换用 USB-C，告别此前使用多年的 Lightning。
标准版 iPhone 15 的线插头虽然变成 USB-C，数据速度属于哪种级别？|USB 2|Thunderbolt 5|USB4 80Gb/s|只有充电没有数据|接口形状和数据协议需要分开看，标准 iPhone 15 的有线数据速率仍为 USB 2 级别。
标准版 iPhone 15 的灵动岛，和前一代标准 iPhone 14 相比怎样？|从没有变为有|从有变为没有|两代都没有|两代都在背面|灵动岛在 iPhone 14 世代限于 Pro，到了 iPhone 15 才进入标准版。
`);
add('iphone15pro','iphone','surprise','iphone-fifteen-pro',`
iPhone 15 Pro 把左侧的静音拨片换成了什么？|操作按钮|Digital Crown|Touch Bar|Apple Pencil 接口|操作按钮取代传统响铃静音开关，并可自定义多种功能。
iPhone 15 Pro 的外侧边框，主打哪种金属？|钛金属|纯金|铜|铅|iPhone 15 Pro 使用钛金属设计，内部结构仍包含其他材料。
iPhone 15 Pro Max 首次引入的 5 倍长焦，内部用了哪种光路设计？|四重反射棱镜|旋转唱片|真空电子管|液晶投影灯|四重反射棱镜让光线在内部折返，以有限空间实现更长焦距。
`);
add('airpods','audio','surprise','airpods-first',`
第一代 AirPods 刚发布时，两只耳机之间有线吗？|没有，左右耳独立|有一根绕颈连接线|只有左耳能出声|必须接到 Lightning|2016 年的 AirPods 采用左右耳独立的无线设计，配合充电盒使用。
初代 AirPods 耳机放回盒子里，盒子还承担哪项任务？|为耳机补充电量|给手机增加内存|把音乐存成光盘|为 iPad 增加 SIM 卡|AirPods 充电盒既便于收纳，也能给耳机充电。
第一代 AirPods 发布时使用的无线芯片，叫什么？|W1|M1 Ultra|A17 Pro|S10|W1 芯片是第一代 AirPods 无线体验的重要组成。
`);
add('airpodspro','audio','surprise','airpods-pro',`
AirPods Pro 的通透模式，想解决哪种日常场景？|听音乐时仍能听见周围环境|让耳机变透明|让手机屏幕穿透墙壁|把音量自动调成最大|通透模式利用麦克风让外界声音进入耳中，方便感知周围。
AirPods Pro 相比初代 AirPods，外观上多了什么关键部件？|可更换硅胶耳塞|外露天线杆|绕颈线圈|实体磁带仓|AirPods Pro 采用入耳式硅胶耳塞，并提供不同尺寸。
AirPods Pro 的耳塞贴合度测试，主要关心什么？|耳塞是否形成合适的声学密封|用户的听歌品味|头发长度|手机壁纸颜色|系统会帮助判断耳塞与耳道是否贴合，影响低频和降噪体验。
`);
add('airpodsmax','audio','surprise','airpods-max',`
AirPods Max 没有采用普通的滑动音量条，转动哪个部件能调音量？|Digital Crown|SIM 卡托|Lightning 插头|降噪麦克风|AirPods Max 使用类似 Apple Watch 的数码旋钮来调节音量和控制播放。
AirPods Max 属于哪一种耳机形态？|头戴包耳式|骨传导夹耳式|传统有线耳塞|挂颈式单耳麦克风|Max 把 AirPods 体验扩展到头戴包耳式耳机。
AirPods Max 放进 Smart Case 时，主要发生什么？|进入超低功耗状态|立即为耳机无线充电|自动转换音频格式|把耳机拆成两半|Smart Case 帮助耳机进入超低功耗状态，它本身并非给耳机充电的电池盒。
`);
add('homepod','audio','stories','homepod-original',`
第一代 HomePod 内部用了哪颗你可能在 iPhone 历史里见过的芯片？|A8|M4 Max|A17 Pro|W2|第一代 HomePod 使用 A8 芯片进行音频处理和 Siri 等工作。
第一代 HomePod 在摆放后，会用什么方式适应房间？|分析房间声学并调节声音|伸出机械尺量房间|要求用户输入墙壁重量|只能放在完全吸音房|HomePod 利用麦克风和计算音频感知空间并优化声音表现。
`);
add('homepodmini','audio','surprise','homepod-mini',`
两台兼容的 HomePod mini 放在同一房间，可以组合成什么？|立体声扬声器对|一台打印机|一个有线键盘|一个双卡手机|两台 HomePod mini 可组成左右声道的立体声扬声器对。
HomePod mini 里的对讲广播功能，主要用来做什么？|向家中设备发送语音消息|监听未授权的电话|给扬声器安装 SIM 卡|传输显卡驱动|Intercom 可让家人在 HomePod 和兼容 Apple 设备间发送语音广播。
`);
add('airtag','ecosystem','surprise','airtag',`
AirTag 想帮你找到钥匙，它本身有 GPS 芯片吗？|没有内置 GPS|有独立卫星电话|必须每月买流量|只有接上充电器才定位|AirTag 通过蓝牙与查找网络协作，定位机制与自带 GPS 的设备不同。
AirTag 电量耗尽后，官方设计允许你怎样处理？|更换 CR2032 纽扣电池|插上 Lightning 线|使用 MagSafe 充电|整只必须扔掉|AirTag 使用可由用户更换的 CR2032 电池，部分带苦味涂层的电池可能不兼容。
AirTag 的精确查找，在支持的 iPhone 上主要借助什么技术？|超宽带 UWB|FM 广播|红外电视遥控|机械罗盘连线|AirTag 的 U1 芯片与支持的 iPhone 配合，以 UWB 提供距离和方向信息。
`);
add('watch','watch','stories','watch-first',`
Apple Watch 第一次公开亮相和正式开售，是同一年吗？|亮相于 2014 年，开售于 2015 年|都在 2007 年|都在 2010 年|亮相于 2018 年，开售于 2017 年|Apple 在 2014 年 9 月展示 Apple Watch，产品于 2015 年 4 月开始销售。
Apple Watch 的 Digital Crown，最早让人联想到哪种传统部件？|手表表冠|相机镜头盖|汽车方向盘|耳机插孔|它把传统表冠转化为数字输入部件，用来滚动、缩放和按压操作。
Apple Watch 上的三个活动圆环，关注哪三件事？|活动、锻炼、站立|电话、短信、相机|下载、上传、存储|经度、纬度、海拔|活动记录以活动、锻炼和站立三环展示日常活动完成情况。
`);
add('watchgold','watch','stories','watch-gold',`
初代 Apple Watch Edition 的昂贵表壳，使用了什么材料？|18K 金|纯塑料|钛陶瓷混合泡沫|透明玻璃|最初的 Edition 使用 18K 金表壳，属于那代产品的奢侈品尝试。
初代黄金 Apple Watch Edition 在美国的起售价，进入了哪个区间？|一万美元|一百美元|九百美元|九十九万美元|Apple Watch Edition 在 2015 年美国起售价为 10000 美元，与普通型号定位差异很大。
`);
add('watchs5','watch','surprise','watch-five',`
哪一代 Apple Watch 首次把常亮显示带到常规 Series 产品线上？|Series 5|Series 1|Series 2|Series 3|2019 年的 Series 5 配备常亮 Retina 显示屏，低功耗状态下仍显示时间等内容。
Apple Watch Series 5 除了常亮屏，还首次在表上加入哪种方向工具？|指南针|机械水平仪|纸质地图仓|潜望镜|Series 5 加入内置指南针，支持方向、坡度等信息显示。
`);
add('ultra','watch','surprise','watch-ultra',`
Apple Watch Ultra 上醒目的额外按钮，最初是什么颜色？|橙色|纯黑|荧光紫|透明|第一代 Ultra 的操作按钮使用国际橙，便于识别和操作。
Apple Watch Ultra 的警笛功能，主要用来做什么？|发出声音帮助引起注意|替代水下声呐|通过声音给手表充电|屏蔽所有手机信号|内置警笛在特定场景发出明显声音，帮助引起附近人员注意。
`);
add('macair','mac','stories','macbook-air-first',`
2008 年的第一代 MacBook Air，乔布斯从什么东西里把它拿出来？|牛皮纸信封|行李箱里的冰箱|玻璃水杯|普通眼镜盒|那次演示用牛皮纸信封强调机身的纤薄，成为经典发布会画面。
第一代 MacBook Air 没有内置光驱，Apple 当时提供什么思路读取光盘？|通过其他电脑共享光驱|把光盘塞入 USB 口|用摄像头拍光盘表面|把光盘切成四块|Remote Disc 让 MacBook Air 通过网络借用兼容 Mac 或 PC 的光驱。
`);
add('mac2015','mac','stories','macbook-2015',`
2015 年的 12 英寸 MacBook，把主要外设和充电连接集中到哪个接口？|一个 USB-C 接口|六个雷雳 5 接口|三个 Lightning 接口|一个 30 针 Dock 接口|这款 MacBook 用单个 USB-C 承担充电与主要外设连接，耳机孔另行保留。
2015 年 12 英寸 MacBook 为了薄，采用哪种散热设计？|无风扇|外置水冷泵|双涡轮风扇|机盖外置散热烟囱|它采用无风扇设计，强调静音和紧凑机身。
2015 年 12 英寸 MacBook 的新键盘机制，名字和哪种昆虫有关？|蝴蝶|蜻蜓|蚂蚁|蟋蟀|Apple 为这款产品介绍了蝶式键盘机制，后来部分采用该机制的机型进入专项服务计划。
2015 年 MacBook 的 Force Touch 触控板，点击感来自哪里？|压力感应配合触觉反馈|触控板下方长行程开关|屏幕扬声器播放鼠标声|整个机身上下跳动|Force Touch 触控板检测压力，并通过触觉反馈模拟点击感觉。
`);
add('mbp2016','mac','stories','touchbar',`
2016 年部分 MacBook Pro 用一条触控屏替换了哪一区域？|传统功能键区域|整个键盘|整个主显示屏|触控板|Touch Bar 位于键盘上方，提供可随应用变化的控制项。
Touch Bar 里的按钮为什么会跟着 App 改变？|它是一块可显示动态控件的触控屏|每个按键都有微型打印机|它其实是镜面反射|用户必须每次手工贴纸|Touch Bar 可由系统和应用显示不同控制项，因此内容并非固定实体按键。
`);
add('mbp2021','mac','stories','mbp-ports-return',`
2021 年 14 和 16 英寸 MacBook Pro，让哪些熟悉接口重新回到机身？|HDMI、SDXC 卡槽和 MagSafe|Lightning、VGA 和 PS/2|30 针 Dock 与串口|只有 Micro-USB|这一代重新加入 HDMI、SDXC 卡槽和 MagSafe 3，改变了此前高度依赖 USB-C 的布局。
2021 年重新设计的 MacBook Pro，功能键区域发生了什么？|用实体功能键替代 Touch Bar|改成第二块触控板|彻底取消键盘|改为手写纸条输入|14 和 16 英寸新设计使用完整高度实体功能键，取代 Touch Bar。
`);
add('mini2024','mac','surprise','mac-mini-2024',`
2024 年缩小后的 Mac mini，电源按钮藏在哪个位置？|机身底部|键盘的空格键里|显示器顶部|电源线插头外侧|重新设计的 Mac mini 把电源按钮放在机身底部，是很容易让人找一圈的细节。
2024 年小巧的 Mac mini，是不是必须买 Pro 版才有前置 USB-C？|两种芯片版本都有前置 USB-C|只有 Pro 版有|两版都只有 Lightning|只有旧 Intel 版有|M4 与 M4 Pro Mac mini 都提供前置 USB-C 接口，后部接口能力则有区别。
`);
add('m1','silicon','surprise','m1',`
第一批搭载 M1 的 Mac 中，哪款笔记本没有风扇？|MacBook Air|13 英寸 MacBook Pro|两款都装了三风扇|两款都只靠水冷|2020 年 M1 MacBook Air 采用无风扇设计，13 英寸 MacBook Pro 保留主动散热。
M1 把 CPU、GPU 等多个部分放在一起，属于什么设计？|片上系统 SoC|一张外接独立显卡|机械硬盘控制面板|云端虚拟处理器|M1 是片上系统，整合多种计算与控制单元。
`);
add('intel','history','stories','mac-intel',`
2005 年 Apple 宣布 Mac 处理器转型，目标是哪家公司？|Intel|NVIDIA|高通|AMD|Apple 在 2005 年公布从 PowerPC 转向 Intel 的计划，首批 Intel Mac 于 2006 年登场。
Mac 转向 Intel 之前，主线使用的处理器架构是什么？|PowerPC|MIPS 家族独占|RISC-V|只使用 ARM|2005 年的转型从 PowerPC 出发，随后持续到 Apple 芯片时代。
`);
add('silicon','history','stories','mac-transition',`
2020 年 Apple 宣布 Mac 转向自家芯片，发布时给出的过渡预期约多久？|两年|两周|二十年|当天全部完成|Apple 在 2020 年宣布预计用约两年推进过渡。这是当时预期，实际产品节奏需要另行核对。
Mac 转向 Apple 芯片时，用来帮助运行许多 Intel App 的技术叫什么？|Rosetta 2|AirDrop 2|Time Capsule 2|FaceTime 2|Rosetta 2 为许多为 Intel Mac 编译的应用提供转换兼容能力。
`);
add('studio','mac','surprise','studio-display',`
Studio Display 虽然是一台显示器，里面却放了哪颗 iPhone 时代的芯片？|A13 Bionic|M1 Ultra|A4|W1|2022 年的 Studio Display 内置 A13 Bionic，支持相机与音频等智能功能。
Studio Display 的人物居中功能，主要想让谁保持在画面里？|视频通话中的人物|桌面上的文件夹|鼠标指针|电源线|人物居中利用相机和计算处理，在视频通话中自动调整取景。
`);
add('ipodbye','history','stories','ipod-end',`
2022 年 Apple 宣布 iPod 走到产品线尾声，当时剩下的最后一条 iPod 线是什么？|iPod touch|iPod mini|iPod Hi-Fi|iPod photo|Apple 在 2022 年说明 iPod touch 售完即止，音乐体验转移到更多 Apple 设备上。
最后一代 iPod touch，外形最容易被误认为哪种设备？|没有蜂窝电话功能的 iPhone|圆形 Apple Watch|夹式 AirTag|折叠 MacBook|iPod touch 采用触屏手持设计，支持 App，却没有 iPhone 的蜂窝电话能力。
`);
add('vision','ecosystem','surprise','vision-pro',`
Vision Pro 的 EyeSight，主要想让外面的人看到什么？|佩戴者眼睛的视觉呈现|佩戴者所有密码|头显的完整桌面录像|手机的实时短信|EyeSight 通过外部显示呈现眼部相关视觉状态，帮助身边的人理解互动状态。
首代 Vision Pro 的电池，采用什么布局？|通过线缆连接的外置电池|两节 AA 装进镜片|只靠太阳能供电|电池完全藏在表带|首代 Vision Pro 连接独立外置电池，也可在接电时持续使用。
Vision Pro 的主要输入方式，发布时强调哪三种？|眼睛、手势和声音|键盘、鼠标和触控笔缺一不可|方向盘、踏板和拉杆|只能使用游戏手柄|Apple 把眼睛、手势和声音作为空间计算的重要交互方式。
`);
// One feature fact per row; the alternatives are releases, not device specifications.
export const iosFeatures = [
 [2,'App Store 第一次进入 iPhone 系统','下载第三方原生 App 的官方商店，随 iPhone OS 2 在 2008 年开启。'],
 [2,'iPhone 系统第一次加入 Microsoft Exchange ActiveSync','iPhone OS 2 带来企业邮件、日历和联系人同步能力。'],
 [3,'iPhone 系统第一次原生支持剪切、复制和粘贴','2009 年的 iPhone OS 3 补上了被用户期待很久的基础编辑操作。'],
 [3,'Spotlight 全局搜索第一次来到 iPhone','iPhone OS 3 把联系人、邮件等内容的统一搜索带到主屏幕。'],
 [3,'系统首次为第三方 App 提供推送通知服务','iPhone OS 3 让 App 可以借助推送服务提示消息，不用一直在前台运行。'],
 [3,'iPhone 系统第一次加入横向键盘到邮件、信息和备忘录等更多应用','iPhone OS 3 扩大横向键盘的可用范围，Safari 之前已有横向输入。'],
 [4,'iPhone 系统正式把名字从 iPhone OS 改成 iOS','2010 年的第 4 代系统采用 iOS 这个名字。'],
 [4,'iPhone 主屏幕第一次支持用文件夹整理 App','iOS 4 加入文件夹，把一堆 App 收进同一个入口。'],
 [4,'iPhone 首次获得系统级多任务 API 和快速 App 切换','iOS 4 带来多任务支持，最初有设备兼容范围和后台任务限制。'],
 [4,'iPhone 首次支持更换主屏幕壁纸','iOS 4 在兼容机型上支持主屏幕壁纸，此前用户主要能改锁屏壁纸。'],
 [5,'iMessage 第一次在 iPhone 系统里登场','iOS 5 的 iMessage 通过网络在 Apple 设备之间发送信息。'],
 [5,'通知中心第一次来到 iPhone','iOS 5 把通知集中到可下拉查看的通知中心。'],
 [5,'iCloud 随哪一代 iPhone 系统首次正式到来','iCloud 在 2011 年与 iOS 5 同步进入用户生活，自动同步多类内容。'],
 [5,'iPhone 开始支持不连接电脑完成系统设置与无线更新','iOS 5 的 PC Free 让设置和软件更新进一步摆脱电脑连接。'],
 [5,'提醒事项作为内置 App 第一次来到 iPhone','iOS 5 引入提醒事项，可设置时间和位置提醒。'],
 [5,'系统相机第一次支持用音量加键拍照','iOS 5 的相机功能加入音量加键快门，让横握拍照更自然。'],
 [6,'Passbook 第一次在 iPhone 系统里亮相','iOS 6 的 Passbook 收纳登机牌、票券等内容，后来发展为钱包。'],
 [6,'Apple 自家重做的地图服务第一次随 iPhone 系统亮相','iOS 6 在 2012 年带来 Apple 自家地图，替代此前的地图数据方案。'],
 [6,'勿扰模式第一次来到 iPhone 系统','iOS 6 引入勿扰功能，帮助控制来电和通知打扰。'],
 [6,'共享照片流第一次在 iPhone 系统里推出','iOS 6 加入共享照片流，让选中的照片可与他人分享。'],
 [7,'控制中心第一次来到 iPhone','iOS 7 引入控制中心，用一个入口集中常用开关和工具。'],
 [7,'iPhone 系统迎来标志性的扁平化界面大改版','2013 年的 iOS 7 大幅重绘系统界面，改变了此前的拟物风格。'],
 [7,'AirDrop 第一次来到 iPhone 系统','AirDrop 在 Mac 上出现得更早，iOS 7 把它带入兼容 iPhone 和 iPad。'],
 [7,'FaceTime 首次在 iPhone 上支持纯音频通话','iOS 7 引入 FaceTime Audio，不开摄像头也能进行网络语音通话。'],
 [7,'查找 iPhone 首次加入激活锁','iOS 7 的激活锁让关闭查找、抹除或重新激活受到账号验证保护。'],
 [7,'App Store 首次支持在后台自动更新 App','iOS 7 为 App Store 加入自动更新能力，减少手动点更新的次数。'],
 [8,'健康 App 第一次在 iPhone 上登场','iOS 8 把健康 App 带到 iPhone，集中展示健康和健身数据。'],
 [8,'家人共享第一次作为系统功能推出','iOS 8 介绍家人共享，帮助家庭成员分享符合条件的购买项目等内容。'],
 [8,'QuickType 预测输入首次随 iPhone 系统推出','iOS 8 的 QuickType 键盘可根据上下文提供预测输入。'],
 [8,'iCloud Drive 第一次随 iPhone 系统推出','iOS 8 将 iCloud Drive 作为跨设备访问文件的新能力。'],
 [8,'iPhone 开始允许安装第三方键盘扩展','iOS 8 向开发者开放键盘扩展，实际输入受系统和 App 场景限制。'],
 [8,'Handoff 接力第一次随 iPhone 系统推出','iOS 8 与 OS X Yosemite 的连续互通，让部分任务在设备之间接着做。'],
 [9,'低电量模式第一次来到 iPhone','iOS 9 加入低电量模式，通过减少部分后台活动等方式延长续航。'],
 [9,'备忘录首次支持清单、涂鸦和照片等更丰富内容','iOS 9 大幅升级备忘录，加入清单、绘图等内容工具。'],
 [9,'地图首次加入受支持城市的公共交通路线','iOS 9 地图加入 Transit，首发支持的城市和地区有限。'],
 [9,'兼容 iPad 首次获得 Split View 分屏多任务','iOS 9 让部分 iPad 支持分屏，同时操作两个应用。'],
 [9,'兼容 iPad 首次获得系统级画中画视频','iOS 9 的 iPad 多任务包括画中画，iPhone 的系统级画中画则更晚到来。'],
 [10,'家庭 App 第一次作为内置应用亮相','iOS 10 的家庭 App 集中管理兼容 HomeKit 配件。'],
 [10,'照片 App 首次加入回忆功能','iOS 10 的回忆把相关照片和视频组织成可回顾的内容。'],
 [10,'信息 App 首次支持满屏特效和气泡特效','iOS 10 给信息带来气泡、全屏动画等更丰富的表达方式。'],
 [10,'Siri 首次通过 SiriKit 向特定类型第三方 App 开放','iOS 10 引入 SiriKit，最初支持的应用类型受到范围限制。'],
 [10,'抬起唤醒首次进入兼容 iPhone 的系统功能','iOS 10 在兼容机型上支持抬起查看锁屏，不用先按按钮。'],
 [11,'文件 App 第一次随 iPhone 和 iPad 系统出现','iOS 11 引入文件 App，把本机、iCloud Drive 和兼容服务的文件汇集起来。'],
 [11,'系统自带的屏幕录制功能第一次来到 iPhone','iOS 11 把录屏集成进系统，并可放进控制中心。'],
 [11,'ARKit 第一次随 iPhone 系统公开推出','iOS 11 的 ARKit 为开发者提供增强现实框架。'],
 [11,'兼容 iPhone 首次采用 HEIF 和 HEVC 来提高拍摄存储效率','iOS 11 加入高效图像和视频格式支持，具体拍摄能力取决于设备。'],
 [11,'iPad Dock 首次大幅扩展并支持从应用中呼出','iOS 11 为 iPad 带来更灵活的 Dock，配合多任务操作。'],
 [11,'备忘录首次集成扫描文稿工具','iOS 11 的备忘录可以扫描纸质文件并进行裁切调整。'],
 [12,'屏幕使用时间第一次来到 iPhone','iOS 12 引入使用统计、App 限额等屏幕使用时间功能。'],
 [12,'Memoji 拟我表情首次随系统推出','iOS 12 在兼容机型上提供可自定义的 Memoji 角色。'],
 [12,'Siri 捷径首次随系统公开推出','iOS 12 将捷径与 Siri 结合，帮助把操作串起来。'],
 [12,'通知首次在 iPhone 上按分组集中显示','iOS 12 的分组通知减少锁屏上逐条堆叠的混乱。'],
 [12,'测距仪 App 首次随 iPhone 系统推出','iOS 12 引入利用增强现实估计尺寸的测距仪 App，结果受环境影响。'],
 [13,'系统级深色模式第一次来到 iPhone','iOS 13 引入深色模式，为系统和支持的 App 提供深色外观。'],
 [13,'通过 Apple 登录首次随系统发布','iOS 13 时代的通过 Apple 登录提供面向 App 和网站的隐私友好登录方式。'],
 [13,'QuickPath 滑行键入第一次随 iPhone 系统推出','iOS 13 的键盘支持在受支持语言中滑动输入。'],
 [13,'照片编辑工具首次更完整地用于编辑视频','iOS 13 扩展视频编辑能力，支持旋转、裁剪和多种调整。'],
 [14,'主屏幕小组件第一次可放进 iPhone 的 App 图标布局','iOS 14 改变主屏幕，让不同尺寸的小组件和 App 图标一起排列。'],
 [14,'App 资源库第一次来到 iPhone','iOS 14 的 App 资源库自动整理 App，位于主屏幕页面之后。'],
 [14,'App Clips 轻 App 第一次推出','iOS 14 的轻 App 提供应用的一小部分功能，适合快速完成任务。'],
 [14,'iPhone 首次支持系统级画中画视频','iOS 14 把画中画带到 iPhone，兼容 App 和内容有具体限制。'],
 [14,'来电界面首次可用紧凑横幅呈现，减少遮住整个屏幕','iOS 14 为来电和 Siri 等交互提供更紧凑的界面。'],
 [14,'系统首次在状态栏用颜色指示相机或麦克风被访问','iOS 14 加入橙色和绿色指示点，提示麦克风或相机使用情况。'],
 [15,'实况文本第一次随 iPhone 系统推出','iOS 15 的实况文本可识别照片中的文字，需要兼容设备和受支持语言。'],
 [15,'专注模式第一次作为扩展后的场景化通知设置推出','iOS 15 的专注模式把通知控制扩展到工作、个人等场景。'],
 [15,'SharePlay 同播共享首次在这一代系统周期推出','SharePlay 属于 iOS 15 功能周期，通过后续更新到来。'],
 [15,'Safari 首次在 iPhone 上支持标签页组','iOS 15 的 Safari 加入标签页组，便于按任务收纳网页。'],
 [15,'FaceTime 首次支持创建链接邀请其他平台用户通过浏览器加入','iOS 15 扩展 FaceTime 参与方式，浏览器用户通过邀请链接加入。'],
 [16,'锁定屏幕首次支持自定义字体和添加小组件','iOS 16 大改锁屏，加入字体、颜色、小组件等个性化能力。'],
 [16,'iMessage 首次支持在时间限制内编辑已发送信息','iOS 16 增加编辑功能，支持范围和时间限制以系统版本为准。'],
 [16,'实况文本首次扩展到暂停的视频画面','iOS 16 扩展实况文本，支持从暂停的视频中识别文字。'],
 [16,'相册首次支持按住主体将其从背景中提取出来','iOS 16 的视觉查找能力扩展到提取主体，需要兼容设备。'],
 [16,'实时活动首次在这一代系统周期推出','实时活动属于 iOS 16 功能周期，具体能力通过后续版本逐步提供。'],
 [17,'待机显示首次在 iPhone 系统中推出','iOS 17 的 StandBy 在横向放置并充电等条件下显示时钟、小组件和照片。'],
 [17,'NameDrop 名片投送首次随系统推出','iOS 17 将靠近设备分享联系信息的 NameDrop 带给用户。'],
 [17,'联系人的个性化海报首次随系统推出','iOS 17 的联系人海报让来电展示更具个性。'],
 [17,'手记 App 首次在这一代系统周期推出','手记属于 iOS 17 功能周期，在 iOS 17.2 等后续版本中提供。'],
 [17,'小组件首次支持在主屏幕上直接执行更多交互操作','iOS 17 的交互式小组件可直接完成受支持的任务，例如勾选提醒事项。'],
 [17,'信息中的平安确认首次随系统推出','iOS 17 的 Check In 帮助用户在到达目的地等场景向指定联系人报平安。'],
 [18,'主屏幕首次允许自由布置 App 图标，留出中间空位','iOS 18 为主屏幕加入更自由的图标排列、深色和着色等选项。'],
 [18,'控制中心首次大幅扩展为可组织多组控制项的界面','iOS 18 大幅增强控制中心的分组和自定义能力。'],
 [18,'密码首次成为独立的系统 App','iOS 18 的密码 App 将密码、通行密钥等信息集中到独立入口。'],
 [18,'信息 App 首次加入 RCS 支持','iOS 18 加入 RCS，实际可用性取决于运营商和地区。'],
 [18,'iPhone 首次能在系统层面锁定并隐藏部分 App','iOS 18 增加锁定和隐藏 App 的能力，具体应用受规则限制。'],
 [26,'Liquid Glass 首次作为 iPhone 系统的新设计语言亮相','2025 年的 iOS 26 推出 Liquid Glass 设计语言，版本号也采用新的命名方式。'],
];
for(const [n,feature,explanation] of iosFeatures){
 const release=iosReleases.find(r=>r.id===`ios-${n}`);
 const label=x=>x<4?`iPhone OS ${x}`:`iOS ${x}`;
 const neighbors=iosReleases.filter(r=>r.id!==release.id).sort((a,b)=>Math.abs(a.year-release.year)-Math.abs(b.year-release.year)).slice(0,6).map(r=>r.model);
 rows.push({source:release.source,category:'ecosystem',topic:'surprise',family:`ios-${n}`,cells:[`${feature}，是哪一代？`,label(n),...neighbors.slice(0,3),explanation]});
}
add('touch','iphone','surprise','ios-gestures',`
iPhone 打字时，长按空格键后，键盘可以变成什么？|移动光标的触控板|计算器|全屏相机|遥控电视的红外灯|在兼容输入场景中长按空格键，可以拖动手指移动插入点，修改文字更方便。
iPhone 输入长段文字想撤销，三指向左轻扫通常能做什么？|撤销刚才的编辑|把手机恢复出厂|删除所有照片|给对方发语音|系统支持三指编辑手势，向左轻扫可撤销，具体 App 可能有自己的实现。
iPhone 的背面轻点设置，能把机身背面当成什么？|触发指定操作的输入区域|无线充电输出开关|实体键盘|测量电池重量的秤|背面轻点可在兼容 iPhone 上用轻点两下或三下触发指定操作。
iPhone 放大屏幕内容的缩放辅助功能，和相机变焦有什么关系？|它放大屏幕界面，功能不同|一定会改变相机镜头焦距|只会放大照片文件本身|必须先购买长焦镜头|辅助功能中的缩放作用于屏幕显示，帮助看清内容，与拍摄时的相机变焦属于不同功能。
iPhone 开着手电筒，想调亮度，可以在控制中心怎样做？|按住手电筒控制项后调整|按住 SIM 卡托|旋转后置镜头|反复插拔充电线|控制中心支持打开手电筒的亮度调节，界面随系统版本有所变化。
iPhone 的橙色指示点通常意味着什么？|有 App 正在使用麦克风|电池一定坏了|手机正在快充|屏幕分辨率降低了|系统用橙色指示麦克风使用，绿色通常提示相机或相机与麦克风使用。
照片 App 的隐藏相簿，主要起到什么作用？|把照片移出通常浏览位置|保证照片从所有备份永久消失|自动变成低像素|把照片发给朋友|隐藏相簿改变照片的浏览入口，不能据此推断云端或备份中的内容已被删除。
专注模式开启后，你可以怎样对待重要联系人？|允许指定联系人通知|只能屏蔽全部联系人|只能允许陌生号码|必须删除通信录|专注模式支持允许指定人员或 App 的通知，具体设置随系统版本变化。
iPhone 的声音识别辅助功能，适合帮助发现什么？|门铃等特定环境声音|别人心里在想什么|照片中的颜色温度|所有无线网络密码|声音识别可识别特定环境声音并提醒用户，不能作为高风险场景的唯一依赖。
放大器 App 的主要用途是什么？|借助相机放大现实中的内容|增加手机物理存储|给扬声器永久增压|提高蜂窝网络覆盖|放大器用相机帮助看清现实物体和文字，并提供辅助视觉工具。
语音控制辅助功能，主要用来怎样操控 iPhone？|通过语音命令操作界面|仅改变铃声音高|给 SIM 卡加密|只能发送录音|语音控制可通过命令点击、滚动和输入等，支持语言和命令依系统而定。
引导式访问可以把 iPhone 暂时限制在什么范围？|一个 App 里|一个 Wi-Fi 频段里|一张壁纸里|一个充电电压里|引导式访问帮助限制到单个 App，并能控制部分可用功能。
`);
add('guidemac','mac','surprise','mac-everyday',`
Mac 上按空格键快速看看文件内容，这项功能叫什么？|快速查看|快速格式化|快速重装|快速抹掉|快速查看可在 Finder 等场景直接预览文件，无需完整打开对应应用。
Mac 触控板的三指拖移，通常要到哪一类设置开启？|辅助功能中的指针控制相关设置|显示器分辨率设置|磁盘分区工具|Apple Music 设置|三指拖移属于触控板的辅助输入选项，设置路径随 macOS 版本变化。
Mac 上的 Time Machine，名字听起来像科幻，实际主要做什么？|备份并恢复文件|修改现实时间|让处理器降到石器时代|预测股价|Time Machine 是 macOS 的备份功能，可以恢复历史版本文件等内容。
Mac 用 AirDrop 收到文件时，通常会把文件放到哪里？|下载文件夹|回收站|只能在内存里保留|自动刻进光盘|Mac 接收的 AirDrop 文件通常保存在下载文件夹，某些内容可能进入特定应用。
在支持的 Mac 上，热角可以把屏幕角落变成什么？|触发指定操作的区域|新的摄像头|额外一块 SSD|扬声器接口|把指针移到配置好的屏幕角落，可以触发调度中心、锁屏等指定操作。
Mac 的随航功能，可以让兼容 iPad 承担什么角色？|Mac 的扩展或镜像显示屏|Mac 的外置电池|Mac 的机械风扇|替代全部内存|随航可把兼容 iPad 作为 Mac 的另一块显示屏，具体条件取决于设备和系统。
通用控制开启后，一套键鼠可以怎样工作？|跨兼容 Mac 与 iPad 控制各自系统|把 iPadOS 永久变成 macOS|让所有设备共用同一个硬盘|只能控制 Apple TV|通用控制让指针在多台兼容设备间移动，每台设备仍运行自己的系统。
通用剪贴板想帮你做到什么？|一台设备复制，另一台粘贴|给显示器增加色深|把内存容量相加|让打印机打印所有密码|通用剪贴板通过连续互通，在满足条件的 Apple 设备间传递复制内容。
Mac 的接力功能，可以把什么接着做？|兼容 App 中正在进行的任务|给主板焊接新接口|把电池电量转给别人|自动升级显卡核心|接力让兼容任务在附近的 Apple 设备间延续，需满足账户与连接等条件。
Mac 的聚焦搜索，除了找文件，还常能直接做什么？|计算和单位换算|给电脑增加内存条|修理断掉的充电线|替换硬盘磁头|聚焦支持计算、转换和搜索等功能，具体可用项目随地区与系统而异。
`);
add('guideipad','ipad','surprise','ipad-everyday',`
iPad 的侧拉功能，主要让你怎样使用应用？|在当前应用上方临时打开另一应用|把屏幕机械拉长|把 App 卸载到侧边|把 iPad 变成电话卡|侧拉是部分系统版本与设备上的多任务形式，具体可用方式取决于 iPadOS 版本。
iPad 的截屏缩略图，点开后通常可以做什么？|标记和裁剪截图|增加屏幕物理尺寸|让屏幕刷新率翻倍|给照片加入真实深度传感器|截图工具支持裁剪、绘图和文字等标记操作。
iPad 上的辅助触控，主要能提供什么？|屏幕上的辅助操作菜单|给屏幕装机械按钮|自动修复破裂玻璃|增加摄像头数量|AssistiveTouch 帮助用户以屏幕菜单等方式完成手势和按钮操作。
Apple Pencil 悬浮指向，笔尖需要先碰到屏幕吗？|支持的设备上可在接近屏幕时预览|必须先用力压下|必须把笔接到充电线|必须把屏幕关掉|在兼容 iPad 与笔的组合上，悬浮指向可在笔尖靠近时显示预览。
`);
export function buildTrivia(){return rows.map(({source,category,topic,family,cells},i)=>{const [prompt,answer,...rest]=cells,explanation=rest.pop(),rng=seeded(`trivia-${i}`);return {id:`trivia-${String(i+1).padStart(3,'0')}`,category,difficulty:topic==='stories'?'medium':'easy',prompt,answer,options:shuffle([answer,...rest],rng),explanation,sources:[S[source]||source],kind:'trivia',topic,family,tag:topic==='stories'?'苹果旧事':'有点反直觉'};});}
add('https://www.macrumors.com/2019/03/29/apple-officially-cancels-airpower/','history','stories','airpower',`
哪款 Apple 配件公开预告后，最终在 2019 年宣布取消？|AirPower|AirTag|HomePod mini|第一代 AirPods|AirPower 在正式发售前取消；资料页保存了 Apple 硬件负责人向媒体提供的声明。
`);
add('https://www.macrumors.com/2012/09/28/tim-cook-publishes-open-letter-on-maps-for-ios-6/','history','stories','maps-apology',`
2012 年库克曾写公开信道歉，还提到可暂用其他公司的同类产品，涉及哪个 App？|地图|计算器|语音备忘录|时钟|iOS 6 地图引发批评后，库克在公开信中致歉，并列出临时替代方案。资料链接保存了信件原文。
`);
add('https://support.apple.com/en-ie/102292','mac','surprise','magic-mouse',`
可充电的 Magic Mouse，充电口位于哪里？|鼠标底部|左键上方|滚轮正中|机身前端上表面|Apple 的充电说明标出了底部接口，所以接线时需要把鼠标翻过来。
可充电的 Magic Mouse 正在接线充电，能正常在桌上当鼠标使用吗？|充电时无法使用|可以，和有线鼠标完全相同|只能使用右键|只能向上滚动|Apple 的说明明确写明 Magic Mouse 在充电时不可用。
Magic Keyboard 和 Magic Trackpad 接线充电时，使用情况与 Magic Mouse 有何不同？|前两者可以边充边用|三者都不能用|只有鼠标能用|只有键盘能用|Apple 的说明区分了三类配件，键盘和触控板可在充电时使用，鼠标不行。
`);
add(iosReleases.find(r=>r.id==='ios-3').source,'history','stories','ios-3',`
2009 年升级 iPhone OS 3，iPhone 与 iPod touch 用户的官方定价有什么不同？|iPhone 免费，iPod touch 需付 9.95 美元|两者都永久免费|iPhone 收费，iPod touch 免费|两者都需 99 美元|当年的发布资料给 iPhone 用户免费升级，而 iPod touch 用户的升级价格是 9.95 美元。
剪切、复制和粘贴这类基础功能，在初代 iPhone 发布当天就齐全了吗？|后来到 iPhone OS 3 才原生加入|第一天就和今天完全一样|直到 iOS 18 才支持|只能靠实体键盘实现|Apple 在 2009 年的 iPhone OS 3 预览中把剪切、复制和粘贴列为新功能。
`);
