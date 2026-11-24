const main = (config) => {

  // ================================================================
  // FlClash / Mihomo Perfect-Rules v1.0
  //
  // Architecture:
  //
  //   Airport Subscription
  //          ↓
  //   Preserve Airport Basic Groups
  //          ↓
  //   Dynamic Region Groups
  //          ↓
  //   Perfect-Rules Service Groups
  //          ↓
  //   Remote Rule Providers
  //
  // ================================================================


  // ================================================================
  // 1. Basic configuration
  // ================================================================

  config["mixed-port"] = 7890;

  config["mode"] = "rule";

  config["unified-delay"] = true;

  config["tcp-concurrent"] = true;

  config["log-level"] = "error";

  // Disable IPv6 to prevent IPv4 / IPv6 exit mismatch.
  config["ipv6"] = false;

  config["allow-lan"] = false;

  config["find-process-mode"] = "always";

  config["keep-alive-interval"] = 30;

  config["keep-alive-idle"] = 30;

  config["disable-keep-alive"] = false;


  // ================================================================
  // 2. Profile
  // ================================================================

  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true
  };


  // ================================================================
  // 3. DNS
  // ================================================================

  config["dns"] = {

    "enable": true,

    "listen": "0.0.0.0:53",

    "prefer-h3": false,

    "ipv6": false,

    "respect-rules": true,

    "enhanced-mode": "fake-ip",

    "fake-ip-range": "198.18.0.1/16",

    "fake-ip-filter": [
      "geosite:private",
      "geosite:cn",

      "+.lan",
      "+.local",
      "+.localhost",
      "+.home.arpa",

      "time.*.com",
      "time.*.gov",
      "time.*.edu.cn",
      "time.*.apple.com",
      "ntp.*.com",
      "pool.ntp.org",

      "+.stun.*.*",
      "+.stun.*.*.*",
      "+.stun.*.*.*.*",
      "stun.*.*",
      "stun.*.*.*",

      "+.push.apple.com",

      "mesu.apple.com",
      "swscan.apple.com",

      "captive.apple.com",

      "connectivitycheck.gstatic.com",

      "connectivitycheck.android.com",

      "*.msftconnecttest.com",

      "*.msftncsi.com",

      "localhost.ptlogin2.qq.com",

      "localhost.sec.qq.com"
    ],

    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "nameserver-policy": {

      "geosite:geolocation-!cn": [
        "https://cloudflare-dns.com/dns-query",
        "https://dns.google/dns-query"
      ]

    },

    "proxy-server-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "direct-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    "direct-nameserver-follow-policy": true,

    "fallback": [
      "https://cloudflare-dns.com/dns-query",
      "https://dns.google/dns-query"
    ],

    "fallback-filter": {

      "geoip": true,

      "geoip-code": "CN",

      "ipcidr": [
        "240.0.0.0/4",
        "0.0.0.0/32"
      ],

      "geosite": [
        "gfw"
      ],

      "domain": [
        "+.google.com",
        "+.googleapis.com",
        "+.googlevideo.com",
        "+.youtube.com",
        "+.github.com",
        "+.openai.com",
        "+.chatgpt.com",
        "+.anthropic.com",
        "+.claude.ai",
        "+.x.com",
        "+.twitter.com",
        "+.twimg.com",
        "+.t.co",
        "+.reddit.com",
        "+.discord.com",
        "+.discordapp.com"
      ]

    }

  };


  // ================================================================
  // 4. TUN
  // ================================================================

  config["tun"] = {

    "enable": true,

    "device": "FlClash",

    "stack": "gvisor",

    "dns-hijack": [
      "any:53",
      "tcp://any:53"
    ],

    "auto-route": true,

    "auto-detect-interface": true,

    "strict-route": true,

    "mtu": 1280,

    // Do not set inet4-address in 172.16.0.0/12, which conflicts with
    // FlClash bypassPrivateRoute (route-exclude-address) and breaks TUN.
    "auto-redirect": false,

    "disable-icmp-forwarding": true

  };


  // ================================================================
  // 5. Sniffer
  // ================================================================

  config["sniffer"] = {

    "enable": true,

    "parse-pure-ip": true,

    "force-dns-mapping": true,

    "override-destination": true,

    "sniff": {

      "HTTP": {
        "ports": [
          80,
          "8080-8880"
        ]
      },

      "TLS": {
        "ports": [
          443,
          8443
        ]
      },

      "QUIC": {
        "ports": [
          443,
          8443
        ]
      }

    },

    "skip-domain": [
      "+.push.apple.com",
      "+.mijia.cloud"
    ]

  };


  // ================================================================
  // 6. NTP
  // ================================================================

  config["ntp"] = {

    "enable": true,

    "write-to-system": false,

    "server": "time.apple.com",

    "port": 123,

    "interval": 30

  };


  // ================================================================
  // 7. Original airport proxies
  // ================================================================

  const originalProxies = Array.isArray(config["proxies"])
    ? config["proxies"]
    : [];

  const proxyNames = [];

  originalProxies.forEach((proxy) => {

    if (proxy && proxy.name) {
      proxyNames.push(proxy.name);
    }

  });


  // ================================================================
  // 8. Original airport proxy groups
  // ================================================================

  const originalGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];


  // ================================================================
  // 9. Perfect-Rules icon CDN
  // ================================================================

  // Icons are served from this repository (clearmann/shunt-rule),
  // so custom icons work after pushing to main.
  const iconBaseURL =
    "https://cdn.jsdelivr.net/gh/clearmann/shunt-rule@main/Clash/icons/";


  const groupIcons = {

    "一键代理": "Proxy.png",

    "国内直连": "China.png",

    "AI": "AI.png",

    "YouTube": "YouTube.png",

    "Google": "Google.png",

    "GitHub": "GitHub.png",

    "网络检测": "Network-test.png",

    "广告拦截": "Advertising.png",

    "Netflix": "Netflix.png",

    "Spotify": "Spotify.png",

    "Steam": "Steam.png",

    "Telegram": "Telegram.png",

    "Twitter": "Twitter.png",

    "Reddit": "Reddit.png",

    "TikTok": "TikTok.png",

    "海外媒体": "ForeignMedia.png",

    "Apple": "Apple.png",

    "Microsoft": "Microsoft.png",

    "Crypto": "Crypto.png",

    "金融支付": "Finance.png",

    "香港": "Hong_Kong.png",

    "台湾": "Taiwan.png",

    "日本": "Japan.png",

    "新加坡": "Singapore.png",

    "韩国": "Korea.png",

    "美国": "United_States.png",

    "加拿大": "Other.png",

    "英国": "Other.png",

    "其他地区": "Other.png"

  };


  function getGroupIcon(name) {

    if (!groupIcons[name]) {
      return undefined;
    }

    return iconBaseURL + groupIcons[name];

  }


  // ================================================================
  // 10. Managed groups
  // ================================================================

  const managedGroups = {

    "一键代理": true,

    "国内直连": true,

    "AI": true,

    "YouTube": true,

    "Google": true,

    "GitHub": true,

    "网络检测": true,

    "广告拦截": true,

    "Netflix": true,

    "Spotify": true,

    "Steam": true,

    "Telegram": true,

    "Twitter": true,

    "Reddit": true,

    "TikTok": true,

    "海外媒体": true,

    "Apple": true,

    "Microsoft": true,

    "Crypto": true,

    "金融支付": true,

    "香港": true,

    "台湾": true,

    "日本": true,

    "新加坡": true,

    "韩国": true,

    "美国": true,

    "加拿大": true,

    "英国": true,

    "其他地区": true

  };


  // ================================================================
  // 11. Built-in targets
  // ================================================================

  const builtinTargets = {

    "DIRECT": true,

    "REJECT": true,

    "REJECT-DROP": true,

    "PASS": true,

    "COMPATIBLE": true,

    "GLOBAL": true

  };


  // ================================================================
  // 12. Business group detection
  // ================================================================

  function isBusinessGroupName(name) {

    if (!name) {
      return false;
    }

    const text = String(name);

    const patterns = [

      /ai/i,
      /openai/i,
      /chatgpt/i,
      /claude/i,
      /gemini/i,

      /netflix/i,
      /disney/i,
      /disney\+/i,

      /youtube/i,
      /google/i,
      /github/i,

      /spotify/i,
      /steam/i,
      /tiktok/i,
      /telegram/i,

      /binance/i,
      /币安/i,
      /crypto/i,
      /币圈/i,

      /paypal/i,
      /金融/i,
      /支付/i,

      /广告/i,

      /twitter/i,
      /推特/i,
      /x\.com/i,
      /reddit/i,
      /discord/i,
      /meta/i,
      /whatsapp/i,
      /facebook/i,
      /instagram/i,

      /流媒体/i,
      /媒体/i,
      /影音/i,
      /视频/i,

      /游戏/i,
      /游戏专用/i,

      /机场专用/i,
      /节点分流/i

    ];

    for (let i = 0; i < patterns.length; i++) {

      if (patterns[i].test(text)) {
        return true;
      }

    }

    return false;

  }


  // ================================================================
  // 13. Auto-select detection
  // ================================================================

  function isAutoSelectGroup(name) {

    if (!name) {
      return false;
    }

    return (

      /自动选择/i.test(name) ||

      /auto[\s_-]*select/i.test(name) ||

      /auto[\s_-]*test/i.test(name) ||

      /测速/i.test(name)

    );

  }


  // ================================================================
  // 14. Failover detection
  // ================================================================

  function isFailoverGroup(name) {

    if (!name) {
      return false;
    }

    return (

      /故障转移/i.test(name) ||

      /failover/i.test(name) ||

      /fallback/i.test(name)

    );

  }


  // ================================================================
  // 15. All-node detection
  // ================================================================

  function isAllNodeName(name) {

    if (!name) {
      return false;
    }

    return (

      /全部节点/i.test(name) ||

      /所有节点/i.test(name) ||

      /全部/i.test(name) ||

      /all[\s_-]*nodes?/i.test(name) ||

      /all[\s_-]*proxies?/i.test(name)

    );

  }


  function getProxyComposition(group) {

    const result = {

      total: 0,

      actualNodes: 0,

      groups: 0,

      builtin: 0,

      unknown: 0

    };


    if (
      !group ||
      !Array.isArray(group.proxies)
    ) {

      return result;

    }


    result.total = group.proxies.length;


    group.proxies.forEach((item) => {

      if (!item) {
        return;
      }


      // Actual proxy node

      if (proxyNames.indexOf(item) !== -1) {

        result.actualNodes++;

        return;

      }


      // Built-in target

      if (builtinTargets[item]) {

        result.builtin++;

        return;

      }


      // Another proxy group

      const referencedGroup = originalGroups.some((g) => {

        return (

          g &&
          g.name === item

        );

      });


      if (referencedGroup) {

        result.groups++;

        return;

      }


      result.unknown++;

    });


    return result;

  }


  function isAllNodesGroup(group) {

    if (!group || !group.name) {
      return false;
    }

    const name = String(group.name);


    // Explicit all-node name

    if (isAllNodeName(name)) {
      return true;
    }


    // Business groups are never treated as all-node groups

    if (isBusinessGroupName(name)) {
      return false;
    }


    const composition =
      getProxyComposition(group);


    if (composition.total === 0) {
      return false;
    }


    // At least two actual nodes

    if (composition.actualNodes < 2) {
      return false;
    }


    // Actual nodes must represent a meaningful portion

    const ratio =
      composition.actualNodes /
      composition.total;


    if (ratio < 0.3) {
      return false;
    }


    // Groups containing other groups

    if (composition.groups > 0) {

      if (composition.actualNodes >= 5) {
        return true;
      }

      return false;

    }


    return true;

  }


  // ================================================================
  // 16. Preserve airport basic groups
  // ================================================================

  const preservedGroups = [];


  originalGroups.forEach((group) => {

    if (!group || !group.name) {
      return;
    }


    if (managedGroups[group.name]) {
      return;
    }


    const isBasic =

      isAutoSelectGroup(group.name) ||

      isFailoverGroup(group.name) ||

      isAllNodesGroup(group);


    if (!isBasic) {
      return;
    }


    const copied =
      JSON.parse(JSON.stringify(group));


    // Keep airport group visible.

    delete copied["hidden"];


    preservedGroups.push(copied);

  });


  // ================================================================
  // 17. Convert airport Auto-Select groups to URL-Test
  // ================================================================

  preservedGroups.forEach((group) => {

    if (!group || !group.name) {
      return;
    }


    if (!isAutoSelectGroup(group.name)) {
      return;
    }


    group.type = "url-test";

    group.proxies =
      proxyNames.slice();

    group.url =
      "https://www.gstatic.com/generate_204";

    group.interval = 300;

    group.timeout = 5000;

    group.tolerance = 50;

    group.lazy = true;

    group["max-failed-times"] = 3;

    group["expected-status"] = 204;


    delete group["disable-udp"];

    delete group["strategy"];

  });


  // ================================================================
  // 18. Remove managed groups from preserved groups
  // ================================================================

  const finalPreservedGroups = [];


  preservedGroups.forEach((group) => {

    if (

      group &&

      group.name &&

      !managedGroups[group.name]

    ) {

      finalPreservedGroups.push(group);

    }

  });


  // ================================================================
  // 19. Remote Rule Provider base URL
  // ================================================================

  // Rules are served directly from GitHub Raw to avoid jsDelivr @main CDN
  // staleness after pushing rule updates to main.
  const ruleBaseURL =
    "https://raw.githubusercontent.com/clearmann/shunt-rule/main/Clash/rules/";


  // ================================================================
  // 20. Rule Provider factory
  // ================================================================

  function createRuleProvider(filename) {

    return {

      "type": "http",

      "behavior": "classical",

      "format": "yaml",

      "url": ruleBaseURL + filename,

      "path": "./rules/" + filename,

      "interval": 86400

    };

  }


  // ================================================================
  // 21. Remote Rule Providers
  // ================================================================

  config["rule-providers"] = {

    "Direct":
      createRuleProvider("direct.yaml"),

    "Ads":
      createRuleProvider("ads.yaml"),

    "AI":
      createRuleProvider("ai.yaml"),

    "YouTube":
      createRuleProvider("youtube.yaml"),

    "Google":
      createRuleProvider("google.yaml"),

    "GitHub":
      createRuleProvider("github.yaml"),

    "Netflix":
      createRuleProvider("netflix.yaml"),

    "Spotify":
      createRuleProvider("spotify.yaml"),

    "Steam":
      createRuleProvider("steam.yaml"),

    "Telegram":
      createRuleProvider("telegram.yaml"),

    "Twitter":
      createRuleProvider("twitter.yaml"),

    "Reddit":
      createRuleProvider("reddit.yaml"),

    "TikTok":
      createRuleProvider("tiktok.yaml"),

    "GlobalMedia":
      createRuleProvider("global-media.yaml"),

    "Apple":
      createRuleProvider("apple.yaml"),

    "Microsoft":
      createRuleProvider("microsoft.yaml"),

    "Crypto":
      createRuleProvider("crypto.yaml"),

    "Finance":
      createRuleProvider("finance.yaml"),

    "NetworkTest":
      createRuleProvider("network-test.yaml")

  };


  // ================================================================
  // 22. Region detection
  // ================================================================

  const regionPatterns = {

    "香港": [

      /香港/i,
      /\bHK\b/i,
      /HKG/i,
      /Hong\s*Kong/i,
      /HongKong/i

    ],


    "台湾": [

      /台湾/i,
      /台灣/i,
      /\bTW\b/i,
      /TPE/i,
      /KHH/i,
      /TSA/i,
      /Taiwan/i,
      /Taipei/i

    ],


    "日本": [

      /日本/i,
      /\bJP\b/i,
      /NRT/i,
      /HND/i,
      /KIX/i,
      /CTS/i,
      /FUK/i,
      /Japan/i,
      /Tokyo/i,
      /Osaka/i

    ],


    "新加坡": [

      /新加坡/i,
      /\bSG\b/i,
      /SIN/i,
      /XSP/i,
      /Singapore/i

    ],


    "韩国": [

      /韩国/i,
      /韓國/i,
      /\bKR\b/i,
      /ICN/i,
      /GMP/i,
      /PUS/i,
      /Korea/i,
      /Seoul/i

    ],


    "美国": [

      /美国/i,
      /\bUS\b/i,
      /\bUSA\b/i,
      /LAX/i,
      /SFO/i,
      /JFK/i,
      /SJC/i,
      /United\s*States/i,
      /America/i,
      /Los\s*Angeles/i,
      /San\s*Jose/i,
      /New\s*York/i

    ],


    "加拿大": [

      /加拿大/i,
      /Canada/i,
      /Toronto/i,
      /Vancouver/i,
      /Montreal/i

    ],


    "英国": [

      /英国/i,
      /UK/i,
      /United\s*Kingdom/i,
      /England/i,
      /London/i,
      /Manchester/i

    ]

  };


  function detectRegion(proxyName) {

    for (const region in regionPatterns) {

      if (
        !Object.prototype.hasOwnProperty.call(
          regionPatterns,
          region
        )
      ) {
        continue;
      }


      const patterns =
        regionPatterns[region];


      for (let i = 0; i < patterns.length; i++) {

        if (patterns[i].test(proxyName)) {
          return region;
        }

      }

    }


    return "其他地区";

  }


  // ================================================================
  // 23. Build region node lists
  // ================================================================

  const regionNodes = {

    "香港": [],

    "台湾": [],

    "日本": [],

    "新加坡": [],

    "韩国": [],

    "美国": [],

    "加拿大": [],

    "英国": [],

    "其他地区": []

  };


  originalProxies.forEach((proxy) => {

    if (!proxy || !proxy.name) {
      return;
    }


    const region =
      detectRegion(String(proxy.name));


    regionNodes[region].push(
      proxy.name
    );

  });


  // ================================================================
  // 24. Region order
  // ================================================================

  const regionOrder = [

    "香港",

    "台湾",

    "日本",

    "新加坡",

    "韩国",

    "美国",

    "加拿大",

    "英国",

    "其他地区"

  ];


  // ================================================================
  // 25. Create region groups (manual select for configured regions,
  //     url-test for others)
  // ================================================================

  const manualRegions = {
    "美国": true
  };

  const regionGroups = [];


  regionOrder.forEach((region) => {

    const nodes =
      regionNodes[region];


    if (
      !nodes ||
      nodes.length === 0
    ) {
      return;
    }


    const group = manualRegions[region]
      ? {

        "name": region,

        "type": "select",

        "proxies": nodes

      }
      : {

        "name": region,

        "type": "url-test",

        "proxies": nodes,

        "url":
          "https://www.gstatic.com/generate_204",

        "interval": 300,

        "timeout": 5000,

        "tolerance": 50,

        "lazy": true,

        "max-failed-times": 3,

        "expected-status": 204

      };


    const icon =
      getGroupIcon(region);


    if (icon) {
      group["icon"] = icon;
    }


    regionGroups.push(group);

  });


  const availableRegions =
    regionGroups.map((group) => {

      return group.name;

    });


  // ================================================================
  // 26. Domestic Direct
  // ================================================================

  const domesticDirectGroup = {

    "name": "国内直连",

    "type": "select",

    "proxies": [
      "DIRECT"
    ]

  };


  const domesticIcon =
    getGroupIcon("国内直连");


  if (domesticIcon) {

    domesticDirectGroup["icon"] =
      domesticIcon;

  }


  // ================================================================
  // 27. One-click Proxy
  // ================================================================

  const mainSelector = {

    "name": "一键代理",

    "type": "select",

    "proxies":
      availableRegions.concat([
        "国内直连"
      ])

  };


  const mainIcon =
    getGroupIcon("一键代理");


  if (mainIcon) {

    mainSelector["icon"] =
      mainIcon;

  }


  // ================================================================
  // 28. Service groups
  // ================================================================

  function createBusinessGroup(name) {

    const group = {

      "name": name,

      "type": "select",

      "proxies":
        availableRegions.concat([
          "国内直连"
        ])

    };


    const icon =
      getGroupIcon(name);


    if (icon) {
      group["icon"] = icon;
    }


    return group;

  }


  const adsGroup = {

    "name": "广告拦截",

    "type": "select",

    "proxies": [
      "REJECT",
      "DIRECT"
    ]

  };


  const adsIcon =
    getGroupIcon("广告拦截");


  if (adsIcon) {
    adsGroup["icon"] = adsIcon;
  }


  const businessGroups = [

    createBusinessGroup("AI"),

    createBusinessGroup("YouTube"),

    createBusinessGroup("Google"),

    createBusinessGroup("GitHub"),

    createBusinessGroup("Netflix"),

    createBusinessGroup("Spotify"),

    createBusinessGroup("Steam"),

    createBusinessGroup("Telegram"),

    createBusinessGroup("Twitter"),

    createBusinessGroup("Reddit"),

    createBusinessGroup("TikTok"),

    createBusinessGroup("海外媒体"),

    createBusinessGroup("Apple"),

    createBusinessGroup("Microsoft"),

    createBusinessGroup("Crypto"),

    createBusinessGroup("金融支付"),

    createBusinessGroup("网络检测"),

    adsGroup

  ];


  // ================================================================
  // 29. Final proxy-group architecture
  //
  //   Airport basic groups
  //          ↓
  //   Perfect-Rules service groups
  //          ↓
  //   Perfect-Rules region groups
  //          ↓
  //   Domestic Direct
  //          ↓
  //   One-click Proxy
  //
  // ================================================================

  // Compatibility group for airport configs that reference "🚀 直连".
  const legacyDirectGroup = {

    "name": "🚀 直连",

    "type": "select",

    "proxies": [
      "DIRECT"
    ]

  };


  config["proxy-groups"] =

    finalPreservedGroups

      .concat(businessGroups)

      .concat(regionGroups)

      .concat([

        domesticDirectGroup,

        legacyDirectGroup,

        mainSelector

      ]);


  // ================================================================
  // 30. Routing rules
  //
  // Rule Provider order:
  //
  // Direct
  // NetworkTest
  // Ads
  // AI
  // YouTube
  // Google
  // GitHub
  // Netflix
  // Spotify
  // Steam
  // Telegram
  // Twitter
  // Reddit
  // TikTok
  // GlobalMedia
  // Apple
  // Microsoft
  // Crypto
  // Finance
  // Private
  // China (GEOSITE)
  // Non-China (GEOSITE)
  // China (GEOIP)
  // MATCH
  //
  // YouTube MUST be before Google.
  //
  // ================================================================

  config["rules"] = [

    // --------------------------------------------------------------
    // Private / LAN
    // --------------------------------------------------------------

    "DOMAIN-SUFFIX,lan,DIRECT",

    "DOMAIN-SUFFIX,local,DIRECT",

    "DOMAIN-SUFFIX,localhost,DIRECT",

    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",

    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",

    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",

    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",


    // --------------------------------------------------------------
    // Custom Direct
    // --------------------------------------------------------------

    "RULE-SET,Direct,国内直连",


    // --------------------------------------------------------------
    // Network Test
    // --------------------------------------------------------------

    "RULE-SET,NetworkTest,网络检测",


    // --------------------------------------------------------------
    // Ads
    // --------------------------------------------------------------

    "RULE-SET,Ads,广告拦截",


    // --------------------------------------------------------------
    // AI
    // --------------------------------------------------------------

    "RULE-SET,AI,AI",


    // --------------------------------------------------------------
    // YouTube
    // --------------------------------------------------------------

    "RULE-SET,YouTube,YouTube",


    // --------------------------------------------------------------
    // Google
    // --------------------------------------------------------------

    "RULE-SET,Google,Google",


    // --------------------------------------------------------------
    // GitHub
    // --------------------------------------------------------------

    "RULE-SET,GitHub,GitHub",


    // --------------------------------------------------------------
    // Netflix
    // --------------------------------------------------------------

    "RULE-SET,Netflix,Netflix",


    // --------------------------------------------------------------
    // Spotify
    // --------------------------------------------------------------

    "RULE-SET,Spotify,Spotify",


    // --------------------------------------------------------------
    // Steam
    // --------------------------------------------------------------

    "RULE-SET,Steam,Steam",


    // --------------------------------------------------------------
    // Telegram
    // --------------------------------------------------------------

    "RULE-SET,Telegram,Telegram",


    // --------------------------------------------------------------
    // Twitter
    // --------------------------------------------------------------

    "RULE-SET,Twitter,Twitter",


    // --------------------------------------------------------------
    // Reddit
    // --------------------------------------------------------------

    "RULE-SET,Reddit,Reddit",


    // --------------------------------------------------------------
    // TikTok
    // --------------------------------------------------------------

    "RULE-SET,TikTok,TikTok",


    // --------------------------------------------------------------
    // Global Media (Discord / Meta / Disney+ / Streaming)
    // --------------------------------------------------------------

    "RULE-SET,GlobalMedia,海外媒体",


    // --------------------------------------------------------------
    // Apple
    // --------------------------------------------------------------

    "RULE-SET,Apple,Apple",


    // --------------------------------------------------------------
    // Microsoft
    // --------------------------------------------------------------

    "RULE-SET,Microsoft,Microsoft",


    // --------------------------------------------------------------
    // Crypto (includes Binance / OKX / Bybit / Web3)
    // --------------------------------------------------------------

    "RULE-SET,Crypto,Crypto",


    // --------------------------------------------------------------
    // Finance & Payment
    // --------------------------------------------------------------

    "RULE-SET,Finance,金融支付",


    // --------------------------------------------------------------
    // Private
    // --------------------------------------------------------------

    "GEOSITE,private,国内直连",

    "GEOIP,private,国内直连,no-resolve",


    // --------------------------------------------------------------
    // China
    // --------------------------------------------------------------

    "GEOSITE,cn,国内直连",


    // --------------------------------------------------------------
    // Non-China (match known overseas domains before GEOIP DNS lookup)
    // --------------------------------------------------------------

    "GEOSITE,geolocation-!cn,一键代理",


    // --------------------------------------------------------------
    // Private IP (resolve remaining internal domains to route direct)
    // --------------------------------------------------------------

    "GEOIP,private,国内直连",


    // --------------------------------------------------------------
    // China IP (resolve remaining unknown domains to catch unlisted CN apps)
    // --------------------------------------------------------------

    "GEOIP,cn,国内直连",


    // --------------------------------------------------------------
    // Final
    // --------------------------------------------------------------

    "MATCH,一键代理"

  ];


  // ================================================================
  // 31. Return generated config
  // ================================================================

  return config;

};
