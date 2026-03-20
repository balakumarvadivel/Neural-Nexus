export const riskSeries = [24, 32, 28, 44, 52, 61, 48];
export const riskLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const activityTimeline = [
  {
    time: "08:10",
    headline: "Heavy rain trigger evaluated",
    detail: "South Bengaluru corridor crossed the rainfall threshold and policy conditions were reevaluated.",
    tone: "warning" as const
  },
  {
    time: "09:30",
    headline: "Protection state confirmed",
    detail: "Your weekly protection remains active with auto-payout readiness.",
    tone: "success" as const
  },
  {
    time: "11:00",
    headline: "System updated route risk",
    detail: "AQI risk lowered in Indiranagar while heat exposure increased in eastern delivery zones.",
    tone: "info" as const
  }
];

export const heatmapData = [
  [
    { label: "North Hub", value: 61 },
    { label: "Central Hub", value: 79 },
    { label: "Airport Belt", value: 43 }
  ],
  [
    { label: "West Corridor", value: 70 },
    { label: "East Corridor", value: 54 },
    { label: "South Tech Belt", value: 84 }
  ]
];

export const monitoringZones = [
  { label: "Koramangala", value: "Rain alert", detail: "18 min to threshold" },
  { label: "Whitefield", value: "Heat spike", detail: "Feels like 42 C" },
  { label: "HSR Layout", value: "AQI drift", detail: "Now 176 and rising" }
];

export const payoutEvents = [
  {
    time: "This week",
    headline: "Auto payout triggered for rain disruption",
    detail: "UPI transfer queued after 90 minutes of sustained unsafe conditions.",
    tone: "success" as const
  },
  {
    time: "Yesterday",
    headline: "Manual review bypassed",
    detail: "Trust score remained above 80 so the payout engine processed immediately.",
    tone: "info" as const
  },
  {
    time: "3 days ago",
    headline: "Processing delay avoided",
    detail: "No fraud anomalies detected during session verification.",
    tone: "success" as const
  }
];

export const alertsFeed = [
  { label: "Weather alert", value: "High", detail: "Rainfall threshold likely within 30 minutes", tone: "alert" as const },
  { label: "Risk warning", value: "Medium", detail: "Heat score elevated from 1 PM to 3 PM" },
  { label: "System notification", value: "Low", detail: "Model refresh completed 4 minutes ago", tone: "safe" as const }
];

export const analyticsSeries = [420, 510, 470, 560, 630, 590, 680];
export const earningsSeries = [700, 680, 540, 620, 510, 590, 760];
export const protectedIncomeSeries = [420, 420, 390, 420, 390, 410, 440];
