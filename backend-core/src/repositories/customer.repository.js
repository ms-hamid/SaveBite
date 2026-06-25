import { prisma } from "../lib/prisma.js";

export async function createCustomerData(
  payload
) {
  return prisma.$transaction(
    async (tx) => {
      const profile =
        await tx.profile.create({
          data: {
            user_id: payload.user_id,
            full_name:
              payload.full_name,
            role: "CUSTOMER",
          },
        });

      const customer =
        await tx.customer.create({
          data: {
            user_id: payload.user_id,
            full_name:
              payload.full_name,
          },
        });

      return {
        profile,
        customer,
      };
    }
  );
}

export async function updateCustomerProfile(userId, data) {
  return prisma.$transaction(async (tx) => {
    let profileUpdate;
    if (data.full_name !== undefined) {
      profileUpdate = await tx.profile.update({
        where: { user_id: userId },
        data: { full_name: data.full_name },
      });
    }

    let customerUpdate;
    if (data.full_name !== undefined) {
      customerUpdate = await tx.customer.update({
        where: { user_id: userId },
        data: { full_name: data.full_name },
      });
    }

    return {
      profile: profileUpdate,
      customer: customerUpdate,
    };
  });
}