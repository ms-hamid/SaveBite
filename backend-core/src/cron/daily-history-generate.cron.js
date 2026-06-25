import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function generateDailyAiFeature() {


    const today = new Date();

    today.setHours(0,0,0,0);


    const yesterday = new Date(today);
    yesterday.setDate(today.getDate()-1);



    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate()-7);



    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate()-30);



    const listings =
        await prisma.listing.findMany({
            where:{
                deleted_at:null
            },

            include:{
                merchant:true
            }
        });



    for(const listing of listings){


        const merchantId =
            listing.merchant_id;



        // ============================
        // SALES TODAY
        // ============================


        const todayOrders =
        await prisma.order.aggregate({

            where:{
                listing_id:listing.id,

                status:"completed",

                created_at:{
                    gte:today
                }
            },


            _sum:{
                qty:true
            }

        });



        const soldToday =
            todayOrders._sum.qty ?? 0;




        // ============================
        // YESTERDAY SALES
        // ============================


        const yesterdaySales =
        await prisma.order.aggregate({

            where:{
                listing_id:listing.id,

                status:"completed",

                created_at:{
                    gte:yesterday,
                    lt:today
                }
            },


            _sum:{
                qty:true
            }
        });



        const soldYesterday =
            yesterdaySales._sum.qty ?? 0;



        // ============================
        // LAST 7 DAYS
        // ============================


        const weekSales =
        await prisma.order.aggregate({

            where:{
                listing_id:listing.id,

                status:"completed",

                created_at:{
                    gte:sevenDaysAgo
                }
            },


            _sum:{
                qty:true
            }
        });


        const sold7Days =
            weekSales._sum.qty ?? 0;




        // ============================
        // LAST 30 DAYS
        // ============================


        const monthSales =
        await prisma.order.aggregate({

            where:{
                listing_id:listing.id,

                status:"completed",

                created_at:{
                    gte:thirtyDaysAgo
                }
            },


            _sum:{
                qty:true
            }
        });



        const sold30Days =
            monthSales._sum.qty ?? 0;



        // ============================
        // FEATURE CALENDAR
        // ============================


        const day =
            today.getDay();



        const isWeekend =
            day === 0 ||
            day === 6;



        const production =
            listing.stock_total;



        const surplus =
            Math.max(
                production - soldToday,
                0
            );




        const sellRate =
            production === 0
            ? 0
            :
            soldToday / production;



        const surplusRate =
            production === 0
            ? 0
            :
            surplus / production;




        // ============================
        // INSERT HISTORY
        // ============================


        await prisma.aiFeatureHistory.upsert({

            where:{

                merchant_id_listing_id_feature_date:
                {
                    merchant_id:merchantId,

                    listing_id:listing.id,

                    feature_date:today
                }

            },


            update:{

                sold_qty:soldToday,

                actual_surplus:surplus,

                sold_previous_day:
                    soldYesterday,

                sold_last_7_days:
                    sold7Days,

                sold_last_30_days:
                    sold30Days,


                sell_through_rate:
                    sellRate,


                surplus_rate:
                    surplusRate

            },


            create:{


                merchant_id:merchantId,

                listing_id:listing.id,

                feature_date:today,


                production_qty:production,

                actual_surplus:surplus,

                sold_qty:soldToday,


                day_of_week:day,

                is_weekend:isWeekend,


                rain_intensity:0,

                promo_active:
                    listing.discount_percentage
                    ? true
                    : false,



                sold_previous_day:
                    soldYesterday,


                sold_last_7_days:
                    sold7Days,


                sold_last_30_days:
                    sold30Days,


                avg_weekly_sales:
                    sold7Days / 7,


                sell_through_rate:
                    sellRate,


                surplus_rate:
                    surplusRate
            }

        });



    }


    console.log(
        "AI feature history generated"
    );

}