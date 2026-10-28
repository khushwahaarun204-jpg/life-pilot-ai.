// Pre-curated realistic sample notices and circulars for first-time users and repeatable testing

export const SAMPLES = [
  {
    id: 'school-circular',
    title: 'School Annual Day & Fee Notice',
    category: 'Education & Parenting',
    icon: 'GraduationCap',
    text: `DELHI PUBLIC ACADEMY - NOTICE
Date: October 24, 2026
Circular No: DPA/2026/108

Dear Parents/Guardians,

Sub: 15th Annual Day Celebration & Term II Fee Clearance

We are delighted to announce that our 15th Annual Day 'Udaan 2026' will be celebrated on Saturday, November 14, 2026 at the Siri Fort Auditorium, New Delhi from 4:30 PM to 8:00 PM.

Important Instructions & Deadlines:
1. Consent & Costume Fee: A non-refundable costume deposit of ₹1,800 must be deposited with the respective class teacher by Friday, November 6, 2026.
2. Rehearsal Attendance: Full dress rehearsal will take place on November 12, 2026. Attendance is mandatory for all participating students.
3. Term II Tuition Fees: Parents are requested to clear all pending Term II school fees amounting to ₹14,500 latest by November 10, 2026 to ensure admit card issuance for upcoming December exams.
4. Entry Passes: Each family will receive 2 entry passes upon submission of the signed consent slip. Additional passes are not guaranteed and depend on auditorium capacity.
5. Transport: School bus pickup will run at 1:00 PM on the event day. Parents must arrange their own return pickup for children at 8:15 PM sharp.

For queries, contact the Event Coordinator Ms. Sharma at eventcoord@dpa.edu during school hours (8:00 AM - 2:00 PM).

Principal,
Dr. Rajesh Malhotra`,
    demoResponse: {
      en: {
        summary: "Delhi Public Academy will host its 15th Annual Day on Nov 14, 2026 at Siri Fort Auditorium. Parents need to pay ₹1,800 costume fee by Nov 6, clear ₹14,500 tuition fees by Nov 10, ensure attendance at the Nov 12 dress rehearsal, and arrange evening return transport.",
        facts: [
          "Event date: Saturday, Nov 14, 2026 from 4:30 PM to 8:00 PM at Siri Fort Auditorium.",
          "Costume fee is ₹1,800 non-refundable, due by Nov 6, 2026.",
          "Term II tuition fee of ₹14,500 must be cleared by Nov 10, 2026 to receive exam admit cards.",
          "Full dress rehearsal is mandatory on Nov 12, 2026.",
          "2 entry passes provided per family with signed consent slip.",
          "School bus departs at 1:00 PM on event day; parents must pick up students at 8:15 PM sharp."
        ],
        datesAndAmounts: [
          { label: "Costume Fee Deadline", value: "Nov 6, 2026", type: "date" },
          { label: "Costume Deposit", value: "₹1,800 (non-refundable)", type: "amount" },
          { label: "Term II Fee Deadline", value: "Nov 10, 2026", type: "date" },
          { label: "Term II School Fees", value: "₹14,500", type: "amount" },
          { label: "Mandatory Rehearsal", value: "Nov 12, 2026", type: "date" },
          { label: "Annual Day Event", value: "Nov 14, 2026 (4:30 PM - 8:00 PM)", type: "date" },
          { label: "Parent Pickup Time", value: "Nov 14, 2026 at 8:15 PM", type: "date" }
        ],
        uncertainties: [
          "How to submit the costume fee (cash to teacher vs online portal is not stated).",
          "Availability and cost of extra passes beyond the 2 allotted tickets.",
          "Specific lunch/snack arrangements during the 1:00 PM - 4:30 PM rehearsal period."
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: 'Pay ₹1,800 costume deposit & submit consent form',
            description: 'Submit to class teacher before deadline to ensure child participation.',
            priority: 'High',
            deadline: '2026-11-06',
            status: 'pending',
            category: 'Financial / School'
          },
          {
            id: 'task-2',
            title: 'Clear ₹14,500 Term II tuition fees',
            description: 'Required before Nov 10 to receive December exam admit card.',
            priority: 'High',
            deadline: '2026-11-10',
            status: 'pending',
            category: 'Financial'
          },
          {
            id: 'task-3',
            title: 'Ensure student attends dress rehearsal',
            description: 'Mandatory full dress rehearsal at school.',
            priority: 'Medium',
            deadline: '2026-11-12',
            status: 'pending',
            category: 'Event'
          },
          {
            id: 'task-4',
            title: 'Arrange evening return pickup at Siri Fort Auditorium',
            description: 'Parents must personally pick up child at 8:15 PM sharp.',
            priority: 'Medium',
            deadline: '2026-11-14',
            status: 'pending',
            category: 'Logistics'
          },
          {
            id: 'task-5',
            title: 'Contact Ms. Sharma regarding extra entry passes (Optional)',
            description: 'Email eventcoord@dpa.edu if grandparents or guests wish to attend.',
            priority: 'Low',
            deadline: null,
            status: 'pending',
            category: 'Communication'
          }
        ]
      },
      hi: {
        summary: "दिल्ली पब्लिक एकेडमी का 15वां वार्षिकोत्सव 14 नवंबर 2026 को सिरी फोर्ट ऑडिटोरियम में आयोजित होगा। माता-पिता को 6 नवंबर तक ₹1,800 पोशाक शुल्क जमा करना होगा, 10 नवंबर तक ₹14,500 स्कूल फीस चुकानी होगी, 12 नवंबर को ड्रेस रिहर्सल में उपस्थिति सुनिश्चित करनी होगी और शाम को बच्चों को घर ले जाने की व्यवस्था करनी होगी।",
        facts: [
          "वार्षिकोत्सव 14 नवंबर 2026 को शाम 4:30 से रात 8:00 बजे तक सिरी फोर्ट ऑडिटोरियम में होगा।",
          "पोशाक शुल्क ₹1,800 गैर-वापसी योग्य है, जिसे 6 नवंबर 2026 तक जमा करना अनिवार्य है।",
          "टर्म II की ₹14,500 फीस 10 नवंबर 2026 तक जमा करनी होगी ताकि दिसंबर परीक्षा का एडमिट कार्ड मिल सके।",
          "12 नवंबर 2026 को पूरी ड्रेस रिहर्सल में भाग लेना अनिवार्य है।",
          "सहमति पत्र जमा करने पर प्रत्येक परिवार को 2 प्रवेश पास मिलेंगे।",
          "कार्यक्रम के दिन स्कूल बस दोपहर 1:00 बजे ले जाएगी; शाम 8:15 बजे माता-पिता को खुद बच्चे को लेना होगा।"
        ],
        datesAndAmounts: [
          { label: "पोशाक शुल्क की अंतिम तिथि", value: "6 नवंबर 2026", type: "date" },
          { label: "पोशाक शुल्क", value: "₹1,800 (गैर-वापसी योग्य)", type: "amount" },
          { label: "स्कूल फीस की अंतिम तिथि", value: "10 नवंबर 2026", type: "date" },
          { label: "टर्म II फीस", value: "₹14,500", type: "amount" },
          { label: "अनिवार्य रिहर्सल", value: "12 नवंबर 2026", type: "date" },
          { label: "वार्षिकोत्सव कार्यक्रम", value: "14 नवंबर 2026 (शाम 4:30 - रात 8:00)", type: "date" },
          { label: "माता-पिता द्वारा पिकअप समय", value: "14 नवंबर 2026 रात 8:15 बजे", type: "date" }
        ],
        uncertainties: [
          "पोशाक शुल्क नकद देना है या ऑनलाइन पोर्टल से, यह स्पष्ट नहीं है।",
          "2 पास के अतिरिक्त और पास मिलेंगे या नहीं और उसका शुल्क क्या होगा।",
          "दोपहर 1:00 से शाम 4:30 बजे रिहर्सल के दौरान जलपान/भोजन की व्यवस्था।"
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: '₹1,800 पोशाक शुल्क और सहमति पत्र जमा करें',
            description: 'अंतिम तिथि से पहले कक्षा अध्यापक को जमा करें ताकि बच्चे की भागीदारी पक्की हो सके।',
            priority: 'High',
            deadline: '2026-11-06',
            status: 'pending',
            category: 'स्कूल / शुल्क'
          },
          {
            id: 'task-2',
            title: 'टर्म II की ₹14,500 फीस का भुगतान करें',
            description: 'दिसंबर परीक्षा का एडमिट कार्ड प्राप्त करने हेतु 10 नवंबर तक आवश्यक।',
            priority: 'High',
            deadline: '2026-11-10',
            status: 'pending',
            category: 'वित्तीय'
          },
          {
            id: 'task-3',
            title: '12 नवंबर को ड्रेस रिहर्सल में बच्चे की उपस्थिति सुनिश्चित करें',
            description: 'स्कूल में अनिवार्य पूर्ण ड्रेस रिहर्सल।',
            priority: 'Medium',
            deadline: '2026-11-12',
            status: 'pending',
            category: 'कार्यक्रम'
          },
          {
            id: 'task-4',
            title: 'सिरी फोर्ट ऑडिटोरियम से रात 8:15 बजे पिकअप की व्यवस्था करें',
            description: 'माता-पिता को कार्यक्रम समाप्ति पर बच्चे को व्यक्तिगत रूप से लेना होगा।',
            priority: 'Medium',
            deadline: '2026-11-14',
            status: 'pending',
            category: 'यातायात'
          },
          {
            id: 'task-5',
            title: 'अतिरिक्त पास के लिए सुश्री शर्मा से संपर्क करें (वैकल्पिक)',
            description: 'यदि अन्य सदस्य आना चाहते हैं तो eventcoord@dpa.edu पर ईमेल करें।',
            priority: 'Low',
            deadline: null,
            status: 'pending',
            category: 'संपर्क'
          }
        ]
      }
    }
  },
  {
    id: 'apartment-maintenance',
    title: 'Apartment Water Supply & Elevator Maintenance',
    category: 'Community & Housing',
    icon: 'Building2',
    text: `GREENWOOD HEIGHTS RESIDENTS WELFARE ASSOCIATION (RWA)
NOTICE TO ALL RESIDENTS - TOWER A & B
Date: October 27, 2026

Subject: Scheduled Water Tank Cleaning & Passenger Lift Overhaul

Please take note of upcoming critical infrastructure maintenance across Greenwood Heights:

1. Underground & Overhead Water Tank Disinfection:
   - Schedule: Thursday, October 29, 2026 from 9:00 AM to 5:00 PM.
   - Water supply will be completely suspended during this 8-hour window.
   - Residents are urged to store sufficient water for cooking, drinking, and sanitation on Wednesday night (Oct 28).

2. Lift Overhaul (Tower A - Passenger Lift 1):
   - Service begins: Friday, October 30, 2026 at 10:00 AM and concludes Saturday, October 31 at 6:00 PM.
   - Service lift will remain operational for emergency and stretcher use only.
   - Expect longer wait times during peak morning hours (8:00 AM - 10:00 AM).

3. Emergency Maintenance Levy:
   - An ad-hoc contribution of ₹2,500 per flat has been approved in the AGM for boiler and sensor upgrades.
   - Due date: November 5, 2026. A penalty of ₹200 applies after the cutoff date.
   - Pay via UPI to rwa@greenwoodheights or visit the estate office.

For urgent queries or elderly assistance, call the Estate Manager Mr. Verma at +91-98765-43210.`,
    demoResponse: {
      en: {
        summary: "Greenwood Heights has scheduled water tank cleaning on Oct 29 (no water 9 AM-5 PM), lift overhaul for Tower A from Oct 30-31, and a ₹2,500 maintenance levy due by Nov 5 (with ₹200 late fee).",
        facts: [
          "Water supply suspended completely on Oct 29, 2026 from 9:00 AM to 5:00 PM.",
          "Residents must store water in advance on Wednesday night, Oct 28.",
          "Passenger Lift 1 under overhaul from Oct 30 (10 AM) to Oct 31 (6 PM).",
          "Service lift reserved for emergencies and stretchers only.",
          "₹2,500 maintenance levy per apartment due by Nov 5, 2026.",
          "Late payment penalty of ₹200 applies after Nov 5."
        ],
        datesAndAmounts: [
          { label: "Water Storage Deadline", value: "Wednesday night, Oct 28, 2026", type: "date" },
          { label: "Water Cut Period", value: "Oct 29, 2026 (9:00 AM - 5:00 PM)", type: "date" },
          { label: "Lift Overhaul Window", value: "Oct 30 (10 AM) to Oct 31 (6 PM)", type: "date" },
          { label: "Maintenance Levy", value: "₹2,500 per flat", type: "amount" },
          { label: "Levy Due Date", value: "Nov 5, 2026", type: "date" },
          { label: "Late Fee Penalty", value: "₹200", type: "amount" }
        ],
        uncertainties: [
          "Whether water will resume at full pressure immediately after 5:00 PM on Oct 29.",
          "Whether Tower B lifts are affected at all (notice only states Tower A Passenger Lift 1).",
          "Exact hours of the Estate Office for cash/cheque payment."
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: 'Store domestic and drinking water',
            description: 'Fill buckets and bottles on Wednesday night (Oct 28) before 9 AM shutdown on Thursday.',
            priority: 'High',
            deadline: '2026-10-28',
            status: 'pending',
            category: 'Household'
          },
          {
            id: 'task-2',
            title: 'Pay ₹2,500 maintenance levy via UPI',
            description: 'Transfer to rwa@greenwoodheights by Nov 5 to avoid ₹200 late fee.',
            priority: 'Medium',
            deadline: '2026-11-05',
            status: 'pending',
            category: 'Financial'
          },
          {
            id: 'task-3',
            title: 'Plan morning commute around elevator delay',
            description: 'Allow extra travel time during Oct 30-31 mornings due to single lift operation.',
            priority: 'Low',
            deadline: '2026-10-30',
            status: 'pending',
            category: 'Commute'
          }
        ]
      },
      hi: {
        summary: "ग्रीनवुड हाइट्स में 29 अक्टूबर को सुबह 9 से शाम 5 बजे तक पानी की सप्लाई बंद रहेगी। टॉवर A की लिफ्ट 30-31 अक्टूबर को सर्विसिंग के कारण बंद रहेगी। प्रत्येक फ्लैट को ₹2,500 रखरखाव शुल्क 5 नवंबर तक जमा करना होगा (देरी पर ₹200 जुर्माना)।",
        facts: [
          "29 अक्टूबर 2026 को सुबह 9:00 से शाम 5:00 बजे तक पानी पूरी तरह बंद रहेगा।",
          "बुधवार, 28 अक्टूबर की रात को ही पर्याप्त पानी स्टोर करना आवश्यक है।",
          "टॉवर A की पैसेंजर लिफ्ट 30 अक्टूबर (10 AM) से 31 अक्टूबर (6 PM) तक बंद रहेगी।",
          "सर्विस लिफ्ट केवल आपातकालीन स्थिति के लिए उपलब्ध होगी।",
          "₹2,500 प्रति फ्लैट आपातकालीन रखरखाव शुल्क 5 नवंबर 2026 तक देय है।",
          "5 नवंबर के बाद ₹200 का विलंब शुल्क लागू होगा।"
        ],
        datesAndAmounts: [
          { label: "पानी जमा करने का समय", value: "28 अक्टूबर 2026 की रात", type: "date" },
          { label: "पानी कटौती समय", value: "29 अक्टूबर 2026 (सुबह 9:00 - शाम 5:00)", type: "date" },
          { label: "लिफ्ट मरम्मत अवधि", value: "30 अक्टूबर (सुबह 10) से 31 अक्टूबर (शाम 6)", type: "date" },
          { label: "रखरखाव शुल्क", value: "₹2,500 प्रति फ्लैट", type: "amount" },
          { label: "शुल्क भुगतान की अंतिम तिथि", value: "5 नवंबर 2026", type: "date" },
          { label: "विलंब दंड", value: "₹200", type: "amount" }
        ],
        uncertainties: [
          "29 अक्टूबर को शाम 5 बजे के बाद पानी सामान्य दबाव से आएगा या नहीं।",
          "टॉवर B की लिफ्ट पर कोई प्रभाव पड़ेगा या नहीं (केवल टॉवर A का उल्लेख है)।"
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: 'पीने व दैनिक उपयोग के लिए पानी जमा करें',
            description: 'गुरुवार सुबह 9 बजे पानी बंद होने से पूर्व बुधवार रात (28 अक्टूबर) ही बाल्टी व बोतलें भर लें।',
            priority: 'High',
            deadline: '2026-10-28',
            status: 'pending',
            category: 'घरेलू'
          },
          {
            id: 'task-2',
            title: '₹2,500 रखरखाव शुल्क का UPI से भुगतान करें',
            description: '₹200 जुर्माने से बचने के लिए 5 नवंबर तक rwa@greenwoodheights पर भेजें।',
            priority: 'Medium',
            deadline: '2026-11-05',
            status: 'pending',
            category: 'वित्तीय'
          },
          {
            id: 'task-3',
            title: 'लिफ्ट की देरी को ध्यान में रखकर समय निर्धारित करें',
            description: '30 और 31 अक्टूबर की सुबह निकलने के लिए 10-15 मिनट का अतिरिक्त समय रखें।',
            priority: 'Low',
            deadline: '2026-10-30',
            status: 'pending',
            category: 'दैनिक दिनचर्या'
          }
        ]
      }
    }
  },
  {
    id: 'medical-instructions',
    title: 'Pre-Surgery & Medication Guidelines',
    category: 'Healthcare & Wellness',
    icon: 'Stethoscope',
    text: `METROPOLITAN SURGICAL CARE CLINIC
PRE-OPERATIVE PATIENT INSTRUCTION SHEET
Patient: Arvind Swaminathan | Procedure: Laparoscopic Hernia Repair
Date of Procedure: Monday, November 9, 2026 at 7:30 AM
Surgeon: Dr. Sunita Kulkarni, MS (Gen Surg)

Please strictly comply with the following instructions to avoid cancellation of your surgery:

1. Fasting (NPO) Protocol:
   - Absolute fasting from midnight (12:00 AM) prior to the surgery day (Nov 8 into Nov 9).
   - No solid foods, no milk, no chewing gum, and no water after 4:00 AM on Nov 9.

2. Medication Adjustments:
   - Stop taking Blood Thinners (Aspirin / Ecosprin) starting Monday, November 2, 2026 (7 full days prior).
   - Take blood pressure medication (Telmisartan 40mg) on the morning of surgery at 6:00 AM with a single sip of water.
   - Withhold diabetic medications (Metformin) on the morning of surgery.

3. Hospital Admission & Testing:
   - Complete Pre-Anaesthesia Checkup (PAC) and blood tests (CBC, PT/INR, ECG) by Thursday, November 5, 2026.
   - Arrive at the 2nd Floor Daycare Desk on Nov 9 at 6:00 AM sharp.
   - Bring photo ID, insurance e-card, and original diagnostic reports.
   - An adult attendant must accompany the patient and remain throughout the procedure.

4. Financial Clearance:
   - Initial deposit of ₹35,000 to be authorized at the TPA desk by Nov 6, 2026 if using cashless mediclaim.

Helpline: +91-11-2654-9900 (Ext 402) - Day Surgery Coordinator`,
    demoResponse: {
      en: {
        summary: "Arvind Swaminathan is scheduled for Laparoscopic Hernia Repair on Nov 9, 2026 at 7:30 AM. Must stop Aspirin on Nov 2, complete PAC tests by Nov 5, pay ₹35,000 deposit or cashless clearance by Nov 6, fast strictly from midnight Nov 8, and arrive at 6:00 AM with an adult attendant.",
        facts: [
          "Surgery date: Monday, Nov 9, 2026 at 7:30 AM (reporting time 6:00 AM).",
          "Stop blood thinners (Aspirin) 7 days prior on Nov 2, 2026.",
          "Pre-Anaesthesia Checkup (PAC) and blood tests must be completed by Nov 5, 2026.",
          "Insurance / TPA deposit authorization of ₹35,000 required by Nov 6, 2026.",
          "Absolute fasting from midnight Nov 8; no water after 4:00 AM on Nov 9.",
          "Take BP medicine at 6:00 AM with one sip of water; do not take diabetic medication.",
          "An adult attendant must accompany the patient throughout the day."
        ],
        datesAndAmounts: [
          { label: "Stop Blood Thinners (Aspirin)", value: "Nov 2, 2026", type: "date" },
          { label: "PAC & Blood Tests Due", value: "Nov 5, 2026", type: "date" },
          { label: "TPA / Cashless Deposit Due", value: "Nov 6, 2026", type: "date" },
          { label: "TPA Deposit Amount", value: "₹35,000", type: "amount" },
          { label: "Fasting Begins (No solid food)", value: "Midnight, Nov 8, 2026", type: "date" },
          { label: "Strict No Water Cutoff", value: "Nov 9, 2026 at 4:00 AM", type: "date" },
          { label: "Hospital Arrival Time", value: "Nov 9, 2026 at 6:00 AM", type: "date" },
          { label: "Surgery Start Time", value: "Nov 9, 2026 at 7:30 AM", type: "date" }
        ],
        uncertainties: [
          "Expected discharge time (same day evening or next morning overnight stay).",
          "Whether post-operative compression garment needs to be purchased independently.",
          "Mode of cashless authorization (physical original policy bond needed or digital e-card is sufficient)."
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: 'Stop taking Aspirin / Ecosprin blood thinners',
            description: 'Critical safety step: discontinue 7 days prior to surgery on Nov 2.',
            priority: 'High',
            deadline: '2026-11-02',
            status: 'pending',
            category: 'Medication'
          },
          {
            id: 'task-2',
            title: 'Complete PAC and pre-op blood tests',
            description: 'Visit hospital lab for CBC, PT/INR, ECG, and anaesthetist clearance.',
            priority: 'High',
            deadline: '2026-11-05',
            status: 'pending',
            category: 'Medical'
          },
          {
            id: 'task-3',
            title: 'Submit ₹35,000 TPA cashless insurance authorization',
            description: 'Process paperwork at TPA insurance desk 3 days ahead of procedure.',
            priority: 'High',
            deadline: '2026-11-06',
            status: 'pending',
            category: 'Financial / Insurance'
          },
          {
            id: 'task-4',
            title: 'Confirm adult attendant availability for Nov 9',
            description: 'Ensure a family member or friend is free to stay at clinic from 6 AM onward.',
            priority: 'Medium',
            deadline: '2026-11-07',
            status: 'pending',
            category: 'Personal'
          },
          {
            id: 'task-5',
            title: 'Begin strict fasting from midnight',
            description: 'No solid food after midnight Nov 8, and no water after 4:00 AM Nov 9.',
            priority: 'High',
            deadline: '2026-11-08',
            status: 'pending',
            category: 'Protocol'
          }
        ]
      },
      hi: {
        summary: "अरविंद स्वामीनाथन की लेप्रोस्कोपिक हर्निया सर्जरी 9 नवंबर 2026 को सुबह 7:30 बजे निर्धारित है। 2 नवंबर से एस्पिरिन दवा बंद करनी होगी, 5 नवंबर तक PAC जांच करानी होगी, 6 नवंबर तक ₹35,000 बीमा स्वीकृति करानी होगी, 8 नवंबर की आधी रात से उपवास रखना होगा और 9 नवंबर को सुबह 6:00 बजे एक वयस्क अटेंडेंट के साथ अस्पताल पहुंचना होगा।",
        facts: [
          "सर्जरी की तिथि: सोमवार, 9 नवंबर 2026 सुबह 7:30 बजे (पहुंचने का समय सुबह 6:00 बजे)।",
          "खून पतला करने वाली दवा (एस्पिरिन) 7 दिन पहले यानी 2 नवंबर 2026 से बंद करनी है।",
          "प्री-एनेस्थीसिया चेकअप (PAC) और रक्त परीक्षण 5 नवंबर 2026 तक पूरे करने होंगे।",
          "बीमा कैशलेस के लिए ₹35,000 का प्रारंभिक जमा/मंजूरी 6 नवंबर 2026 तक जरूरी है।",
          "8 नवंबर की आधी रात से पूर्ण उपवास; 9 नवंबर सुबह 4:00 बजे के बाद पानी भी नहीं पीना है।",
          "बीपी की गोली सुबह 6:00 बजे एक घूंट पानी से ले सकते हैं; शुगर की गोली नहीं लेनी है।",
          "एक वयस्क तीमारदार का साथ रहना अनिवार्य है।"
        ],
        datesAndAmounts: [
          { label: "एस्पिरिन बंद करने की तिथि", value: "2 नवंबर 2026", type: "date" },
          { label: "PAC व जांच की अंतिम तिथि", value: "5 नवंबर 2026", type: "date" },
          { label: "टीपीए बीमा जमा की अंतिम तिथि", value: "6 नवंबर 2026", type: "date" },
          { label: "प्रारंभिक बीमा राशि", value: "₹35,000", type: "amount" },
          { label: "उपवास शुरू (भोजन बंद)", value: "8 नवंबर 2026 की आधी रात", type: "date" },
          { label: "पानी पीने की अंतिम सीमा", value: "9 नवंबर 2026 सुबह 4:00 बजे", type: "date" },
          { label: "अस्पताल में रिपोर्टिंग", value: "9 नवंबर 2026 सुबह 6:00 बजे", type: "date" },
          { label: "सर्जरी शुरू", value: "9 नवंबर 2026 सुबह 7:30 बजे", type: "date" }
        ],
        uncertainties: [
          "अस्पताल से छुट्टी उसी दिन शाम को होगी या अगले दिन, यह स्पष्ट नहीं है।",
          "सर्जरी के बाद का बेल्ट/बैंडेज अस्पताल से मिलेगा या खुद खरीदना होगा।"
        ],
        actionPlan: [
          {
            id: 'task-1',
            title: 'एस्पिरिन / खून पतला करने वाली दवाएं बंद करें',
            description: 'सर्जरी सुरक्षा प्रोटोकॉल: 2 नवंबर से दवा बंद करना अनिवार्य है।',
            priority: 'High',
            deadline: '2026-11-02',
            status: 'pending',
            category: 'दवा'
          },
          {
            id: 'task-2',
            title: 'PAC और आवश्यक रक्त जांच पूरी करें',
            description: '5 नवंबर तक अस्पताल में CBC, PT/INR, ECG और एनेस्थेटिस्ट की सहमति लें।',
            priority: 'High',
            deadline: '2026-11-05',
            status: 'pending',
            category: 'चिकित्सा'
          },
          {
            id: 'task-3',
            title: '₹35,000 कैशलेस बीमा मंजूरी प्रक्रिया पूरी करें',
            description: '6 नवंबर तक TPA डेस्क पर दस्तावेज देकर प्री-ऑथराइजेशन प्राप्त करें।',
            priority: 'High',
            deadline: '2026-11-06',
            status: 'pending',
            category: 'वित्तीय / बीमा'
          },
          {
            id: 'task-4',
            title: '9 नवंबर के लिए अटेंडेंट की व्यवस्था पक्की करें',
            description: 'पूरे दिन देखभाल के लिए परिवार के सदस्य या मित्र को तैयार रखें।',
            priority: 'Medium',
            deadline: '2026-11-07',
            status: 'pending',
            category: 'व्यक्तिगत'
          },
          {
            id: 'task-5',
            title: '8 नवंबर रात 12 बजे से खाली पेट रहें',
            description: 'आधी रात के बाद भोजन न लें, सुबह 4 बजे के बाद पानी भी बंद रखें।',
            priority: 'High',
            deadline: '2026-11-08',
            status: 'pending',
            category: 'प्रोटोकॉल'
          }
        ]
      }
    }
  }
];
