/**
 * Every user-facing string that is not a service, package, city or FAQ.
 *
 * Keeping them here means the whole site can be re-voiced for a different brand
 * without opening `src/`. Interpolated strings are functions rather than
 * templates with placeholders, so TypeScript catches a missing argument.
 */
export const copy = {
  brand: {
    skipToContent: "Skip to main content",
    menu: "Menu",
    closeMenu: "Close menu",
    openMenu: "Open menu",
  },

  cta: {
    whatsapp: "Book on WhatsApp",
    whatsappShort: "WhatsApp",
    call: "Call now",
    callShort: "Call",
    seePackages: "See packages",
    getQuote: "Get a quote",
    viewAll: "View all",
    bookThis: (name: string) => `Book ${name}`,
    checkAvailability: "Check availability",
  },

  home: {
    heroEyebrow: "Delhi · Gurugram · Noida · Greater Noida · Faridabad",
    heroTitle: "Decoration that is still standing when the cake comes out.",
    heroLead:
      "Balloon and party decoration set up at your place across Delhi NCR. Our own team, materials included, and teardown afterwards — so the only thing left to organise is who blows out the candles.",
    heroPriceNote: (from: string) => `Setups from ${from}. Quoted before you confirm.`,

    servicesEyebrow: "What we do",
    servicesTitle: "Six kinds of setup, one team",
    servicesLead:
      "Most bookings are a birthday or an anniversary at home. The rest are the ones people do not plan for — a homecoming, a proposal, a hard year ending.",

    occasionsEyebrow: "By occasion",
    occasionsTitle: "What are you celebrating?",
    occasionsLead:
      "Each occasion has its own failure mode. These pages are about the thing that usually goes wrong, and how we plan around it.",

    themesEyebrow: "Themes",
    themesTitle: "Pick a look",
    themesLead:
      "Ten themes, each with a palette we will actually build to. Send a reference photo if you have one — we will tell you honestly whether it suits your room.",

    packagesEyebrow: "Packages",
    packagesTitle: "What a setup costs",
    packagesLead:
      "Published prices, with what is included and what is not written down beside them. If your room needs something different, we will quote it before you confirm.",

    citiesEyebrow: "Where we work",
    citiesTitle: "Across Delhi NCR",
    citiesLead:
      "Five cities, each with its own access rules, traffic and building stock. The city pages say what that means for your booking rather than repeating the same paragraph five times.",

    processEyebrow: "How it works",
    processTitle: "From message to teardown",
    processLead:
      "Four steps, no deposit before you have a written quote, and a named person you can reach on the day.",

    reviewsEyebrow: "What people say",
    reviewsTitle: "Reviews",
    reviewsLead: "Published only where the customer gave us permission to.",

    faqEyebrow: "Questions",
    faqTitle: "Before you book",
    faqLead: "The things people ask most often, answered properly.",

    ctaTitle: "Tell us the date and the room",
    ctaBody:
      "Send a photo of the space and what you are celebrating. You will get a plan and a price back, usually within the hour.",
  },

  services: {
    indexEyebrow: "Services",
    indexTitle: "What we set up",
    indexLead:
      "Every setup is installed by our own team, with materials included and teardown afterwards. Prices start where they say they start.",
    includesTitle: (service: string) => `What ${service.toLowerCase()} includes`,
    packagesTitle: (service: string) => `${service} packages`,
    citiesTitle: (service: string) => `${service} across Delhi NCR`,
    inCityTitle: (service: string, city: string) => `${service} in ${city}`,
    inCityLocalTitle: (city: string) => `What booking in ${city} actually involves`,
    localitiesTitle: (city: string) => `Areas we cover in ${city}`,
    relatedTitle: "Other things we set up",
  },

  occasions: {
    indexEyebrow: "Occasions",
    indexTitle: "What are you celebrating?",
    indexLead:
      "Seven kinds of celebration, and the specific thing that tends to go wrong at each one.",
    considerationsTitle: (occasion: string) => `What matters at a ${occasion.toLowerCase()}`,
    packagesTitle: "Setups people book for this",
  },

  themes: {
    indexEyebrow: "Themes",
    indexTitle: "Pick a look",
    indexLead:
      "Descriptive themes rather than licensed characters — built from colour, shape and material, so what arrives matches what you saw.",
    paletteTitle: "Palette",
    suitedToTitle: "Best suited to",
    packagesTitle: "Setups available in this theme",
  },

  packages: {
    indexEyebrow: "Packages",
    indexTitle: "Setups and prices",
    indexLead:
      "What each setup includes, what it does not, and how long it takes to install. No package is quoted without a look at your room first.",
    includesTitle: "What you get",
    excludesTitle: "What is not included",
    setupTimeLabel: "Setup time",
    priceFromLabel: "From",
    availableInTitle: "Available in",
    goodForTitle: "Good for",
    noImagesNote:
      "Photographs of this setup are being added. Ask on WhatsApp and we will send recent ones from a booking like yours.",
  },

  /**
   * The catalog browser — filters, sort and the card preview.
   *
   * Competitors in this market put a photograph on every listing card. Until
   * there are photographs of this team's own setups, the card shows the theme
   * palettes the setup is genuinely built in. That is a real answer to "what
   * will it look like", not a placeholder pretending to be one.
   */
  catalog: {
    filtersTitle: "Narrow it down",
    resultsHeading: "Matching setups",
    showFilters: "Filters",
    hideFilters: "Hide filters",
    clear: "Clear all",
    resultCount: (n: number) => (n === 1 ? "1 setup" : `${n} setups`),
    activeFilterCount: (n: number) => (n === 1 ? "1 filter" : `${n} filters`),
    sortLabel: "Sort by",
    sortOptions: {
      recommended: "Recommended",
      priceAsc: "Price: low to high",
      priceDesc: "Price: high to low",
      name: "Name (A–Z)",
    },
    groups: {
      occasion: "Occasion",
      theme: "Theme",
      city: "City",
      budget: "Budget",
      service: "Type of setup",
    },
    anyOption: {
      occasion: "Any occasion",
      theme: "Any theme",
      city: "Anywhere in NCR",
      budget: "Any budget",
      service: "Any type",
    },
    empty: {
      title: "Nothing matches all of those",
      body:
        "We build to order as often as we build from the list. Tell us the room, the date and the budget on WhatsApp and we will quote it.",
      reset: "Clear the filters",
    },
    /** Shown on a card when the package has no photograph yet. */
    palettePreviewLabel: (n: number) => (n === 1 ? "Built in 1 palette" : `Built in ${n} palettes`),
    photosPending: "Photographs coming",
    setupTimeShort: (time: string) => `${time} to install`,
    cityCount: (n: number) => (n === 1 ? "1 city" : `${n} cities`),
    allCitiesLabel: "Across all of NCR",
    browseByBudgetEyebrow: "By budget",
    browseByBudgetTitle: "Start from what you want to spend",
    browseByBudgetLead:
      "Every price below is a starting point for that setup, quoted properly once we have seen the room. Nothing is hidden behind an enquiry.",
    budgetBandCount: (n: number) => (n === 1 ? "1 setup" : `${n} setups`),
    seeAllSetups: "See all setups",
    inThisTheme: (theme: string) => `See every setup in ${theme}`,
    forThisOccasion: (occasion: string) => `See every setup for ${occasion.toLowerCase()}`,
    inThisCity: (city: string) => `See every setup available in ${city}`,
  },

  cities: {
    indexEyebrow: "Service areas",
    indexTitle: "Where we set up",
    indexLead:
      "Five cities across Delhi NCR. Each page covers the access rules, travel and timing that actually apply there.",
    localNotesTitle: (city: string) => `Booking in ${city}`,
    localitiesTitle: "Areas covered",
    travelNoteTitle: "Travel and scheduling",
    servicesTitle: (city: string) => `What we set up in ${city}`,
    packagesTitle: (city: string) => `Packages available in ${city}`,
  },

  gallery: {
    eyebrow: "Our work",
    title: "Setups we have built",
    lead:
      "Photographs of real setups by this team. Nothing here is stock imagery or someone else's work.",
    empty:
      "We are photographing recent setups and will publish them here. In the meantime, ask on WhatsApp and we will send pictures from a booking like yours.",
  },

  contact: {
    eyebrow: "Get in touch",
    title: "Tell us the date and the room",
    lead:
      "The fastest way to a quote is WhatsApp with a photo of the space. If you would rather write it out, the form goes to the same place.",
    formTitle: "Send an enquiry",
    formNote:
      "We reply during working hours, usually within the hour. For a booking in the next twenty-four hours, WhatsApp or call instead.",
    whatsappTitle: "WhatsApp",
    whatsappBody: "Send a photo of the room and your date. Quickest route to a real quote.",
    callTitle: "Call",
    callBody: "For same-day bookings and anything that needs a conversation.",
    hoursTitle: "Hours",
    fields: {
      name: "Your name",
      phone: "Phone number",
      email: "Email (optional)",
      city: "City",
      date: "Date of the event",
      occasion: "What are you celebrating?",
      message: "Tell us about the space",
      messagePlaceholder:
        "Which room, roughly how big, how many people, and anything the building requires — a gate pass, a lift booking, a rule about wall fixings.",
      honeypot: "Website",
      submit: "Send enquiry",
      submitting: "Sending…",
    },
    success: "Thanks — we have your enquiry and will come back to you shortly.",
    error:
      "That did not send. Please WhatsApp or call us instead and we will take the details directly.",
    validation: {
      name: "Please tell us your name.",
      phone: "We need a phone number to confirm the booking.",
      message: "A sentence or two about the space helps us quote properly.",
    },
  },

  footer: {
    tagline: "Balloon and party decoration across Delhi NCR.",
    servicesTitle: "Setups",
    citiesTitle: "Areas",
    companyTitle: "HappyArc",
    legalTitle: "Legal",
    cookiePreferences: "Cookie preferences",
    rights: (year: number, name: string) => `© ${year} ${name}. All rights reserved.`,
  },

  notFound: {
    title: "That page does not exist",
    body:
      "The link may be old, or the page may have moved. Everything we set up is listed below.",
    cta: "Back to the home page",
  },

  consent: {
    bannerTitle: "Cookies on this site",
    bannerBody:
      "We use necessary cookies to make the site work. With your permission we would also like to measure how the site is used, so we can improve it. You can change this at any time.",
    accept: "Accept all",
    reject: "Reject non-essential",
    manage: "Manage preferences",
    dialogTitle: "Cookie preferences",
    dialogBody:
      "Necessary cookies keep the site working and cannot be switched off. Everything else is your choice, and you can come back and change it whenever you like.",
    save: "Save preferences",
    close: "Close",
  },
} as const;
