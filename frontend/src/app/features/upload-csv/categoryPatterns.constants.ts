import { CategoryValue } from '../../shared/interfaces/password.interface';

export const categoryPatterns: { [key in CategoryValue]?: RegExp } = {
  social_media:
    /social|network|facebook|fb|insta|gram|twitter|tweet|x|linkedin|reddit|pin|pinterest|tiktok|snap|sc|whatsapp|wa|telegram|tg|signal|discord|slack|messenger|dm|msg|chat|wechat|line|viber|flickr|tumblr|blog|mastodon|threads|bluesky|nextdoor|meetup|clubhouse|forum|community|group/i,

  work_professional:
    /work|office|job|career|employment|business|corporate|professional|company|enterprise|org|hr|recruit|hiring|interview|resume|cv|linkedin|indeed|glassdoor|monster|ziprecruiter|upwork|fiverr|freelancer|gig|contract|remote|wfh|team|collab|meet|zoom|webex|gotomeeting|teams|slack|workspace|gmail|outlook|calendar|schedule|task|asana|trello|basecamp|jira|confluence|notion|airtable|zoho|salesforce|crm|erp/i,

  banking_finance:
    /bank|finance|money|cash|pay|wallet|invest|capital|credit|debit|loan|mortgage|insurance|savings|account|card|visa|mastercard|amex|discover|chase|wells|boa|citi|capitalone|ally|pnc|usbank|td|hsbc|barclays|schwab|fidelity|vanguard|etrade|robinhood|coinbase|crypto|bitcoin|ether|blockchain|venmo|paypal|zelle|cashapp|stripe|square|quickbooks|xero|mint|creditkarma|tax|irs|turbotax|wealth|retirement|401k|ira|broker|trade|stock|market|exchange/i,

  entertainment:
    /entertain|fun|movie|film|music|song|game|play|stream|video|netflix|hulu|disney|prime|hbo|peacock|paramount|showtime|appletv|amc|imdb|pandora|spotify|soundcloud|deezer|tidal|itunes|audible|podcast|twitch|steam|epic|xbox|playstation|ps|nintendo|switch|roblox|minecraft|fortnite|league|dota|chess|poker|casino|bet|gamble|lottery|bingo|arcade|theme|park|zoo|aquarium|theater|concert|festival|event|ticket|show|performance|art|museum|gallery|exhibit/i,

  education:
    /educat|learn|study|school|college|univ|academy|class|course|lesson|tutorial|training|mooc|edx|coursera|udemy|skillshare|khan|codecademy|pluralsight|lynda|udacity|research|thesis|paper|publish|journal|library|book|textbook|reference|dictionary|wiki|quiz|exam|test|cert|degree|diploma|phd|master|bachelor|professor|teacher|instructor|tutor|mentor|coach|student|alumni|scholarship|grant|aid|homework|assignment|project|lab|science|math|history|literature|language|program|coding|engin|medicine|law|art|design|psychology|economics/i,

  shopping_ecommerce:
    /shop|store|buy|purchase|cart|sell|market|retail|sale|deal|discount|offer|coupon|promo|voucher|amazon|ebay|etsy|walmart|target|bestbuy|costco|homedepot|lowes|ikea|wayfair|zappos|asos|nordstrom|macys|sephora|ulta|walgreens|cvs|grocery|pharmacy|bookstore|electronic|fashion|cloth|shoe|jewelry|watch|accessory|furniture|home|garden|appliance|tool|hardware|toy|game|hobby|craft|pet|baby|kids|beauty|cosmetic|skin|hair|perfume|health|wellness|vitamin|supplement|fitness|sport|outdoor|travel|luggage|car|auto|vehicle/i,

  health_fitness:
    /health|fit|gym|exercise|workout|yoga|pilates|meditate|doctor|dr|hospital|clinic|medical|pharma|dentist|optic|therapy|counsel|psych|neuro|cardio|onco|derm|pediatric|surgery|scan|xray|mri|blood|test|diagnos|vaccine|antibiotic|pain|relief|recover|rehab|physical|nutrition|diet|weight|fasting|keto|paleo|vegan|vegetarian|gluten|dairy|organic|natural|homeopath|ayurved|acupunctu|chiropract|massage|reflex|aromather|reiki|shiatsu|thai|swedish|deep|sport|trigger|rolf|cranio|polar|felden|alexander|bowen|martial|boxing|kickbox|muay|judo|taekwondo|karate|aikido|jiu|wrestle|mma/i,

  travel_tourism:
    /travel|tour|trip|vacation|holiday|resort|cruise|hotel|motel|hostel|airbnb|flight|fly|airline|booking|expedia|kayak|orbitz|priceline|trivago|sightsee|adventure|safari|backpack|camp|rv|glamp|beach|mountain|ski|snow|surf|dive|snorkel|hike|trek|climb|bike|cycle|motorcycle|sail|boat|yacht|kayak|canoe|raft|fish|hunt|golf|tennis|soccer|rugby|cricket|baseball|basketball|volleyball|badminton|tabletennis|chess|poker|casino|bet|gamble|lottery|bingo|arcade|theme|park|zoo|aquarium|museum|gallery|exhibit|show|performance|concert|festival|event|ticket/i,

  personal:
    /personal|private|self|me|my|individual|family|home|profile|account|user|login|signin|register|signup|create|edit|update|delete|remove|manage|setting|preference|option|config|setup|install|download|upload|sync|backup|restore|reset|password|security|privacy|term|condition|policy|cookie|gdpr|ccpa|hipaa|ferpa|sox|pci|legal|law|attorney|lawyer|notary|court|judge|jury|trial|verdict|sentence|appeal|government|president|prime|minister|mayor|governor|senator|congress|representative/i,
};
