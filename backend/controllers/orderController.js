import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from "../models/orderModel.js"
import crypto from "crypto"
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)

        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save()
        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (error) {
        console.error("❌ Error in create Order:", error)
        res.status(500).json({ success: false, message: error.message })


    }
}

export const verifyPayment = async (req, res) => {
    try {

        console.log("VERIFY API CALLED")
        console.log(req.body)

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentFailed
        } = req.body

        const userId = req.user._id

        console.log("Searching Order:", razorpay_order_id)

        const existingOrder = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        })

        console.log("Existing Order:", existingOrder)

        if (paymentFailed) {

            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )

            return res.status(400).json({
                success: false,
                message: "Payment failed",
                order
            })
        }

        const sign =
            razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex")

        console.log("Expected:", expectedSignature)
        console.log("Received:", razorpay_signature)

        if (expectedSignature === razorpay_signature) {

            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            )

            console.log("UPDATED ORDER:", order)

            await Cart.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        items: [],
                        totalPrice: 0
                    }
                }
            )

            return res.json({
                success: true,
                message: "Payment Successful",
                order
            })

        } else {

            await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            )

            return res.status(400).json({
                success: false,
                message: "Invalid Signature"
            })
        }

    } catch (error) {

        console.error("❌ Error in verify Payment:", error)

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id;
        const orders = await Order.find({user: userId})
        .populate({path:"products.productId", select:"productName productPrice productImg"})
        .populate("user", "firstName lastName email")
        res.status(200).json({ success: true,count:orders.length, orders })
    } catch (error) {
        console.error("❌ Error in get My Order:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getUserOrders = async(req, res)=>{
    try {
        const {userId} = req.params;
        const orders = await Order.find({user:userId})
        .populate({
            path:"products.productId",
            select:"productName productPrice productImg"
        })
        .populate("user", "firstName lastName email")

        res.status(200).json({
            success:true,
            count: orders.length,
            orders
        })

    } catch (error) {
        console.log("❌ Error fetching user order: ", error)
        res.status(500).json({message:error.message})
    }
}

export const getAllOrdersAdmin = async(req, res)=>{
    try {
        const orders = await Order.find()
        .sort({createdAt: -1})
        .populate("user", "name email")
        .populate("products.productId", "productName productPrice")
        res.json({
            success:true,
            count:orders.length,
            orders
        })
    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch all orders",
            error:error.message
        })
    }
}


export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    const totalOrders = await Order.countDocuments({ status: "Paid" });

    // TOTAL SALES
    const totalSaleAgg = await Order.aggregate([
      {
        $match: { status: "Paid" },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" }, // CHANGE if your field differs
        },
      },
    ]);

    const totalSales = totalSaleAgg[0]?.totalSales || 0;

    // DATE RANGE (LAST 30 DAYS)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);

    // STEP 1: AGGREGATE REAL DATA
    const rawData = await Order.aggregate([
      {
        $match: {
          status: "Paid",
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          amount: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // STEP 2: CONVERT TO MAP FOR FAST LOOKUP
    const salesMap = {};
    rawData.forEach((item) => {
      salesMap[item._id] = item.amount;
    });

    // STEP 3: FILL LAST 30 DAYS (IMPORTANT FIX)
    const salesByDate = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const formattedDate = date.toISOString().split("T")[0];

      salesByDate.push({
        date: formattedDate,
        amount: salesMap[formattedDate] || 0,
      });
    }

    return res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      salesByDate,
    });

  } catch (error) {
    console.error("Sales Data Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};