// CMS Schema System - Defines field structures for different section types

export interface FieldSchema {
  type:
    | "text"
    | "textarea"
    | "number"
    | "url"
    | "email"
    | "tel"
    | "array"
    | "object"
    | "select"
    | "date"
    | "datetime"
    | "time"
    | "color"
    | "range"
    | "checkbox"
    | "radio"
    | "file";
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    accept?: string; // For file inputs
  };
  options?: string[]; // For select/radio fields
  fields?: Record<string, FieldSchema>; // For object fields
  itemSchema?: FieldSchema; // For array fields
  defaultValue?: unknown; // Default value for the field
  helpText?: string; // Additional help text
}

export interface SectionSchema {
  name: string;
  description: string;
  fields: Record<string, FieldSchema>;
}

// Built-in section schemas
export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  hero: {
    name: "Hero Section",
    description: "Main banner with title, text, and optional image",
    fields: {
      title: {
        type: "text",
        label: "Title",
        required: false,
        placeholder: "Enter hero title (optional)",
      },
      text: {
        type: "textarea",
        label: "Description",
        placeholder: "Enter hero description",
      },
      image: {
        type: "url",
        label: "Image URL",
        placeholder: "https://example.com/image.jpg",
      },
    },
  },

  services: {
    name: "Service Packages",
    description: "Collection of service offerings with detailed information",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Our Service Packages",
      },
      items: {
        type: "array",
        label: "Service Packages",
        itemSchema: {
          type: "object",
          label: "Service Package",
          fields: {
            title: {
              type: "text",
              label: "Package Title",
              required: true,
              placeholder: "Mini Villa Date",
            },
            price: {
              type: "text",
              label: "Price",
              required: true,
              placeholder: "$285",
            },
            category: {
              type: "select",
              label: "Category",
              options: ["villa", "outdoor", "bubble", "proposal", "custom"],
            },
            duration: {
              type: "text",
              label: "Duration",
              placeholder: "1 hr 30 min",
            },
            guestCount: {
              type: "number",
              label: "Guest Count",
              validation: { min: 1, max: 20 },
            },
            location: {
              type: "text",
              label: "Location",
              placeholder: "Fred Fletcher Park",
            },
            shortDescription: {
              type: "textarea",
              label: "Short Description",
              placeholder: "Brief description for listings",
            },
            fullDescription: {
              type: "textarea",
              label: "Full Description",
              placeholder: "Detailed description of the experience",
            },
            image: {
              type: "url",
              label: "Image URL",
              placeholder: "https://example.com/image.jpg",
            },
            specialFeatures: {
              type: "array",
              label: "Special Features",
              itemSchema: {
                type: "text",
                label: "Feature",
                placeholder: "Love Island villa colors and theme",
              },
            },
            availability: {
              type: "radio",
              label: "Availability Status",
              options: ["available", "limited", "booked", "seasonal"],
              defaultValue: "available",
              helpText: "Current booking availability for this package",
            },
            bookingDeadline: {
              type: "number",
              label: "Booking Deadline (days in advance)",
              validation: { min: 1, max: 365 },
              defaultValue: 7,
              helpText: "How many days in advance must this be booked?",
            },
            seasonalPricing: {
              type: "checkbox",
              label: "Seasonal Pricing",
              placeholder: "This package has different pricing by season",
              helpText: "Check if prices vary by season or demand",
            },
            tags: {
              type: "array",
              label: "Package Tags",
              itemSchema: {
                type: "select",
                label: "Tag",
                options: [
                  "romantic",
                  "family-friendly",
                  "luxury",
                  "budget",
                  "outdoor",
                  "indoor",
                  "customizable",
                  "popular",
                ],
              },
              helpText: "Tags help customers find the right package",
            },
            minimumNotice: {
              type: "range",
              label: "Minimum Notice (hours)",
              validation: { min: 24, max: 720 },
              defaultValue: 48,
              helpText: "Minimum hours of notice required for booking",
            },
            cancellationPolicy: {
              type: "select",
              label: "Cancellation Policy",
              options: ["flexible", "moderate", "strict", "non-refundable"],
              defaultValue: "moderate",
            },
            weatherDependent: {
              type: "checkbox",
              label: "Weather Dependent",
              placeholder: "This service is affected by weather conditions",
              helpText: "Check if weather conditions affect this service",
            },
            addOnsIncluded: {
              type: "array",
              label: "Included Add-Ons",
              itemSchema: {
                type: "text",
                label: "Add-On",
                placeholder: "Bluetooth speaker",
              },
              helpText: "Add-ons that are included in the base price",
            },
          },
        },
      },
    },
  },

  baseline: {
    name: "Baseline Inclusions",
    description: "Standard and additional items included in services",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "What's Included",
      },
      standardInclusions: {
        type: "array",
        label: "Standard Inclusions",
        itemSchema: {
          type: "text",
          label: "Inclusion",
          placeholder: "Soft floor coverings, plush pillows, and cozy blankets",
        },
      },
      additionalInclusions: {
        type: "array",
        label: "Additional Inclusions",
        itemSchema: {
          type: "text",
          label: "Inclusion",
          placeholder: "Refreshing sparkling cider",
        },
      },
    },
  },

  addOns: {
    name: "Add-On Items",
    description: "Optional extras that can be purchased",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Available Add-Ons",
      },
      items: {
        type: "array",
        label: "Add-On Items",
        itemSchema: {
          type: "text",
          label: "Item",
          placeholder: "Charcuterie board",
        },
      },
    },
  },

  contact: {
    name: "Contact Information",
    description: "Business contact details and booking information",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Ready to Book?",
      },
      owner: {
        type: "text",
        label: "Owner/Contact Name",
        placeholder: "Ariana Jagessar",
      },
      email: {
        type: "email",
        label: "Email Address",
        placeholder: "contact@business.com",
      },
      phone: {
        type: "tel",
        label: "Phone Number",
        placeholder: "984-789-0731",
      },
      depositInfo: {
        type: "textarea",
        label: "Deposit Information",
        placeholder: "We accept deposits via CashApp or Zelle...",
      },
    },
  },

  content: {
    name: "Content Section",
    description: "General content with title and text",
    fields: {
      title: {
        type: "text",
        label: "Title",
        required: false,
        placeholder: "Section Title (optional)",
      },
      text: {
        type: "textarea",
        label: "Content",
        placeholder: "Enter your content here...",
      },
      image: {
        type: "url",
        label: "Image URL (optional)",
        placeholder: "https://example.com/image.jpg",
      },
    },
  },

  testimonials: {
    name: "Customer Testimonials",
    description: "Collection of customer reviews and testimonials",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "What Our Customers Say",
      },
      subtitle: {
        type: "text",
        label: "Subtitle (optional)",
        placeholder: "Real experiences from real customers",
      },
      items: {
        type: "array",
        label: "Testimonials",
        itemSchema: {
          type: "object",
          label: "Testimonial",
          fields: {
            name: {
              type: "text",
              label: "Customer Name",
              required: true,
              placeholder: "Sarah Johnson",
            },
            role: {
              type: "text",
              label: "Role/Title (optional)",
              placeholder: "Event Planner",
            },
            company: {
              type: "text",
              label: "Company (optional)",
              placeholder: "Dream Events LLC",
            },
            rating: {
              type: "number",
              label: "Rating (1-5)",
              validation: { min: 1, max: 5 },
              placeholder: "5",
            },
            quote: {
              type: "textarea",
              label: "Testimonial Quote",
              required: true,
              placeholder: "The service was absolutely amazing! Every detail was perfect...",
            },
            image: {
              type: "url",
              label: "Customer Photo (optional)",
              placeholder: "https://example.com/customer-photo.jpg",
            },
            location: {
              type: "text",
              label: "Location (optional)",
              placeholder: "Raleigh, NC",
            },
            eventType: {
              type: "select",
              label: "Event Type",
              options: ["wedding", "birthday", "corporate", "anniversary", "proposal", "other"],
            },
          },
        },
      },
    },
  },

  gallery: {
    name: "Photo Gallery",
    description: "Collection of images with captions",
    fields: {
      title: {
        type: "text",
        label: "Gallery Title",
        required: true,
        placeholder: "Our Work",
      },
      description: {
        type: "textarea",
        label: "Gallery Description",
        placeholder: "Take a look at some of our recent events...",
      },
      layout: {
        type: "select",
        label: "Gallery Layout",
        options: ["grid", "masonry", "carousel", "slideshow"],
      },
      images: {
        type: "array",
        label: "Images",
        itemSchema: {
          type: "object",
          label: "Image",
          fields: {
            src: {
              type: "url",
              label: "Image URL",
              required: true,
              placeholder: "https://example.com/image.jpg",
              defaultValue: "",
            },
            caption: {
              type: "text",
              label: "Caption (optional)",
              placeholder: "Beautiful outdoor setup",
              defaultValue: "",
            },
            alt: {
              type: "text",
              label: "Alt Text",
              required: true,
              placeholder: "Outdoor picnic setup with flowers",
              defaultValue: "",
            },
            category: {
              type: "select",
              label: "Category",
              options: ["villa", "outdoor", "luxury", "bubble", "proposal"],
              defaultValue: "villa",
            },
          },
        },
      },
    },
  },

  events: {
    name: "Upcoming Events",
    description: "Showcase upcoming events and bookings",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Upcoming Events",
      },
      showPastEvents: {
        type: "checkbox",
        label: "Show Past Events",
        placeholder: "Include events that have already happened",
        helpText: "Check this to display past events in a separate section",
      },
      maxEvents: {
        type: "range",
        label: "Maximum Events to Display",
        validation: { min: 1, max: 20 },
        defaultValue: 6,
        helpText: "Limit the number of events shown on the page",
      },
      events: {
        type: "array",
        label: "Events",
        itemSchema: {
          type: "object",
          label: "Event",
          fields: {
            title: {
              type: "text",
              label: "Event Title",
              required: true,
              placeholder: "Summer Wedding Showcase",
            },
            date: {
              type: "date",
              label: "Event Date",
              required: true,
              helpText: "The date when this event takes place",
            },
            time: {
              type: "time",
              label: "Event Time",
              placeholder: "14:00",
              helpText: "Start time for the event",
            },
            duration: {
              type: "number",
              label: "Duration (hours)",
              validation: { min: 0.5, max: 24 },
              placeholder: "2",
            },
            location: {
              type: "text",
              label: "Location",
              required: true,
              placeholder: "Fred Fletcher Park",
            },
            description: {
              type: "textarea",
              label: "Event Description",
              placeholder: "Join us for a beautiful showcase of our wedding packages...",
            },
            eventType: {
              type: "radio",
              label: "Event Type",
              options: ["public", "private", "workshop", "showcase"],
              helpText: "Select the type of event this is",
            },
            price: {
              type: "text",
              label: "Price",
              placeholder: "Free",
              validation: {
                pattern: "^(Free|\\$\\d+(\\.\\d{2})?)$",
              },
              helpText: "Enter 'Free' or price like '$25.00'",
            },
            capacity: {
              type: "number",
              label: "Max Capacity",
              validation: { min: 1, max: 500 },
              placeholder: "50",
            },
            registrationRequired: {
              type: "checkbox",
              label: "Registration Required",
              placeholder: "Guests must register in advance",
            },
            featured: {
              type: "checkbox",
              label: "Featured Event",
              placeholder: "Highlight this event",
              helpText: "Featured events appear at the top of the list",
            },
            image: {
              type: "url",
              label: "Event Image",
              placeholder: "https://example.com/event-image.jpg",
            },
            themeColor: {
              type: "color",
              label: "Theme Color",
              defaultValue: "#3B82F6",
              helpText: "Color used for event styling and highlights",
            },
          },
        },
      },
    },
  },

  pricing: {
    name: "Pricing Plans",
    description: "Display pricing tiers and packages",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Our Pricing",
      },
      subtitle: {
        type: "text",
        label: "Subtitle",
        placeholder: "Choose the perfect package for your event",
      },
      currency: {
        type: "select",
        label: "Currency",
        options: ["USD", "EUR", "GBP", "CAD", "AUD"],
        defaultValue: "USD",
      },
      billingPeriod: {
        type: "radio",
        label: "Billing Period",
        options: ["one-time", "hourly", "daily", "monthly", "yearly"],
        defaultValue: "one-time",
      },
      plans: {
        type: "array",
        label: "Pricing Plans",
        itemSchema: {
          type: "object",
          label: "Plan",
          fields: {
            name: {
              type: "text",
              label: "Plan Name",
              required: true,
              placeholder: "Basic Package",
            },
            price: {
              type: "number",
              label: "Price",
              required: true,
              validation: { min: 0 },
              placeholder: "299",
            },
            popular: {
              type: "checkbox",
              label: "Most Popular",
              placeholder: "Mark as most popular plan",
            },
            description: {
              type: "textarea",
              label: "Plan Description",
              placeholder: "Perfect for intimate gatherings...",
            },
            features: {
              type: "array",
              label: "Features",
              itemSchema: {
                type: "text",
                label: "Feature",
                placeholder: "Setup and cleanup included",
              },
            },
            maxGuests: {
              type: "range",
              label: "Maximum Guests",
              validation: { min: 1, max: 100 },
              defaultValue: 10,
            },
            available: {
              type: "checkbox",
              label: "Currently Available",
              defaultValue: true,
              placeholder: "This plan is available for booking",
            },
          },
        },
      },
    },
  },

  contactInfo: {
    name: "Detailed Contact Information",
    description: "Comprehensive contact details with business information",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Contact Information",
      },
      owner: {
        type: "text",
        label: "Owner/Contact Person",
        placeholder: "Ariana Jagessar",
      },
      email: {
        type: "email",
        label: "Email Address",
        placeholder: "picnicutopia@gmail.com",
      },
      phone: {
        type: "tel",
        label: "Phone Number",
        placeholder: "984-789-0731",
      },
      location: {
        type: "text",
        label: "Service Location",
        placeholder: "Raleigh, NC & Surrounding Areas",
      },
      hours: {
        type: "text",
        label: "Business Hours Summary",
        placeholder: "Available by appointment, 7 days a week",
      },
      businessHours: {
        type: "object",
        label: "Detailed Business Hours",
        fields: {
          monday: { type: "text", label: "Monday", placeholder: "By appointment" },
          tuesday: { type: "text", label: "Tuesday", placeholder: "By appointment" },
          wednesday: { type: "text", label: "Wednesday", placeholder: "By appointment" },
          thursday: { type: "text", label: "Thursday", placeholder: "By appointment" },
          friday: { type: "text", label: "Friday", placeholder: "By appointment" },
          saturday: { type: "text", label: "Saturday", placeholder: "By appointment" },
          sunday: { type: "text", label: "Sunday", placeholder: "By appointment" },
        },
      },
      serviceAreas: {
        type: "array",
        label: "Service Areas",
        itemSchema: {
          type: "text",
          label: "City/Area",
          placeholder: "Raleigh",
        },
      },
      responseTime: {
        type: "text",
        label: "Response Time",
        placeholder: "We typically respond within 2-4 hours during business hours",
      },
      bookingNotice: {
        type: "text",
        label: "Booking Notice",
        placeholder: "We recommend booking at least 1-2 weeks in advance",
      },
      socialMedia: {
        type: "object",
        label: "Social Media",
        fields: {
          facebook: { type: "text", label: "Facebook", placeholder: "Picnic Utopia" },
          instagram: { type: "text", label: "Instagram", placeholder: "@picnicutopia" },
        },
      },
    },
  },

  form: {
    name: "Contact Form",
    description: "Contact form with instructions and required fields",
    fields: {
      title: {
        type: "text",
        label: "Section Title",
        required: true,
        placeholder: "Send Us a Message",
      },
      description: {
        type: "textarea",
        label: "Form Description",
        placeholder: "Fill out the form below and we'll get back to you within 24 hours",
      },
      formInstructions: {
        type: "textarea",
        label: "Form Instructions",
        placeholder: "Please provide as much detail as possible about your event",
      },
      requiredFields: {
        type: "array",
        label: "Required Form Fields",
        itemSchema: {
          type: "text",
          label: "Field Name",
          placeholder: "name",
        },
      },
    },
  },
};

// Helper functions
export function getSectionSchema(type: string): SectionSchema | null {
  return SECTION_SCHEMAS[type] || null;
}

export function getAllSectionTypes(): string[] {
  return Object.keys(SECTION_SCHEMAS);
}

// Custom validation functions
export const ValidationRules = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""));
  },

  price: (value: string): boolean => {
    const priceRegex = /^(Free|\$\d+(\.\d{2})?)$/;
    return priceRegex.test(value);
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  positiveNumber: (value: number): boolean => {
    return typeof value === "number" && value > 0;
  },

  rating: (value: number): boolean => {
    return typeof value === "number" && value >= 1 && value <= 5;
  },

  dateInFuture: (value: string): boolean => {
    const date = new Date(value);
    return date > new Date();
  },

  minLength: (value: string, min: number): boolean => {
    return typeof value === "string" && value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return typeof value === "string" && value.length <= max;
  },
};

export function validateField(
  fieldSchema: FieldSchema,
  value: unknown,
  fieldName: string
): string[] {
  const errors: string[] = [];

  // Required field validation
  if (
    fieldSchema.required &&
    (!value || value === "" || (Array.isArray(value) && value.length === 0))
  ) {
    errors.push(`${fieldSchema.label} is required`);
    return errors; // Don't validate further if required field is empty
  }

  // Skip validation if field is empty and not required
  if (!value || value === "") {
    return errors;
  }

  // Type-specific validation
  switch (fieldSchema.type) {
    case "email":
      if (typeof value === "string" && !ValidationRules.email(value)) {
        errors.push(`${fieldSchema.label} must be a valid email address`);
      }
      break;

    case "tel":
      if (typeof value === "string" && !ValidationRules.phone(value)) {
        errors.push(`${fieldSchema.label} must be a valid phone number`);
      }
      break;

    case "url":
      if (typeof value === "string" && !ValidationRules.url(value)) {
        errors.push(`${fieldSchema.label} must be a valid URL`);
      }
      break;

    case "number":
      if (typeof value === "number") {
        if (fieldSchema.validation?.min !== undefined && value < fieldSchema.validation.min) {
          errors.push(`${fieldSchema.label} must be at least ${fieldSchema.validation.min}`);
        }
        if (fieldSchema.validation?.max !== undefined && value > fieldSchema.validation.max) {
          errors.push(`${fieldSchema.label} must be no more than ${fieldSchema.validation.max}`);
        }
      }
      break;

    case "text":
    case "textarea":
      if (typeof value === "string") {
        if (
          fieldSchema.validation?.minLength &&
          !ValidationRules.minLength(value, fieldSchema.validation.minLength)
        ) {
          errors.push(
            `${fieldSchema.label} must be at least ${fieldSchema.validation.minLength} characters`
          );
        }
        if (
          fieldSchema.validation?.maxLength &&
          !ValidationRules.maxLength(value, fieldSchema.validation.maxLength)
        ) {
          errors.push(
            `${fieldSchema.label} must be no more than ${fieldSchema.validation.maxLength} characters`
          );
        }
        if (fieldSchema.validation?.pattern) {
          const regex = new RegExp(fieldSchema.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`${fieldSchema.label} format is invalid`);
          }
        }
      }
      break;

    case "array":
      if (Array.isArray(value) && fieldSchema.itemSchema) {
        value.forEach((item, index) => {
          const itemErrors = validateField(fieldSchema.itemSchema!, item, `${fieldName}[${index}]`);
          errors.push(...itemErrors);
        });
      }
      break;

    case "object":
      if (typeof value === "object" && value !== null && fieldSchema.fields) {
        Object.entries(fieldSchema.fields).forEach(([subFieldName, subFieldSchema]) => {
          const subValue = (value as Record<string, unknown>)[subFieldName];
          const subErrors = validateField(subFieldSchema, subValue, `${fieldName}.${subFieldName}`);
          errors.push(...subErrors);
        });
      }
      break;
  }

  return errors;
}

export function validateSectionData(
  type: string,
  data: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const schema = getSectionSchema(type);
  if (!schema) {
    return { valid: false, errors: [`Unknown section type: ${type}`] };
  }

  const errors: string[] = [];

  // Validate each field using the enhanced validation
  Object.entries(schema.fields).forEach(([fieldName, fieldSchema]) => {
    const fieldErrors = validateField(fieldSchema, data[fieldName], fieldName);
    errors.push(...fieldErrors);
  });

  return { valid: errors.length === 0, errors };
}
