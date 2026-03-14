/**
 * Validation schemas using Joi
 */
import Joi from 'joi';

// ===== AUTH VALIDATION =====
export const authValidationSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

// ===== USER VALIDATION =====
export const userValidationSchemas = {
  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(100),
    lastName: Joi.string().min(1).max(100),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(20),
  }).min(1),

  updatePreferences: Joi.object({
    examType: Joi.string().allow(null),
    targetLocation: Joi.string().allow(null),
    preferredTransport: Joi.string().valid('TRAIN', 'BUS', 'FLIGHT', 'CAR').allow(null),
    budgetRange: Joi.object({
      min: Joi.number().min(0),
      max: Joi.number().min(0),
    }).allow(null),
    notifications: Joi.boolean(),
    emailNotifications: Joi.boolean(),
    smsNotifications: Joi.boolean(),
  }).min(1),
};

// ===== EXAM CENTER VALIDATION =====
export const examCenterValidationSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    location: Joi.string(),
    address: Joi.string(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    capacity: Joi.number().min(1),
    examTypes: Joi.string(),
    facilityDetails: Joi.string(),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
  }).min(5),

  update: Joi.object({
    name: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    capacity: Joi.number().min(1),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
  }).min(1),

  search: Joi.object({
    query: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    examType: Joi.string(),
    limit: Joi.number().min(1).max(100).default(20),
    offset: Joi.number().min(0).default(0),
  }),
};

// ===== TRAVEL ROUTE VALIDATION =====
export const travelRouteValidationSchemas = {
  create: Joi.object({
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    transportMode: Joi.string().valid('TRAIN', 'BUS', 'FLIGHT', 'CAR').required(),
    distance: Joi.number().min(0),
    estimatedDuration: Joi.number().min(0),
    basePrice: Joi.number().min(0).required(),
    operatingDays: Joi.string(),
    providers: Joi.string(),
  }).min(5),

  search: Joi.object({
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    transportMode: Joi.string().valid('TRAIN', 'BUS', 'FLIGHT', 'CAR'),
    limit: Joi.number().min(1).max(100).default(20),
    offset: Joi.number().min(0).default(0),
  }),
};

// ===== STAY LISTING VALIDATION =====
export const stayListingValidationSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    examCenterId: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    stayType: Joi.string().valid('HOTEL', 'HOSTEL', 'GUESTHOUSE', 'APARTMENT').required(),
    pricePerNight: Joi.number().min(0).required(),
    amenities: Joi.string(),
    availableRooms: Joi.number().min(0),
    contactEmail: Joi.string().email(),
    contactPhone: Joi.string(),
  }).min(6),

  search: Joi.object({
    city: Joi.string(),
    examCenterId: Joi.string(),
    stayType: Joi.string().valid('HOTEL', 'HOSTEL', 'GUESTHOUSE', 'APARTMENT'),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    minRating: Joi.number().min(0).max(5),
    limit: Joi.number().min(1).max(100).default(20),
    offset: Joi.number().min(0).default(0),
  }),
};

// ===== HELPER FUNCTIONS =====
export const validateRegister = (data: any) => {
  return authValidationSchemas.register.validate(data, { abortEarly: false });
};

export const validateLogin = (data: any) => {
  return authValidationSchemas.login.validate(data, { abortEarly: false });
};

export const validateRefreshToken = (data: any) => {
  return authValidationSchemas.refreshToken.validate(data, { abortEarly: false });
};

export const validateUserUpdate = (data: any) => {
  return userValidationSchemas.updateProfile.validate(data, { abortEarly: false });
};

export const validatePreferencesUpdate = (data: any) => {
  return userValidationSchemas.updatePreferences.validate(data, { abortEarly: false });
};

export const validateExamCenterSearch = (data: any) => {
  return examCenterValidationSchemas.search.validate(data, { abortEarly: false });
};

export const validateExamCenterCreate = (data: any) => {
  return examCenterValidationSchemas.create.validate(data, { abortEarly: false });
};

export const validateTravelRouteSearch = (data: any) => {
  return travelRouteValidationSchemas.search.validate(data, { abortEarly: false });
};

export const validateStayListingSearch = (data: any) => {
  return stayListingValidationSchemas.search.validate(data, { abortEarly: false });
