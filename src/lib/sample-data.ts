import type { KbArticle } from "@/types/kb";

const now = new Date().toISOString();

export const sampleArticles: KbArticle[] = [
  {
    id: "guest-wifi-portal",
    title: "Guest Wi-Fi login page will not load",
    category: "Wi-Fi",
    impact: "Guest cannot access internet; high visibility in lobby, rooms, and meeting spaces.",
    beginner_summary: "Start with the guest device and the nearest access point before escalating to the network team.",
    estimated_time: "5-12 min",
    equipment: ["Guest device", "Known-good test phone", "Wi-Fi controller or dashboard"],
    symptoms: ["Connected without internet", "Captive portal does not appear", "Only one room or floor affected"],
    quick_fix: "Forget the network, reconnect, then open http://neverssl.com to trigger the hotel portal.",
    steps: [
      "Ask whether this is one guest, one room, one floor, or the whole property.",
      "Test the same SSID from your own phone in the same location.",
      "Forget the Wi-Fi network on the guest device and reconnect.",
      "Open a non-HTTPS page such as http://neverssl.com to trigger the portal.",
      "Check the access point serving the area for power, uplink, and client count.",
      "If many devices fail in one zone, escalate with location and AP name."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Confirm nearby access point has power or PoE.", "Check switch port link light if accessible."]
      },
      {
        name: "Wireless layer",
        checks: ["Confirm the correct guest SSID is visible.", "Check signal strength from the affected room or area."]
      },
      {
        name: "Network layer",
        checks: ["Confirm DHCP lease is assigned.", "Check whether DNS and gateway are reachable from a test device."]
      },
      {
        name: "Application layer",
        checks: ["Trigger captive portal with a non-HTTPS page.", "Confirm guest accepts terms or voucher flow."]
      }
    ],
    navigation_steps: [
      {
        device: "iPhone guest device",
        path: "Settings > Wi-Fi > hotel SSID > Forget This Network",
        checks: ["Reconnect to the SSID.", "Open Safari and browse to http://neverssl.com."]
      },
      {
        device: "Windows test laptop",
        path: "Settings > Network & internet > Wi-Fi > Manage known networks",
        checks: ["Forget the hotel SSID.", "Reconnect and run browser test."]
      }
    ],
    commands: ["ipconfig /all", "ipconfig /flushdns", "ping 8.8.8.8", "nslookup hotel-login.example"],
    command_blocks: [
      {
        device: "Windows test laptop on guest Wi-Fi",
        purpose: "Confirm IP, gateway, DNS, and basic reachability.",
        commands: ["ipconfig /all", "ping 8.8.8.8", "nslookup example.com"]
      },
      {
        device: "Mac test laptop on guest Wi-Fi",
        purpose: "Confirm IP and default route.",
        commands: ["ifconfig en0", "netstat -rn | grep default", "scutil --dns"]
      }
    ],
    escalation_notes:
      "Escalate if one AP zone, floor, meeting room, or the full property is affected. Include SSID, area, time started, test device result, AP name if visible, and whether staff Wi-Fi also fails.",
    ticket_template:
      "Issue: Guest Wi-Fi portal not loading\nLocation: \nSSID: \nAffected scope: one guest / room / floor / property\nDevice tested: \nIP received: yes/no\nPortal trigger tried: yes/no\nAP or switch port if known: \nBusiness impact: ",
    references: [
      {
        label: "Cisco Meraki wireless client troubleshooting",
        url: "https://documentation.meraki.com/MR",
        type: "manufacturer"
      },
      {
        label: "UniFi WiFi help center",
        url: "https://help.ui.com/hc/en-us/categories/6583256751383-UniFi-WiFi",
        type: "manufacturer"
      },
      {
        label: "Video: Captive portal troubleshooting search",
        url: "https://www.youtube.com/results?search_query=guest+wifi+captive+portal+troubleshooting",
        type: "video"
      }
    ],
    tags: ["wifi", "guest", "portal", "dhcp", "dns"],
    is_favorite: true,
    created_at: now
  },
  {
    id: "front-desk-printer-offline",
    title: "Front desk printer is offline or jobs are stuck",
    category: "Printers",
    impact: "Can delay check-in, folios, registration cards, and back-office paperwork.",
    beginner_summary: "Work from the printer outward: power, paper, network, Windows queue, then driver.",
    estimated_time: "5-15 min",
    equipment: ["Printer display", "Front desk workstation", "Network cable", "Admin access if available"],
    symptoms: ["Printer shows offline", "Jobs stuck in queue", "Registration cards do not print"],
    quick_fix: "Confirm the printer is ready, clear stuck jobs, then restart the Windows Print Spooler on the workstation.",
    steps: [
      "Check printer power, paper, toner, jams, and display errors.",
      "Confirm network cable is seated and link lights are active.",
      "Print a configuration page from the printer panel if possible.",
      "On the front desk PC, clear stuck jobs from the print queue.",
      "Restart the Print Spooler service on the workstation.",
      "Print a Windows test page before asking staff to retry the PMS document."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Power light on.", "Paper loaded.", "No jam.", "Network cable seated with link light."]
      },
      {
        name: "Network layer",
        checks: ["Printer has expected IP address.", "Workstation can ping printer IP.", "No duplicate IP warning."]
      },
      {
        name: "Windows layer",
        checks: ["Correct printer selected.", "Queue is not paused.", "Use Printer Offline is unchecked."]
      },
      {
        name: "Application layer",
        checks: ["Try Windows test page.", "Then retry PMS or POS print job."]
      }
    ],
    navigation_steps: [
      {
        device: "Windows front desk PC",
        path: "Settings > Bluetooth & devices > Printers & scanners > select printer > Open print queue",
        checks: ["Cancel stuck jobs.", "Confirm queue is not paused.", "Confirm printer is not set offline."]
      },
      {
        device: "Windows front desk PC",
        path: "Services app > Print Spooler",
        checks: ["Restart the service.", "Startup type should be Automatic."]
      }
    ],
    commands: ["ping <printer-ip>", "Get-Printer", "Restart-Service Spooler"],
    command_blocks: [
      {
        device: "Windows front desk PC, PowerShell as Administrator",
        purpose: "Check printer objects and restart stuck print service.",
        commands: ["Get-Printer", "Restart-Service Spooler", "Get-PrintJob -PrinterName \"<printer-name>\""]
      },
      {
        device: "Windows front desk PC, Command Prompt",
        purpose: "Confirm the PC can reach the printer.",
        commands: ["ping <printer-ip>", "tracert <printer-ip>"]
      }
    ],
    escalation_notes:
      "Escalate if the printer has a hardware error, multiple workstations cannot print, the printer IP changed, or the queue fails again after spooler restart.",
    ticket_template:
      "Issue: Front desk printer offline\nPrinter name/model: \nPrinter IP: \nDesk/workstation: \nDisplay error: \nPing result: \nQueue cleared: yes/no\nSpooler restarted: yes/no\nTest page result: \nGuest impact: ",
    references: [
      {
        label: "Microsoft: Fix printer connection and printing problems",
        url: "https://support.microsoft.com/windows/fix-printer-connection-and-printing-problems-in-windows-f4cc3993-2d9b-4bde-9b14-d0e5de5c23d9",
        type: "manufacturer"
      },
      {
        label: "HP printer offline help",
        url: "https://support.hp.com/us-en/help/printer-offline",
        type: "manufacturer"
      },
      {
        label: "Video: Windows print spooler troubleshooting",
        url: "https://www.youtube.com/results?search_query=windows+print+spooler+restart+printer+offline",
        type: "video"
      }
    ],
    tags: ["printer", "front desk", "spooler", "queue", "windows"],
    is_favorite: true,
    created_at: now
  },
  {
    id: "pms-workstation-slow-login",
    title: "PMS workstation is slow or cannot log in",
    category: "PMS / Front Desk",
    impact: "Check-in/check-out workflow slows down and line builds at front desk.",
    beginner_summary: "Separate workstation issue from PMS outage: test network, browser/app, and another station.",
    estimated_time: "7-15 min",
    equipment: ["Affected workstation", "Known-good workstation", "PMS status page or vendor contact"],
    symptoms: ["PMS login hangs", "One PC is slow", "Staff report timeout or blank screen"],
    quick_fix: "Test another workstation first. If only one PC is affected, restart browser/app, clear cache, and verify network.",
    steps: [
      "Ask whether all stations or only one station are affected.",
      "Test the PMS from a known-good workstation.",
      "Restart the PMS app or browser on the affected station.",
      "Check that the workstation has network access and correct time.",
      "Clear browser cache only if vendor guidance allows it.",
      "Escalate quickly if multiple stations fail."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Workstation has power.", "Ethernet or Wi-Fi is connected.", "Docking station is seated if used."]
      },
      {
        name: "Network layer",
        checks: ["Can reach internet or PMS endpoint.", "DNS resolves.", "No VPN or captive portal issue."]
      },
      {
        name: "Browser or app layer",
        checks: ["Restart browser/app.", "Try private window if web PMS.", "Check pop-up blocker if reports fail."]
      },
      {
        name: "Vendor layer",
        checks: ["Check PMS vendor status.", "Collect error screenshot without guest data."]
      }
    ],
    navigation_steps: [
      {
        device: "Windows front desk PC",
        path: "Settings > Time & language > Date & time",
        checks: ["Set time automatically should be enabled.", "Timezone should match property location."]
      },
      {
        device: "Browser PMS",
        path: "Browser menu > Settings > Privacy > Clear browsing data",
        checks: ["Clear cache only if it will not remove required site settings.", "Do not save or expose passwords."]
      }
    ],
    commands: ["ping 8.8.8.8", "nslookup <pms-hostname>", "ipconfig /all"],
    command_blocks: [
      {
        device: "Windows affected PMS workstation",
        purpose: "Confirm network and name resolution.",
        commands: ["ipconfig /all", "ping 8.8.8.8", "nslookup <vendor-pms-hostname>"]
      }
    ],
    escalation_notes:
      "Escalate as urgent if more than one front desk station cannot access PMS. Do not include guest names, reservation numbers, payment data, or screenshots with personal information.",
    ticket_template:
      "Issue: PMS access slow/failing\nAffected station(s): \nOne station or all stations: \nPMS app/browser: \nError text: \nKnown-good station result: \nNetwork test result: \nTime started: \nBusiness impact: check-in / check-out / reports / night audit",
    references: [
      {
        label: "Oracle Hospitality OPERA Cloud documentation",
        url: "https://docs.oracle.com/en/industries/hospitality/opera-cloud/",
        type: "vendor"
      },
      {
        label: "Microsoft Edge clear browsing data",
        url: "https://support.microsoft.com/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4",
        type: "manufacturer"
      }
    ],
    tags: ["pms", "opera", "front desk", "browser", "login"],
    is_favorite: true,
    created_at: now
  },
  {
    id: "door-lock-keycard-fails",
    title: "Guest keycard does not open room door",
    category: "Door Locks",
    impact: "Guest cannot access room; security-sensitive and time-sensitive.",
    beginner_summary: "Do not guess. Verify key encode, door battery/reader behavior, and PMS/lock system sync.",
    estimated_time: "5-20 min",
    equipment: ["Replacement keycard", "Key encoder", "Lock programmer if authorized", "Fresh lock batteries"],
    symptoms: ["Card flashes red", "Door reader has no light", "Only one room affected", "Multiple new keys fail"],
    quick_fix: "Re-encode a fresh card, verify room and date/time, then test the lock reader lights and battery behavior.",
    steps: [
      "Confirm the room number and stay dates in the key system without repeating guest data aloud.",
      "Encode a fresh card and test it away from phones or magnets.",
      "Observe lock LED/beep behavior at the door.",
      "If no light or weak response, check battery or maintenance lock alert.",
      "If multiple doors or encoders are affected, check key encoder connection and lock system status.",
      "Escalate security-sensitive failures to manager/vendor."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Door lock reader lights or beeps.", "Handle returns normally.", "Battery is not dead."]
      },
      {
        name: "Credential layer",
        checks: ["Fresh card used.", "Correct room and dates encoded.", "Card is not stored near phone/magnet."]
      },
      {
        name: "System layer",
        checks: ["Encoder is online.", "Lock system date/time is correct.", "PMS interface is syncing if integrated."]
      },
      {
        name: "Security layer",
        checks: ["Follow property identity policy.", "Escalate repeated failures or suspicious activity."]
      }
    ],
    navigation_steps: [
      {
        device: "Key encoder workstation",
        path: "Lock system > Guest key > Room > Stay dates > Encode",
        checks: ["Confirm room number.", "Confirm checkout date.", "Use a fresh card."]
      }
    ],
    commands: [],
    command_blocks: [],
    escalation_notes:
      "Escalate if the reader is dead, master cards fail, multiple encoders fail, or there is any security concern. Never share master key procedures in tickets.",
    ticket_template:
      "Issue: Keycard failing\nRoom/area: \nLock LED/beep behavior: \nFresh card encoded: yes/no\nEncoder used: \nOne room or multiple rooms: \nBattery suspected: yes/no\nSecurity/guest impact: ",
    references: [
      {
        label: "ASSA ABLOY Global Solutions support",
        url: "https://www.assaabloyglobalsolutions.com/en/support",
        type: "manufacturer"
      },
      {
        label: "Vingcard support",
        url: "https://www.vingcard.com/support",
        type: "manufacturer"
      },
      {
        label: "dormakaba lodging support",
        url: "https://www.dormakaba.com/us-en/support",
        type: "manufacturer"
      }
    ],
    tags: ["door lock", "keycard", "vingcard", "dormakaba", "security"],
    is_favorite: true,
    created_at: now
  },
  {
    id: "pos-terminal-cannot-process",
    title: "POS terminal cannot process payment",
    category: "POS / Payments",
    impact: "Restaurant, bar, or gift shop cannot close checks; revenue and guest experience affected.",
    beginner_summary: "Protect cardholder data. Check power, network, terminal status, and POS app before escalating.",
    estimated_time: "5-15 min",
    equipment: ["Payment terminal", "POS workstation/tablet", "Network cable or Wi-Fi status", "Vendor support number"],
    symptoms: ["Transaction timeout", "Terminal disconnected", "POS says pin pad offline"],
    quick_fix: "Restart the terminal and POS app, verify network, and test a non-payment connection status screen.",
    steps: [
      "Do not ask for card numbers, CVV, PIN, or payment screenshots.",
      "Check terminal power and cable seating.",
      "Confirm POS workstation/tablet has network access.",
      "Restart POS app and payment terminal in the vendor-recommended order.",
      "Test whether all terminals or one lane is affected.",
      "Escalate to payment/POS vendor if transactions still fail."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Terminal has power.", "USB/Ethernet cable seated.", "Dock is charging if wireless."]
      },
      {
        name: "Network layer",
        checks: ["Terminal shows online.", "POS can reach network.", "Only one terminal or all terminals affected."]
      },
      {
        name: "Application layer",
        checks: ["POS app signed in.", "Terminal paired to correct station.", "No open batch/vendor alert."]
      },
      {
        name: "Compliance layer",
        checks: ["No cardholder data in notes.", "No photos of payment cards or receipts with full card details."]
      }
    ],
    navigation_steps: [
      {
        device: "POS terminal",
        path: "Terminal menu > Settings/Diagnostics > Network or Connection test",
        checks: ["Record pass/fail only.", "Do not capture sensitive payment data."]
      }
    ],
    commands: ["ping <pos-gateway-if-approved>", "ipconfig /all"],
    command_blocks: [
      {
        device: "POS workstation, Command Prompt",
        purpose: "Basic workstation network test only.",
        commands: ["ipconfig /all", "ping 8.8.8.8"]
      }
    ],
    escalation_notes:
      "Escalate immediately if all payment terminals fail or settlement/batch is affected. Never include cardholder data, full receipt images, PINs, or merchant secrets.",
    ticket_template:
      "Issue: POS payment terminal offline\nOutlet/location: \nTerminal ID label: \nOne terminal or all: \nPower/cables checked: yes/no\nNetwork test: pass/fail\nPOS app restarted: yes/no\nPayment vendor contacted: yes/no\nBusiness impact: ",
    references: [
      {
        label: "Oracle MICROS hospitality support",
        url: "https://www.oracle.com/industries/hospitality/micros/",
        type: "vendor"
      },
      {
        label: "PCI Security Standards Council",
        url: "https://www.pcisecuritystandards.org/",
        type: "article"
      }
    ],
    tags: ["pos", "payment", "micros", "pci", "terminal"],
    is_favorite: false,
    created_at: now
  },
  {
    id: "digital-signage-blank-screen",
    title: "Lobby digital signage screen is blank",
    category: "Digital Signage",
    impact: "Guest-facing display loses event, meeting, or brand messaging.",
    beginner_summary: "Check the display input and media player before changing content software.",
    estimated_time: "5-12 min",
    equipment: ["Remote control", "Media player", "HDMI cable", "Known-good power outlet"],
    symptoms: ["TV is black", "No signal message", "Content frozen", "Player power light off"],
    quick_fix: "Power-cycle the display and media player, confirm HDMI input, then check player network.",
    steps: [
      "Check whether the display has power and correct input selected.",
      "Confirm the media player has power and HDMI is seated.",
      "Power-cycle the media player for 30 seconds.",
      "If content loads but is old, check network connection and signage schedule.",
      "If display says no signal, test another HDMI cable or input.",
      "Escalate if the player fails to boot or CMS is unreachable."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Display power on.", "Media player power on.", "HDMI fully seated."]
      },
      {
        name: "Display layer",
        checks: ["Correct HDMI input selected.", "Brightness not set to zero.", "No sleep timer active."]
      },
      {
        name: "Network layer",
        checks: ["Media player has Ethernet/Wi-Fi.", "Can reach content platform if status available."]
      },
      {
        name: "Content layer",
        checks: ["Correct playlist scheduled.", "Date/time correct.", "No expired campaign."]
      }
    ],
    navigation_steps: [
      {
        device: "Display remote",
        path: "Input/Source button > select HDMI used by signage player",
        checks: ["Wait 10 seconds after selecting input.", "Look for player boot screen."]
      }
    ],
    commands: ["ping 8.8.8.8"],
    command_blocks: [
      {
        device: "Signage Windows player if keyboard connected",
        purpose: "Confirm basic connectivity.",
        commands: ["ipconfig /all", "ping 8.8.8.8"]
      }
    ],
    escalation_notes:
      "Escalate if the display panel is damaged, media player will not power on, content management portal is down, or multiple screens fail at once.",
    ticket_template:
      "Issue: Digital signage blank/frozen\nDisplay location: \nDisplay power: on/off\nInput selected: \nPlayer power: on/off\nHDMI reseated: yes/no\nNetwork status: \nContent last updated: \nGuest/event impact: ",
    references: [
      {
        label: "Samsung business display support",
        url: "https://www.samsung.com/us/business/support/",
        type: "manufacturer"
      },
      {
        label: "LG business display support",
        url: "https://www.lg.com/us/business/support",
        type: "manufacturer"
      },
      {
        label: "Video: HDMI no signal troubleshooting",
        url: "https://www.youtube.com/results?search_query=digital+signage+hdmi+no+signal+troubleshooting",
        type: "video"
      }
    ],
    tags: ["digital signage", "hdmi", "display", "lobby", "media player"],
    is_favorite: false,
    created_at: now
  },
  {
    id: "guest-room-tv-iptv-down",
    title: "Guest room TV or IPTV has no channels",
    category: "Guest Room Tech",
    impact: "Guest room comfort issue; can become high priority for VIP or multiple-room impact.",
    beginner_summary: "Check TV input, network/coax, set-top box power, then whether multiple rooms are affected.",
    estimated_time: "7-20 min",
    equipment: ["TV remote", "Set-top box", "Coax/Ethernet cable", "Known-good room comparison"],
    symptoms: ["No signal", "All channels black", "Guide does not load", "One room affected"],
    quick_fix: "Power-cycle TV and set-top box, confirm input/source, then compare with a nearby room.",
    steps: [
      "Check TV power and correct input/source.",
      "Check set-top box power light and cable seating.",
      "Power-cycle set-top box for 30 seconds.",
      "Compare same channel in a nearby working room.",
      "If multiple rooms on same floor fail, suspect distribution/network issue.",
      "Escalate vendor-side channel lineup or headend issues."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["TV plugged in.", "Remote batteries okay.", "Coax/Ethernet/HDMI seated."]
      },
      {
        name: "Room device layer",
        checks: ["Set-top box power light on.", "TV input correct.", "Box has booted fully."]
      },
      {
        name: "Distribution layer",
        checks: ["Nearby room works.", "Same floor or riser pattern checked.", "Headend/vendor status considered."]
      }
    ],
    navigation_steps: [
      {
        device: "TV remote",
        path: "Input/Source > HDMI or TV provider input",
        checks: ["Select correct input.", "Wait for set-top box menu."]
      }
    ],
    commands: [],
    command_blocks: [],
    escalation_notes:
      "Escalate if multiple rooms are affected, the set-top box will not boot, or the vendor channel guide/headend is unavailable.",
    ticket_template:
      "Issue: Guest room TV/IPTV no channels\nRoom: \nTV power: \nInput/source: \nSet-top power: \nCable reseated: yes/no\nNearby room tested: \nOne room or multiple: \nGuest impact: ",
    references: [
      {
        label: "Samsung hospitality TV support",
        url: "https://www.samsung.com/us/business/support/",
        type: "manufacturer"
      },
      {
        label: "LG hospitality TV support",
        url: "https://www.lg.com/us/business/support",
        type: "manufacturer"
      }
    ],
    tags: ["tv", "iptv", "guest room", "set top box", "no signal"],
    is_favorite: false,
    created_at: now
  },
  {
    id: "room-phone-no-dial-tone",
    title: "Guest room phone has no dial tone",
    category: "Telephony",
    impact: "Guest safety and service issue; emergency calling must be treated seriously.",
    beginner_summary: "Check handset, cable, wall jack, then PBX/VoIP registration scope.",
    estimated_time: "5-15 min",
    equipment: ["Known-good handset", "Phone cable", "Room phone", "PBX/VoIP portal if authorized"],
    symptoms: ["No dial tone", "Cannot call front desk", "Phone display blank", "Only one room affected"],
    quick_fix: "Reseat handset and line cables, test with a known-good phone if allowed, then compare nearby room.",
    steps: [
      "Check the handset cord and wall/phone cable are fully seated.",
      "If the phone uses power, confirm display and power adapter/PoE.",
      "Swap with a known-good handset only if property process allows.",
      "Test front desk extension and external dialing according to policy.",
      "Check if nearby rooms have the same issue.",
      "Escalate immediately if emergency calling is affected."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Handset cord seated.", "Line cable seated.", "Phone has power or PoE."]
      },
      {
        name: "Network or analog layer",
        checks: ["VoIP phone registered if display exists.", "Analog jack tested with known-good phone if authorized."]
      },
      {
        name: "PBX layer",
        checks: ["Extension status checked.", "Nearby extensions working.", "Call restrictions not changed."]
      }
    ],
    navigation_steps: [
      {
        device: "VoIP phone",
        path: "Phone menu > Status > Network or Registration",
        checks: ["Record registered/not registered.", "Do not expose SIP passwords or server names in ticket."]
      }
    ],
    commands: ["ping <phone-ip-if-known>"],
    command_blocks: [
      {
        device: "Network admin workstation if phone IP is approved to test",
        purpose: "Confirm basic reachability to VoIP phone.",
        commands: ["ping <phone-ip>"]
      }
    ],
    escalation_notes:
      "Escalate as safety priority if 911/emergency calling or multiple guest-room phones are affected. Do not include SIP passwords, server names, or internal IPs in general notes.",
    ticket_template:
      "Issue: Room phone no dial tone\nRoom/extension: \nDisplay/power: \nCable reseated: yes/no\nKnown-good phone tested: yes/no\nNearby room result: \nEmergency calling affected: yes/no/unknown\nBusiness/safety impact: ",
    references: [
      {
        label: "Mitel support",
        url: "https://www.mitel.com/support",
        type: "manufacturer"
      },
      {
        label: "Yealink support",
        url: "https://support.yealink.com/",
        type: "manufacturer"
      }
    ],
    tags: ["phone", "pbx", "voip", "dial tone", "guest room"],
    is_favorite: false,
    created_at: now
  },
  {
    id: "camera-offline",
    title: "Security camera is offline",
    category: "Security Cameras",
    impact: "Security visibility gap; may affect incident review and compliance.",
    beginner_summary: "Check camera power/PoE, switch port, then NVR/VMS status. Avoid moving cameras without approval.",
    estimated_time: "10-25 min",
    equipment: ["Camera location", "PoE switch", "NVR/VMS dashboard", "Patch cable if authorized"],
    symptoms: ["Camera offline", "Black image", "No recording", "Multiple cameras down"],
    quick_fix: "Check PoE switch link/power for the camera port and confirm whether nearby cameras on the same switch are online.",
    steps: [
      "Confirm exact camera name and location in VMS/NVR.",
      "Check if one camera, one area, or many cameras are offline.",
      "Check switch port link and PoE status if accessible.",
      "Do not change camera aim unless authorized.",
      "Power-cycle PoE port if allowed by property process.",
      "Escalate if camera remains offline or multiple cameras are affected."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Camera not visibly damaged.", "Cable connected.", "Switch port link light present."]
      },
      {
        name: "Power layer",
        checks: ["PoE budget not exceeded.", "Port provides PoE.", "Nearby cameras on same switch work."]
      },
      {
        name: "Network layer",
        checks: ["Camera reachable from VMS network.", "No recent VLAN or switch changes."]
      },
      {
        name: "Application layer",
        checks: ["VMS/NVR shows correct camera.", "Recording schedule active.", "Storage not full."]
      }
    ],
    navigation_steps: [
      {
        device: "VMS/NVR dashboard",
        path: "Cameras > Offline or Health > select camera",
        checks: ["Record last seen time.", "Record location and camera name.", "Avoid confidential video screenshots."]
      }
    ],
    commands: ["ping <camera-ip-if-approved>"],
    command_blocks: [
      {
        device: "Network admin workstation if approved",
        purpose: "Basic reachability check.",
        commands: ["ping <camera-ip>", "arp -a | findstr <camera-ip>"]
      }
    ],
    escalation_notes:
      "Escalate if camera covers entrances, cash areas, parking, or safety-critical areas. Include last seen time, camera name, and switch/port if known.",
    ticket_template:
      "Issue: Security camera offline\nCamera name/location: \nLast seen: \nOne camera or multiple: \nSwitch/port if known: \nPoE/link checked: yes/no\nVMS/NVR status: \nSecurity impact: ",
    references: [
      {
        label: "Axis technical support",
        url: "https://www.axis.com/support",
        type: "manufacturer"
      },
      {
        label: "Hanwha Vision support",
        url: "https://www.hanwhavisionamerica.com/support/",
        type: "manufacturer"
      }
    ],
    tags: ["camera", "vms", "nvr", "poe", "security"],
    is_favorite: false,
    created_at: now
  },
  {
    id: "barcode-scanner-not-scanning",
    title: "Barcode scanner will not scan into POS or inventory app",
    category: "Peripherals",
    impact: "Retail, receiving, or inventory work slows down.",
    beginner_summary: "Treat most USB scanners like keyboards: check cable, focus window, input mode, then reset barcode.",
    estimated_time: "5-10 min",
    equipment: ["Scanner", "USB cable or cradle", "POS/inventory workstation", "Test barcode"],
    symptoms: ["Scanner beeps but no text appears", "No beep", "Wrong characters", "Wireless scanner not paired"],
    quick_fix: "Open Notepad, scan a test barcode, and confirm whether text appears outside the POS app.",
    steps: [
      "Check scanner cable, cradle power, or wireless battery.",
      "Open Notepad and scan a known barcode.",
      "If Notepad works, click into the correct POS/inventory field and retry.",
      "If Notepad does not work, reconnect scanner or pair wireless base.",
      "Check keyboard layout if characters are wrong.",
      "Use manufacturer reset/setup barcode only with approval."
    ],
    layers: [
      {
        name: "Physical layer",
        checks: ["Cable seated.", "Scanner has power.", "Wireless scanner charged and paired."]
      },
      {
        name: "Input layer",
        checks: ["Notepad receives scan.", "Cursor is in correct app field.", "Scanner is in keyboard wedge/HID mode if required."]
      },
      {
        name: "Application layer",
        checks: ["POS item exists.", "Field accepts barcode.", "No modal window blocking input."]
      }
    ],
    navigation_steps: [
      {
        device: "Windows workstation",
        path: "Open Notepad > click blank page > scan test barcode",
        checks: ["Text appears.", "Enter key suffix works if expected."]
      }
    ],
    commands: [],
    command_blocks: [],
    escalation_notes:
      "Escalate if multiple scanners fail, the scanner cannot pair, or a reset barcode is needed and you are not authorized.",
    ticket_template:
      "Issue: Barcode scanner not scanning\nLocation/workstation: \nScanner model: \nWired/wireless: \nNotepad test result: \nPOS field tested: \nBattery/cradle checked: yes/no\nBusiness impact: ",
    references: [
      {
        label: "Honeywell productivity support",
        url: "https://sps-support.honeywell.com/",
        type: "manufacturer"
      },
      {
        label: "Zebra support and downloads",
        url: "https://www.zebra.com/us/en/support-downloads.html",
        type: "manufacturer"
      },
      {
        label: "Video: barcode scanner keyboard wedge setup",
        url: "https://www.youtube.com/results?search_query=barcode+scanner+keyboard+wedge+setup",
        type: "video"
      }
    ],
    tags: ["barcode", "scanner", "pos", "inventory", "usb"],
    is_favorite: false,
    created_at: now
  }
];
