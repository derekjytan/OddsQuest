import Stripe from "stripe";

import { auth } from "@clerk/nextjs/server";
import { subscriptionHandler } from "@/use-stripe-sub";
import { clerkClient } from '@clerk/nextjs/server';

export const stripeApiClient = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: null,
    })
  : null;

const findOrCreateCustomerId = async (clerkId) => {
  const user = await clerkClient().users.getUser(clerkId);
  if (user.privateMetadata.stripeId) {
    return user.privateMetadata.stripeId;
  } else {
    const customer = await stripeApiClient.customers.create({
      description: 'A customer',
    });
    const { id } = customer;
    await clerkClient().users.updateUser(clerkId, {
      privateMetadata: {
        stripeId: id
      }
    });
    return id;
  }
}

export async function GET(req) {
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  } 
  
  const customerId = await findOrCreateCustomerId(
    userId
  );

  return new Response(
    JSON.stringify(
      await subscriptionHandler({
        customerId,
        query: new URL(req.url).searchParams.get('action'),
        body: req.body,
      }) 
    )
  );
}

export async function POST(req) {
  const body = await req.json()
  const { userId } = auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  } 
  
  const customerId = await findOrCreateCustomerId(
    userId
  );

  return new Response(
    JSON.stringify(
      await subscriptionHandler({
        customerId,
        query: new URL(req.url).searchParams.get('action'),
        body: body,
      }) 
    )
  );
}
