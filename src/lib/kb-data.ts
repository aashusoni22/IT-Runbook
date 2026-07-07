import type { IssueArticle } from "@/types/issue";

export const issueArticles: IssueArticle[] = [
  {
    id: "printer-offline",
    title: "Printer Offline",
    category: "Printer",
    symptoms: [
      "Printer shows \"Offline\" in Windows",
      "Print jobs sit in the queue and never print",
      "Front desk cannot print registration cards or receipts"
    ],
    quickChecks: [
      "Is the printer powered on with no error light?",
      "Is the network or USB cable fully seated?",
      "Does the printer have paper and no jam?",
      "Do other workstations print to it fine?"
    ],
    layers: [
      {
        name: "Physical",
        checks: ["Power light on", "Paper loaded", "No jam or open door", "Cable seated"]
      },
      {
        name: "Network",
        checks: ["Printer has an IP address", "Workstation can ping the printer", "No duplicate IP on the network"]
      },
      {
        name: "Windows",
        checks: ["Correct printer set as default", "Queue is not paused", "\"Use Printer Offline\" is unchecked"]
      },
      {
        name: "Application",
        checks: ["Windows test page prints", "Then retry the PMS/POS print job"]
      }
    ],
    systemPaths: [
      {
        platform: "Windows 11",
        path: "Settings > Bluetooth & devices > Printers & scanners > select printer > Open print queue",
        notes: ["Cancel any stuck jobs", "Confirm queue is not paused"]
      },
      {
        platform: "Windows Services",
        path: "services.msc > Print Spooler",
        notes: ["Restart the service", "Startup type should be Automatic"]
      }
    ],
    commands: ["ping <printer-ip>", "Get-Printer", "Restart-Service Spooler", "Get-PrintJob -PrinterName \"<name>\""],
    escalationTriggers: [
      "Spooler restart does not fix it",
      "Printer has a hardware fault code",
      "Multiple workstations lose the same printer",
      "Front desk is blocked during check-in"
    ],
    ticketTemplate:
      "Issue: Printer offline\nPrinter name/model:\nLocation:\nIP address:\nPing result:\nQueue cleared: yes/no\nSpooler restarted: yes/no\nTest page result:\nBusiness impact:",
    relatedArticles: ["payment-terminal-offline"],
    youtubeSearches: ["windows print spooler restart printer offline", "printer stuck offline fix"],
    tags: ["printer", "spooler", "queue", "offline", "windows"]
  },
  {
    id: "payment-terminal-offline",
    title: "Payment Terminal Offline",
    category: "Payment/POS",
    symptoms: [
      "Terminal screen is blank or shows \"No connection\"",
      "POS says \"Pin pad offline\"",
      "Transactions will not start"
    ],
    quickChecks: [
      "Does the terminal have power?",
      "Is the network cable or Wi-Fi connected?",
      "Is only one terminal affected or all of them?",
      "Has the POS app or terminal been restarted yet?"
    ],
    layers: [
      { name: "Physical", checks: ["Power light on", "Cable/dock seated", "No visible damage"] },
      { name: "Network", checks: ["Terminal shows connected", "One lane vs all lanes affected"] },
      { name: "Application", checks: ["POS app signed in", "Terminal paired to the right station", "No open batch alert"] },
      { name: "Compliance", checks: ["No card numbers or receipts photographed", "No cardholder data written in notes"] }
    ],
    systemPaths: [
      {
        platform: "Terminal menu",
        path: "Settings/Diagnostics > Network or Connection test",
        notes: ["Record pass/fail only, nothing else"]
      }
    ],
    commands: ["ipconfig /all", "ping 8.8.8.8"],
    escalationTriggers: [
      "All terminals in an outlet are down",
      "Settlement/batch will not close",
      "Restart does not restore connection",
      "Any payment data appears in an error message"
    ],
    ticketTemplate:
      "Issue: Payment terminal offline\nOutlet/location:\nTerminal ID label:\nOne terminal or all:\nPower/cable checked: yes/no\nNetwork test: pass/fail\nPOS app restarted: yes/no\nVendor contacted: yes/no\nBusiness impact:",
    relatedArticles: ["payment-terminal-host-unreachable", "guest-wifi-not-working"],
    youtubeSearches: ["pos terminal offline troubleshooting", "payment terminal no connection fix"],
    tags: ["pos", "payment", "terminal", "offline", "pci"]
  },
  {
    id: "payment-terminal-host-unreachable",
    title: "Payment Terminal Host Unreachable",
    category: "Payment/POS",
    symptoms: [
      "Terminal shows \"Host unreachable\" or \"Cannot reach processor\"",
      "Transactions time out instead of declining",
      "Error appears only on some transactions, not all"
    ],
    quickChecks: [
      "Is this one terminal or every terminal at the property?",
      "Did this start after a network or internet change?",
      "Is the terminal's internet path (Wi-Fi/Ethernet) up?",
      "Has the payment processor posted a status alert?"
    ],
    layers: [
      { name: "Network", checks: ["Terminal has internet path", "Firewall/router did not just change", "DNS resolves for the terminal"] },
      { name: "Terminal", checks: ["Terminal software is current", "No pending firmware update stuck mid-install"] },
      { name: "Processor", checks: ["Check processor status page if available", "Confirm merchant ID/account is active"] }
    ],
    systemPaths: [
      {
        platform: "Terminal menu",
        path: "Settings/Diagnostics > Host/Processor connection test",
        notes: ["Record the exact error code shown"]
      }
    ],
    commands: ["ping 8.8.8.8", "nslookup <processor-hostname-if-known>", "tracert <processor-hostname-if-known>"],
    escalationTriggers: [
      "Multiple terminals or outlets affected at once",
      "Error persists after network is confirmed healthy",
      "Processor status page shows an outage",
      "End of day batch cannot settle"
    ],
    ticketTemplate:
      "Issue: Payment terminal host unreachable\nOutlet/location:\nTerminal ID label:\nError code shown:\nOne terminal or many:\nNetwork test: pass/fail\nProcessor status checked: yes/no\nTime started:\nBusiness impact:",
    relatedArticles: ["payment-terminal-offline", "guest-wifi-not-working"],
    youtubeSearches: ["pos host unreachable error", "payment terminal cannot reach processor"],
    tags: ["pos", "payment", "host", "network", "processor"]
  },
  {
    id: "mfa-new-phone",
    title: "MFA New Phone",
    category: "MFA/Login",
    symptoms: [
      "Employee got a new phone and lost the authenticator app",
      "MFA prompt never arrives",
      "\"Approve sign-in\" push notification does not show up"
    ],
    quickChecks: [
      "Does the employee still have their old phone available?",
      "Can they sign in to a browser to reach the security info page?",
      "Do they have a backup method set up (phone call, backup codes)?",
      "Is this one user or many users at once?"
    ],
    layers: [
      { name: "Identity", checks: ["Verify the employee's identity per property policy before any reset"] },
      { name: "Account", checks: ["Check registered MFA methods on the account", "Confirm account is not locked"] },
      { name: "Device", checks: ["New phone has the authenticator app installed", "Time is set automatically on new phone"] }
    ],
    systemPaths: [
      {
        platform: "Microsoft 365 admin center",
        path: "Users > Active users > select user > Manage multifactor authentication / Reset MFA",
        notes: ["Only admins should perform this reset"]
      },
      {
        platform: "User self-service",
        path: "myaccount.microsoft.com > Security info > Add sign-in method",
        notes: ["User re-adds the authenticator app on the new phone"]
      }
    ],
    commands: [],
    escalationTriggers: [
      "Cannot verify the employee's identity confidently",
      "Account shows suspicious sign-in activity",
      "Admin portal access is needed and you do not have it",
      "User is locked out and needs to work immediately"
    ],
    ticketTemplate:
      "Issue: MFA new phone / reset\nUser (name only, no personal data):\nIdentity verified: yes/no\nOld device available: yes/no\nMFA method reset: yes/no\nNew method registered: yes/no\nTime started:\nBusiness impact:",
    relatedArticles: ["outlook-password-prompt", "teams-sign-in-loop"],
    youtubeSearches: ["microsoft 365 reset mfa new phone", "authenticator app lost phone setup"],
    tags: ["mfa", "authenticator", "login", "microsoft 365", "security"]
  },
  {
    id: "outlook-password-prompt",
    title: "Outlook Keeps Asking for Password",
    category: "Outlook/Email",
    symptoms: [
      "Outlook repeatedly pops up a sign-in box",
      "Entering the password does not clear the prompt",
      "Email stops syncing while the prompt loops"
    ],
    quickChecks: [
      "Is this one workstation or the same user on multiple devices?",
      "Did their password change recently?",
      "Is MFA also failing at the same time?",
      "Is the workstation's date/time correct?"
    ],
    layers: [
      { name: "Account", checks: ["Password not expired", "Account not locked", "MFA method still valid"] },
      { name: "Workstation", checks: ["System date/time correct", "Outlook is signed in with the right account"] },
      { name: "Outlook profile", checks: ["Try a new Outlook profile", "Cached credentials cleared in Credential Manager"] }
    ],
    systemPaths: [
      {
        platform: "Windows Credential Manager",
        path: "Control Panel > Credential Manager > Windows Credentials",
        notes: ["Remove any saved Outlook/Office 365 entries", "Reopen Outlook and sign in fresh"]
      },
      {
        platform: "Outlook",
        path: "File > Account Settings > Manage Profiles > Show Profiles > Add",
        notes: ["Create a new profile as a last resort before escalating"]
      }
    ],
    commands: [],
    escalationTriggers: [
      "New profile still prompts repeatedly",
      "Account is locked or flagged for suspicious sign-in",
      "Multiple users report the same loop at once",
      "MFA reset is also required"
    ],
    ticketTemplate:
      "Issue: Outlook repeated password prompt\nUser (name only):\nWorkstation:\nOne device or many:\nCredential Manager cleared: yes/no\nNew profile tested: yes/no\nMFA involved: yes/no\nBusiness impact:",
    relatedArticles: ["mfa-new-phone", "teams-sign-in-loop"],
    youtubeSearches: ["outlook keeps asking for password fix", "clear credential manager outlook loop"],
    tags: ["outlook", "email", "password", "login", "office"]
  },
  {
    id: "teams-sign-in-loop",
    title: "Teams Sign-in Loop",
    category: "Teams/Microsoft 365",
    symptoms: [
      "Teams repeatedly returns to the sign-in screen",
      "\"We couldn't sign you in\" error appears",
      "Chat and calls do not load past the loading screen"
    ],
    quickChecks: [
      "Does the same account sign in fine on the Teams web app?",
      "Is this one device or every device for the user?",
      "Has the Teams cache ever been cleared on this machine?",
      "Is the account's MFA current?"
    ],
    layers: [
      { name: "Account", checks: ["Sign-in works on teams.microsoft.com in a browser", "Account not locked or MFA-blocked"] },
      { name: "Client", checks: ["Teams app is up to date", "Cache is not corrupted"] },
      { name: "Network", checks: ["Workstation has internet access", "No captive portal blocking Microsoft 365 domains"] }
    ],
    systemPaths: [
      {
        platform: "Windows",
        path: "%appdata%\\Microsoft\\Teams (classic) or clear cache from Teams > Settings > Check for updates",
        notes: ["Fully quit Teams first (check system tray)", "Clear the cache folder then reopen Teams"]
      }
    ],
    commands: ["taskkill /f /im teams.exe", "ipconfig /flushdns"],
    escalationTriggers: [
      "Web version also fails to sign in",
      "Multiple staff affected across departments",
      "Account shows a conditional access block",
      "Cache clear does not resolve it"
    ],
    ticketTemplate:
      "Issue: Teams sign-in loop\nUser (name only):\nWorkstation:\nWeb version tested: yes/no\nCache cleared: yes/no\nOne device or many:\nBusiness impact:",
    relatedArticles: ["outlook-password-prompt", "mfa-new-phone", "onedrive-sync-error"],
    youtubeSearches: ["microsoft teams sign in loop fix", "clear teams cache windows"],
    tags: ["teams", "microsoft 365", "login", "sign-in", "cache"]
  },
  {
    id: "onedrive-sync-error",
    title: "OneDrive Sync Error",
    category: "Teams/Microsoft 365",
    symptoms: [
      "Red X or warning icon on the OneDrive taskbar icon",
      "Files show \"Sync pending\" for a long time",
      "\"OneDrive isn't signed in\" notification appears"
    ],
    quickChecks: [
      "What does the OneDrive icon in the system tray say when clicked?",
      "Is the workstation online?",
      "Is there enough free disk space?",
      "Are any file names using blocked characters (# % & * : < > ? / \\ { | })?"
    ],
    layers: [
      { name: "Account", checks: ["OneDrive is signed in with the correct work account"] },
      { name: "Sync client", checks: ["OneDrive app is running", "Not paused under system tray icon"] },
      { name: "Files", checks: ["No file names with blocked characters", "No files open in another program blocking sync"] }
    ],
    systemPaths: [
      {
        platform: "Windows system tray",
        path: "OneDrive icon > Help & Settings > Pause syncing, then Resume syncing",
        notes: ["If still stuck, try Settings > Account > Unlink this PC, then sign back in"]
      }
    ],
    commands: [],
    escalationTriggers: [
      "Unlink/relink does not fix the sync error",
      "Business-critical files are missing or not syncing",
      "Storage quota appears to be exceeded",
      "Multiple users report sync failures at once"
    ],
    ticketTemplate:
      "Issue: OneDrive sync error\nUser (name only):\nWorkstation:\nIcon status shown:\nPause/resume tried: yes/no\nUnlink/relink tried: yes/no\nBusiness impact:",
    relatedArticles: ["teams-sign-in-loop", "outlook-password-prompt"],
    youtubeSearches: ["onedrive sync error fix", "onedrive stuck processing changes"],
    tags: ["onedrive", "microsoft 365", "sync", "files"]
  },
  {
    id: "guest-wifi-not-working",
    title: "Guest Wi-Fi Not Working",
    category: "Wi-Fi/Network",
    symptoms: [
      "Guest connects but has no internet",
      "Wi-Fi portal never loads",
      "Slow speeds in one room, floor, or meeting space"
    ],
    quickChecks: [
      "Is this one guest, one room, one floor, or the whole property?",
      "Does your own phone have the same problem in that spot?",
      "Has the guest tried forgetting and rejoining the network?",
      "Does opening a non-HTTPS page trigger the portal?"
    ],
    layers: [
      { name: "Wireless", checks: ["Correct guest SSID visible", "Signal strength reasonable in that area"] },
      { name: "Network", checks: ["DHCP lease assigned", "DNS and gateway reachable from a test device"] },
      { name: "Application", checks: ["Captive portal triggers on a non-HTTPS page", "Voucher/terms flow completes"] }
    ],
    systemPaths: [
      {
        platform: "iPhone",
        path: "Settings > Wi-Fi > hotel SSID > Forget This Network, then reconnect",
        notes: ["Open a plain http page like neverssl.com to trigger the portal"]
      },
      {
        platform: "Windows laptop",
        path: "Settings > Network & internet > Wi-Fi > Manage known networks > Forget",
        notes: ["Reconnect and re-test in a browser"]
      }
    ],
    commands: ["ipconfig /all", "ipconfig /flushdns", "ping 8.8.8.8", "nslookup hotel-login.example"],
    escalationTriggers: [
      "An entire floor or the whole property is affected",
      "Staff Wi-Fi is also down",
      "Access point shows no power/uplink",
      "Portal still fails after forget-and-reconnect"
    ],
    ticketTemplate:
      "Issue: Guest Wi-Fi not working\nLocation:\nSSID:\nScope: one guest / room / floor / property\nDevice tested:\nIP received: yes/no\nPortal trigger tried: yes/no\nAP name if known:\nBusiness impact:",
    relatedArticles: ["payment-terminal-host-unreachable"],
    youtubeSearches: ["guest wifi captive portal troubleshooting", "wifi connected no internet fix"],
    tags: ["wifi", "guest", "network", "portal", "dns"]
  },
  {
    id: "laptop-wont-boot",
    title: "Laptop Won't Boot",
    category: "Laptop/Device",
    symptoms: [
      "No lights, no fan, nothing on screen",
      "Powers on but never reaches the login screen",
      "Stuck on manufacturer logo or spinning indefinitely"
    ],
    quickChecks: [
      "Is it plugged in and does the charging light come on?",
      "Try a different outlet and, if possible, a different charger.",
      "Hold power for 10 seconds to force a shutdown, then try again.",
      "Does an external monitor show anything if the laptop screen is blank?"
    ],
    layers: [
      { name: "Power", checks: ["Charger and outlet both tested", "Battery not swollen or removed if replaceable"] },
      { name: "Display", checks: ["External monitor test if screen is blank", "Brightness not at zero"] },
      { name: "Boot", checks: ["Boots to BIOS/UEFI at all", "No repeated crash loop after logo"] }
    ],
    systemPaths: [
      {
        platform: "Windows recovery",
        path: "Hold power to force shutdown 3 times in a row to trigger Automatic Repair",
        notes: ["Follow on-screen recovery prompts if it appears", "Do not run disk repair tools without guidance"]
      }
    ],
    commands: [],
    escalationTriggers: [
      "No response to power at all after charger/outlet swap",
      "Automatic Repair fails or loops",
      "Burning smell, swelling, or physical damage present",
      "User needs the device back urgently for a shift"
    ],
    ticketTemplate:
      "Issue: Laptop won't boot\nUser (name only):\nAsset tag/model:\nPower test result:\nExternal monitor test result:\nAutomatic repair attempted: yes/no\nPhysical damage: yes/no\nBusiness impact:",
    relatedArticles: ["new-user-onboarding"],
    youtubeSearches: ["laptop won't turn on troubleshooting", "windows automatic repair loop fix"],
    tags: ["laptop", "hardware", "boot", "power", "device"]
  },
  {
    id: "new-user-onboarding",
    title: "New User Onboarding",
    category: "New User Setup",
    symptoms: [
      "New hire starts today and needs full access",
      "Account, email, and department apps must be ready before their shift",
      "Manager is asking for status on setup"
    ],
    quickChecks: [
      "Is the account created and enabled in Microsoft 365/AD?",
      "Is the correct department/role license assigned?",
      "Is a device assigned and ready to hand over?",
      "Does the manager know the temporary password process?"
    ],
    layers: [
      { name: "Identity", checks: ["Account created with correct name/role", "Added to the right security groups"] },
      { name: "Access", checks: ["Email and Teams working", "PMS/POS/property app access granted per role"] },
      { name: "Device", checks: ["Device imaged/updated", "Peripherals and badge/key card ready if applicable"] },
      { name: "MFA", checks: ["MFA method registered with the new employee present"] }
    ],
    systemPaths: [
      {
        platform: "Microsoft 365 admin center",
        path: "Users > Active users > Add a user",
        notes: ["Assign license matching their role", "Add to correct department group/distribution list"]
      },
      {
        platform: "Property systems",
        path: "PMS/POS admin > Create staff profile with correct role permissions",
        notes: ["Grant least-privilege access first, expand only if needed"]
      }
    ],
    commands: [],
    escalationTriggers: [
      "Role/license is unclear or not approved yet",
      "Property system account creation needs vendor/admin help",
      "New hire arrives before setup is complete",
      "Access request is missing manager approval"
    ],
    ticketTemplate:
      "Issue: New user onboarding\nNew hire name:\nRole/department:\nStart date:\nAccount created: yes/no\nLicense assigned: yes/no\nProperty system access granted: yes/no\nDevice ready: yes/no\nMFA registered: yes/no\nManager approval on file: yes/no",
    relatedArticles: ["mfa-new-phone", "laptop-wont-boot"],
    youtubeSearches: ["microsoft 365 new user setup admin", "onboard new employee IT checklist"],
    tags: ["onboarding", "new hire", "account", "setup", "access"]
  }
];
