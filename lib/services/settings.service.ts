import "server-only";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_FEE,
} from "@/lib/constants/shipping";

export type StoreSettingsDTO = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  freeShippingThreshold: number;
  shippingFee: number;
  currency: string;
  navbarTitle: string;
  navbarTitleColor: string;
  navbarLogoUrl: string | null;
  navbarDisplayMode: "TEXT" | "IMAGE";
};

const DEFAULTS: StoreSettingsDTO = {
  storeName: "Libaas",
  supportEmail: "support@libaas.com",
  supportPhone: "",
  address: "",
  freeShippingThreshold: DEFAULT_FREE_SHIPPING_THRESHOLD,
  shippingFee: DEFAULT_SHIPPING_FEE,
  currency: "INR",
  navbarTitle: "Libaas",
  navbarTitleColor: "#131110",
  navbarLogoUrl: null,
  navbarDisplayMode: "TEXT",
};

export async function getStoreSettings(): Promise<StoreSettingsDTO> {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });

  if (!settings) {
    try {
      await prisma.storeSettings.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1 },
      });
    } catch (error) {
      // First load races: several requests may upsert id=1 simultaneously.
      // If another request already created the row, the defaults are correct.
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== "P2002"
      ) {
        throw error;
      }
    }
    return DEFAULTS;
  }

  return {
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    address: settings.address,
    freeShippingThreshold: settings.freeShippingThreshold,
    shippingFee: settings.shippingFee,
    currency: settings.currency,
    navbarTitle: settings.navbarTitle,
    navbarTitleColor: settings.navbarTitleColor,
    navbarLogoUrl: settings.navbarLogoUrl,
    navbarDisplayMode: settings.navbarDisplayMode === "IMAGE" ? "IMAGE" : "TEXT",
  };
}
