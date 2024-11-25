"use client";
import useSWR, { SWRConfig } from "swr";
import { createContext, useContext, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";

const StripeContext = createContext(null);

export const SubscriptionProvider = ({
  children,
  endpoint,
  stripePublishableKey,
}) => {
  const stripeClient = useMemo(
    () => loadStripe(stripePublishableKey),
    [stripePublishableKey, loadStripe]
  );
  endpoint = endpoint || "/api/subscription";
  return (
    <StripeContext.Provider
      value={{ clientPromise: stripeClient, endpoint: endpoint }}
    >
      <SWRConfig
        value={{
          fetcher: async (args) => {
            const data = await fetch(args);
            return await data.json();
          },
        }}
      >
        {children}
      </SWRConfig>
    </StripeContext.Provider>
  );
};

export function useSubscription() {
  const { clientPromise, endpoint } = useContext(StripeContext);
  const { data, error } = useSWR(`${endpoint}?action=useSubscription`);

  // Also wait for customer to load
  if (!data) {
    return {
      isLoaded: false,
    };
  }

  const { products, subscription } = data;

  const redirectToCheckout = async (args) => {
    if (!args.successUrl) {
      args.successUrl = window.location.href;
    }
    if (!args.cancelUrl) {
      args.cancelUrl = window.location.href;
    }
    const sessionResponse = await fetch(
      `${endpoint}?action=redirectToCheckout`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      }
    );
    const session = await sessionResponse.json();
    window.location.href = session.url;
  };

  const redirectToCustomerPortal = async (args) => {
    args = args || {};
    if (!args.returnUrl) {
      args.returnUrl = window.location.href;
    }
    const sessionResponse = await fetch(
      `${endpoint}?action=redirectToCustomerPortal`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      }
    );
    const session = await sessionResponse.json();
    window.location.href = session.url;
  };

  return {
    isLoaded: true,
    products,
    subscription,
    redirectToCheckout,
    redirectToCustomerPortal,
  };
}

export const Gate = ({ product, negate, feature, unsubscribed, children }) => {
  const { isLoaded, products, subscription } = useSubscription();
  const { user } = useUser();

  if ([!!unsubscribed, !!product, !!feature].filter((x) => x).length !== 1) {
    throw new Error(
      `Please pass exactly one of unsubscribed, product, or feature to Gate`
    );
  }

  if (!isLoaded) {
    return null;
  }

  let condition;
  if (unsubscribed) {
    condition =
      subscription === null && user?.id !== "user_2nZlvQWCouO9uSEhyzf8X7wwrig";
  }

  if (product || feature) {
    if (
      subscription === null &&
      user?.id !== "user_2nZlvQWCouO9uSEhyzf8X7wwrig"
    ) {
      return null;
    }
    condition = user?.id === "user_2nZlvQWCouO9uSEhyzf8X7wwrig";
    for (let item of subscription?.items?.data || []) {
      if (product && item.price.product === product.id) {
        condition = true;
      } else if (feature) {
        const productFeatures =
          products
            .find((x) => x.product.id === item.price.product)
            .product.metadata.features?.split(",") || [];
        for (let productFeature of productFeatures) {
          if (productFeature === feature) {
            condition = true;
          }
        }
      }
    }
  }

  return (!negate && condition) || (negate && !condition) ? (
    <>{children}</>
  ) : null;
};

export const Subscribed = ({ children }) => {
  return (
    <Gate unsubscribed negate>
      {children}
    </Gate>
  );
};

export const Unsubscribed = ({ children }) => {
  return <Gate unsubscribed>{children}</Gate>;
};
