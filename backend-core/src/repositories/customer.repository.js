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

/**
 * Get paginated customers list for admin
 * @param {number} skip - Skip count for pagination
 * @param {number} take - Items per page
 * @returns {Promise<{customers: Array, total: number}>}
 */
export async function getCustomersWithPagination(skip = 0, take = 10) {
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      skip,
      take,
      orderBy: { full_name: 'asc' },
      select: {
        user_id: true,
        full_name: true,
        exp: true,
        strike_count: true,
        user: {
          select: {
            email: true,
            phone: true,
            created_at: true,
            banned_until: true,
          },
        },
      },
    }),
    prisma.customer.count(),
  ]);

  return { customers, total };
}

/**
 * Get suspended customers count
 * @returns {Promise<number>}
 */
export async function getSuspendedCustomersCount() {
  return prisma.customer.count({
    where: {
      strike_count: { gte: 3 },
    },
  });
}

/**
 * Get customer detail with orders by user_id
 * @param {string} userId - Customer user_id
 * @returns {Promise<object|null>}
 */
export async function getCustomerDetailWithOrders(userId) {
  const customer = await prisma.customer.findUnique({
    where: { user_id: userId },
    include: {
      user: {
        select: {
          email: true,
          phone: true,
          created_at: true,
          banned_until: true,
        },
      },
      orders: {
        where: { deleted_at: null },
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          public_id: true,
          qty: true,
          total_amount: true,
          qr_token: true,
          status: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          listing_id: true,
          merchant_id: true,
          customer_id: true,
        },
      },
    },
  });

  return customer;
}

/**
 * Get all customers for export
 * @returns {Promise<Array>}
 */
export async function getAllCustomersForExport() {
  return prisma.customer.findMany({
    orderBy: { full_name: 'asc' },
    select: {
      user_id: true,
      full_name: true,
      exp: true,
      strike_count: true,
      user: {
        select: {
          email: true,
          phone: true,
          created_at: true,
          banned_until: true,
        },
      },
      _count: {
        select: {
          orders: {
            where: { deleted_at: null },
          },
        },
      },
    },
  });
}
