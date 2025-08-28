import { z } from 'zod';
import { tx } from '@db/pool.js';
import {
  insertLink, insertAbVariant, insertCalendarRule, findLinks, listAbVariants, isSlugTaken
} from './repository.js';
import type {
  CreateRedirectDTO, CreateAbDTO, CreateCalendarDTO, AbVariantInput, CalendarEventInput
} from './types.js';

const urlSchema = z.url();

export class SlugTakenError extends Error {
  status = 409 as const;
  constructor(slug: string) {
    super(`Slug '${slug}' is already taken`);
    this.name = "SlugTakenError";
  }
}

export const getLinks = async (type:string) => {
  return tx( async (c) => {
    try {
      const links = await findLinks(c, type);
        switch (type) {
          case "ab": {
            for (const v of links) {
              v.redirect = await listAbVariants(c, v.id);
            }
          }
        }
        return links;
    } catch (e: any) {
      console.error("calendar redirect error:", e);
      return { status: 500, reason: "Failed to get links" }
    }
  });
};

export const checkSlug = async (slug: string) => {
  return tx(
    async (c) => await isSlugTaken(c, slug)
  );
};

export const createRedirect = async (input: CreateRedirectDTO) => {
  const url = urlSchema.parse(input.redirect);
  const slug = input.slug.trim().toLowerCase();

  return tx(
    async (c) => await insertLink(c, 'redirect', slug, input.redirect, input.description ?? null)
  );
}

export const createAb = async (input: CreateAbDTO) => {
  if (!Array.isArray(input.variations) || input.variations.length === 0) {
    throw new Error('variants required');
  }
  const slug: string = input.slug.trim().toLowerCase();
  return tx(async (c) => {
    const link = await insertLink(c, 'ab', slug, '', input.description ?? null);
    const weight: number = Number((100 / input.variations.length).toFixed(2));
    for (const v of input.variations) {
      const redirect = urlSchema.parse(v.redirect);
      let data: AbVariantInput = { name: v.name, redirect, weight };
      await insertAbVariant(c, link.id, data);
    }
    return link;
  });
}

export const createCalendar = async (input: CreateCalendarDTO) => {
  if (typeof input.event !== 'object') {
    throw new Error('event required');
  }
  const slug: string = input.slug.trim().toLowerCase();
  return tx(async (c) => {
    const link = await insertLink(c, 'calendar', slug, '', input.description ?? null);
    if (!input.event.start_date || !input.event.end_date) throw new Error('start_date and end_date required');
    let event: CalendarEventInput = input.event;
    await insertCalendarRule(c, link.id, event);
    return link;
  });
}