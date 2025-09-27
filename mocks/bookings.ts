// Booking and Payment Related Mock Data

export interface Booking {
  id: string;
  studentId: string;
  coachId: string;
  sessionBlockId?: string;
  type: "single_session" | "session_block";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  bookingDate: string;
  sessionDate?: string;
  sessionTime?: string;
  duration: number; // minutes
  price: number;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  location: string;
  mode: "online" | "offline";
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "bank_transfer" | "ewallet";
  lastFour?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded";
  paymentMethodId: string;
  transactionId?: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiryDate?: string;
  isActive: boolean;
  applicableCoachIds?: string[];
  applicableSessionTypes?: string[];
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  coachId: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  notes?: string;
  status: "waiting" | "contacted" | "fulfilled" | "expired";
  createdAt: string;
}

// Mock Payment Methods
export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm1",
    type: "credit_card",
    lastFour: "4242",
    brand: "visa",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "pm2",
    type: "credit_card",
    lastFour: "5555",
    brand: "mastercard",
    expiryMonth: 8,
    expiryYear: 2024,
    isDefault: false,
  },
  {
    id: "pm3",
    type: "ewallet",
    isDefault: false,
  },
];

// Mock Discount Codes
export const MOCK_DISCOUNT_CODES: DiscountCode[] = [
  {
    id: "dc1",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    minAmount: 50,
    maxUses: 100,
    usedCount: 45,
    expiryDate: "2024-12-31",
    isActive: true,
    applicableSessionTypes: ["single_session", "session_block"],
  },
  {
    id: "dc2",
    code: "FIRST10",
    type: "fixed_amount",
    value: 10,
    minAmount: 30,
    maxUses: 50,
    usedCount: 23,
    expiryDate: "2024-06-30",
    isActive: true,
    applicableSessionTypes: ["single_session"],
  },
  {
    id: "dc3",
    code: "ADVANCED15",
    type: "percentage",
    value: 15,
    minAmount: 100,
    maxUses: 30,
    usedCount: 12,
    expiryDate: "2024-09-30",
    isActive: true,
    applicableSessionTypes: ["session_block"],
    applicableCoachIds: ["coach1", "coach2"],
  },
];

// Mock Bookings
export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "booking1",
    studentId: "student1",
    coachId: "coach1",
    sessionBlockId: "block1",
    type: "session_block",
    status: "confirmed",
    bookingDate: "2024-01-15T10:00:00Z",
    sessionDate: "2024-01-22T09:00:00Z",
    sessionTime: "09:00",
    duration: 60,
    price: 400,
    paymentStatus: "paid",
    location: "Crescent Court, 123 Main St",
    mode: "offline",
    notes: "First session of Pickleball Fundamentals program",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "booking2",
    studentId: "student2",
    coachId: "coach1",
    type: "single_session",
    status: "completed",
    bookingDate: "2024-01-10T14:00:00Z",
    sessionDate: "2024-01-12T17:00:00Z",
    sessionTime: "17:00",
    duration: 60,
    price: 75,
    paymentStatus: "paid",
    location: "Crescent Court, 123 Main St",
    mode: "offline",
    notes: "Focus on serve technique",
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-12T18:00:00Z",
  },
  {
    id: "booking3",
    studentId: "student3",
    coachId: "coach2",
    sessionBlockId: "block4",
    type: "session_block",
    status: "confirmed",
    bookingDate: "2024-01-08T09:00:00Z",
    sessionDate: "2024-01-15T06:00:00Z",
    sessionTime: "06:00",
    duration: 90,
    price: 900,
    paymentStatus: "paid",
    location: "Tennis Club Hanoi, 789 Sport St",
    mode: "offline",
    notes: "Tournament preparation program",
    createdAt: "2024-01-08T09:00:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
  },
  {
    id: "booking4",
    studentId: "student4",
    coachId: "coach3",
    type: "single_session",
    status: "pending",
    bookingDate: "2024-01-20T11:00:00Z",
    sessionDate: "2024-01-25T18:00:00Z",
    sessionTime: "18:00",
    duration: 60,
    price: 85,
    paymentStatus: "pending",
    location: "Da Nang Sports Center, 333 Beach Rd",
    mode: "offline",
    meetingLink: "https://zoom.us/j/michaelchen",
    notes: "Doubles strategy session",
    createdAt: "2024-01-20T11:00:00Z",
    updatedAt: "2024-01-20T11:00:00Z",
  },
  {
    id: "booking5",
    studentId: "student1",
    coachId: "coach1",
    type: "single_session",
    status: "cancelled",
    bookingDate: "2024-01-05T16:00:00Z",
    sessionDate: "2024-01-08T07:00:00Z",
    sessionTime: "07:00",
    duration: 60,
    price: 75,
    paymentStatus: "refunded",
    location: "Crescent Court, 123 Main St",
    mode: "offline",
    notes: "Cancelled by student due to scheduling conflict",
    createdAt: "2024-01-05T16:00:00Z",
    updatedAt: "2024-01-06T10:00:00Z",
  },
];

// Mock Payments
export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay1",
    bookingId: "booking1",
    amount: 400,
    currency: "USD",
    status: "succeeded",
    paymentMethodId: "pm1",
    transactionId: "txn_123456789",
    createdAt: "2024-01-15T10:30:00Z",
    processedAt: "2024-01-15T10:31:00Z",
  },
  {
    id: "pay2",
    bookingId: "booking2",
    amount: 75,
    currency: "USD",
    status: "succeeded",
    paymentMethodId: "pm1",
    transactionId: "txn_987654321",
    createdAt: "2024-01-10T14:30:00Z",
    processedAt: "2024-01-10T14:32:00Z",
  },
  {
    id: "pay3",
    bookingId: "booking3",
    amount: 900,
    currency: "USD",
    status: "succeeded",
    paymentMethodId: "pm2",
    transactionId: "txn_456789123",
    createdAt: "2024-01-08T09:15:00Z",
    processedAt: "2024-01-08T09:17:00Z",
  },
  {
    id: "pay4",
    bookingId: "booking5",
    amount: 75,
    currency: "USD",
    status: "refunded",
    paymentMethodId: "pm1",
    transactionId: "txn_789123456",
    createdAt: "2024-01-05T16:30:00Z",
    processedAt: "2024-01-06T10:00:00Z",
  },
];

// Mock Waitlist Entries
export const MOCK_WAITLIST: WaitlistEntry[] = [
  {
    id: "wait1",
    studentId: "student2",
    coachId: "coach1",
    preferredDate: "2024-01-30",
    preferredTime: "09:00",
    duration: 60,
    notes: "Looking for weekend availability",
    status: "waiting",
    createdAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "wait2",
    studentId: "student3",
    coachId: "coach2",
    preferredDate: "2024-02-05",
    preferredTime: "07:00",
    duration: 90,
    status: "contacted",
    createdAt: "2024-01-18T09:00:00Z",
  },
];

// Mock Notification Templates
export interface NotificationTemplate {
  id: string;
  type:
    | "booking_confirmed"
    | "booking_reminder"
    | "session_cancelled"
    | "payment_received"
    | "coach_request";
  title: string;
  message: string;
  channels: ("push" | "email" | "sms")[];
  sendTiming: "immediate" | "before_24h" | "before_1h" | "after_event";
}

export const MOCK_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: "notif1",
    type: "booking_confirmed",
    title: "Booking Confirmed",
    message:
      "Your {booking_type} with {coach_name} on {date} at {time} has been confirmed.",
    channels: ["push", "email"],
    sendTiming: "immediate",
  },
  {
    id: "notif2",
    type: "booking_reminder",
    title: "Session Reminder",
    message:
      "Reminder: You have a session with {coach_name} tomorrow at {time}. Location: {location}",
    channels: ["push", "sms"],
    sendTiming: "before_24h",
  },
  {
    id: "notif3",
    type: "session_cancelled",
    title: "Session Cancelled",
    message:
      "Your session with {coach_name} on {date} has been cancelled. Refund processed.",
    channels: ["push", "email"],
    sendTiming: "immediate",
  },
  {
    id: "notif4",
    type: "payment_received",
    title: "Payment Received",
    message: "Payment of ${amount} for your {booking_type} has been received.",
    channels: ["push", "email"],
    sendTiming: "immediate",
  },
  {
    id: "notif5",
    type: "coach_request",
    title: "New Booking Request",
    message:
      "You have a new booking request from {student_name} for {date} at {time}.",
    channels: ["push", "email"],
    sendTiming: "immediate",
  },
];

// Utility functions
export const getBookingById = (id: string): Booking | undefined => {
  return MOCK_BOOKINGS.find((booking) => booking.id === id);
};

export const getBookingsByStudent = (studentId: string): Booking[] => {
  return MOCK_BOOKINGS.filter((booking) => booking.studentId === studentId);
};

export const getBookingsByCoach = (coachId: string): Booking[] => {
  return MOCK_BOOKINGS.filter((booking) => booking.coachId === coachId);
};

export const getUpcomingBookings = (
  studentId?: string,
  coachId?: string,
): Booking[] => {
  const now = new Date();
  return MOCK_BOOKINGS.filter((booking) => {
    if (studentId && booking.studentId !== studentId) return false;
    if (coachId && booking.coachId !== coachId) return false;
    if (!booking.sessionDate) return false;
    return (
      new Date(booking.sessionDate) > now && booking.status === "confirmed"
    );
  });
};

export const getPaymentByBookingId = (
  bookingId: string,
): Payment | undefined => {
  return MOCK_PAYMENTS.find((payment) => payment.bookingId === bookingId);
};

export const validateDiscountCode = (
  code: string,
  amount: number,
  coachId?: string,
): DiscountCode | null => {
  const discount = MOCK_DISCOUNT_CODES.find(
    (d) => d.code === code && d.isActive,
  );

  if (!discount) return null;
  if (discount.minAmount && amount < discount.minAmount) return null;
  if (discount.maxUses && discount.usedCount >= discount.maxUses) return null;
  if (discount.expiryDate && new Date(discount.expiryDate) < new Date())
    return null;
  if (
    discount.applicableCoachIds &&
    coachId &&
    !discount.applicableCoachIds.includes(coachId)
  )
    return null;

  return discount;
};

export const calculateDiscountedPrice = (
  originalPrice: number,
  discount: DiscountCode,
): number => {
  if (discount.type === "percentage") {
    return originalPrice * (1 - discount.value / 100);
  } else {
    return Math.max(0, originalPrice - discount.value);
  }
};

export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return MOCK_PAYMENT_METHODS.find((method) => method.id === id);
};

export const getDefaultPaymentMethod = (): PaymentMethod | undefined => {
  return MOCK_PAYMENT_METHODS.find((method) => method.isDefault);
};

export const getWaitlistByCoach = (coachId: string): WaitlistEntry[] => {
  return MOCK_WAITLIST.filter(
    (entry) => entry.coachId === coachId && entry.status === "waiting",
  );
};

export const getNotificationTemplate = (
  type: NotificationTemplate["type"],
): NotificationTemplate | undefined => {
  return MOCK_NOTIFICATION_TEMPLATES.find((template) => template.type === type);
};

// Helper function to format currency
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (
  dateString: string,
  format: "short" | "medium" | "long" = "medium",
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    dateStyle: format,
  });
};

// Helper function to format time
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Booking status helper
export const getBookingStatusColor = (status: Booking["status"]): string => {
  switch (status) {
    case "confirmed":
      return "#10b981";
    case "pending":
      return "#f59e0b";
    case "completed":
      return "#3b82f6";
    case "cancelled":
      return "#ef4444";
    case "no_show":
      return "#6b7280";
    default:
      return "#6b7280";
  }
};

export const getBookingStatusText = (status: Booking["status"]): string => {
  switch (status) {
    case "confirmed":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "no_show":
      return "No Show";
    default:
      return "Unknown";
  }
};
