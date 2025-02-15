import { z } from 'zod';
import * as fs from 'fs';
import path from 'path';


const citiesFilePath = path.resolve(__dirname, './cities.json');
const citiesData = JSON.parse(fs.readFileSync(citiesFilePath, 'utf8'));




const postalCodeToPlaceName = citiesData.reduce((acc: Record<string, string>, city: { "Postal Code": string, "Place Name": string }) => {
  if (city["Postal Code"] && city["Place Name"]) {
    acc[city["Postal Code"]] = city["Place Name"];
  }
  return acc;
}, {});


const placeNameToPostalCode = citiesData.reduce((acc: Record<string, string>, city: { "Postal Code": string, "Place Name": string }) => {
  if (city["Postal Code"] && city["Place Name"]) {
    acc[city["Place Name"]] = city["Postal Code"];
  }
  return acc;
}, {});



const postalCodes = citiesData
  .filter((city: { "Postal Code": string }) => city["Postal Code"] !== "")
  .map((city: { "Postal Code": string }) => city["Postal Code"]);


export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username should be at least 3 characters long')
    .max(12, 'Username should be at most 12 characters long')
    .refine((val) => !/\s/.test(val),  'Username should not contain spaces'), 
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters long'),
  role: z.enum(['client', 'worker']),
});


export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password should be at least 6 characters long')
});



export const addStoreWorkerSchema = z.object({
  storeId: z.number().int().min(1, 'Store ID must be a valid positive integer'),
  workerId: z.number().int().min(1, 'Worker ID must be a valid positive integer'),
});




export const updateSchema = z.object({
  username: z.string()
    .min(3, 'Username should be at least 3 characters long')
    .max(12, 'Username should be at most 12 characters long')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password should be at least 6 characters long').optional(),
});


export const storeSchema = z.object({
  name: z.string()
    .min(3, 'Store name should be at least 3 characters long')
    .max(100, 'Store name should be at most 100 characters long'),

  description: z.string()
    .min(10, 'Description should be at least 10 characters long')
    .max(500, 'Description should be at most 500 characters long'),

  address: z.string()
    .min(3, 'Address should be at least 3 characters long')
    .max(100, 'Address should be at most 100 characters long'),

  city: z.string()
    .min(3, 'City should be at least 3 characters long')
    .max(50, 'City should be at most 50 characters long'),

  postalCode: z.string()
    .refine((val) => postalCodes.includes(val), {
      message: 'Invalid postal code',
    }),

  phone: z.string()
    .min(10, 'Phone number should be at least 10 characters long')
    .max(15, 'Phone number should be at most 15 characters long'),

  email: z.string().email('Invalid email format'),

  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image URL is required'),
})
  .superRefine((data, ctx) => {
    const { postalCode, city } = data;

    const expectedCity = postalCodeToPlaceName[postalCode];
    if (expectedCity && expectedCity !== city) {
      ctx.addIssue({
        path: ['postalCode'],
        message: `Postal code ${postalCode} does not correspond to the city ${city}`,
        code: z.ZodIssueCode.custom,
      });
    }
    
    const expectedPostalCode = placeNameToPostalCode[city];
    if (expectedPostalCode && expectedPostalCode !== postalCode) {
      ctx.addIssue({
        path: ['city'],
        message: `City ${city} does not correspond to the postal code ${postalCode}`,
        code: z.ZodIssueCode.custom,
      });
    }
  });
